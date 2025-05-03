import { useState, Suspense, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Stats } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial, DoubleSide } from 'three';
import { useControls, button } from 'leva';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import './App.css';

// Define stats type
interface ModelStats {
  vertices: number;
  faces: number;
  edges: number;
}

// Pass updateStats function as a prop
function ModelViewer({
  updateStats,
}: {
  updateStats: (stats: ModelStats) => void;
}) {
  const obj = useLoader(OBJLoader, '/models/Barrel_OBJ.obj');

  // Process the loaded model to get stats
  useEffect(() => {
    let vertexCount = 0;
    let faceCount = 0;
    let edgeCount = 0;

    obj.traverse((child: any) => {
      if (child instanceof Mesh) {
        const geometry = child.geometry;

        // Count vertices
        vertexCount += geometry.attributes.position.count;

        // Count faces - ensure index buffer exists
        if (geometry.index) {
          faceCount += geometry.index.count / 3;

          // Count edges - for manifold meshes, E = 3F/2 for triangle meshes
          // This is based on Euler's formula: V - E + F = 2 (for closed manifold)
          edgeCount += geometry.index.count / 2; // Each edge is shared by exactly 2 triangles in a manifold mesh
        } else {
          // If there's no index buffer, each 3 vertices form a face
          const positionCount = geometry.attributes.position.count;
          faceCount += positionCount / 3;
          edgeCount += positionCount / 2; // Approximation
        }

        console.log('Child mesh stats:', {
          vertices: geometry.attributes.position.count,
          faces: geometry.index
            ? geometry.index.count / 3
            : geometry.attributes.position.count / 3,
          hasIndex: !!geometry.index,
        });
      }
    });

    const modelStats = {
      vertices: vertexCount,
      faces: faceCount,
      edges: edgeCount, // More accurate edge counting
    };

    console.log('Model statistics:', modelStats);

    // Update parent component with stats
    updateStats(modelStats);
  }, [obj, updateStats]);

  // UI controls
  const { displayMode, showWireframe, showVertices, color } = useControls({
    displayMode: {
      value: 'solid',
      options: ['solid', 'wireframe', 'points'],
      label: 'Display Mode',
    },
    showWireframe: {
      value: false,
      label: 'Show Wireframe',
    },
    showVertices: {
      value: false,
      label: 'Show Vertices',
    },
    color: {
      value: '#3080e8',
      label: 'Color',
    },
  });

  return (
    <>
      {/* The 3D model */}
      <group>
        <primitive object={obj} scale={1} />

        {/* Apply visualization based on selected mode */}
        {obj &&
          obj.children.map((child: any, index: number) => {
            if (child instanceof Mesh) {
              // Create a clone with different material based on display mode
              const clonedMesh = child.clone();

              if (displayMode === 'wireframe') {
                clonedMesh.material = new MeshStandardMaterial({
                  wireframe: true,
                  color: color,
                  side: DoubleSide,
                });
              } else if (displayMode === 'points') {
                // For points mode, we don't render the mesh
                return null;
              } else {
                clonedMesh.material = new MeshStandardMaterial({
                  color: color,
                  wireframe: showWireframe,
                  side: DoubleSide,
                });
              }

              return <primitive key={`mesh-${index}`} object={clonedMesh} />;
            }
            return null;
          })}

        {/* Display vertices as points if enabled */}
        {showVertices &&
          obj &&
          obj.children.map((child: any, index: number) => {
            if (child instanceof Mesh) {
              return (
                <points key={`points-${index}`}>
                  <bufferGeometry attach="geometry" {...child.geometry} />
                  <pointsMaterial
                    attach="material"
                    size={0.01}
                    color="#ff0000"
                    sizeAttenuation
                  />
                </points>
              );
            }
            return null;
          })}
      </group>

      {/* Camera controls */}
      <OrbitControls />
    </>
  );
}

function App() {
  const [modelStats, setModelStats] = useState<ModelStats>({
    vertices: 0,
    faces: 0,
    edges: 0,
  });
  const [isRecording, setIsRecording] = useState(false);
  const [gifFrames, setGifFrames] = useState<string[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [showDownloadNotice, setShowDownloadNotice] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);

  // Function to receive stats from ModelViewer
  const updateStats = (stats: ModelStats) => {
    setModelStats(stats);
  };

  // Handle recording start and stop
  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording]);

  // Recording controls
  useControls({
    'Record GIF': button(() => {
      toggleRecording();
    }),
  });

  // Function to start recording
  const startRecording = () => {
    console.log('Starting recording...');
    setIsRecording(true);
    setGifFrames([]);

    // Capture frames every 100ms (10 fps)
    recordingIntervalRef.current = window.setInterval(() => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const frame = canvas.toDataURL('image/png');
        setGifFrames(prev => [...prev, frame]);
      }
    }, 100);

    console.log('Recording started...');
  };

  // Function to stop recording and generate GIF
  const stopRecording = async () => {
    console.log('Stopping recording...');

    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    setIsRecording(false);
    console.log('Recording stopped. Generating GIF...');

    if (gifFrames.length === 0) {
      console.error('No frames captured');
      return;
    }

    try {
      // Dynamic import of gif.js
      const GifJs = await import('gif.js');
      const GIF = GifJs.default || GifJs;

      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: 800, // Match your canvas size or scale as needed
        height: 600, // Match your canvas size or scale as needed
        workerScript: '/gif.worker.js', // You'll need to serve this file
      });

      // Add each frame to the GIF
      const promises = gifFrames.map(dataUrl => {
        return new Promise(resolve => {
          const img = new Image();
          img.onload = () => {
            gif.addFrame(img, { delay: 100 }); // 100ms delay between frames
            resolve(null);
          };
          img.src = dataUrl;
        });
      });

      // Wait for all frames to be added
      await Promise.all(promises);

      // Render the GIF
      gif.render();

      // When the GIF is finished rendering
      gif.on('finished', (blob: Blob) => {
        // Create a download link for the GIF
        const url = URL.createObjectURL(blob);

        // Save URL to state for manual download
        setDownloadUrl(url);

        // Show download notice
        setShowDownloadNotice(true);

        // Also try automatic download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'model-animation.gif';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('GIF generated and download started!');
      });
    } catch (error) {
      console.error('Error generating GIF:', error);
    }
  };

  // Clean up URL when component unmounts
  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [downloadUrl]);

  return (
    <div className="app-container">
      <h1>3D Model Viewer</h1>
      {isRecording && (
        <div className="recording-indicator">🔴 Recording...</div>
      )}
      {showDownloadNotice && (
        <div className="download-notice">
          <p>¡GIF generado correctamente!</p>
          <div className="download-buttons">
            <button onClick={() => setShowDownloadNotice(false)}>Cerrar</button>
            {downloadUrl && (
              <a
                href={downloadUrl}
                download="model-animation.gif"
                className="download-button"
                onClick={() => console.log('Manual download clicked')}
              >
                Guardar GIF
              </a>
            )}
          </div>
        </div>
      )}
      <div className="main-content">
        <div className="canvas-container">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }} shadows>
            <color attach="background" args={['#f0f0f0']} />
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <Suspense fallback={<Html center>Loading 3D model...</Html>}>
              <ModelViewer updateStats={updateStats} />
            </Suspense>
            <Stats />
          </Canvas>
        </div>
        <div className="side-panel">
          <div className="stats-container">
            <h3>Model Statistics</h3>
            <p>Vertices: {modelStats.vertices}</p>
            <p>Faces: {Math.round(modelStats.faces)}</p>
            <p>Edges: {Math.round(modelStats.edges)}</p>
            <button
              onClick={toggleRecording}
              style={{
                marginTop: '20px',
                padding: '8px 16px',
                background: isRecording ? '#ff4444' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


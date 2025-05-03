import { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Stats } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial, DoubleSide } from 'three';
import { useControls } from 'leva';
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

  // Function to receive stats from ModelViewer
  const updateStats = (stats: ModelStats) => {
    setModelStats(stats);
  };

  return (
    <div className="app-container">
      <h1>3D Model Viewer</h1>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


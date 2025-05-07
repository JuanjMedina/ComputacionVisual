import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import './App.css'; // Asegúrate de importar los estilos
import ModelViewer from './components/ModelViewer';
import ModelInfoPanel from './components/ModelInfoPanel';
import * as THREE from 'three'; // Import THREE

function App() {
  const [format, setFormat] = useState('OBJ');
  const [verticesCount, setVerticesCount] = useState(0);

  const handleModelLoaded = (model: THREE.Object3D) => {
    let vertices = 0;
    model.traverse?.((child: any) => {
      // child can be a Mesh or other Object3D types
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        vertices += mesh.geometry.attributes?.position?.count || 0;
      }
    });
    setVerticesCount(vertices);
  };

  return (
    <>
      {/* UI Controls Container */}
      <div className="ui-container">
        {/* Format Selector */}
        <div className="ui-card">
          <label htmlFor="format" className="format-label">
            Formato del Modelo
          </label>
          <select
            id="format"
            value={format}
            onChange={e => setFormat(e.target.value)}
            className="select-format"
          >
            <option value="OBJ">OBJ</option>
            <option value="STL">STL</option>
            <option value="GLB">GLB/GLTF</option>
          </select>
        </div>

        {/* Model Info Panel */}
        <ModelInfoPanel format={format} verticesCount={verticesCount} />
      </div>

      {/* Full-screen 3D Canvas */}
      <div className="model-container">
        <Canvas>
          <ModelViewer format={format} onModelLoaded={handleModelLoaded} />
        </Canvas>
      </div>
    </>
  );
}

export default App;


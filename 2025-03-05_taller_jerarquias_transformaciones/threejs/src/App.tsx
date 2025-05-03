import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';
import { useState, CSSProperties } from 'react';

function Scene() {
  // Parent controls
  const parentControls = useControls('Parent', {
    rotationX: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    rotationY: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    rotationZ: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    positionX: { value: 0, min: -5, max: 5, step: 0.1 },
    positionY: { value: 0, min: -5, max: 5, step: 0.1 },
    positionZ: { value: 0, min: -5, max: 5, step: 0.1 },
  });

  // Middle level controls (child of parent, parent of grandchildren)
  const middleLevelControls = useControls('Middle Level', {
    rotationX: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    rotationY: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    rotationZ: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    positionX: { value: 2, min: -3, max: 3, step: 0.1 },
    positionY: { value: 0, min: -3, max: 3, step: 0.1 },
    positionZ: { value: 0, min: -3, max: 3, step: 0.1 },
  });

  return (
    <>
      {/* Parent group */}
      <group
        position={[
          parentControls.positionX,
          parentControls.positionY,
          parentControls.positionZ,
        ]}
        rotation={[
          parentControls.rotationX,
          parentControls.rotationY,
          parentControls.rotationZ,
        ]}
      >
        {/* Parent box */}
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>

        {/* Axis helper for parent */}
        <axesHelper args={[2]} />

        {/* Middle level (child of parent, parent of grandchildren) */}
        <group
          position={[
            middleLevelControls.positionX,
            middleLevelControls.positionY,
            middleLevelControls.positionZ,
          ]}
          rotation={[
            middleLevelControls.rotationX,
            middleLevelControls.rotationY,
            middleLevelControls.rotationZ,
          ]}
        >
          {/* Middle level box */}
          <mesh>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial color="blue" />
          </mesh>

          {/* Axis helper for middle level */}
          <axesHelper args={[1.5]} />

          {/* Grandchild 1 */}
          <mesh position={[1.2, 0, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="green" />
          </mesh>

          {/* Grandchild 2 */}
          <mesh position={[0, 1.2, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="red" />
          </mesh>

          {/* Grandchild 3 */}
          <mesh position={[0, 0, 1.2]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="purple" />
          </mesh>
        </group>
      </group>

      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <gridHelper args={[10, 10]} />
    </>
  );
}

const infoPanelStyle: CSSProperties = {
  
  position: 'absolute',
  bottom: '20px',
  right: '20px',
  width: '300px',
  padding: '15px',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  borderRadius: '8px',
  fontFamily: 'Arial, sans-serif',
  zIndex: 1000,
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
};

const headingStyle: CSSProperties = {
  margin: '0 0 10px 0',
  color: '#4fc3f7',
  fontSize: '1.4rem',
};

const listStyle: CSSProperties = {
  margin: '10px 0',
  paddingLeft: '20px',
};

const listItemStyle: CSSProperties = {
  margin: '5px 0',
};

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
        <Scene />
      </Canvas>
      <div style={infoPanelStyle}>
        <h2 style={headingStyle}>Hierarchical Transformations Demo</h2>
        <p>
          This scene demonstrates parent-child relationships in 3D
          transformations:
        </p>
        <ul style={listStyle}>
          <li style={listItemStyle}>Orange box: Parent object</li>
          <li style={listItemStyle}>
            Blue box: Middle level (child of parent)
          </li>
          <li style={listItemStyle}>Colored spheres: Grandchildren</li>
        </ul>
        <p>Use the control panels to adjust rotations and positions.</p>
        <p>
          Notice how transformations of parent objects affect their children!
        </p>
      </div>
    </div>
  );
}

export default App;


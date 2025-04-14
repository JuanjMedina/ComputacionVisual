import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';

// Mathematical object that transforms over time
function MathObject() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // Translation: Create a more complex path
    meshRef.current.position.x =
      Math.sin(time * 0.5) * Math.cos(time * 0.3) * 3;
    meshRef.current.position.z = Math.cos(time * 0.5) * 3;
    meshRef.current.position.y = Math.sin(time * 0.7) * 1.5;

    // Rotation: Incrementally rotate on all axes for more dynamic feel
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;

    // Scaling: Smooth breathing-like scaling effect
    const scale = 1 + Math.sin(time * 0.8) * 0.2;
    meshRef.current.scale.set(scale, scale, scale);

    // Update material color based on time
    if (materialRef.current) {
      const hue = (time * 0.05) % 1;
      materialRef.current.color.setHSL(hue, 0.7, 0.5);
      materialRef.current.emissive.setHSL(hue, 1, 0.2);
      materialRef.current.transmission = 0.5 + Math.sin(time) * 0.2;
    }

    // Update geometry parameters over time if active
    if (active && meshRef.current.geometry instanceof THREE.TorusKnotGeometry) {
      // Only recreate the geometry periodically to avoid performance issues
      if (Math.floor(time * 2) % 5 === 0) {
        meshRef.current.geometry.dispose();
        const p = 2 + Math.floor(Math.sin(time * 0.2) * 3);
        const q = 3 + Math.floor(Math.cos(time * 0.2) * 4);
        meshRef.current.geometry = new THREE.TorusKnotGeometry(
          1.2, // radius
          0.4, // tube radius
          128, // tubular segments
          32, // radial segments
          p, // p
          q, // q
        );
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      castShadow
      receiveShadow
    >
      <torusKnotGeometry args={[1.2, 0.4, 128, 32, 3, 7]} />
      <meshPhysicalMaterial
        ref={materialRef}
        color="#5588ff"
        emissive="#223366"
        metalness={0.8}
        roughness={0.2}
        clearcoat={0.8}
        clearcoatRoughness={0.2}
        transmission={0.5}
        reflectivity={1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function App() {
  return (
    <div className="canvas-container">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
        <color attach="background" args={['#050505']} />

        {/* Lights */}
        <ambientLight intensity={0.4} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          castShadow
          intensity={1}
        />
        <pointLight
          position={[-10, -10, -10]}
          intensity={0.5}
          color="#ff3366"
        />
        <pointLight position={[10, -5, 5]} intensity={0.5} color="#3366ff" />

        {/* Single mathematical object */}
        <MathObject />

        {/* Title */}
        <Float
          position={[0, 3, 0]}
          rotation={[0, 0, 0]}
          floatIntensity={1}
          speed={2}
        >
          <Text
            fontSize={0.6}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            Transformaciones Matemáticas
          </Text>
        </Float>

        {/* Environment and controls */}
        <Environment preset="city" />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={15}
        />
      </Canvas>
    </div>
  );
}


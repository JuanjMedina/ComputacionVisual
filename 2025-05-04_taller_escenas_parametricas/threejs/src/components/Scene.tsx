import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import { ObjectData, objects } from '../constants/Objectd3d';

function Scene() {
  const { globalScale } = useControls('Global', {
    globalScale: { value: 1, min: 0.1, max: 5, step: 0.1 },
  });

  return (
    <>
      <Leva collapsed />
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {objects.map(obj => (
          <AnimatedMesh key={obj.id} {...obj} globalScale={globalScale} />
        ))}
        <OrbitControls />
      </Canvas>
    </>
  );
}

type AnimatedMeshProps = ObjectData & { globalScale: number };

function AnimatedMesh({
  type,
  position,
  scale,
  color,
  rotationSpeed,
  globalScale,
}: AnimatedMeshProps) {
  const ref = useRef<any>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += rotationSpeed[0];
      ref.current.rotation.y += rotationSpeed[1];
      ref.current.rotation.z += rotationSpeed[2];
    }
  });
  return (
    <mesh
      ref={ref}
      position={position}
      scale={scale.map(s => s * globalScale) as [number, number, number]}
    >
      {type === 'box' ? (
        <boxGeometry args={[1, 1, 1]} />
      ) : type === 'sphere' ? (
        <sphereGeometry args={[0.75, 32, 32]} />
      ) : (
        <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
      )}
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default Scene;

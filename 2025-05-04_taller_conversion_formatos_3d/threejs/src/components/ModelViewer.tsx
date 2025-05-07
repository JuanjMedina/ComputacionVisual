import { useEffect, Suspense, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Grid,
} from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

interface ModelViewerProps {
  format: string;
  onModelLoaded: (model: THREE.Object3D | THREE.Mesh) => void;
}

export default function ModelViewer({
  format,
  onModelLoaded,
}: ModelViewerProps) {
  const [loading, setLoading] = useState(true);

  const objModel = useLoader(OBJLoader, '/models/base.obj');
  const stlGeometry = useLoader(
    STLLoader,
    '/models/base.stl',
    loader => {
      console.log('STL Loader initialized:', loader);
    },
    event => {
      console.log('STL Load Error:', event);
    },
  );
  const glbModel = useLoader(GLTFLoader, '/models/base.glb');

  // Log the STL geometry properties
  useEffect(() => {
    if (stlGeometry) {
      console.log('STL Geometry loaded:', stlGeometry);
      console.log(
        'STL Geometry vertices:',
        stlGeometry.attributes?.position?.count || 0,
      );
    }
  }, [stlGeometry]);

  // Convertir STL geometry en mesh con material mejorado
  const stlMesh = new THREE.Mesh(
    stlGeometry,
    new THREE.MeshPhysicalMaterial({
      color: 'rgb(180, 180, 190)',
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.5,
    }),
  );

  // Compute face normals for better rendering
  useEffect(() => {
    if (stlGeometry && !stlGeometry.attributes.normal) {
      stlGeometry.computeVertexNormals();
    }

    // Ensure the STL mesh has correct scale and position
    if (stlMesh) {
      // Center the model
      stlGeometry.computeBoundingBox();
      if (stlGeometry.boundingBox) {
        const center = new THREE.Vector3();
        stlGeometry.boundingBox.getCenter(center);
        stlMesh.position.set(-center.x, -center.y, -center.z);
      }

      // Normalize scale if too large or small
      stlGeometry.computeBoundingSphere();
      if (stlGeometry.boundingSphere) {
        const radius = stlGeometry.boundingSphere.radius;
        if (radius > 10 || radius < 0.1) {
          const scale = 1 / radius;
          stlMesh.scale.set(scale, scale, scale);
        }
      }
    }
  }, [stlGeometry, stlMesh]);

  // Apply similar scaling and centering to OBJ model
  useEffect(() => {
    if (objModel) {
      const box = new THREE.Box3().setFromObject(objModel);
      const center = new THREE.Vector3();
      box.getCenter(center);
      objModel.position.set(-center.x, -center.y, -center.z);

      // Scale if needed
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 10 || maxDim < 0.1) {
        const scale = 1 / maxDim;
        objModel.scale.set(scale, scale, scale);
      }
    }
  }, [objModel]);

  // Apply similar scaling and centering to GLB model
  useEffect(() => {
    if (glbModel && glbModel.scene) {
      const box = new THREE.Box3().setFromObject(glbModel.scene);
      const center = new THREE.Vector3();
      box.getCenter(center);
      glbModel.scene.position.set(-center.x, -center.y, -center.z);

      // Scale if needed
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 10 || maxDim < 0.1) {
        const scale = 1 / maxDim;
        glbModel.scene.scale.set(scale, scale, scale);
      }
    }
  }, [glbModel]);

  useEffect(() => {
    setLoading(true);
    if (format === 'OBJ' && objModel) {
      onModelLoaded(objModel);
      setLoading(false);
    } else if (format === 'STL' && stlMesh) {
      onModelLoaded(stlMesh);
      setLoading(false);
    } else if (format === 'GLB' && glbModel?.scene) {
      onModelLoaded(glbModel.scene);
      setLoading(false);
    }
  }, [format, objModel, stlMesh, glbModel, onModelLoaded]);

  return (
    <>
      <color attach="background" args={['#f0f0f0']} />

      {/* Lighting setup */}
      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <spotLight
        position={[-10, -10, -10]}
        angle={0.15}
        penumbra={1}
        intensity={0.5}
      />

      {/* Environment and effects */}
      <Environment preset="city" />
      <ContactShadows
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, -0.8, 0]}
        opacity={0.6}
        width={10}
        height={10}
        blur={1.5}
        far={0.8}
      />
      <Grid
        infiniteGrid
        fadeDistance={50}
        fadeStrength={1.5}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#6f6f6f"
        sectionSize={2}
        sectionThickness={1.2}
        sectionColor="#9d4b4b"
        position={[0, -0.01, 0]}
      />

      {/* Camera Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={1}
        maxDistance={100}
      />

      {/* 3D Models */}
      <Suspense fallback={null}>
        {format === 'OBJ' && (
          <primitive object={objModel} castShadow receiveShadow />
        )}
        {format === 'STL' && (
          <primitive object={stlMesh} castShadow receiveShadow />
        )}
        {format === 'GLB' && (
          <primitive object={glbModel.scene} castShadow receiveShadow />
        )}
      </Suspense>

      {/* Loading indicator */}
      {loading && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#ff6b6b" />
        </mesh>
      )}
    </>
  );
}

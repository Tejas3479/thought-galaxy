'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Clouds } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function CameraController() {
  const cameraGroupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (cameraGroupRef.current) {
      cameraGroupRef.current.rotation.y += 0.0001; // Gentle rotation
    }
  });

  return (
    <group ref={cameraGroupRef}>
      <Stars depth={50} factor={4} saturation={0.1} fade speed={0.5} />
      <Clouds position={[0, 0, -30]} opacity={0.05} speed={0.2} />
    </group>
  );
}

export default function SpaceScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 60 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
    >
      <color attach="background" args={['#000011']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={0.5} />
      <CameraController />
    </Canvas>
  );
}

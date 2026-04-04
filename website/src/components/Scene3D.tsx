"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

function CoreSphere() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock, pointer }) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = clock.getElapsedTime() * 0.1;
    mesh.current.rotation.y = clock.getElapsedTime() * 0.15;
    mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, pointer.x * 0.3, 0.03);
    mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, pointer.y * 0.2, 0.03);
  });

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={1}>
      <Sphere ref={mesh} args={[2.2, 256, 256]}>
        <MeshDistortMaterial
          color="#1D4ED8"
          roughness={0.15}
          metalness={0.9}
          distort={0.4}
          speed={1.5}
          transparent
          opacity={0.6}
        />
      </Sphere>
    </Float>
  );
}

function FloatingParticles({ count = 150 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#3B82F6" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

export default function Scene3D({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} color="#3B82F6" />
        <pointLight position={[-3, 2, 4]} intensity={0.4} color="#8B5CF6" />
        <CoreSphere />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}

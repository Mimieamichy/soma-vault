
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere({ position, color, speed, distort }: { position: [number, number, number], color: string, speed: number, distort: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1, 64, 64]} position={position} ref={meshRef}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <Environment preset="city" />
      
      {/* Main Navy Blue Sphere */}
      <AnimatedSphere 
        position={[0, 0, 0]} 
        color="#282e3b" 
        speed={2} 
        distort={0.4} 
      />
      
      {/* Secondary Beige Sphere */}
      <AnimatedSphere 
        position={[2, 1, -2]} 
        color="#DFCFB6" 
        speed={3} 
        distort={0.3} 
      />
      
      {/* Accent Crimson Sphere */}
      <AnimatedSphere 
        position={[-2, -1, -1]} 
        color="#b62020" 
        speed={1.5} 
        distort={0.5} 
      />
      
      {/* Background ambient particles or small spheres could go here */}
      <Float speed={4} rotationIntensity={2} floatIntensity={1}>
        <Sphere args={[0.2, 32, 32]} position={[1.5, -1.5, 1]}>
          <meshStandardMaterial color="#DFCFB6" />
        </Sphere>
      </Float>
    </>
  );
}

export function Hero3D() {
  return (
    <div className="h-full w-full absolute inset-0 -z-10 md:static md:z-auto">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
}

"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Stars } from "@react-three/drei";
import { useRef, Suspense, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, MeshStandardMaterial } from "three";

function GlobeModel({ url }) {
  const { scene } = useGLTF(url);
  const meshRef = useRef();
  const rotationSpeed = 0.001; // Adjust this value to control rotation speed

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = 0;
      meshRef.current.rotation.y = 0;
      meshRef.current.rotation.z = 0;
      meshRef.current.position.set(0, -3, 0); // Center the globe
    }

    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new MeshStandardMaterial({
          map: child.material.map,
          normalMap: child.material.normalMap,
          metalness: 0.1,
          roughness: 0.8,
        });
      }
    });
  }, [scene]);

  // Add auto-rotation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <primitive ref={meshRef} object={scene} scale={1.8} position={[0, -3, 0]} />
  );
}

// function LoadingSpinner() {
//   return (
//     <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
//       <div className="text-white text-xl">Loading Globe...</div>
//     </div>
//   );
// }

export default function Globe() {
  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-hidden">
      <Canvas
        camera={{
          position: [0, 0, 8], // Moved camera back slightly
          fov: 50, // Increased field of view
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        onCreated={(state) => {
          state.gl.setClearColor("#0a0a0a");
        }}
      >
        <ambientLight intensity={0.4} color="#ffffff" />
        <directionalLight
          position={[5, 3, 5]}
          intensity={0.8}
          color="#ffffff"
        />
        <directionalLight
          position={[-5, -3, -5]}
          intensity={0.2}
          color="#4a90e2"
        />

        <Stars
          radius={300}
          depth={60}
          count={500}
          factor={4}
          saturation={0}
          fade={true}
        />

        <GlobeModel url="/Globe.glb" />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={0.6}
          minDistance={6} // Increased min distance
          maxDistance={15} // Increased max distance
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.3}
          minPolarAngle={Math.PI / 2} // Exactly 90 degrees
          maxPolarAngle={Math.PI / 2} // Lock to 90 degrees
          target={[0, 0, 0]} // Changed target to center
        />
      </Canvas>

      <div className="absolute top-4 left-4 text-white z-10">
        <div className="bg-black bg-opacity-50 p-3 rounded-lg">
          <p className="text-sm">🌍 Interactive Globe</p>
          <p className="text-xs opacity-75">Drag to rotate • Scroll to zoom</p>
        </div>
      </div>
    </div>
  );
}

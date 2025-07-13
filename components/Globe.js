"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { MeshStandardMaterial } from "three";

function GlobeModel({ url }) {
  const { scene } = useGLTF(url);
  const meshRef = useRef();
  const rotationSpeed = 0.001;

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = 0;
      meshRef.current.rotation.y = 0;
      meshRef.current.rotation.z = 0;
      meshRef.current.position.set(0, -3, 0); // Centered
    }

    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new MeshStandardMaterial({
          map: child.material.map,
          normalMap: child.material.normalMap,
          metalness: 0.1,
          roughness: 0.8,
          transparent: false,
          opacity: 1,
        });
      }
    });
  }, [scene]);

  useFrame(() => {
    if (meshRef.current && !window.isRotating) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  // Reduce scale if needed (try 1.5 or 1.2 if 1.8 is too large)
  return (
    <primitive ref={meshRef} object={scene} scale={1.8} position={[0, 0, 0]} />
  );
}

export default function Globe() {
  return (
    <div
      className="w-full h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: 'url("/bg_image.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 8], // Centered
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        onCreated={(state) => {
          state.gl.setClearColor("#000000", 0);
        }}
      >
        <ambientLight intensity={1.2} color="#ffffff" />
        <directionalLight
          position={[5, 3, 5]}
          intensity={0.8}
          color="#ffffff"
        />
        {/* <directionalLight
          position={([-5, -3, -5], [5, 3, 5])}
          intensity={0.2}
          color="#4a90e2"
        /> */}

        <GlobeModel url="/Globe.glb" />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={0.6}
          minDistance={6}
          maxDistance={15}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          minPolarAngle={0} // Allow full vertical rotation
          maxPolarAngle={Math.PI} // Allow full vertical rotation
          target={[0, 0, 0]}
          onStart={() => {
            window.isRotating = true;
          }}
          onEnd={() => {
            window.isRotating = false;
          }}
        />
      </Canvas>

      {/* <div className="absolute top-4 left-4 text-white z-10">
        <div className="bg-black bg-opacity-50 p-3 rounded-lg">
          <p className="text-sm">🌍 Interactive Globe</p>
          <p className="text-xs opacity-75">Drag to rotate • Scroll to zoom</p>
        </div>
      </div> */}
    </div>
  );
}

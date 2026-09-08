"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

function useScrollSignal() {
  const signal = useRef({ progress: 0, velocity: 0 });

  useEffect(() => {
    const onScroll = (event) => {
      signal.current = event.detail;
    };
    window.addEventListener("aquamundi:lenis-scroll", onScroll);
    return () => window.removeEventListener("aquamundi:lenis-scroll", onScroll);
  }, []);

  return signal;
}

function ScenePlane({ src, position, width, scroll, parallax = 1, rotate = 0 }) {
  const mesh = useRef();
  const texture = useTexture(src);
  const { viewport } = useThree();
  const scale = useMemo(() => {
    const image = texture.image;
    const ratio = image?.width && image?.height ? image.width / image.height : 1;
    const nextWidth = viewport.width * width;
    return [nextWidth, nextWidth / ratio, 1];
  }, [viewport, texture, width]);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame(() => {
    const progress = scroll.current.progress;
    mesh.current.scale.set(...scale);
    mesh.current.position.x = position[0] * viewport.width;
    mesh.current.position.y = position[1] * viewport.height - progress * viewport.height * 2.75 * parallax;
    mesh.current.rotation.z = rotate;
  });

  return (
    <mesh ref={mesh} position={[0, 0, position[2] || 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function JourneyScene() {
  const scroll = useScrollSignal();

  return (
    <>
      <color attach="background" args={["#061824"]} />
      <ScenePlane src="/landing/living-field-hero.png" position={[0, 0, -0.4]} width={1.08} scroll={scroll} parallax={0.92} />
      <ScenePlane src="/landing/carnation-pollinator.webp" position={[0.2, 0.85, 0.4]} width={0.56} scroll={scroll} parallax={1.04} rotate={-0.035} />
      <ScenePlane src="/landing/cloud-bank-blue-alpha.webp" position={[-0.1, 1.72, 0.2]} width={1.12} scroll={scroll} parallax={1.12} />
      <ScenePlane src="/landing/pollinator-meadow.webp" position={[0.08, 2.6, -0.1]} width={1.02} scroll={scroll} parallax={1.22} />
    </>
  );
}

export default function ExperienceLabCanvas() {
  return (
    <div aria-hidden="true" className="fixed inset-0 z-0">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: "high-performance" }} orthographic camera={{ position: [0, 0, 5], zoom: 1 }}>
        <Suspense fallback={null}><JourneyScene /></Suspense>
      </Canvas>
    </div>
  );
}

"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";

function SceneAsset() {
  const { gl, set, size, scene } = useThree();
  const [asset, setAsset] = useState(null);

  useEffect(() => {
    let disposed = false;
    const loader = new GLTFLoader();
    const ktx2 = new KTX2Loader()
      .setTranscoderPath("/basis/")
      .detectSupport(gl);
    loader.setKTX2Loader(ktx2);
    ktx2.load("/experience/andes-intro-bg-s-CSpou73Y.ktx2", (texture) => {
      if (disposed) return texture.dispose();
      texture.colorSpace = THREE.SRGBColorSpace;
      scene.background = texture;
    });
    loader.load("/experience/andes_c-Dtj79C6i.glb", (gltf) => {
      if (disposed) return;
      gltf.scene.traverse((object) => {
        if (object.isMesh) {
          object.frustumCulled = false;
          object.visible = true;
        }
      });
      const titleNode = gltf.scene.getObjectByName("title-webgl_text");
      const subtitleNode = gltf.scene.getObjectByName("title_sub-webgl_text");
      if (titleNode) titleNode.visible = false;
      if (subtitleNode) subtitleNode.visible = false;
      if (titleNode) {
        const labelCanvas = document.createElement("canvas");
        labelCanvas.width = 1600;
        labelCanvas.height = 320;
        const labelContext = labelCanvas.getContext("2d");
        labelContext.clearRect(0, 0, labelCanvas.width, labelCanvas.height);
        labelContext.textAlign = "center";
        labelContext.textBaseline = "middle";
        labelContext.fillStyle = "#eef4ec";
        labelContext.font = "600 190px Georgia, serif";
        labelContext.fillText("AquaMundi", labelCanvas.width / 2, 145);
        labelContext.fillStyle = "#a9c2c4";
        labelContext.font = "700 24px Arial, sans-serif";
        labelContext.letterSpacing = "8px";
        labelContext.fillText("A LIVING ARCHIVE OF CONNECTED HABITATS", labelCanvas.width / 2, 265);
        const texture = new THREE.CanvasTexture(labelCanvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthTest: true,
          depthWrite: false,
        }));
        const bounds = new THREE.Box3().setFromObject(titleNode);
        const size = bounds.getSize(new THREE.Vector3());
        sprite.scale.set(Math.max(size.x * 2.8, 5), Math.max(size.y * 4, 1.4), 1);
        sprite.userData.titleAnchor = titleNode;
        gltf.scene.add(sprite);
        gltf.__titleSprite = sprite;
        gltf.__titleTexture = texture;
      }
      setAsset(gltf);
    }, undefined, (error) => console.error("AquaMundi Andes scene failed to load", error));
    return () => {
      disposed = true;
      if (scene.background?.isTexture) scene.background.dispose();
      scene.background = null;
      if (asset?.__titleTexture) asset.__titleTexture.dispose();
      ktx2.dispose();
    };
  }, [gl, scene]);

  useEffect(() => {
    const camera = asset?.cameras?.find((item) => item.name === "andesCam.001")
      || asset?.cameras?.[0]
      || asset?.scene?.getObjectByName("andesCam.001");
    if (!camera) return;
    asset.scene.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
    camera.aspect = size.width / Math.max(size.height, 1);
    camera.far = 2000;
    camera.updateProjectionMatrix();
    set({ camera });
  }, [asset, set, size.width, size.height]);

  useFrame((_, delta) => {
    if (!asset) return;
    // Stop at the first cloud: the globe chapter begins immediately after it.
    const rawProgress = window.__aquamundiIntroProgress || 0;
    const progress = Math.min(rawProgress * 0.42, 0.42);
    const mixer = asset.__mixer || (asset.__mixer = new THREE.AnimationMixer(asset.scene));
    if (!asset.__actions) {
      asset.__actions = asset.animations.map((clip) => mixer.clipAction(clip));
      asset.__actions.forEach((action) => action.play());
      asset.__duration = Math.max(...asset.animations.map((clip) => clip.duration), 1);
    }
    mixer.setTime(Math.min(progress * asset.__duration, asset.__duration));
    const sprite = asset.__titleSprite;
    const anchor = sprite?.userData.titleAnchor;
    if (sprite && anchor) {
      anchor.getWorldPosition(sprite.position);
      const reveal = THREE.MathUtils.clamp((progress - 0.2) / 0.12, 0, 1);
      sprite.material.opacity = reveal;
    }
    mixer.update(delta * 0.00001);
  });

  return asset ? <primitive object={asset.scene} /> : null;
}

export default function ExperienceIntroGLB() {
  useEffect(() => {
    const onScroll = (event) => {
      window.__aquamundiIntroProgress = event.detail?.progress || 0;
    };
    window.addEventListener("aquamundi:intro-scroll", onScroll);
    return () => window.removeEventListener("aquamundi:intro-scroll", onScroll);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 15], fov: 45 }}
    >
      <color attach="background" args={["#061824"]} />
      <ambientLight intensity={1.8} />
      <directionalLight position={[2, 4, 6]} intensity={2.4} />
      <SceneAsset />
    </Canvas>
  );
}

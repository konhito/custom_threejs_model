"use client";

import { motion } from "motion/react";
import { useState, useRef, useEffect, useMemo } from "react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { computeSANCode } from "../../lib/sanCode";
import {
  Globe2,
  Sparkles,
  Bug,
  TrendingDown,
  Target,
  ChevronLeft,
  ChevronRight,
  Search
} from "lucide-react";
import { useTranslation } from "../../lib/useTranslation";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation as SwiperNavigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Helper function to create GLB path
const createGLBPath = (fileName) => {
  return `/api/glb-proxy?url=${encodeURIComponent(`https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/${fileName}`)}`;
};

// Pollinator data array
const POLLINATORS_DATA = [
  {
    id: "ant",
    commonName: "Ant",
    scientificName: "Formicidae sp.",
    roleEn: "Ground pollinator associated with flowers",
    roleEs: "Polinizador terrestre asociado a las flores",
    sanCode: computeSANCode("Formicidae sp.", "P"),
    glbPath: "/ant.glb",
    country: "Global",
    group: "Social insects (Order Hymenoptera)",
    morphology: "Body divided into head, thorax and abdomen, elbowed antennae and strong mandibles; size from a few millimetres to 1–2 cm.",
    habitat: "Present in almost all terrestrial ecosystems, especially soils, path edges and gardens.",
    role: "Ants visit flowers attracted by nectar and sugary exudates on the petals. Although often considered secondary pollinators compared to lepidoptera or bees, they promote contact with pollen at the base of the flower.",
    conservation: "Ant pollinator guilds receive an estimated Araihan Measure of 18/25: high local efficiency and strong ecological interdependence, yet vulnerable to pesticides, habitat loss and changes in soil micro‑climate.",
    araihanMeasure: "18 / 25 (Stable)",
    icon: Bug,
    color: "amber"
  },
  // Honeybee & Bumblebee commented out for now (no GLB models)
  // {
  //   id: "honeybee",
  //   commonName: "Honeybee",
  //   scientificName: "Apis mellifera",
  //   roleEn: "Essential pollinator responsible for pollinating many of the world's food crops",
  //   roleEs: "Polinizador esencial responsable de polinizar muchos de los cultivos alimentarios del mundo",
  //   sanCode: computeSANCode("Apis mellifera", "P"),
  //   glbPath: null, // Will use procedural 3D for now
  //   country: "Global",
  //   group: "Social insects (Order Hymenoptera)",
  //   morphology: "Small, fuzzy insects with black and yellow striped bodies, approximately 1-1.5 cm in length.",
  //   habitat: "Found worldwide in diverse habitats, from forests to urban gardens, wherever flowering plants grow.",
  //   role: "Honeybees are among the most important pollinators, responsible for pollinating approximately 80% of flowering plants and 75% of food crops worldwide.",
  //   conservation: "Honeybee populations face significant threats from pesticides, habitat loss, climate change, and diseases. Araihan Measure: 20 / 25 (Declining).",
  //   araihanMeasure: "20 / 25 (Declining)",
  //   icon: Bug,
  //   color: "yellow"
  // },
  // {
  //   id: "bumblebee",
  //   commonName: "Bumblebee",
  //   scientificName: "Bombus terrestris",
  //   roleEn: "Large, fuzzy bees that are excellent pollinators for many wildflowers and crops",
  //   roleEs: "Abejas grandes y peludas que son excelentes polinizadores para muchas flores silvestres y cultivos",
  //   sanCode: computeSANCode("Bombus terrestris", "P"),
  //   glbPath: null,
  //   country: "Europe, Asia, North America",
  //   group: "Social insects (Order Hymenoptera)",
  //   morphology: "Large, robust bees with dense hair covering their bodies, typically 1.5-2.5 cm in length with distinctive black and yellow banding.",
  //   habitat: "Temperate regions, grasslands, meadows, and gardens with abundant flowering plants.",
  //   role: "Bumblebees are excellent pollinators due to their large size and ability to 'buzz pollinate' flowers that require vibration to release pollen.",
  //   conservation: "Many bumblebee species are declining due to habitat loss and pesticide use. Araihan Measure: 19 / 25 (Stable to Declining).",
  //   araihanMeasure: "19 / 25 (Stable to Declining)",
  //   icon: Bug,
  //   color: "orange"
  // },
  {
    id: "hummingbird",
    commonName: "Ruby-throated Hummingbird",
    scientificName: "Archilochus colubris",
    roleEn: "Tiny, fast-flying birds that pollinate tubular flowers with their long beaks",
    roleEs: "Aves diminutas y de vuelo rápido que polinizan flores tubulares con sus picos largos",
    sanCode: computeSANCode("Archilochus colubris", "P"),
    glbPath: createGLBPath("Humming_bird.glb"),
    country: "North America",
    group: "Birds (Order Apodiformes)",
    morphology: "Small birds, 7-9 cm in length, with iridescent green feathers and a distinctive ruby-red throat patch in males.",
    habitat: "Forests, gardens, and meadows throughout North America, especially areas with abundant nectar-producing flowers.",
    role: "Hummingbirds are important pollinators for many tubular flowers, transferring pollen as they feed on nectar with their long, specialized beaks.",
    conservation: "While not currently endangered, habitat loss and climate change pose threats. Araihan Measure: 22 / 25 (Stable).",
    araihanMeasure: "22 / 25 (Stable)",
    icon: Bug,
    color: "emerald"
  },
  {
    id: "butterfly",
    commonName: "Monarch Butterfly",
    scientificName: "Danaus plexippus",
    roleEn: "Famous migratory butterflies that pollinate milkweed and other wildflowers",
    roleEs: "Mariposas migratorias famosas que polinizan algodoncillo y otras flores silvestres",
    sanCode: computeSANCode("Danaus plexippus", "P"),
    glbPath: createGLBPath("Final_Textured_Butterfly.glb"),
    country: "North America",
    group: "Butterflies (Order Lepidoptera)",
    morphology: "Large butterflies with distinctive orange and black wing patterns, wingspan of 8-10 cm.",
    habitat: "Meadows, fields, and gardens across North America, with specific overwintering sites in Mexico and California.",
    role: "Monarchs are important pollinators during their long migrations, visiting numerous flowering plants along their route.",
    conservation: "Monarch populations have declined significantly due to habitat loss and pesticide use. Araihan Measure: 17 / 25 (Declining).",
    araihanMeasure: "17 / 25 (Declining)",
    icon: Bug,
    color: "purple"
  },
  {
    id: "hummingbird_moth",
    commonName: "Hummingbird Moth",
    scientificName: "Hemaris spp.",
    roleEn: "Moth species that mimic hummingbirds in appearance and behavior",
    roleEs: "Especies de polillas que imitan a los colibríes en apariencia y comportamiento",
    sanCode: computeSANCode("Hemaris spp.", "P"),
    glbPath: createGLBPath("Normal__Humming_Bird_Moth_Glb.glb"),
    country: "North America, Europe, Asia",
    group: "Moths (Order Lepidoptera)",
    morphology: "Medium-sized moths with clear wings and fuzzy bodies, resembling hummingbirds. Wingspan of 4-6 cm with transparent patches.",
    habitat: "Gardens, meadows, and open areas with abundant flowering plants. Found in temperate regions worldwide.",
    role: "Hummingbird moths are important pollinators, especially for tubular flowers. They hover like hummingbirds while feeding on nectar.",
    conservation: "Hummingbird moth populations are generally stable but face threats from habitat loss and pesticide use. Araihan Measure: 19 / 25 (Stable).",
    araihanMeasure: "19 / 25 (Stable)",
    icon: Bug,
    color: "emerald"
  },
  {
    id: "beetle",
    commonName: "Beetle",
    scientificName: "Coleoptera sp.",
    roleEn: "Diverse group of insects that pollinate flowers while feeding on pollen and nectar",
    roleEs: "Grupo diverso de insectos que polinizan flores mientras se alimentan de polen y néctar",
    sanCode: computeSANCode("Coleoptera sp.", "P"),
    glbPath: createGLBPath("Beetle_Final_With_Texture.glb"),
    country: "Global",
    group: "Beetles (Order Coleoptera)",
    morphology: "Hard-shelled insects with elytra (wing covers) protecting delicate flight wings. Size varies from a few millimeters to several centimeters.",
    habitat: "Found in almost all terrestrial ecosystems worldwide, from forests to deserts, gardens to grasslands.",
    role: "Beetles are among the oldest pollinators, visiting flowers to feed on pollen and nectar. They are particularly important for primitive flowering plants.",
    conservation: "Beetle pollinator populations are generally stable but face threats from habitat loss and pesticide use. Araihan Measure: 20 / 25 (Stable).",
    araihanMeasure: "20 / 25 (Stable)",
    icon: Bug,
    color: "amber"
  }
];

const BACKGROUND_HEX = "#E8E6DF";
const VIEW_OPTION = {
  id: "side",
  label: "Side View",
  camera: { position: [0, 1.5, 3], lookAt: [0, 0, 0] },
  controls: {
    minPolar: Math.PI / 3.2,
    maxPolar: Math.PI / 1.8,
    autoRotate: true,
    autoRotateSpeed: 0.8,
  },
};

// Floating floral decoration component
const FloralDecoration = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 1, ease: "easeOut" }}
  >
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(147, 197, 253, 0.3)" />
          <stop offset="50%" stopColor="rgba(196, 181, 253, 0.2)" />
          <stop offset="100%" stopColor="rgba(249, 168, 212, 0.3)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#glow)" className="animate-float">
        <ellipse cx="60" cy="30" rx="12" ry="25" fill="url(#petalGradient)" transform="rotate(0 60 60)" />
        <ellipse cx="60" cy="30" rx="12" ry="25" fill="url(#petalGradient)" transform="rotate(72 60 60)" />
        <ellipse cx="60" cy="30" rx="12" ry="25" fill="url(#petalGradient)" transform="rotate(144 60 60)" />
        <ellipse cx="60" cy="30" rx="12" ry="25" fill="url(#petalGradient)" transform="rotate(216 60 60)" />
        <ellipse cx="60" cy="30" rx="12" ry="25" fill="url(#petalGradient)" transform="rotate(288 60 60)" />
        <circle cx="60" cy="60" r="8" fill="rgba(251, 191, 36, 0.4)" />
      </g>
    </svg>
  </motion.div>
);

// Glowing orb decoration
const GlowingOrb = ({ className, color = "blue", delay = 0, size = "md" }) => {
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-64 h-64",
    xl: "w-96 h-96",
  };

  const colorClasses = {
    blue: "from-blue-400/20 via-indigo-300/10 to-transparent",
    purple: "from-purple-400/20 via-violet-300/10 to-transparent",
    pink: "from-pink-400/20 via-rose-300/10 to-transparent",
    teal: "from-teal-400/20 via-cyan-300/10 to-transparent",
    emerald: "from-emerald-400/20 via-green-300/10 to-transparent",
    amber: "from-amber-400/20 via-yellow-300/10 to-transparent",
    rainbow: "from-blue-400/15 via-purple-400/15 to-pink-400/15",
  };

  return (
    <motion.div
      className={`absolute rounded-full bg-gradient-radial ${colorClasses[color]} ${sizeClasses[size]} blur-3xl pointer-events-none ${className}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 1.5, ease: "easeOut" }}
    />
  );
};

// Pollinator 3D Model Viewer Component (reusable)
function Pollinator3DViewer({ pollinator, t, isActive = false, onGLBLoaded }) {
  const canvasRef = useRef(null);
  const [isGLBLoaded, setIsGLBLoaded] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lazy load GLB first when slide becomes active
  useEffect(() => {
    if (typeof window === "undefined" || !isMounted || !isActive || !pollinator.glbPath) return;

    let renderer;
    let camera;
    let animationId;
    const cleanupFns = [];

    setIsGLBLoaded(false);
    setError(null);

    const loadModel = async () => {
      try {
        const THREE = await import("three");
        const { GLTFLoader } = await import(
          "three/examples/jsm/loaders/GLTFLoader.js"
        );
        const { DRACOLoader } = await import(
          "three/examples/jsm/loaders/DRACOLoader.js"
        );
        const { OrbitControls } = await import(
          "three/examples/jsm/controls/OrbitControls.js"
        );

        const container = canvasRef.current;
        if (!container) {
          console.warn("Canvas container not found");
          return;
        }

        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(BACKGROUND_HEX);

        const viewSettings = VIEW_OPTION;

        camera = new THREE.PerspectiveCamera(
          45,
          container.clientWidth / container.clientHeight,
          0.1,
          100
        );
        camera.position.set(...viewSettings.camera.position);
        camera.lookAt(
          viewSettings.camera.lookAt[0],
          viewSettings.camera.lookAt[1],
          viewSettings.camera.lookAt[2]
        );

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(container.clientWidth, container.clientHeight, false);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        renderer.shadowMap.enabled = true;

        // Prevent Swiper from capturing events on the 3D canvas.
        // Use stopPropagation only (not stopImmediatePropagation) so OrbitControls still receive events.
        // When user drags off the canvas, mousemove/mouseup fire on other elements; we use document
        // listeners to block those from reaching Swiper.
        renderer.domElement.style.touchAction = "none";
        renderer.domElement.style.pointerEvents = "auto";
        renderer.domElement.style.userSelect = "none";

        let removeDocListeners = null;

        const stopPropagationOnly = (e) => {
          e.stopPropagation();
        };

        const stopOnCanvas = (e) => {
          if (e.target !== renderer.domElement) return;
          e.stopPropagation();
        };

        const stopOnContainer = (e) => {
          if (e.target !== renderer.domElement && !renderer.domElement.contains(e.target)) return;
          e.stopPropagation();
        };

        const bindDocListeners = () => {
          if (removeDocListeners) return;
          const docStop = (e) => {
            e.stopPropagation();
          };
          const docUp = (e) => {
            e.stopPropagation();
            removeDocListeners?.();
            removeDocListeners = null;
          };
          const opts = { capture: true, passive: false };
          document.addEventListener("mousemove", docStop, opts);
          document.addEventListener("mouseup", docUp, opts);
          document.addEventListener("touchmove", docStop, opts);
          document.addEventListener("touchend", docUp, opts);
          document.addEventListener("touchcancel", docUp, opts);
          removeDocListeners = () => {
            document.removeEventListener("mousemove", docStop, opts);
            document.removeEventListener("mouseup", docUp, opts);
            document.removeEventListener("touchmove", docStop, opts);
            document.removeEventListener("touchend", docUp, opts);
            document.removeEventListener("touchcancel", docUp, opts);
          };
        };

        const canvasPointerDown = (e) => {
          if (e.target !== renderer.domElement) return;
          e.stopPropagation();
          bindDocListeners();
        };

        const containerPointerDown = (e) => {
          if (e.target !== renderer.domElement && !renderer.domElement.contains(e.target)) return;
          e.stopPropagation();
          bindDocListeners();
        };

        // Canvas: stop propagation so Swiper never sees it. No stopImmediatePropagation so OrbitControls work.
        renderer.domElement.addEventListener("mousedown", canvasPointerDown, { capture: true, passive: false });
        renderer.domElement.addEventListener("touchstart", canvasPointerDown, { capture: true, passive: false });
        renderer.domElement.addEventListener("mousemove", stopOnCanvas, { capture: true, passive: false });
        renderer.domElement.addEventListener("mouseup", stopOnCanvas, { capture: true, passive: false });
        renderer.domElement.addEventListener("touchmove", stopOnCanvas, { capture: true, passive: false });
        renderer.domElement.addEventListener("touchend", stopOnCanvas, { capture: true, passive: false });
        renderer.domElement.addEventListener("click", stopPropagationOnly, { capture: true, passive: false });
        renderer.domElement.addEventListener("wheel", stopPropagationOnly, { capture: true, passive: false });
        renderer.domElement.addEventListener("contextmenu", stopPropagationOnly, { capture: true, passive: false });

        container.style.pointerEvents = "auto";
        container.addEventListener("mousedown", containerPointerDown, { capture: true, passive: false });
        container.addEventListener("touchstart", containerPointerDown, { capture: true, passive: false });

        container.appendChild(renderer.domElement);
        cleanupFns.push(() => {
          removeDocListeners?.();
          renderer.domElement.removeEventListener("mousedown", canvasPointerDown, { capture: true });
          renderer.domElement.removeEventListener("touchstart", canvasPointerDown, { capture: true });
          renderer.domElement.removeEventListener("mousemove", stopOnCanvas, { capture: true });
          renderer.domElement.removeEventListener("mouseup", stopOnCanvas, { capture: true });
          renderer.domElement.removeEventListener("touchmove", stopOnCanvas, { capture: true });
          renderer.domElement.removeEventListener("touchend", stopOnCanvas, { capture: true });
          renderer.domElement.removeEventListener("click", stopPropagationOnly, { capture: true });
          renderer.domElement.removeEventListener("wheel", stopPropagationOnly, { capture: true });
          renderer.domElement.removeEventListener("contextmenu", stopPropagationOnly, { capture: true });
          container.removeEventListener("mousedown", containerPointerDown, { capture: true });
          container.removeEventListener("touchstart", containerPointerDown, { capture: true });
          if (renderer?.domElement?.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
          }
          renderer?.dispose();
        });

        const neutralKey = new THREE.DirectionalLight(0xffffff, 1.2);
        neutralKey.position.set(4, 6, 3);
        neutralKey.castShadow = true;
        scene.add(neutralKey);

        const warmFill = new THREE.DirectionalLight(0xfff1d6, 0.6);
        warmFill.position.set(-3, 2, -2);
        scene.add(warmFill);

        const coolRim = new THREE.DirectionalLight(0xd8ecff, 0.45);
        coolRim.position.set(0, 4, -4);
        scene.add(coolRim);

        scene.add(new THREE.AmbientLight(0xfaf7f1, 0.5));

        const groundGeo = new THREE.PlaneGeometry(20, 20);
        const groundMat = new THREE.ShadowMaterial({
          opacity: 0.18,
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1;
        ground.receiveShadow = true;
        scene.add(ground);

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(
          "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
        );
        dracoLoader.setDecoderConfig({ type: "js" });

        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        loader.setCrossOrigin("anonymous");
        loader.load(
          pollinator.glbPath,
          (gltf) => {
            const model = gltf.scene;
            model.traverse((node) => {
              if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                if (node.material) {
                  node.material.needsUpdate = true;
                }
              }
            });

            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const targetHeight = 1.8;
            const scale = targetHeight / maxDim;
            model.scale.setScalar(scale);
            model.position.sub(center.multiplyScalar(scale));

            scene.add(model);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.autoRotate = viewSettings.controls.autoRotate ?? true;
            controls.autoRotateSpeed =
              viewSettings.controls.autoRotateSpeed ?? 0.8;
            controls.minPolarAngle = viewSettings.controls.minPolar;
            controls.maxPolarAngle = viewSettings.controls.maxPolar;
            controls.enablePan = false;
            cleanupFns.push(() => controls.dispose());

            const animate = () => {
              animationId = requestAnimationFrame(animate);
              controls.update();
              renderer.render(scene, camera);
            };
            animate();
            cleanupFns.push(() => cancelAnimationFrame(animationId));

            const handleResize = () => {
              if (!container) return;
              camera.aspect = container.clientWidth / container.clientHeight;
              camera.updateProjectionMatrix();
              renderer.setSize(container.clientWidth, container.clientHeight);
            };

            window.addEventListener("resize", handleResize);
            setIsGLBLoaded(true);
            if (onGLBLoaded) onGLBLoaded();
            // After GLB loads, lazy load content
            setTimeout(() => setIsContentLoaded(true), 300);
            cleanupFns.push(() =>
              window.removeEventListener("resize", handleResize)
            );
          },
          undefined,
          (error) => {
            console.error("GLB load error", error);
            setError("Failed to load 3D model.");
            setIsGLBLoaded(false);
            setIsContentLoaded(true); // Still show content even if GLB fails
          }
        );
      } catch (err) {
        console.error("Three.js setup error", err);
        setError("Three.js could not initialize.");
        setIsGLBLoaded(false);
        setIsContentLoaded(true);
      }
    };

    loadModel();

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, [isMounted, isActive, pollinator.glbPath, onGLBLoaded]);

  // Lazy load content when slide becomes active (even if no GLB)
  useEffect(() => {
    if (isActive && !pollinator.glbPath) {
      // If no GLB, load content immediately
      setTimeout(() => setIsContentLoaded(true), 100);
    }
  }, [isActive, pollinator.glbPath]);

  if (!isMounted) {
    return (
      <div className="w-full h-[260px] sm:h-[340px] md:h-[420px] lg:h-[500px] flex items-center justify-center bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl">
        <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const IconComponent = pollinator.icon || Bug;
  const colorClasses = {
    amber: "from-amber-400/20 via-orange-400/20 to-yellow-400/20",
    yellow: "from-yellow-400/20 via-amber-400/20 to-orange-400/20",
    orange: "from-orange-400/20 via-red-400/20 to-amber-400/20",
    emerald: "from-emerald-400/20 via-green-400/20 to-teal-400/20",
    purple: "from-purple-400/20 via-violet-400/20 to-pink-400/20",
  };
  const bgColorClasses = {
    amber: "bg-amber-50/80 border-amber-200",
    yellow: "bg-yellow-50/80 border-yellow-200",
    orange: "bg-orange-50/80 border-orange-200",
    emerald: "bg-emerald-50/80 border-emerald-200",
    purple: "bg-purple-50/80 border-purple-200",
  };
  const iconBgClasses = {
    amber: "from-amber-500 to-orange-500",
    yellow: "from-yellow-500 to-amber-500",
    orange: "from-orange-500 to-red-500",
    emerald: "from-emerald-500 to-teal-500",
    purple: "from-purple-500 to-violet-500",
  };
  const borderClasses = {
    amber: "border-amber-500",
    yellow: "border-yellow-500",
    orange: "border-orange-500",
    emerald: "border-emerald-500",
    purple: "border-purple-500",
  };
  const textClasses = {
    amber: "text-amber-700",
    yellow: "text-yellow-700",
    orange: "text-orange-700",
    emerald: "text-emerald-700",
    purple: "text-purple-700",
  };

  return (
    <div className="relative group">
      {/* Glow effect on hover - hidden on touch/mobile */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${colorClasses[pollinator.color] || colorClasses.amber} rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:block`} />

      {/* Card */}
      <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${iconBgClasses[pollinator.color] || iconBgClasses.amber} flex items-center justify-center shadow-md flex-shrink-0`}>
            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h2
              className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 line-clamp-1 sm:line-clamp-none"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              {pollinator.commonName}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 italic line-clamp-1 sm:line-clamp-none">
              <em>{pollinator.scientificName}</em>
            </p>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
              {pollinator.country}
            </p>
          </div>
        </div>

        {/* 3D Viewer */}
        {pollinator.glbPath && (
          <div className="relative w-full h-[260px] sm:h-[340px] md:h-[420px] lg:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden isolate mb-4 sm:mb-6 swiper-no-swiping" style={{ pointerEvents: 'auto' }} data-canvas-container>
            <div ref={canvasRef} className="w-full h-full gpu-accelerated" style={{ pointerEvents: 'auto' }} />
            {!isGLBLoaded && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
                <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mb-2 sm:mb-3" />
                <span className="text-xs sm:text-sm text-gray-500 px-2 text-center">
                  {t('common.loading')}
                </span>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 grid place-content-center bg-red-50 text-red-500 text-sm font-medium text-center px-4">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Pollinator Information - Lazy loaded after GLB */}
        {isContentLoaded && (
          <div className="space-y-4 sm:space-y-6" style={{ animation: 'fadeIn 0.5s ease-in' }}>
            {/* Biological Data */}
            <div className={`${bgColorClasses[pollinator.color] || bgColorClasses.amber} backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border`}>
              <h3 className={`text-[11px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] ${textClasses[pollinator.color] || textClasses.amber} mb-3 sm:mb-4`}>
                {t('pollinators.biologicalData')}
              </h3>
              <div className="grid gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className={`bg-white/80 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 border-l-4 ${borderClasses[pollinator.color] || borderClasses.amber}`}>
                  <div className={`text-[10px] sm:text-[11px] font-semibold ${textClasses[pollinator.color] || textClasses.amber} uppercase mb-0.5 sm:mb-1`}>
                    {t('pollinators.scientificName')}
                  </div>
                  <div className="text-gray-800 line-clamp-1 sm:line-clamp-none">
                    <em>{pollinator.scientificName}</em>
                  </div>
                </div>
                <div className={`bg-white/80 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 border-l-4 ${borderClasses[pollinator.color] || borderClasses.amber}`}>
                  <div className={`text-[10px] sm:text-[11px] font-semibold ${textClasses[pollinator.color] || textClasses.amber} uppercase mb-0.5 sm:mb-1`}>
                    {t('pollinators.group')}
                  </div>
                  <div className="text-gray-800 line-clamp-2 sm:line-clamp-none">
                    {pollinator.group}
                  </div>
                </div>
                <div className="text-[11px] sm:text-xs text-gray-700 space-y-1 mt-2 sm:mt-3">
                  <p className="line-clamp-3 sm:line-clamp-none">
                    <span className="font-semibold">
                      {t('pollinators.basicMorphology')}
                    </span>{" "}
                    {pollinator.morphology}
                  </p>
                  <p className="line-clamp-2 sm:line-clamp-none">
                    <span className="font-semibold">
                      {t('pollinators.habitatDistribution')}
                    </span>{" "}
                    {pollinator.habitat}
                  </p>
                </div>
              </div>
            </div>

            {/* Pollinator Role */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-amber-200">
              <h3 className={`text-[11px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] ${textClasses[pollinator.color] || textClasses.amber} mb-3 sm:mb-4`}>
                {t('pollinators.pollinatorRole')}
              </h3>
              <p className="text-gray-800 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 line-clamp-4 sm:line-clamp-none">
                {pollinator.role}
              </p>
              <p className="text-gray-800 text-xs sm:text-sm leading-relaxed line-clamp-4 sm:line-clamp-none">
                {pollinator.conservation}
              </p>
              <div className="mt-3 sm:mt-4 text-[11px] sm:text-xs text-gray-600 space-y-0.5">
                <p>
                  <span className="font-mono font-semibold">{t('flowersCatalog.sanCode')}</span> {pollinator.sanCode}
                </p>
                <p>
                  {t('pollinators.araihanMeasure')} {pollinator.araihanMeasure}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PollinatorsPage() {
  const { t, isLoading } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter pollinators by SAN code, scientific name, or common name
  const filteredPollinators = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().replace(/[,\s-]/g, "");
    return POLLINATORS_DATA.filter((pol) => {
      const san = (pol.sanCode || "").toLowerCase().replace(/[,\s-]/g, "");
      const sci = (pol.scientificName || "").toLowerCase();
      const common = (pol.commonName || "").toLowerCase();
      const country = (pol.country || "").toLowerCase();
      return san.includes(q) || sci.includes(q) || common.includes(q) || country.includes(q);
    });
  }, [searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .pollinators-swiper .swiper-slide {
          opacity: 0.3;
          transition: opacity 0.3s;
        }
        .pollinators-swiper .swiper-slide-active {
          opacity: 1;
        }
      `}</style>
      {/* Aurora-inspired background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Main aurora gradient */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 20%, rgba(251, 191, 36, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 30%, rgba(249, 115, 22, 0.35) 0%, transparent 50%),
              radial-gradient(ellipse 70% 50% at 50% 80%, rgba(245, 158, 11, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse 50% 30% at 10% 60%, rgba(217, 119, 6, 0.25) 0%, transparent 50%)
            `,
          }}
        />

        {/* Animated aurora streaks */}
        <div
          className="absolute inset-0 animate-aurora opacity-20"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                100deg,
                rgba(251, 191, 36, 0.1) 10%,
                rgba(249, 115, 22, 0.1) 15%,
                rgba(245, 158, 11, 0.1) 20%,
                rgba(217, 119, 6, 0.1) 25%,
                rgba(251, 191, 36, 0.1) 30%
              )
            `,
            backgroundSize: '300% 200%',
          }}
        />
      </div>

      {/* Decorative elements - reduced on mobile for performance & less clutter */}
      <GlowingOrb className="hidden md:block top-20 -right-20" color="amber" delay={0.2} size="xl" />
      <GlowingOrb className="hidden sm:block top-1/3 -left-32" color="amber" delay={0.4} size="lg" />
      <GlowingOrb className="bottom-1/4 right-4 sm:right-10 opacity-60 sm:opacity-100" color="amber" delay={0.6} size="md" />
      <GlowingOrb className="hidden lg:block bottom-40 left-1/4" color="amber" delay={0.8} size="lg" />

      <FloralDecoration className="hidden sm:block top-32 right-20 opacity-60" delay={1} />
      <FloralDecoration className="hidden md:block top-1/2 left-10 opacity-40" delay={1.2} />
      <FloralDecoration className="hidden lg:block bottom-60 right-1/3 opacity-50" delay={1.4} />

      <Navigation />

      <main className="relative pt-20 sm:pt-24 pb-12 sm:pb-20">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-24">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Decorative line */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-8">
                <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <Bug className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>

              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-1"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {t('pollinators.pageTitle')}
              </h1>

              {/* Separator */}
              <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 mx-auto mb-4 sm:mb-8" />

              <p
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed italic px-1"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                {t('pollinators.heroSubtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Guardians Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="group relative">
                {/* Glow effect on hover - hidden on touch to avoid layout shift */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-yellow-400/20 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:block" />

                {/* Card */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <h2
                    className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {t('pollinators.guardiansTitle')}
                  </h2>

                  <div className="space-y-4 sm:space-y-6">
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                      {t('pollinators.guardiansText1')}
                    </p>

                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {t('pollinators.guardiansText2')}
                    </p>
                  </div>

                  {/* Decorative corner element - smaller on mobile */}
                  <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 overflow-hidden rounded-tr-2xl sm:rounded-tr-3xl">
                    <div className="absolute -top-10 -right-10 sm:-top-16 sm:-right-16 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-amber-100/50 to-transparent rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pollinators Slider Section - In the middle */}
        <section className="px-2 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-24">
          <div className="max-w-5xl mx-auto">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-8 px-2 sm:px-0"
            >
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="pollinators-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('pollinators.searchPlaceholder')}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 shadow-sm transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
              {filteredPollinators !== null && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  {filteredPollinators.length} {filteredPollinators.length === 1 ? 'pollinator' : 'pollinators'} found
                </p>
              )}
            </motion.div>

            {/* Filtered Results or Swiper */}
            {filteredPollinators !== null ? (
              <div className="space-y-8 px-2 sm:px-0">
                {filteredPollinators.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">{t('pollinatorsCatalog.noResults')}</p>
                  </div>
                ) : (
                  filteredPollinators.map((pollinator) => (
                    <Pollinator3DViewer
                      key={pollinator.id}
                      pollinator={pollinator}
                      t={t}
                      isActive={true}
                    />
                  ))
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative px-2 sm:px-0">
                  <Swiper
                    ref={swiperRef}
                    modules={[SwiperNavigation]}
                    navigation={{
                      nextEl: '.swiper-button-next-custom',
                      prevEl: '.swiper-button-prev-custom',
                    }}
                    spaceBetween={16}
                    slidesPerView={1}
                    loop={true}
                    allowTouchMove={true}
                    simulateTouch={true}
                    noSwipingClass="swiper-no-swiping"
                    noSwipingSelector="[data-canvas-container]"
                    touchEventsTarget="container"
                    className="pollinators-swiper"
                    onSlideChange={(swiper) => {
                      setActiveIndex(swiper.realIndex);
                    }}
                    onSwiper={(swiper) => {
                      swiperRef.current = swiper;
                    }}
                  >
                    {POLLINATORS_DATA.map((pollinator, index) => (
                      <SwiperSlide key={pollinator.id}>
                        <Pollinator3DViewer
                          pollinator={pollinator}
                          t={t}
                          isActive={activeIndex === index}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Custom Navigation Buttons - compact on mobile */}
                  <button className="swiper-button-prev-custom absolute left-0 sm:left-0 top-[42%] sm:top-1/2 -translate-y-1/2 z-10 -translate-x-1 sm:-translate-x-4 lg:-translate-x-12 w-9 h-9 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-white/95 hover:bg-white backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-300 active:scale-95 sm:hover:scale-110 group touch-manipulation" aria-label="Previous pollinator">
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-gray-700 group-hover:text-amber-600 transition-colors" />
                  </button>
                  <button className="swiper-button-next-custom absolute right-0 sm:right-0 top-[42%] sm:top-1/2 -translate-y-1/2 z-10 translate-x-1 sm:translate-x-4 lg:translate-x-12 w-9 h-9 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-white/95 hover:bg-white backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-300 active:scale-95 sm:hover:scale-110 group touch-manipulation" aria-label="Next pollinator">
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-gray-700 group-hover:text-amber-600 transition-colors" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* NAHIARA Manifesto Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-12 lg:mb-16"
            >
              <h2
                className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-1"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {t('pollinators.manifestoTitle')}
              </h2>
              <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-red-400 to-orange-400 mx-auto mb-4 sm:mb-6" />
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-1">
                {t('pollinators.manifestoSubtitle')}
              </p>
            </motion.div>

            <div className="space-y-4 sm:space-y-6">
              {/* 2016 Section */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-red-200 shadow-lg">
                  <h3 className="text-base sm:text-lg lg:text-2xl font-bold text-red-800 mb-3 sm:mb-4 flex items-center flex-wrap gap-2">
                    <span className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm sm:text-base flex-shrink-0">2016</span>
                    <span>{t('pollinators.ipbesReport')}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0" />
                      <p className="text-gray-700">{t('pollinators.ipbesPoint1')}</p>
                    </div>
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0" />
                      <p className="text-gray-700">{t('pollinators.ipbesPoint2')}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 2025 Section */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="bg-red-100/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-red-300 shadow-lg">
                  <h3 className="text-base sm:text-lg lg:text-2xl font-bold text-red-800 mb-3 sm:mb-4 flex items-center flex-wrap gap-2">
                    <span className="w-8 h-8 sm:w-10 sm:h-10 bg-red-200 rounded-full flex items-center justify-center text-red-700 font-bold text-sm sm:text-base flex-shrink-0">2025</span>
                    <span>{t('pollinators.evidence2025')}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{t('pollinators.evidence1')}</p>
                    </div>
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{t('pollinators.evidence2')}</p>
                    </div>
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{t('pollinators.evidence3')}</p>
                    </div>
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{t('pollinators.evidence4')}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Call for Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-amber-300 shadow-lg">
                  <h3 className="text-base sm:text-lg lg:text-2xl font-bold text-amber-800 mb-3 sm:mb-4 flex items-center flex-wrap gap-2">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0" />
                    <span>{t('pollinators.callForAction')}</span>
                  </h3>
                  <p className="text-gray-700 mb-3 sm:mb-4 text-xs sm:text-sm">
                    {t('pollinators.callText')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div key={num} className="flex items-start space-x-2 sm:space-x-3">
                        <span className="w-4 h-4 sm:w-5 sm:h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0">{num}</span>
                        <p className="text-gray-700">{t(`pollinators.action${num}`)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quote / Call to Action Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-10 sm:mb-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative group">
                {/* Animated gradient border - hidden on mobile */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 rounded-2xl sm:rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-slow hidden sm:block" />

                {/* Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 border border-white/50 shadow-2xl text-center overflow-hidden">
                  {/* Decorative background */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 20% 30%, rgba(251, 191, 36, 0.5) 0%, transparent 40%),
                        radial-gradient(circle at 80% 70%, rgba(249, 115, 22, 0.5) 0%, transparent 40%)
                      `,
                    }}
                  />

                  <div className="relative">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 mx-auto mb-4 sm:mb-6" />

                    <blockquote
                      className="text-base sm:text-xl md:text-2xl lg:text-3xl text-gray-800 leading-relaxed mb-5 sm:mb-8 italic px-1"
                      style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                    >
                      &ldquo;{t('pollinators.guardiansText2')}&rdquo;
                    </blockquote>

                    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-5 sm:mb-8">
                      <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                      <Bug className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                      <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    </div>

                    <Link
                      href="/pollinators/gallery"
                      className="inline-flex items-center gap-2 px-5 py-3 sm:px-8 sm:py-4 bg-gray-900 text-white text-sm sm:text-base font-semibold rounded-full shadow-lg hover:bg-gray-800 hover:shadow-xl active:scale-95 sm:hover:scale-105 transition-all duration-300 touch-manipulation"
                    >
                      <span>{t('pollinators.exploreGallery')}</span>
                      <Globe2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

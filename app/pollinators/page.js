"use client";

import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { 
  Globe2, 
  Sparkles, 
  Bug,
  TrendingDown,
  Target
} from "lucide-react";
import { useTranslation } from "../../lib/useTranslation";
import Link from "next/link";

// Ant pollinator data
const POLLINATOR_DATA = {
  commonName: "Ant",
  scientificName: "Formicidae sp.",
  roleEn: "Ground pollinator associated with flowers",
  roleEs: "Polinizador terrestre asociado a las flores",
  sanCode: "SAN-P-ANT001",
  glbPath: "/ant.glb",
};

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
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#glow)" className="animate-float">
        <ellipse cx="60" cy="30" rx="12" ry="25" fill="url(#petalGradient)" transform="rotate(0 60 60)"/>
        <ellipse cx="60" cy="30" rx="12" ry="25" fill="url(#petalGradient)" transform="rotate(72 60 60)"/>
        <ellipse cx="60" cy="30" rx="12" ry="25" fill="url(#petalGradient)" transform="rotate(144 60 60)"/>
        <ellipse cx="60" cy="30" rx="12" ry="25" fill="url(#petalGradient)" transform="rotate(216 60 60)"/>
        <ellipse cx="60" cy="30" rx="12" ry="25" fill="url(#petalGradient)" transform="rotate(288 60 60)"/>
        <circle cx="60" cy="60" r="8" fill="rgba(251, 191, 36, 0.4)"/>
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

// Ant 3D Model Viewer Component
function Ant3DViewer({ t }) {
  const antCanvasRef = useRef(null);
  const [isAntLoaded, setIsAntLoaded] = useState(false);
  const [antError, setAntError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Three.js loader for ant GLB model
  useEffect(() => {
    if (typeof window === "undefined" || !isMounted) return;

    let renderer;
    let camera;
    let animationId;
    const cleanupFns = [];

    setIsAntLoaded(false);
    setAntError(null);

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

        const container = antCanvasRef.current;
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
        container.appendChild(renderer.domElement);
        cleanupFns.push(() => {
          renderer?.domElement?.parentNode?.removeChild(renderer.domElement);
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
          POLLINATOR_DATA.glbPath,
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
            setIsAntLoaded(true);
            cleanupFns.push(() =>
              window.removeEventListener("resize", handleResize)
            );
          },
          undefined,
          (error) => {
            console.error("GLB load error", error);
            setAntError("Failed to load 3D model.");
            setIsAntLoaded(false);
          }
        );
      } catch (err) {
        console.error("Three.js setup error", err);
        setAntError("Three.js could not initialize.");
        setIsAntLoaded(false);
      }
    };

    loadModel();

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, [isMounted]);

  if (!isMounted) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-white/70 backdrop-blur-xl rounded-3xl">
        <div className="w-10 h-10 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-yellow-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Card */}
      <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
            <Bug className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 
              className="text-3xl lg:text-4xl font-bold text-gray-900"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              {POLLINATOR_DATA.commonName}
            </h2>
            <p className="text-sm text-gray-600 italic">
              <em>{POLLINATOR_DATA.scientificName}</em>
            </p>
          </div>
        </div>

        {/* 3D Viewer */}
        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden isolate mb-6">
          <div ref={antCanvasRef} className="w-full h-full gpu-accelerated" />
          {!isAntLoaded && !antError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
              <div className="w-10 h-10 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mb-3" />
              <span className="text-sm text-gray-500">
                {t('common.loading') || "Loading 3D model..."}
              </span>
            </div>
          )}
          {antError && (
            <div className="absolute inset-0 grid place-content-center bg-red-50 text-red-500 text-sm font-medium text-center px-4">
              {antError}
            </div>
          )}
        </div>

        {/* Ant Information */}
        <div className="space-y-6">
          {/* Biological Data */}
          <div className="bg-amber-50/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200">
            <h3 className="text-sm uppercase tracking-[0.3em] text-amber-700 mb-4">
              {t('pollinators.biologicalData') || "1. BIOLOGICAL DATA"}
            </h3>
            <div className="grid gap-3 text-sm">
              <div className="bg-white/80 rounded-lg px-3 py-2 border-l-4 border-amber-500">
                <div className="text-[11px] font-semibold text-amber-700 uppercase mb-1">
                  {t('pollinators.scientificName') || "Scientific name"}
                </div>
                <div className="text-gray-800">
                  <em>{POLLINATOR_DATA.scientificName}</em>
                </div>
              </div>
              <div className="bg-white/80 rounded-lg px-3 py-2 border-l-4 border-amber-500">
                <div className="text-[11px] font-semibold text-amber-700 uppercase mb-1">
                  {t('pollinators.group') || "Group"}
                </div>
                <div className="text-gray-800">
                  {t('pollinators.socialInsects') || "Social insects (Order Hymenoptera)"}
                </div>
              </div>
              <div className="text-xs text-gray-700 space-y-1 mt-3">
                <p>
                  <span className="font-semibold">
                    {t('pollinators.basicMorphology') || "Basic morphology:"}
                  </span>{" "}
                  {t('pollinators.antMorphology') || "Body divided into head, thorax and abdomen, elbowed antennae and strong mandibles; size from a few millimetres to 1–2 cm."}
                </p>
                <p>
                  <span className="font-semibold">
                    {t('pollinators.habitatDistribution') || "Habitat & distribution:"}
                  </span>{" "}
                  {t('pollinators.antHabitat') || "Present in almost all terrestrial ecosystems, especially soils, path edges and gardens."}
                </p>
              </div>
            </div>
          </div>

          {/* Pollinator Role */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200">
            <h3 className="text-sm uppercase tracking-[0.3em] text-amber-700 mb-4">
              {t('pollinators.pollinatorRole') || "2-5. POLLINATOR ROLE, CONSERVATION & ARAIHAN MEASURE"}
            </h3>
            <p className="text-gray-800 text-sm leading-relaxed mb-3">
              {t('pollinators.antRole') || "Ants visit flowers attracted by nectar and sugary exudates on the petals. Although often considered secondary pollinators compared to lepidoptera or bees, they promote contact with pollen at the base of the flower."}
            </p>
            <p className="text-gray-800 text-sm leading-relaxed">
              {t('pollinators.antConservation') || "Ant pollinator guilds receive an estimated Araihan Measure of 18/25: high local efficiency and strong ecological interdependence, yet vulnerable to pesticides, habitat loss and changes in soil micro‑climate."}
            </p>
            <div className="mt-4 text-xs text-gray-600">
              <p>
                <span className="font-mono font-semibold">S.A.N.:</span> {POLLINATOR_DATA.sanCode}
              </p>
              <p>
                {t('pollinators.araihanMeasure') || "Araihan Measure: 18 / 25 (Stable)"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PollinatorsPage() {
  const { t, isLoading } = useTranslation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
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

      {/* Decorative elements */}
      <GlowingOrb className="top-20 -right-20" color="amber" delay={0.2} size="xl" />
      <GlowingOrb className="top-1/3 -left-32" color="amber" delay={0.4} size="lg" />
      <GlowingOrb className="bottom-1/4 right-10" color="amber" delay={0.6} size="md" />
      <GlowingOrb className="bottom-40 left-1/4" color="amber" delay={0.8} size="lg" />
      
      <FloralDecoration className="top-32 right-20 opacity-60" delay={1} />
      <FloralDecoration className="top-1/2 left-10 opacity-40" delay={1.2} />
      <FloralDecoration className="bottom-60 right-1/3 opacity-50" delay={1.4} />

      <Navigation />

      <main className="relative pt-24 pb-20">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Decorative line */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <Bug className="w-5 h-5 text-amber-400" />
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>

              <h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {t('pollinators.pageTitle')}
              </h1>

              {/* Separator */}
              <div className="w-24 h-px bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 mx-auto mb-8" />

              <p 
                className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed italic"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                {t('pollinators.heroSubtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Guardians Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="group relative">
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-yellow-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Card */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <h2 
                    className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {t('pollinators.guardiansTitle')}
                  </h2>
                  
                  <div className="space-y-6">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {t('pollinators.guardiansText1')}
                    </p>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {t('pollinators.guardiansText2')}
                    </p>
                  </div>
                  
                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-amber-100/50 to-transparent rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Ant 3D Viewer Section - In the middle */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <Ant3DViewer t={t} />
            </motion.div>
          </div>
        </section>

        {/* NAHIARA Manifesto Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {t('pollinators.manifestoTitle')}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-red-400 to-orange-400 mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('pollinators.manifestoSubtitle')}
              </p>
            </motion.div>

            <div className="space-y-6">
              {/* 2016 Section */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 lg:p-8 border border-red-200 shadow-lg">
                  <h3 className="text-xl lg:text-2xl font-bold text-red-800 mb-4 flex items-center">
                    <span className="w-10 h-10 bg-red-100 rounded-full mr-4 flex items-center justify-center text-red-600 font-bold">2016</span>
                    {t('pollinators.ipbesReport')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{t('pollinators.ipbesPoint1')}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{t('pollinators.ipbesPoint2')}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 2025 Section */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="bg-red-100/80 backdrop-blur-lg rounded-2xl p-6 lg:p-8 border border-red-300 shadow-lg">
                  <h3 className="text-xl lg:text-2xl font-bold text-red-800 mb-4 flex items-center">
                    <span className="w-10 h-10 bg-red-200 rounded-full mr-4 flex items-center justify-center text-red-700 font-bold">2025</span>
                    {t('pollinators.evidence2025')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start space-x-3">
                      <TrendingDown className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{t('pollinators.evidence1')}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <TrendingDown className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{t('pollinators.evidence2')}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <TrendingDown className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{t('pollinators.evidence3')}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <TrendingDown className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{t('pollinators.evidence4')}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Call for Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6 lg:p-8 border border-amber-300 shadow-lg">
                  <h3 className="text-xl lg:text-2xl font-bold text-amber-800 mb-4 flex items-center">
                    <Target className="w-6 h-6 text-amber-600 mr-3" />
                    {t('pollinators.callForAction')}
                  </h3>
                  <p className="text-gray-700 mb-4 text-sm">
                    {t('pollinators.callText')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div key={num} className="flex items-start space-x-3">
                        <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{num}</span>
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
        <section className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative group">
                {/* Animated gradient border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-slow" />
                
                {/* Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/50 shadow-2xl text-center overflow-hidden">
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
                    <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-6" />
                    
                    <blockquote 
                      className="text-xl sm:text-2xl lg:text-3xl text-gray-800 leading-relaxed mb-8 italic"
                      style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                    >
                      &ldquo;{t('pollinators.guardiansText2')}&rdquo;
                    </blockquote>
                    
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                      <Bug className="w-5 h-5 text-amber-400" />
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    </div>
                    
                    <Link
                      href="/pollinators/gallery"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full shadow-lg hover:bg-gray-800 hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <span>{t('pollinators.exploreGallery') || "Explore Gallery"}</span>
                      <Globe2 className="w-5 h-5" />
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

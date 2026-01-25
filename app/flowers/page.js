"use client";

import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { 
  Flower2, 
  Globe2, 
  Heart, 
  Sparkles, 
  BookOpen,
  Shield,
  Search,
  Archive,
  Layers,
  Sprout
} from "lucide-react";
import { useTranslation } from "../../lib/useTranslation";

// Flower data
const FLOWER_DATA = {
  commonName: "Carnation",
  scientificName: "Dianthus caryophyllus L.",
  country: "España (Spain)",
  glbPath: `/api/glb-proxy?url=${encodeURIComponent("https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/Espana_Carnation.glb")}`,
  sanCode: "SAN-F-191998",
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

// Criteria cards data with translation keys
const getCriteriaCards = (t) => [
  {
    icon: Heart,
    title: t('flowers.criteriaTitle1'),
    description: t('flowers.criteriaText1'),
    gradient: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    delay: 0,
  },
  {
    icon: Flower2,
    title: t('flowers.criteriaTitle2'),
    description: t('flowers.criteriaText2'),
    gradient: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    delay: 0.1,
  },
  {
    icon: Shield,
    title: t('flowers.criteriaTitle3'),
    description: t('flowers.criteriaText3'),
    gradient: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    delay: 0.2,
  },
];

// Selection points data with translation keys
const getSelectionPoints = (t) => [
  {
    icon: Search,
    text: t('flowers.selectionPoint1'),
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: BookOpen,
    text: t('flowers.selectionPoint2'),
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Layers,
    text: t('flowers.selectionPoint3'),
    gradient: "from-violet-500 to-pink-500",
  },
  {
    icon: Sprout,
    text: t('flowers.selectionPoint4'),
    gradient: "from-green-500 to-emerald-500",
  },
];

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

// Flower 3D Model Viewer Component
function Flower3DViewer({ t }) {
  const flowerCanvasRef = useRef(null);
  const [isFlowerLoaded, setIsFlowerLoaded] = useState(false);
  const [flowerError, setFlowerError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Three.js loader for flower GLB model
  useEffect(() => {
    if (typeof window === "undefined" || !isMounted) return;

    let renderer;
    let camera;
    let animationId;
    const cleanupFns = [];

    setIsFlowerLoaded(false);
    setFlowerError(null);

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

        const container = flowerCanvasRef.current;
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
          FLOWER_DATA.glbPath,
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
            setIsFlowerLoaded(true);
            cleanupFns.push(() =>
              window.removeEventListener("resize", handleResize)
            );
          },
          undefined,
          (error) => {
            console.error("GLB load error", error);
            setFlowerError("Failed to load 3D model.");
            setIsFlowerLoaded(false);
          }
        );
      } catch (err) {
        console.error("Three.js setup error", err);
        setFlowerError("Three.js could not initialize.");
        setIsFlowerLoaded(false);
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
      <div className="absolute -inset-1 bg-gradient-to-r from-pink-400/20 via-rose-400/20 to-purple-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Card */}
      <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-md">
            <Flower2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 
              className="text-3xl lg:text-4xl font-bold text-gray-900"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              {FLOWER_DATA.commonName}
            </h2>
            <p className="text-sm text-gray-600 italic">
              <em>{FLOWER_DATA.scientificName}</em>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {FLOWER_DATA.country}
            </p>
          </div>
        </div>

        {/* 3D Viewer */}
        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden isolate mb-6">
          <div ref={flowerCanvasRef} className="w-full h-full gpu-accelerated" />
          {!isFlowerLoaded && !flowerError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
              <div className="w-10 h-10 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mb-3" />
              <span className="text-sm text-gray-500">
                {t('common.loading') || "Loading 3D model..."}
              </span>
            </div>
          )}
          {flowerError && (
            <div className="absolute inset-0 grid place-content-center bg-red-50 text-red-500 text-sm font-medium text-center px-4">
              {flowerError}
            </div>
          )}
        </div>

        {/* Flower Information */}
        <div className="space-y-6">
          {/* Botanical Data */}
          <div className="bg-rose-50/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-200">
            <h3 className="text-sm uppercase tracking-[0.3em] text-rose-700 mb-4">
              {t('flowers.botanicalData') || "1. BOTANICAL DATA"}
            </h3>
            <div className="grid gap-3 text-sm">
              <div className="bg-white/80 rounded-lg px-3 py-2 border-l-4 border-rose-500">
                <div className="text-[11px] font-semibold text-rose-700 uppercase mb-1">
                  {t('flowers.scientificName') || "Scientific name"}
                </div>
                <div className="text-gray-800">
                  <em>{FLOWER_DATA.scientificName}</em>
                </div>
              </div>
              <div className="bg-white/80 rounded-lg px-3 py-2 border-l-4 border-rose-500">
                <div className="text-[11px] font-semibold text-rose-700 uppercase mb-1">
                  {t('flowers.botanicalFamily') || "Botanical family"}
                </div>
                <div className="text-gray-800">Caryophyllaceae</div>
              </div>
              <div className="text-xs text-gray-700 space-y-1 mt-3">
                <p>
                  <span className="font-semibold">
                    {t('flowers.basicMorphology') || "Basic morphology:"}
                  </span>{" "}
                  {t('flowers.carnationMorphology') || "Wide chromatic range (white, pink, red, yellow), highly fragrant flowers with toothed petals and a height of 40‑80 cm."}
                </p>
                <p>
                  <span className="font-semibold">
                    {t('flowers.habitatDistribution') || "Habitat & distribution:"}
                  </span>{" "}
                  {t('flowers.carnationHabitat') || "Ornamental crops and Mediterranean gardens; native to the Mediterranean basin and widely cultivated in Spain."}
                </p>
              </div>
            </div>
          </div>

          {/* Cultural Significance */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-200">
            <h3 className="text-sm uppercase tracking-[0.3em] text-rose-700 mb-4">
              {t('flowers.culturalSignificance') || "2-5. CULTURE, CONSERVATION & NAHIARA MEASURE"}
            </h3>
            <p className="text-gray-800 text-sm leading-relaxed mb-3">
              {t('flowers.carnationCulture') || "The Carnation symbolizes true love, passion and resilience. Since the 16th century it has been linked to Spanish royalty and today is inseparable from flamenco, popular festivities and Mediterranean identity."}
            </p>
            <p className="text-gray-800 text-sm leading-relaxed">
              {t('flowers.carnationConservation') || "Although not an official national flower, its cultural weight and extensive cultivation give it a stable Nahiara Measure (19/25), with strong cultural protection but exposure to climate and habitat‑loss threats."}
            </p>
            <div className="mt-4 text-xs text-gray-600">
              <p>
                <span className="font-mono font-semibold">S.A.N.:</span> {FLOWER_DATA.sanCode}
              </p>
              <p>
                {t('flowers.nahiaraMeasure') || "Nahiara Measure: 19 / 25 (Stable)"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FlowersPage() {
  const { t, isLoading } = useTranslation();
  
  // Get translated data
  const criteriaCards = getCriteriaCards(t);
  const selectionPoints = getSelectionPoints(t);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
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
              radial-gradient(ellipse 80% 50% at 20% 20%, rgba(147, 197, 253, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 30%, rgba(196, 181, 253, 0.35) 0%, transparent 50%),
              radial-gradient(ellipse 70% 50% at 50% 80%, rgba(249, 168, 212, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse 50% 30% at 10% 60%, rgba(167, 243, 208, 0.25) 0%, transparent 50%)
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
                rgba(59, 130, 246, 0.1) 10%,
                rgba(165, 180, 252, 0.1) 15%,
                rgba(147, 197, 253, 0.1) 20%,
                rgba(221, 214, 254, 0.1) 25%,
                rgba(96, 165, 250, 0.1) 30%
              )
            `,
            backgroundSize: '300% 200%',
          }}
        />
      </div>

      {/* Decorative elements */}
      <GlowingOrb className="top-20 -right-20" color="purple" delay={0.2} size="xl" />
      <GlowingOrb className="top-1/3 -left-32" color="blue" delay={0.4} size="lg" />
      <GlowingOrb className="bottom-1/4 right-10" color="pink" delay={0.6} size="md" />
      <GlowingOrb className="bottom-40 left-1/4" color="emerald" delay={0.8} size="lg" />
      
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
                <Flower2 className="w-5 h-5 text-purple-400" />
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>

              <h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {t('flowers.heroTitle')}
              </h1>

              {/* Separator */}
              <div className="w-24 h-px bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mx-auto mb-8" />

              <p 
                className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed italic"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                {t('flowers.heroSubtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Introduction Section */}
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
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Card */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <h2 
                    className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {t('flowers.introTitle')}
                  </h2>
                  
                  <div className="space-y-6">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {t('flowers.introParagraph1')}
                    </p>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {t('flowers.introParagraph2')}
                    </p>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {t('flowers.introParagraph3')}
                    </p>
                  </div>
                  
                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Flower 3D Viewer Section - In the middle */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <Flower3DViewer t={t} />
            </motion.div>
          </div>
        </section>

        {/* Criteria Cards Section */}
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
                {t('flowers.selectionCriteriaTitle') || "Our Selection Criteria"}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('flowers.selectionCriteriaSubtitle') || "Each flower is carefully chosen based on these fundamental principles"}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
              {criteriaCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: card.delay }}
                >
                  <div className="group relative h-full">
                    {/* Frosted glass card */}
                    <div className={`relative h-full ${card.bgColor} backdrop-blur-lg rounded-2xl p-6 lg:p-8 border ${card.borderColor} shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300`}>
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <card.icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 
                        className="text-xl font-bold text-gray-900 mb-3"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        {card.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {card.description}
                      </p>
                      
                      {/* Subtle gradient line */}
                      <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Living Archive Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="group relative">
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 via-teal-400/20 to-emerald-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Card */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-md">
                      <Archive className="w-6 h-6 text-white" />
                    </div>
                    <h2 
                      className="text-3xl lg:text-4xl font-bold text-gray-900"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      {t('flowers.narrativeTitle')}
                    </h2>
                  </div>
                  
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {t('flowers.narrativeText')}
                  </p>
                  
                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-cyan-100/50 to-transparent rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Selection Process Section */}
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
                {t('flowers.selectionTitle')}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('flowers.selectionMethodology') || "Our rigorous methodology ensures accuracy and cultural authenticity"}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {selectionPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="group relative h-full">
                    {/* Frosted glass card */}
                    <div className="relative h-full bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${point.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <point.icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed">
                        {point.text}
                      </p>
                      
                      {/* Subtle gradient line */}
                      <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${point.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full`} />
                    </div>
                  </div>
                </motion.div>
              ))}
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
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-slow" />
                
                {/* Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/50 shadow-2xl text-center overflow-hidden">
                  {/* Decorative background */}
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 20% 30%, rgba(147, 197, 253, 0.5) 0%, transparent 40%),
                        radial-gradient(circle at 80% 70%, rgba(249, 168, 212, 0.5) 0%, transparent 40%)
                      `,
                    }}
                  />
                  
                  <div className="relative">
                    <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-6" />
                    
                    <blockquote 
                      className="text-xl sm:text-2xl lg:text-3xl text-gray-800 leading-relaxed mb-8 italic"
                      style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                    >
                      &ldquo;{t('flowers.closingBefore')}
                      <span className="font-bold text-indigo-600">
                        {t('flowers.closingScience')}
                      </span>
                      {t('flowers.closingMiddle')}
                      <span className="font-bold text-blue-600">
                        {t('flowers.closingGarden')}
                      </span>
                      {t('flowers.closingAfter')}&rdquo;
                    </blockquote>
                    
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                      <Flower2 className="w-5 h-5 text-pink-400" />
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    </div>
                    
                    <a
                      href="/globe"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full shadow-lg hover:bg-gray-800 hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <span>{t('flowers.exploreGlobe') || "Explore the Globe"}</span>
                      <Globe2 className="w-5 h-5" />
                    </a>
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

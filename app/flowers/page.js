"use client";

import { motion } from "motion/react";
import { useState, useRef, useEffect, useMemo } from "react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { computeSANCode } from "../../lib/sanCode";
import {
  Flower2,
  Globe2,
  Heart,
  Search,
  Sparkles,
  BookOpen,
  Shield,
  Archive,
  Layers,
  Sprout,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useTranslation } from "../../lib/useTranslation";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation as SwiperNavigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Helper function to create GLB path
const createGLBPath = (countryName, flowerName) => {
  const fileName = `${countryName}_${flowerName}.glb`;
  return `/api/glb-proxy?url=${encodeURIComponent(`https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/${fileName}`)}`;
};

// Comprehensive flowers data array with all GLB links
const FLOWERS_DATA = [
  {
    id: "US_ROSE",
    commonName: "Rose",
    scientificName: "Rosa (hybrid cultivars)",
    country: "United States",
    countryCode: "US",
    glbPath: "/api/glb-proxy?url=" + encodeURIComponent("https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/Flower_America_Web.glb"),
    sanCode: "SAN-F-083,003",
    botanicalFamily: "Rosaceae",
    morphology: "Wide chromatic range (red, pink, white, yellow, lavender), highly fragrant flowers with 5–60+ petals; woody perennial shrub 0.3–3 m tall with thorny stems and pinnately compound leaves.",
    habitat: "Adaptable to temperate zones worldwide — gardens, parks, roadsides; native species in meadows, forest edges, and rocky hillsides across the Northern Hemisphere.",
    distribution: "Native to Asia, Europe, North America, and North Africa. The US grows approximately 1.2 billion cut roses annually; major cultivation in California, Oregon, and Texas.",
    historicalOrigin: "Roses have been cultivated for over 5,000 years. Ancient Romans used them in festivals and perfumery. In 1986, President Ronald Reagan signed legislation designating Rosa as the official national floral emblem of the United States. The rose's symbolic power spans Greek mythology (sacred to Aphrodite), Christianity (the Virgin Mary's flower), and heraldry (the Wars of the Roses in England).",
    nationalStatus: "Official national floral emblem of the United States since 1986 (Public Law 99-449)",
    traditionalUses: "Perfumery and essential oils (rose otto, rosa damascena); culinary uses (rosewater, rose hip tea, jams); Ayurvedic and Western herbal medicine (rose hips rich in Vitamin C); ornamental horticulture and floristry; religious and ceremonial decoration.",
    conservationStatus: "Cultivated varieties: Not Evaluated (NE). Wild species: several native Rosa species listed as state or federal Species of Concern in the USA.",
    mainThreats: "Rose Rosette Disease (RRD) — a devastating mite-transmitted virus; climate-driven drought stress; pesticide dependency in commercial cultivation; habitat loss for native wild rose species.",
    pfnoClassification: "Official National Floral Emblem",
    relevantPollinator: "Apis mellifera (Western honeybee) and native Bombus species (bumblebees) — roses are key bee pasture plants. Also pollinated by beetles, hoverflies, and solitary bees (Osmia spp.)",
    nahiaraMeasure: {
      total: 23,
      max: 25,
      rank: 5,
      status: "Living EcoRoot",
      latidoFloral: 5,
      memoriaCultural: 5,
      vozPublica: 5,
      escudoProteccion: 4,
      petaloEsperanza: 4,
    },
    araihanScore: 23,
    scorfidon: {
      climateChange: { code: "SCF-001", threat: "Climate Change", impact: -1, description: "Shifting temperature patterns disrupt rose bloom cycles and increase drought stress in cultivation zones across the American Southwest.", guardian: "Natural Balance", guardianPower: 1 },
      deforestation: { code: "SCF-002", threat: "Deforestation", impact: -2, description: "Loss of native meadow and woodland habitats reduces populations of wild rose species (Rosa carolina, Rosa blanda, Rosa woodsii).", guardian: "Reforestation", guardianPower: 2 },
      exploitation: { code: "SCF-003", threat: "Exploitation", impact: -3, description: "Intensive commercial cut-flower production relies on heavy pesticide use, harming pollinators and degrading soil health.", guardian: "Floral Justice", guardianPower: 3 },
      ignorance: { code: "SCF-004", threat: "Ignorance", impact: -4, description: "Widespread ignorance of Rose Rosette Disease (RRD) — a fatal mite-vectored virus — has led to catastrophic losses of landscape roses across North America.", guardian: "Education", guardianPower: 4 },
      intentionalFire: { code: "SCF-005", threat: "Intentional Fire", impact: -5, description: "Wildfire, exacerbated by drought and heat waves, destroys native rose scrubland habitats across the western United States.", guardian: "Water", guardianPower: 5 },
    },
    nahiaraSynthesis: "Rosa integrates into the Nahiara universe with code SAN-F-083,003, evaluated at level 23/25 (Living EcoRoot) in the Nahiara Measure — ranking 5th globally. As the official national floral emblem of the United States since 1986, the rose carries 5,000 years of cultural resonance across civilizations. The principal threat — Rose Rosette Disease — underscores the fragility hidden within iconic status. The rose stands as Master Reference Model for the Western hemisphere within the AquaMundi flower system.",
    cultural: "The rose is the official national floral emblem of the United States (1986). It has been a global symbol of love, beauty, passion, and remembrance for over 5,000 years — from ancient Rome and Greek mythology, to the heraldic Wars of the Roses, to the rose gardens of the White House.",
    conservation: "While cultivated roses thrive globally, native wild rosa species in the US face threats from Rose Rosette Disease, habitat loss, and climate change. Nahiara Measure: 23 / 25 (Living EcoRoot).",
    nahiaraMeasureLabel: "23 / 25 (Living EcoRoot)",
  },
  {
    id: "ES_CARNATION",

    commonName: "Carnation",
    scientificName: "Dianthus caryophyllus L.",
    country: "España (Spain)",
    countryCode: "ES",
    glbPath: createGLBPath("Espana", "Carnation"),
    sanCode: computeSANCode("Dianthus caryophyllus L.", "F"),
    botanicalFamily: "Caryophyllaceae",
    morphology: "Wide chromatic range (white, pink, red, yellow), highly fragrant flowers with toothed petals and a height of 40‑80 cm.",
    habitat: "Ornamental crops and Mediterranean gardens; native to the Mediterranean basin and widely cultivated in Spain.",
    cultural: "The Carnation symbolizes true love, passion and resilience. Since the 16th century it has been linked to Spanish royalty and today is inseparable from flamenco, popular festivities and Mediterranean identity.",
    conservation: "Although not an official national flower, its cultural weight and extensive cultivation give it a stable Nahiara Measure (19/25), with strong cultural protection but exposure to climate and habitat‑loss threats.",
    nahiaraMeasure: "19 / 25 (Stable)",
  },
  {
    id: "IN_LOTUS",
    commonName: "Lotus",
    scientificName: "Nelumbo nucifera",
    country: "India",
    countryCode: "IN",
    glbPath: createGLBPath("India", "Lotus"),
    sanCode: computeSANCode("Nelumbo nucifera", "F"),
    botanicalFamily: "Nelumbonaceae",
    morphology: "Large, fragrant pink or white flowers with broad, floating leaves. Aquatic perennial plant that can live for over 1,000 years.",
    habitat: "Ponds, lakes, and slow-moving rivers throughout India and Southeast Asia.",
    cultural: "Sacred in Hinduism and Buddhism, the lotus represents divine beauty, purity, and spiritual awakening. It rises from muddy waters to bloom magnificently, symbolizing the journey from darkness to light.",
    conservation: "The lotus is India's national flower with strong cultural and religious significance. Nahiara Measure: 22 / 25 (Stable).",
    nahiaraMeasure: "22 / 25 (Stable)",
  },
  {
    id: "PK_JASMINE",
    commonName: "Jasmine",
    scientificName: "Jasminum officinale",
    country: "Pakistan",
    countryCode: "PK",
    glbPath: createGLBPath("Pakistan", "Jasmine"),
    sanCode: computeSANCode("Jasminum officinale", "F"),
    botanicalFamily: "Oleaceae",
    morphology: "Small, white, star-shaped flowers with a sweet, intoxicating fragrance. Climbing or trailing shrub.",
    habitat: "Gardens, parks, and cultivated areas throughout Pakistan and South Asia.",
    cultural: "Jasmine holds a special place in Pakistani culture, often used in religious ceremonies and traditional celebrations. It symbolizes purity, grace, beauty, and spiritual purity.",
    conservation: "The jasmine is Pakistan's national flower with strong cultural protection. Nahiara Measure: 20 / 25 (Stable).",
    nahiaraMeasure: "20 / 25 (Stable)",
  },
  {
    id: "PE_CANTUTA",
    commonName: "Cantuta",
    scientificName: "Cantua buxifolia",
    country: "Peru",
    countryCode: "PE",
    glbPath: createGLBPath("Peru", "Cantuta"),
    sanCode: computeSANCode("Cantua buxifolia", "F"),
    botanicalFamily: "Polemoniaceae",
    morphology: "Tubular flowers in shades of red, pink, and yellow. Shrub or small tree native to the Andes.",
    habitat: "High-altitude Andean regions, between 2,000 and 3,500 meters above sea level.",
    cultural: "The cantuta is Peru's national flower, symbolizing the beauty and resilience of the Andean people. It represents the connection between nature and culture in the highlands.",
    conservation: "The cantuta is Peru's national flower with strong cultural significance. Nahiara Measure: 21 / 25 (Stable).",
    nahiaraMeasure: "21 / 25 (Stable)",
  },
  {
    id: "TZ_CLOVE",
    commonName: "Clove",
    scientificName: "Syzygium aromaticum",
    country: "Tanzania",
    countryCode: "TZ",
    glbPath: createGLBPath("Tanzania", "Clove"),
    sanCode: computeSANCode("Syzygium aromaticum", "F"),
    botanicalFamily: "Myrtaceae",
    morphology: "Small, aromatic flower buds that are dried and used as a spice. Evergreen tree with glossy leaves.",
    habitat: "Tropical regions, particularly Zanzibar and Pemba islands in Tanzania.",
    cultural: "The clove is Tanzania's national flower, symbolizing the country's rich spice heritage and natural abundance. It represents the connection between people and the land.",
    conservation: "The clove is Tanzania's national flower with economic and cultural importance. Nahiara Measure: 19 / 25 (Stable).",
    nahiaraMeasure: "19 / 25 (Stable)",
  },
  {
    id: "NI_SACUANJOCHE",
    commonName: "Sacuanjoche",
    scientificName: "Plumeria rubra",
    country: "Nicaragua",
    countryCode: "NI",
    glbPath: createGLBPath("Nicaragua", "Sacuanjoche"),
    sanCode: computeSANCode("Plumeria rubra", "F"),
    botanicalFamily: "Apocynaceae",
    morphology: "Fragrant, waxy flowers in white, pink, yellow, or red. Deciduous tree with thick, succulent branches.",
    habitat: "Tropical and subtropical regions, gardens, and coastal areas throughout Central America.",
    cultural: "The sacuanjoche is Nicaragua's national flower, symbolizing beauty, grace, and spiritual enlightenment. It represents the country's tropical beauty and cultural richness.",
    conservation: "The sacuanjoche is Nicaragua's national flower with strong cultural significance. Nahiara Measure: 20 / 25 (Stable).",
    nahiaraMeasure: "20 / 25 (Stable)",
  },
  {
    id: "JM_LIGNUM_VITAE",
    commonName: "Lignum Vitae",
    scientificName: "Guaiacum officinale",
    country: "Jamaica",
    countryCode: "JM",
    glbPath: createGLBPath("Jamaica", "LignumVitae"),
    sanCode: computeSANCode("Guaiacum officinale", "F"),
    botanicalFamily: "Zygophyllaceae",
    morphology: "Small, blue to purple flowers with five petals. Slow-growing evergreen tree with very hard wood.",
    habitat: "Dry coastal forests and limestone areas in the Caribbean, particularly Jamaica.",
    cultural: "The lignum vitae is Jamaica's national flower, symbolizing strength, endurance, and the island's natural heritage.",
    conservation: "The lignum vitae is Jamaica's national flower. Nahiara Measure: 18 / 25 (Vulnerable).",
    nahiaraMeasure: "18 / 25 (Vulnerable)",
  },
  {
    id: "SC_THISTLE",
    commonName: "Thistle",
    scientificName: "Cirsium vulgare",
    country: "Escocia (Scotland)",
    countryCode: "GB-SCT",
    glbPath: createGLBPath("Escocia", "Thistle"),
    sanCode: computeSANCode("Cirsium vulgare", "F"),
    botanicalFamily: "Asteraceae",
    morphology: "Purple or pink flower heads with spiny leaves and stems. Biennial or perennial herb.",
    habitat: "Meadows, grasslands, and disturbed areas throughout Scotland and the British Isles.",
    cultural: "The thistle is Scotland's national flower, symbolizing resilience, protection, and the Scottish spirit. According to legend, it helped defend Scotland from Norse invaders.",
    conservation: "The thistle is Scotland's national flower with strong cultural identity. Nahiara Measure: 20 / 25 (Stable).",
    nahiaraMeasure: "20 / 25 (Stable)",
  },
  {
    id: "DE_CORNFLOWER",
    commonName: "Cornflower",
    scientificName: "Centaurea cyanus",
    country: "Alemania (Germany)",
    countryCode: "DE",
    glbPath: createGLBPath("Alemania", "Cornflower"),
    sanCode: computeSANCode("Centaurea cyanus", "F"),
    botanicalFamily: "Asteraceae",
    morphology: "Bright blue flower heads with delicate, fringed petals. Annual herbaceous plant.",
    habitat: "Fields, meadows, and roadsides throughout Europe, particularly Germany.",
    cultural: "The cornflower is Germany's national flower, symbolizing simplicity, modesty, and the German countryside. It was historically associated with Prussian culture.",
    conservation: "The cornflower is Germany's national flower. Nahiara Measure: 19 / 25 (Stable).",
    nahiaraMeasure: "19 / 25 (Stable)",
  },
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
function Flower3DViewer({ flower, t, isActive = false }) {
  const flowerCanvasRef = useRef(null);
  const [isFlowerLoaded, setIsFlowerLoaded] = useState(false);
  const [flowerError, setFlowerError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Three.js loader for flower GLB model - lazy load when slide becomes active
  useEffect(() => {
    if (typeof window === "undefined" || !isMounted || !isActive || !flower.glbPath) return;

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
          flower.glbPath,
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
  }, [isMounted, isActive, flower.glbPath]);

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
              {flower.commonName}
            </h2>
            <p className="text-sm text-gray-600 italic">
              <em>{flower.scientificName}</em>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {flower.country}
            </p>
          </div>
        </div>

        {/* 3D Viewer */}
        {flower.glbPath && (
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
        )}

        {/* Flower Information */}
        <div className="space-y-6">
          {/* 1. Botanical Data */}
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
                  <em>{flower.scientificName}</em>
                </div>
              </div>
              <div className="bg-white/80 rounded-lg px-3 py-2 border-l-4 border-rose-500">
                <div className="text-[11px] font-semibold text-rose-700 uppercase mb-1">
                  {t('flowers.botanicalFamily') || "Botanical family"}
                </div>
                <div className="text-gray-800">{flower.botanicalFamily}</div>
              </div>
              <div className="text-xs text-gray-700 space-y-1 mt-3">
                <p>
                  <span className="font-semibold">
                    {t('flowers.basicMorphology') || "Basic morphology:"}
                  </span>{" "}
                  {flower.morphology}
                </p>
                <p>
                  <span className="font-semibold">
                    {t('flowers.habitatDistribution') || "Habitat & distribution:"}
                  </span>{" "}
                  {flower.habitat}
                </p>
                {flower.distribution && (
                  <p className="text-gray-600 italic">{flower.distribution}</p>
                )}
              </div>
            </div>
          </div>

          {/* 2. Cultural & Historical Data */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-200">
            <h3 className="text-sm uppercase tracking-[0.3em] text-rose-700 mb-4">
              2. CULTURAL &amp; HISTORICAL DATA
            </h3>
            <p className="text-gray-800 text-sm leading-relaxed mb-3">
              {flower.cultural}
            </p>
            {flower.historicalOrigin && (
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 mb-3">
                <span className="text-xs font-bold text-purple-700 uppercase block mb-1">📖 Historical Origin</span>
                <p className="text-sm text-gray-700 leading-relaxed">{flower.historicalOrigin}</p>
              </div>
            )}
            {(flower.nationalStatus || flower.traditionalUses) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {flower.nationalStatus && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <span className="text-xs font-bold text-gray-500 uppercase block mb-1">National Status</span>
                    <span className="text-sm text-gray-800">{flower.nationalStatus}</span>
                  </div>
                )}
                {flower.traditionalUses && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Traditional Uses</span>
                    <span className="text-sm text-gray-800">{flower.traditionalUses}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Conservation Data */}
          {(flower.conservationStatus || flower.mainThreats) && (
            <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200">
              <h3 className="text-sm uppercase tracking-[0.3em] text-blue-700 mb-4">3. CONSERVATION DATA</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {flower.conservationStatus && (
                  <div className="bg-white/80 rounded-lg p-4 border border-blue-100">
                    <span className="text-xs font-bold text-blue-700 uppercase block mb-1">🌍 IUCN Status</span>
                    <span className="text-sm text-gray-800 font-medium">{flower.conservationStatus}</span>
                  </div>
                )}
                {flower.mainThreats && (
                  <div className="bg-white/80 rounded-lg p-4 border border-blue-100">
                    <span className="text-xs font-bold text-blue-700 uppercase block mb-1">⚠️ Main Threats</span>
                    <span className="text-sm text-gray-700">{flower.mainThreats}</span>
                  </div>
                )}
                <p className="text-gray-800 text-sm leading-relaxed col-span-2">{flower.conservation}</p>
              </div>
            </div>
          )}

          {/* 4. Nahiara Metadata */}
          {(flower.pfnoClassification || flower.nahiaraMeasure) && (
            <div className="bg-violet-50/80 backdrop-blur-sm rounded-2xl p-6 border border-violet-200">
              <h3 className="text-sm uppercase tracking-[0.3em] text-violet-700 mb-4">4. NAHIARA METADATA</h3>
              {/* SAN Code */}
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-5 border border-violet-100 text-center mb-4">
                <div className="text-2xl font-bold text-violet-800 font-mono tracking-wider mb-1">{flower.sanCode}</div>
                <div className="text-xs text-violet-500">Assigned S.A.N. Code</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {flower.pfnoClassification && (
                  <div className="bg-white/80 rounded-lg p-3 border border-violet-100">
                    <span className="text-xs font-bold text-violet-700 uppercase block mb-1">PFNO Classification</span>
                    <span className="text-sm text-gray-800 font-medium">{flower.pfnoClassification}</span>
                  </div>
                )}
                {flower.relevantPollinator && (
                  <div className="bg-white/80 rounded-lg p-3 border border-violet-100">
                    <span className="text-xs font-bold text-violet-700 uppercase block mb-1">🐝 Relevant Pollinator</span>
                    <span className="text-sm text-gray-700">{flower.relevantPollinator}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. Nahiara Measure */}
          {flower.nahiaraMeasure && typeof flower.nahiaraMeasure === 'object' && (
            <div className="bg-amber-50/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200">
              <h3 className="text-sm uppercase tracking-[0.3em] text-amber-700 mb-4">5. NAHIARA MEASURE</h3>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100 text-center mb-4">
                <div className="text-4xl font-bold text-amber-700 mb-1">
                  {flower.nahiaraMeasure.total}/{flower.nahiaraMeasure.max}
                </div>
                <div className="text-sm text-amber-600 font-medium">
                  {flower.nahiaraMeasure.status}
                  {flower.nahiaraMeasure.rank && ` · Rank #${flower.nahiaraMeasure.rank} globally`}
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Floral Heartbeat (Population)", value: flower.nahiaraMeasure.latidoFloral, color: "bg-green-500" },
                  { label: "Cultural Memory", value: flower.nahiaraMeasure.memoriaCultural, color: "bg-purple-500" },
                  { label: "Public Voice", value: flower.nahiaraMeasure.vozPublica, color: "bg-blue-500" },
                  { label: "Protection Shield", value: flower.nahiaraMeasure.escudoProteccion, color: "bg-amber-500" },
                  { label: "Petal of Hope", value: flower.nahiaraMeasure.petaloEsperanza, color: "bg-rose-500" },
                ].map((dim) => (
                  <div key={dim.label}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600 font-medium">{dim.label}</span>
                      <span className="text-xs font-bold text-gray-800">{dim.value}/5</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className={`${dim.color} h-2.5 rounded-full`} style={{ width: `${(dim.value / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Scorfidon Protocol */}
          {flower.scorfidon && (
            <div className="bg-red-50/80 backdrop-blur-sm rounded-2xl p-6 border border-red-200">
              <h3 className="text-sm uppercase tracking-[0.3em] text-red-700 mb-2">6. SCORFIDON PROTOCOL</h3>
              <p className="text-xs text-gray-500 italic mb-4">Threats and their guardians — the balance between destruction and restoration.</p>
              <div className="space-y-3">
                {Object.values(flower.scorfidon).map((entry) => (
                  <div key={entry.code} className="bg-white/80 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-400">{entry.code}</span>
                        <span className="text-sm font-bold text-gray-800">{entry.threat}</span>
                      </div>
                      <span className="text-xs font-bold text-red-600">{entry.impact} petals</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{entry.description}</p>
                    <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-100">
                      <span className="text-xs text-emerald-700">🛡️ {entry.guardian}</span>
                      <span className="text-xs font-bold text-emerald-600 ml-auto">+{entry.guardianPower} petals</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Araihan Measurement */}
          {flower.araihanScore && (
            <div className="bg-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200">
              <h3 className="text-sm uppercase tracking-[0.3em] text-indigo-700 mb-4">7. ARAIHAN MEASUREMENT</h3>
              <div className="bg-white/80 rounded-xl p-5 border border-indigo-100 text-center">
                <div className="text-3xl font-bold text-indigo-700 mb-1">{flower.araihanScore}</div>
                <div className="text-xs text-indigo-500">Araihan Score</div>
              </div>
            </div>
          )}

          {/* Nahiara Synthesis */}
          {flower.nahiaraSynthesis && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-sm uppercase tracking-[0.3em] text-green-700 mb-3">✅ NAHIARA SYNTHESIS</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{flower.nahiaraSynthesis}</p>
            </div>
          )}

          {/* Fallback: basic cultural/SAN for simple flowers */}
          {!flower.nahiaraSynthesis && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-200">
              <h3 className="text-sm uppercase tracking-[0.3em] text-rose-700 mb-4">
                {t('flowers.culturalSignificance') || "2-5. CULTURE, CONSERVATION & NAHIARA MEASURE"}
              </h3>
              <p className="text-gray-800 text-sm leading-relaxed mb-3">{flower.cultural}</p>
              <p className="text-gray-800 text-sm leading-relaxed">{flower.conservation}</p>
              <div className="mt-4 text-xs text-gray-600">
                <p><span className="font-mono font-semibold">S.A.N.:</span> {flower.sanCode}</p>
                <p>{t('flowers.nahiaraMeasure') || "Nahiara Measure:"} {flower.nahiaraMeasureLabel || flower.nahiaraMeasure}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FlowersPage() {
  const { t, isLoading } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  // Get translated data
  const criteriaCards = getCriteriaCards(t);
  const selectionPoints = getSelectionPoints(t);

  // Filter flowers by SAN code, scientific name, or common name
  const filteredFlowers = useMemo(() => {
    if (!searchQuery.trim()) return null; // null = show swiper (no filtering)
    const q = searchQuery.toLowerCase().replace(/[,\s-]/g, "");
    return FLOWERS_DATA.filter((flower) => {
      const san = (flower.sanCode || "").toLowerCase().replace(/[,\s-]/g, "");
      const sci = (flower.scientificName || "").toLowerCase();
      const common = (flower.commonName || "").toLowerCase();
      const country = (flower.country || "").toLowerCase();
      return san.includes(q) || sci.includes(q) || common.includes(q) || country.includes(q);
    });
  }, [searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
      <style jsx>{`
        .flowers-swiper .swiper-slide {
          opacity: 0.3;
          transition: opacity 0.3s;
        }
        .flowers-swiper .swiper-slide-active {
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

        {/* Flowers 3D Viewer Section - In the middle */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-5xl mx-auto">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="flowers-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('flowers.searchPlaceholder') || "Search by SAN code, name, or country..."}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 shadow-sm transition-all"
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
              {filteredFlowers !== null && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  {filteredFlowers.length} {filteredFlowers.length === 1 ? 'flower' : 'flowers'} found
                </p>
              )}
            </motion.div>

            {/* Filtered Results or Swiper */}
            {filteredFlowers !== null ? (
              // Filtered results as vertical stack
              <div className="space-y-8">
                {filteredFlowers.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">No flowers match your search.</p>
                  </div>
                ) : (
                  filteredFlowers.map((flower) => (
                    <Flower3DViewer
                      key={flower.id}
                      flower={flower}
                      t={t}
                      isActive={true}
                    />
                  ))
                )}
              </div>
            ) : (
              // Default swiper view
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative">
                  <Swiper
                    modules={[SwiperNavigation]}
                    navigation={{
                      nextEl: '.swiper-button-next-flowers',
                      prevEl: '.swiper-button-prev-flowers',
                    }}
                    spaceBetween={30}
                    slidesPerView={1}
                    className="flowers-swiper"
                  >
                    {FLOWERS_DATA.map((flower, index) => (
                      <SwiperSlide key={flower.id}>
                        <Flower3DViewer
                          flower={flower}
                          t={t}
                          isActive={true}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Custom Navigation Buttons */}
                  <button className="swiper-button-prev-flowers absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-4 lg:-translate-x-12 w-12 h-12 lg:w-16 lg:h-16 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                    <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8 text-gray-700 group-hover:text-rose-600 transition-colors" />
                  </button>
                  <button className="swiper-button-next-flowers absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-4 lg:translate-x-12 w-12 h-12 lg:w-16 lg:h-16 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                    <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8 text-gray-700 group-hover:text-rose-600 transition-colors" />
                  </button>
                </div>
              </motion.div>
            )}
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

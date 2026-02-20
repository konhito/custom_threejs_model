"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { X, MapPin, Flower, Info, Rotate3D, Target, Maximize2, Minimize2, ArrowLeft, Palette } from "lucide-react";
import { MusicToggleButton } from "./MusicToggleButton";
import Link from "next/link";
import Image from "next/image";
import GlobeLoader from "./GlobeLoader";

// Three.js is loaded dynamically to avoid SSR issues
let THREE = null;
let GLTFLoader = null;
let DRACOLoader = null;
let OrbitControls = null;

// Promise to track Three.js loading
let threeLoadPromise = null;

async function loadThreeJS() {
  if (THREE) return { THREE, GLTFLoader, DRACOLoader, OrbitControls };

  if (!threeLoadPromise) {
    threeLoadPromise = (async () => {
      const threeModule = await import("three");
      const gltfModule = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const dracoModule = await import("three/examples/jsm/loaders/DRACOLoader.js");
      const controlsModule = await import("three/examples/jsm/controls/OrbitControls.js");

      THREE = threeModule;
      GLTFLoader = gltfModule.GLTFLoader;
      DRACOLoader = dracoModule.DRACOLoader;
      OrbitControls = controlsModule.OrbitControls;

      return { THREE, GLTFLoader, DRACOLoader, OrbitControls };
    })();
  }

  return threeLoadPromise;
}

// Flower Detail Modal Component
function FlowerDetailModal({ country, isVisible, onClose }) {
  const modelViewerRef = useRef();
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [lang, setLang] = useState("en"); // Default to English for now

  useEffect(() => {
    if (!isVisible || !country) return;

    // Load Three.js and create 3D viewer
    const loadModel = async () => {
      try {
        // Load Three.js dynamically
        const { THREE, GLTFLoader, DRACOLoader, OrbitControls } = await loadThreeJS();

        if (!modelViewerRef.current) return;

        // Clear previous content
        modelViewerRef.current.innerHTML = "";

        // Scene setup
        const scene = new THREE.Scene();
        // Use a warm neutral background similar to test page
        scene.background = new THREE.Color(0xF2F1ED);

        const camera = new THREE.PerspectiveCamera(
          45,
          modelViewerRef.current.clientWidth /
          modelViewerRef.current.clientHeight,
          0.1,
          100
        );

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(
          modelViewerRef.current.clientWidth,
          modelViewerRef.current.clientHeight
        );
        renderer.shadowMap.enabled = true;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;

        modelViewerRef.current.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.8;
        controls.minPolarAngle = Math.PI / 3.2;
        controls.maxPolarAngle = Math.PI / 1.8;
        controls.enablePan = false;

        // Lighting match test page
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

        // Ground plane
        const groundGeo = new THREE.PlaneGeometry(20, 20);
        const groundMat = new THREE.ShadowMaterial({
          opacity: 0.18,
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1;
        ground.receiveShadow = true;
        scene.add(ground);

        // Load model or create fallback
        const loader = new GLTFLoader();

        // Use custom DRACO loader if needed
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(
          "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
        );
        dracoLoader.setDecoderConfig({ type: "js" });
        loader.setDRACOLoader(dracoLoader);

        const gltfUrl = country.gltfPath;

        if (gltfUrl) {
          loader.setCrossOrigin("anonymous");
          loader.load(
            gltfUrl,
            (gltf) => {
              const model = gltf.scene;

              // Try to fix textures if they are black
              model.traverse((node) => {
                if (node.isMesh) {
                  node.castShadow = true;
                  node.receiveShadow = true;
                  if (node.material) {
                    node.material.side = THREE.DoubleSide;
                    // Reset emissive if it's potentially causing issues, or ensure map encoding
                    if (node.material.map) node.material.map.encoding = THREE.sRGBEncoding;
                    node.material.needsUpdate = true;
                  }
                }
              });

              // Center and scale the model
              const box = new THREE.Box3().setFromObject(model);
              const size = box.getSize(new THREE.Vector3());
              const center = box.getCenter(new THREE.Vector3());
              const maxDim = Math.max(size.x, size.y, size.z);

              // Different scale for different models if needed, but 1.8 fit well in test page
              const targetHeight = 1.8;
              const scale = targetHeight / maxDim;

              model.scale.setScalar(scale);
              model.position.sub(center.multiplyScalar(scale));

              scene.add(model);
              setIsModelLoaded(true);

              // Position camera
              camera.position.set(0, 1.5, 3);
              camera.lookAt(0, 0, 0);
              controls.target.set(0, 0, 0);
            },
            undefined,
            (error) => {
              console.error("Error loading model:", error);
              createFallbackFlower(THREE, scene, camera, controls, country);
            }
          );
        } else {
          createFallbackFlower(THREE, scene, camera, controls, country);
        }

        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();

        // Handle resize
        const handleResize = () => {
          if (!modelViewerRef.current) return;
          const width = modelViewerRef.current.clientWidth;
          const height = modelViewerRef.current.clientHeight;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };

        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
          if (modelViewerRef.current) {
            modelViewerRef.current.innerHTML = "";
          }
        };
      } catch (error) {
        console.error("Error loading 3D viewer:", error);
        setIsModelLoaded(false);
      }
    };

    if (isVisible) {
      const timer = setTimeout(loadModel, 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible, country]);

  // Fallback flower function
  function createFallbackFlower(THREE, scene, camera, controls, country) {
    const flowerGroup = new THREE.Group();
    // Simple fallback logic (simplified for brevity)
    const centerGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const centerMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    flowerGroup.add(center);

    // Add some petals
    const petalCount = 8;
    const petalGeo = new THREE.ConeGeometry(0.5, 1.5, 8);
    const petalMat = new THREE.MeshPhongMaterial({ color: country.color });
    for (let i = 0; i < petalCount; i++) {
      const petal = new THREE.Mesh(petalGeo, petalMat);
      const angle = (i / petalCount) * Math.PI * 2;
      petal.position.set(Math.cos(angle) * 0.8, 0, Math.sin(angle) * 0.8);
      petal.rotation.z = angle + Math.PI / 2;
      petal.rotation.x = Math.PI / 4;
      flowerGroup.add(petal);
    }

    scene.add(flowerGroup);
    setIsModelLoaded(true);
    camera.position.set(0, 2, 4);
    controls.target.set(0, 0, 0);
  }

  if (!country) return null;

  return (
    <div
      className={`fixed inset-0 z-[100000] flex items-center justify-center p-0 sm:p-4 transition-all duration-500 ${isVisible
        ? "bg-slate-50/90 backdrop-blur-sm"
        : "bg-transparent pointer-events-none opacity-0"
        }`}
      role="dialog"
      aria-modal="true"
    >
      {/* Music Player */}
      {isVisible && country.musicPath && (
        <div className="fixed bottom-6 left-6 z-[100002]">
          <MusicToggleButton
            src={country.musicPath}
            autoPlay={true}
            onLoadComplete={isModelLoaded}
          />
        </div>
      )}

      <div
        className={`bg-white w-full h-full sm:h-auto sm:max-w-6xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-700 transform ${isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-8"
          }`}
        style={{ maxHeight: "95vh" }}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            <span className="text-xs rounded-full bg-rose-50 px-3 py-1 text-rose-700 font-medium hidden sm:inline-block">
              {country.country} · {country.flowerName}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* 3D Model Viewer - Left Side */}
          <div className="lg:w-[55%] relative bg-[#F2F1ED] flex flex-col">
            <div
              ref={modelViewerRef}
              className="w-full h-[40vh] lg:h-full"
            />

            {!isModelLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm text-gray-500">Loading model...</p>
              </div>
            )}

            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md rounded-full px-4 py-2 border border-white/50 shadow-sm hidden sm:block">
              <p className="text-xs text-gray-600 font-medium">
                Drag to rotate • Scroll to zoom
              </p>
            </div>
          </div>

          {/* Information Panel - Right Side */}
          <div className="lg:w-[45%] flex flex-col h-[60vh] lg:h-auto bg-white border-l border-gray-100 overflow-y-auto">
            <div className="p-6 sm:p-8 lg:p-10 space-y-8">

              {/* Header */}
              <header>
                <div className="text-3xl mb-2">🌸</div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-1">
                  {country.flowerName}
                </h1>
                {/* Local language name */}
                {country.flowerNameLocal && country.flowerNameLocal !== country.flowerName && (
                  <div className="flex items-baseline gap-2 mb-2">
                    <span
                      className="text-xl font-semibold"
                      style={{ color: country.color }}
                    >
                      {country.flowerNameLocal}
                    </span>
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                      {country.localLanguageName}
                    </span>
                  </div>
                )}
                <p className="text-gray-500 text-lg italic font-serif">
                  {country.flowerScientificName}
                </p>
                {country.sanCode && (
                  <div className="mt-2 text-xs text-gray-400 font-mono">
                    S.A.N.: {country.sanCode}
                  </div>
                )}
              </header>

              {/* Botanical Data */}
              <div className="space-y-4">
                <h2 className="text-xs uppercase tracking-[0.3em] text-rose-500 font-semibold">
                  1. BOTANICAL DATA
                </h2>
                <div className="bg-rose-50 rounded-xl p-5 border border-rose-100 space-y-4">
                  <div>
                    <span className="text-xs font-bold text-rose-700 uppercase block mb-1">Scientific Name</span>
                    <span className="text-gray-800 italic">{country.flowerScientificName}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-rose-700 uppercase block mb-1">Common Names</span>
                    <span className="text-gray-800">{country.flowerName}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-rose-700 uppercase block mb-1">Description</span>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {country.botanicalInfo}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cultural Significance */}
              <div className="space-y-4">
                <h2 className="text-xs uppercase tracking-[0.3em] text-gray-400 font-semibold">
                  2. CULTURAL SIGNIFICANCE
                </h2>
                <div className="prose prose-sm text-gray-600">
                  <p>{country.flowerDescription}</p>
                  <p className="mt-2">{country.culturalSignificance}</p>
                </div>
              </div>

              {/* Country Stats */}
              <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Country</p>
                  <p className="font-semibold text-gray-900">{country.country}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Capital</p>
                  <p className="font-semibold text-gray-900">{country.capital}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Language</p>
                  <p className="font-semibold text-gray-900">{country.language}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Currency</p>
                  <p className="font-semibold text-gray-900">{country.currency}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GlobeComponent({ showOvalBorder = true, showBackground = true }) {
  const containerRef = useRef();
  const fullscreenContainerRef = useRef();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isGlobeLoaded, setIsGlobeLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controlsRef = useRef();
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  // Countries data array
  const countriesData = useMemo(() => [
    {
      id: "IN_LOTUS",
      name: "Lotus",
      country: "India",
      countryCode: "IN",
      lat: 20.5937,
      lng: -55.9629, // Adjusted for custom globe
      capital: "New Delhi",
      population: "1.4 billion",
      continent: "Asia",
      language: "Hindi, English",
      currency: "Indian Rupee (INR)",
      flowerName: "Lotus",
      flowerScientificName: "Nelumbo nucifera",
      flowerDescription:
        "The lotus is India's national flower, symbolizing purity, enlightenment, and rebirth. It rises from muddy waters to bloom magnificently, representing the journey from darkness to light.",
      culturalSignificance:
        "Sacred in Hinduism and Buddhism, the lotus represents divine beauty and purity. It's often associated with gods and goddesses and is a symbol of spiritual awakening.",
      botanicalInfo:
        "An aquatic perennial plant with large, fragrant pink or white flowers. The lotus can live for over 1,000 years and its seeds can remain viable for centuries.",
      color: "#ff6b9d",
      special: true,
      size: 0.10,
      flowerNameLocal: "कमल",
      localLanguageName: "Hindi",
      gltfPath: "/api/glb-proxy?url=" + encodeURIComponent("https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/Indian_lotus.glb"),
      musicPath: "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/National_music/Folk+Project+(India).mp3.mpeg",
      sanCode: "SAN-F-IN-001",
    },
    {
      id: "US_ROSE",
      name: "Rose",
      country: "United States",
      countryCode: "US",
      lat: 50.8283,
      lng: 100.5795, // Center of USA
      capital: "Washington D.C.",
      population: "331 million",
      continent: "North America",
      language: "English",
      currency: "US Dollar (USD)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription:
        "The rose is the national flower of the United States, symbolizing love, beauty, and courage. It represents the nation's spirit and natural beauty.",
      culturalSignificance:
        "Roses have been symbols of love and beauty for centuries. In American culture, they represent the nation's natural heritage and the spirit of freedom.",
      botanicalInfo:
        "A woody perennial flowering plant with over 300 species. Roses are known for their fragrant flowers and thorny stems.",
      color: "#e91e63",
      special: false,
      size: 0.08,
      flowerNameLocal: "Rose",
      localLanguageName: "English",
      gltfPath: "/api/glb-proxy?url=" + encodeURIComponent("https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/Flower_America_Web.glb"),
      musicPath: "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/National_music/Folk+Project+(USA).mp3.mpeg",
      sanCode: "SAN-F-US-001",
    },
    {
      id: "CA_MAPLE",
      name: "Maple Leaf",
      country: "Canada",
      countryCode: "CA",
      lat: 67.7560,
      lng: 120.8520,
      capital: "Ottawa",
      population: "38 million",
      continent: "North America",
      language: "English, French",
      currency: "Canadian Dollar (CAD)",
      flowerName: "Maple Leaf",
      flowerScientificName: "Acer",
      flowerDescription:
        "The maple leaf is the distinctively shaped leaf of the maple tree, and is the most widely recognized national symbol of Canada.",
      culturalSignificance:
        "The maple leaf has been a symbol of Canada since the 18th century, representing the land and its people. It features prominently on the national flag.",
      botanicalInfo:
        "Maples are trees or shrubs in the genus Acer. They are known for their palmate leaves and winged seeds. Canada is home to ten native maple species.",
      color: "#ff0000",
      special: true,
      size: 0.09,
      flowerNameLocal: "Feuille d'érable",
      localLanguageName: "French",
      gltfPath: null, // Will use fallback
      musicPath: "/music/Canada.mp3", // Placeholder
      sanCode: "SAN-F-CA-001",
    },
    {
      id: "ES_CARNATION",
      name: "Carnation",
      country: "Spain",
      countryCode: "ES",
      lat: 44.5711,
      lng: -139.5964,
      capital: "Madrid",
      population: "47 million",
      continent: "Europe",
      language: "Spanish",
      currency: "Euro (EUR)",
      flowerName: "Carnation",
      flowerScientificName: "Dianthus caryophyllus",
      flowerDescription:
        "The carnation is Spain's national flower, symbolizing passion, love, and the vibrant spirit of the Spanish people.",
      culturalSignificance:
        "Carnations are central to Spanish culture, often worn during festivals and bullfights. They represent the deep-rooted traditions and artistic soul of Spain.",
      botanicalInfo:
        "A perennial flowering plant known for its fringed petals and sweet, spicy fragrance. It thrives in Spain's Mediterranean climate.",
      color: "#ff5252",
      special: true,
      size: 0.08,
      flowerNameLocal: "Clavel",
      localLanguageName: "Spanish",
      gltfPath: "/api/glb-proxy?url=" + encodeURIComponent("https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/Espana_Carnation.glb"),
      musicPath: "/Folk Project (España).mp3",
      sanCode: "SAN-F-ES-001",
    },
    {
      id: "ZA_PROTEA",
      name: "Protea",
      country: "South Africa",
      countryCode: "ZA",
      lat: -30.6814,
      lng: -117.5419,
      capital: "Pretoria",
      population: "60 million",
      continent: "Africa",
      language: "Zulu, Xhosa, Afrikaans, English",
      currency: "South African Rand (ZAR)",
      flowerName: "King Protea",
      flowerScientificName: "Protea cynaroides",
      flowerDescription:
        "The King Protea is South Africa's national flower, symbolizing diversity and courage. It has the largest flower head in the genus.",
      culturalSignificance:
        "It represents the beauty and resilience of the land. Its name comes from the Greek god Proteus due to the many shapes and colors of the flowers.",
      botanicalInfo:
        "A woody shrub with thick stems and large dark green glossy leaves. The flower heads are huge, bowl-shaped, and surrounded by bracts.",
      color: "#e91e63",
      special: true,
      size: 0.09,
      flowerNameLocal: "Koningsuikerbos",
      localLanguageName: "Afrikaans",
      gltfPath: "/api/glb-proxy?url=" + encodeURIComponent("https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/King_Protea.glb"),
      musicPath: "/music/SouthAfrica.mp3", // Placeholder
      sanCode: "SAN-F-ZA-001",
    },
    {
      id: "CO_ORCHID",
      name: "Orchid",
      country: "Colombia",
      countryCode: "CO",
      lat: 20.6917,
      lng: 135.5094,
      capital: "Bogotá",
      population: "50 million",
      continent: "South America",
      language: "Spanish",
      currency: "Colombian Peso (COP)",
      flowerName: "Cattleya Trianae",
      flowerScientificName: "Cattleya trianae",
      flowerDescription:
        "The Cattleya trianae orchid is Colombia's national flower, chosen for its beauty and because the colors of its lip (yellow, blue, and red) match the Colombian flag.",
      culturalSignificance:
        "Named after Colombian botanist Jerónimo Triana, it represents the rich biodiversity of Colombia, which has the most orchid species in the world.",
      botanicalInfo:
        "An epiphytic orchid that grows on trees in the cloud forests of the Andes. It produces large, fragrant flowers.",
      color: "#ba68c8",
      special: true,
      size: 0.08,
      flowerNameLocal: "Orquídea de Navidad",
      localLanguageName: "Spanish",
      gltfPath: "/api/glb-proxy?url=" + encodeURIComponent("https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/Orqui%CC%81dea_Tricolor.glb"),
      musicPath: "/music/Colombia.mp3", // Placeholder
      sanCode: "SAN-F-CO-001",
    },
    {
      id: "PK_JASMINE",
      name: "Jasmine",
      country: "Pakistan",
      countryCode: "PK",
      lat: 28.6939,
      lng: -68.0902,
      capital: "Islamabad",
      population: "231 million",
      continent: "Asia",
      language: "Urdu, English",
      currency: "Pakistani Rupee (PKR)",
      flowerName: "Jasmine",
      flowerScientificName: "Jasminum officinale",
      flowerDescription:
        "The jasmine is Pakistan's national flower, symbolizing purity, grace, and beauty. It represents the country's rich cultural heritage and natural fragrance.",
      culturalSignificance:
        "Jasmine holds a special place in Pakistani culture, often used in religious ceremonies and traditional celebrations. It symbolizes love, beauty, and spiritual purity.",
      botanicalInfo:
        "A fragrant flowering plant with small, white, star-shaped flowers. Known for its sweet, intoxicating scent, jasmine is widely cultivated in Pakistan's gardens and parks.",
      color: "#4caf50",
      special: false,
      size: 0.08,
      flowerNameLocal: "چنبیلی",
      localLanguageName: "Urdu",
      gltfPath: "/api/glb-proxy?url=" + encodeURIComponent("https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/Pakistani_Jasmine.glb"),
      musicPath: "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/National_music/Folk+Project+(Pakistan).mp3.mpeg",
      sanCode: "SAN-F-PK-001",
    },

  ], []);

  // Helper function to calculate 3D coordinates from lat/lng
  const calculate3DCoordinates = (lat, lng, radius = 4.5) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    return {
      x: -(radius * Math.sin(phi) * Math.cos(theta)),
      y: radius * Math.cos(phi),
      z: radius * Math.sin(phi) * Math.sin(theta)
    };
  };

  // Helper function to create a new country entry
  const createCountryData = (id, name, country, countryCode, lat, lng, capital, population, continent, language, currency, flowerName, flowerScientificName, flowerDescription, culturalSignificance, botanicalInfo, color, special = false, size = 0.06, gltfPath = null) => {
    return {
      id,
      name,
      country,
      countryCode,
      lat,
      lng,
      capital,
      population,
      continent,
      language,
      currency,
      flowerName,
      flowerScientificName,
      flowerDescription,
      culturalSignificance,
      botanicalInfo,
      color,
      special,
      size,
      gltfPath
    };
  };


  useEffect(() => {
    if (!containerRef.current) return;

    let isLoaded = false; // Prevent multiple loads

    const loadGlobe = async () => {
      if (isLoaded) return; // Prevent multiple loads
      isLoaded = true;
      try {
        // Load Three.js dynamically
        const { THREE, GLTFLoader, OrbitControls } = await loadThreeJS();

        // Clear container
        containerRef.current.innerHTML = "";

        // Create scene
        const scene = new THREE.Scene();
        scene.background = null; // Make background transparent so CSS background shows
        sceneRef.current = scene;
        console.log("✅ Scene created");

        // Create camera with mobile-friendly settings
        const camera = new THREE.PerspectiveCamera(
          75,
          containerRef.current.clientWidth / containerRef.current.clientHeight,
          0.1,
          1000
        );
        cameraRef.current = camera;

        // Adjust camera position based on screen size
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

        // Set initial camera position far for zoom-in effect
        const targetDistance = isMobile ? 7 : isTablet ? 6.5 : 8;
        const startDistance = isMobile ? 14 : isTablet ? 13 : 16;

        camera.position.set(0, 0, startDistance);
        console.log("✅ Camera positioned at:", camera.position);

        // Animate camera zoom in on load
        const zoomDuration = 2000; // 2 seconds
        const startTime = Date.now();

        const animateZoom = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / zoomDuration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

          const currentDistance = startDistance + (targetDistance - startDistance) * easeProgress;
          camera.position.z = currentDistance;

          if (progress < 1) {
            requestAnimationFrame(animateZoom);
          }
        };

        animateZoom();

        // Create renderer
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true, // Enable alpha channel for transparency
        });
        renderer.setSize(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        );
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setClearColor(0x000000, 0); // Set clear color with 0 alpha (transparent)
        rendererRef.current = renderer;
        containerRef.current.appendChild(renderer.domElement);

        // Add balanced lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // Add subtle colored ambient light for atmospheric glow
        const coloredAmbientLight = new THREE.AmbientLight(0x4a90e2, 0.05);
        scene.add(coloredAmbientLight);

        // Helper function to calculate 3D coordinates (local version with custom radius)
        const calculate3DCoordsWithRadius = (lat, lng, radius) => {
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lng + 180) * (Math.PI / 180);

          return {
            x: -(radius * Math.sin(phi) * Math.cos(theta)),
            y: radius * Math.cos(phi),
            z: radius * Math.sin(phi) * Math.sin(theta)
          };
        };

        // Function to calculate distance from screen center
        const getDistanceFromScreenCenter = (worldPosition, camera, renderer) => {
          // Convert world position to screen coordinates
          const vector = worldPosition.clone();
          vector.project(camera);

          // Convert to screen coordinates
          const x = (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
          const y = (vector.y * 0.5 + 0.5) * renderer.domElement.clientHeight;

          // Calculate distance from screen center
          const screenCenterX = renderer.domElement.clientWidth / 2;
          const screenCenterY = renderer.domElement.clientHeight / 2;

          const distance = Math.sqrt(
            Math.pow(x - screenCenterX, 2) + Math.pow(y - screenCenterY, 2)
          );

          // Normalize distance (0 = center, 1 = edge)
          const maxDistance = Math.sqrt(
            Math.pow(screenCenterX, 2) + Math.pow(screenCenterY, 2)
          );

          return Math.min(distance / maxDistance, 1);
        };

        // Function to create dynamic color based on distance from screen center
        const getDynamicColor = (baseColor, distanceFromCenter) => {
          // Parse base color
          const color = new THREE.Color(baseColor);

          // Calculate brightness factor with dramatic range (1.5 at center, 0.2 at edge)
          const brightness = 1.5 - (distanceFromCenter * 1.3);

          // Calculate saturation factor (1.2 at center, 0.4 at edge)
          const saturation = 1.2 - (distanceFromCenter * 0.8);

          // Apply brightness and saturation
          const hsl = { h: 0, s: 0, l: 0 };
          color.getHSL(hsl);

          // Adjust saturation and lightness with more dramatic effect
          hsl.s = Math.min(hsl.s * saturation, 1.0);
          hsl.l = Math.min(hsl.l * brightness, 1.0);

          // Convert back to color
          const dynamicColor = new THREE.Color();
          dynamicColor.setHSL(hsl.h, hsl.s, hsl.l);

          return dynamicColor;
        };

        // Function to update ball colors and opacity based on screen position
        const updateBallColors = (scene, camera, renderer) => {
          scene.traverse((child) => {
            if (child.userData && child.userData.data && child.material) {
              const ballGroup = child.parent;
              if (ballGroup && ballGroup.userData && ballGroup.userData.data) {
                const countryData = ballGroup.userData.data;
                const distanceFromCenter = getDistanceFromScreenCenter(ballGroup.position, camera, renderer);
                const dynamicColor = getDynamicColor(countryData.color, distanceFromCenter);

                // Calculate dramatic opacity factor (1.5 at center, 0.3 at edge)
                const opacityFactor = 1.5 - (distanceFromCenter * 1.2);
                const clampedOpacityFactor = Math.max(0.1, Math.min(opacityFactor, 1.0));

                // Update main ball color
                if (child.material.color) {
                  child.material.color.copy(dynamicColor);
                }

                // Store original opacity if not already stored
                if (!child.material.userData) {
                  child.material.userData = {};
                }
                if (child.material.userData.originalOpacity === undefined) {
                  child.material.userData.originalOpacity = child.material.opacity || 0.9;
                }

                // Update opacity with dramatic range
                if (child.material.opacity !== undefined) {
                  child.material.opacity = child.material.userData.originalOpacity * clampedOpacityFactor;
                }
              }
            }
          });
        };

        // Load your custom Globe.glb
        const loader = new GLTFLoader();

        loader.load(
          "/Globe.glb",
          (gltf) => {
            const globe = gltf.scene;

            // Ensure globe materials are visible
            globe.traverse((child) => {
              if (child.isMesh && child.material) {
                child.material.transparent = false;
                child.material.opacity = 1.0;
              }
            });

            // Add initial scale animation with mobile-friendly scaling
            const targetScale = isMobile ? 1.8 : isTablet ? 2.8 : 4.0;
            globe.scale.setScalar(0.1);
            scene.add(globe);
            console.log("✅ Globe loaded successfully");

            // Animate globe scale
            const scaleAnimation = () => {
              if (globe.scale.x < targetScale) {
                globe.scale.addScalar(0.1);
                requestAnimationFrame(scaleAnimation);
              } else {
                globe.scale.setScalar(targetScale);
                setIsGlobeLoaded(true);
                console.log("✅ Globe animation complete");
              }
            };
            scaleAnimation();

            // Now add country balls for all countries
            addCountryBalls(scene, camera);
          },
          (progress) => {
            console.log(`Loading Globe.glb: ${Math.round((progress.loaded / progress.total) * 100)}%`);
          },
          (error) => {
            console.error("Failed to load Globe.glb:", error);
            createFallbackGlobe();
          }
        );

        // Function to create fallback globe
        function createFallbackGlobe() {
          console.log("🔄 Creating fallback globe");
          // Create fallback sphere with better visibility
          const geometry = new THREE.SphereGeometry(1, 32, 32);
          const material = new THREE.MeshPhongMaterial({
            color: 0x4a90e2,
            transparent: false,
            opacity: 1.0
          });
          const sphere = new THREE.Mesh(geometry, material);

          // Add initial scale animation for fallback with mobile-friendly scaling
          const targetScale = isMobile ? 1.8 : isTablet ? 2.8 : 4.0;
          sphere.scale.setScalar(0.1);
          scene.add(sphere);
          console.log("✅ Fallback globe added to scene");

          // Animate fallback globe scale
          const scaleAnimation = () => {
            if (sphere.scale.x < targetScale) {
              sphere.scale.addScalar(0.1);
              requestAnimationFrame(scaleAnimation);
            } else {
              sphere.scale.setScalar(targetScale);
              setIsGlobeLoaded(true);
              console.log("✅ Fallback globe animation complete");
            }
          };
          scaleAnimation();

          // Add country balls
          addCountryBalls(scene, camera);
        }

        // Store ball groups for zoom scaling
        const ballGroups = [];

        // Function to add country balls for all countries
        function addCountryBalls(scene, camera) {
          countriesData.forEach((countryData, index) => {
            const ballGroup = new THREE.Group();

            // Adjust satellite size based on device type
            const adjustedSize = isMobile
              ? countryData.size * 1.2  // 20% larger on mobile for better visibility
              : isTablet
                ? countryData.size * 0.9  // 10% smaller on tablet
                : countryData.size;       // Original size on desktop

            // Main sphere (ball) - this will be clickable
            const sphereGeometry = new THREE.SphereGeometry(
              adjustedSize,
              16,
              16
            );
            const sphereMaterial = new THREE.MeshPhongMaterial({
              color: countryData.color,
              shininess: 120,
              specular: 0x666666,
              transparent: true,
              opacity: 0.9,
            });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

            // Store country data for click handling
            sphere.userData = { data: countryData };
            sphere.castShadow = true;
            sphere.receiveShadow = true;
            ballGroup.add(sphere);

            // Add initial scale animation for the ball
            ballGroup.scale.setScalar(0);
            scene.add(ballGroup);

            // Animate ball appearance with delay (staggered for visual effect)
            setTimeout(() => {
              const ballAnimation = () => {
                if (ballGroup.scale.x < 1) {
                  ballGroup.scale.addScalar(0.1);
                  requestAnimationFrame(ballAnimation);
                } else {
                  ballGroup.scale.setScalar(1);
                }
              };
              ballAnimation();
            }, 1000 + (index * 200)); // Staggered delay for each country

            // Enhanced 3-layer glow effect with stronger aura
            // Inner glow (closest to ball)
            const innerGlowGeometry = new THREE.SphereGeometry(
              adjustedSize * 1.4,
              16,
              16
            );
            const innerGlowMaterial = new THREE.MeshBasicMaterial({
              color: countryData.color,
              transparent: true,
              opacity: 0.45,
            });
            const innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
            innerGlow.userData = { data: countryData };
            ballGroup.add(innerGlow);

            // Middle glow
            const middleGlowGeometry = new THREE.SphereGeometry(
              adjustedSize * 2.0,
              16,
              16
            );
            const middleGlowMaterial = new THREE.MeshBasicMaterial({
              color: countryData.color,
              transparent: true,
              opacity: 0.30,
            });
            const middleGlow = new THREE.Mesh(middleGlowGeometry, middleGlowMaterial);
            middleGlow.userData = { data: countryData };
            ballGroup.add(middleGlow);

            // Outer glow
            const outerGlowGeometry = new THREE.SphereGeometry(
              adjustedSize * 2.8,
              16,
              16
            );
            const outerGlowMaterial = new THREE.MeshBasicMaterial({
              color: countryData.color,
              transparent: true,
              opacity: 0.18,
            });
            const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
            outerGlow.userData = { data: countryData };
            ballGroup.add(outerGlow);

            // Enhanced ring effect for special countries
            if (countryData.special) {
              // Single elegant ring with stronger glow
              const ringGeometry = new THREE.RingGeometry(
                adjustedSize * 1.6,
                adjustedSize * 2.0,
                32
              );
              const ringMaterial = new THREE.MeshBasicMaterial({
                color: countryData.color,
                transparent: true,
                opacity: 0.5,
                side: THREE.DoubleSide,
              });
              const ring = new THREE.Mesh(ringGeometry, ringMaterial);
              ring.rotateX(Math.PI / 2);
              ring.userData = { data: countryData };
              ballGroup.add(ring);
            }

            // Position the ball using the helper function with closer radius for mobile
            const initialRadius = isMobile ? 2.0 : isTablet ? 3.0 : 4.5;
            const coords = calculate3DCoordinates(countryData.lat, countryData.lng, initialRadius);
            ballGroup.position.set(coords.x, coords.y, coords.z);
            ballGroup.userData = {
              data: countryData,
              isHovered: false
            };

            // Store ball group for zoom scaling
            ballGroups.push(ballGroup);

            console.log(`🌸 ${countryData.country} ball added at coordinates:`, coords);
            console.log(`Ball distance from origin: ${Math.sqrt(coords.x * coords.x + coords.y * coords.y + coords.z * coords.z)}`);
          });
        }

        // Cache for last distance to avoid unnecessary recalculations
        let lastDistance = -1;
        const DISTANCE_THRESHOLD = 0.1; // Only recalculate if distance changed by more than this

        // Function to scale and reposition satellites based on camera distance (zoom level)
        const scaleSatellitesBasedOnZoom = (camera) => {
          const distance = camera.position.length();

          // Only recalculate if distance changed significantly (optimization)
          if (Math.abs(distance - lastDistance) < DISTANCE_THRESHOLD) {
            return; // Skip recalculation if distance hasn't changed much
          }
          lastDistance = distance;

          // Mobile-friendly distance limits
          const minDistance = isMobile ? 3 : isTablet ? 2.5 : 3;
          const maxDistance = isMobile ? 12 : isTablet ? 11 : 15;

          // Calculate normalized distance (0 = closest, 1 = farthest)
          const normalizedDistance = Math.max(0, Math.min(1, (distance - minDistance) / (maxDistance - minDistance)));

          // Calculate base scale factor (closer = smaller satellites)
          // Mobile: Scale from 0.4x to 0.9x (larger for better visibility), Tablet: 0.25x to 0.8x, Desktop: 0.4x to 1.2x
          const baseScaleFactor = isMobile
            ? 0.4 + (normalizedDistance * 0.5)
            : isTablet
              ? 0.25 + (normalizedDistance * 0.55)
              : 0.4 + (normalizedDistance * 0.8);

          // Calculate dynamic radius (closer zoom = satellites closer to globe)
          // Mobile: 1.8 to 2.4 (balanced), Tablet: 2.8 to 3.4, Desktop: 4.2 to 4.8
          const dynamicRadius = isMobile
            ? 1.8 + (normalizedDistance * 0.6)
            : isTablet
              ? 2.8 + (normalizedDistance * 0.6)
              : 4.2 + (normalizedDistance * 0.6);

          // Apply scaling and repositioning to all ball groups
          ballGroups.forEach((ballGroup) => {
            if (ballGroup && ballGroup.userData && ballGroup.userData.data) {
              const countryData = ballGroup.userData.data;

              // Calculate final scale factor (base scale * hover multiplier)
              const hoverMultiplier = ballGroup.userData.isHovered ? 1.3 : 1.0;
              const finalScaleFactor = baseScaleFactor * hoverMultiplier;

              // Apply the combined scaling
              ballGroup.scale.setScalar(finalScaleFactor);

              // Reposition with dynamic radius
              const coords = calculate3DCoordsWithRadius(countryData.lat, countryData.lng, dynamicRadius);
              ballGroup.position.set(coords.x, coords.y, coords.z);
            }
          });
        };

        // Move controls declaration BEFORE the click handler
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.enableZoom = false; // Disabled by default in normal view
        controls.enablePan = false;
        // Disable rotation on mobile when not in fullscreen to prevent scroll interference
        controls.enableRotate = !isMobile; // Disable on mobile, enable on desktop/tablet

        // Mobile-friendly zoom limits
        if (isMobile) {
          controls.minDistance = 3;
          controls.maxDistance = 12;
          controls.autoRotateSpeed = 0.3; // Slower rotation for mobile
          // Disable all interactions on mobile when not in fullscreen
          controls.enableRotate = false;
        } else if (isTablet) {
          controls.minDistance = 2.5;
          controls.maxDistance = 11;
          controls.autoRotateSpeed = 0.4;
        } else {
          controls.minDistance = 3;
          controls.maxDistance = 15;
        }

        // Mobile touch settings - disable touch controls on mobile when not in fullscreen
        if (isMobile) {
          controls.touches = {
            ONE: THREE.TOUCH.NONE,
            TWO: THREE.TOUCH.NONE
          };
        } else {
          controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
          };
        }

        // Add zoom event listener to immediately scale satellites
        controls.addEventListener('change', () => {
          scaleSatellitesBasedOnZoom(camera);
        });

        // Store controls reference so closeModal and fullscreen can access it
        controlsRef.current = controls;

        // Add click detection using raycasting
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const handleClick = (event) => {
          // Get mouse position relative to the canvas/renderer element
          const rect = renderer.domElement.getBoundingClientRect();
          mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

          // Update raycaster
          raycaster.setFromCamera(mouse, camera);

          // Get all intersectable objects
          const intersectableObjects = [];
          scene.traverse((child) => {
            if (child.userData && child.userData.data && child.isMesh) {
              intersectableObjects.push(child);
            }
          });

          // Check for intersections
          const intersects = raycaster.intersectObjects(scene.children, true);

          if (intersects.length > 0) {
            const firstIntersect = intersects[0];
            const clickedObject = firstIntersect.object;

            // --- COORDINATE DEBUG TOOL ---
            // Find the point on the globe's surface (specifically looking for the globe mesh)
            let globeIntersection = null;
            for (let intersect of intersects) {
              // Usually the globe is a mesh that doesn't have country data
              if (intersect.object.isMesh && (!intersect.object.userData || !intersect.object.userData.data)) {
                globeIntersection = intersect;
                break;
              }
            }

            if (globeIntersection) {
              const point = globeIntersection.point.clone();
              // Calculate distance from center
              const distance = point.length();

              // Normalize point to sphere (latitude/longitude calculation)
              const normalizedPoint = point.clone().normalize();

              const lat = Math.asin(normalizedPoint.y) * (180 / Math.PI);
              let lng = (Math.atan2(normalizedPoint.z, -normalizedPoint.x) * (180 / Math.PI)) + 180;

              // Normalize to [-180, 180]
              while (lng <= -180) lng += 360;
              while (lng > 180) lng -= 360;

              console.log("%c--- GLOBE COORDINATE FIXED ---", "color: #38a169; font-weight: bold;");
              console.log(`📍 Clicked Location: lat: ${lat.toFixed(4)}, lng: ${lng.toFixed(4)}`);
              console.log(`📏 Distance from origin: ${distance.toFixed(4)}`);
            }
            // -----------------------------

            const countryData = clickedObject.userData?.data || clickedObject.parent?.userData?.data;

            if (countryData) {
              // Prevent fullscreen toggle when clicking on a flower
              event.stopPropagation();

              // Stop auto rotation
              controls.autoRotate = false;

              // Show modal
              setSelectedCountry(countryData);
              setIsModalVisible(true);
              console.log(`🌸 Opening ${countryData.flowerName} dialog for ${countryData.country}`);
            }
          }
        };

        // Add click listener
        renderer.domElement.addEventListener("click", handleClick);

        // On mobile when not in fullscreen, disable pointer events on the canvas to allow scrolling
        if (isMobile) {
          renderer.domElement.style.pointerEvents = 'none';
          renderer.domElement.style.touchAction = 'none';
        }

        // Add hover effect for balls
        let hoveredBall = null;

        const handleMouseMove = (event) => {
          const mouse = new THREE.Vector2();
          // Use renderer element's bounding rect for accurate coordinates
          const rect = renderer.domElement.getBoundingClientRect();
          mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

          const raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(mouse, camera);

          // Check for intersections with balls
          const intersects = raycaster.intersectObjects(scene.children, true);

          // Reset previously hovered ball
          if (hoveredBall) {
            hoveredBall.userData.isHovered = false;
            hoveredBall = null;
          }

          // Find the first ball intersection
          for (let intersect of intersects) {
            if (intersect.object.userData && intersect.object.userData.data) {
              hoveredBall = intersect.object.parent; // Get the ball group
              hoveredBall.userData.isHovered = true; // Mark as hovered
              break;
            }
          }
        };

        renderer.domElement.addEventListener("mousemove", handleMouseMove);

        // Animation loop with pulsing glow effect and dynamic colors
        const animate = () => {
          requestAnimationFrame(animate);
          controls.update();

          // Scale satellites based on zoom level
          scaleSatellitesBasedOnZoom(camera);

          // Update ball colors based on screen position
          updateBallColors(scene, camera, renderer);

          // Add dynamic pulsing glow animation with stronger effect
          const time = Date.now() * 0.001;
          scene.traverse((child) => {
            if (child.userData && child.userData.data && child.material && child.material.transparent) {
              // Only animate glow materials (not the main ball)
              if (child.geometry.type === 'SphereGeometry' && child.material.opacity < 0.9) {
                const ballGroup = child.parent;
                if (ballGroup && ballGroup.userData && ballGroup.userData.data) {
                  const distanceFromCenter = getDistanceFromScreenCenter(ballGroup.position, camera, renderer);

                  // Stronger pulsing effect for better visibility
                  const pulseIntensity = 0.25 * (1 - distanceFromCenter); // 0.25 at center, 0 at edge (increased from 0.15)
                  const pulseSpeed = 1.2 + (0.8 * (1 - distanceFromCenter)); // Faster pulse at center

                  const pulse = Math.sin(time * pulseSpeed) * pulseIntensity + (1 - pulseIntensity);
                  child.material.opacity = child.material.opacity * pulse;
                }
              }
            }
          });

          renderer.render(scene, camera);
        };
        animate();

        // Handle resize with mobile responsiveness
        const handleResize = () => {
          if (!containerRef.current) return;
          const width = containerRef.current.clientWidth;
          const height = containerRef.current.clientHeight;

          // Update camera aspect ratio
          camera.aspect = width / height;
          camera.updateProjectionMatrix();

          // Update renderer size
          renderer.setSize(width, height);

          // Recalculate mobile/tablet status
          const newIsMobile = window.innerWidth < 768;
          const newIsTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

          // Adjust camera position if screen size changed
          if (newIsMobile && !isMobile) {
            camera.position.set(0, 0, 7);
          } else if (newIsTablet && !isTablet) {
            camera.position.set(0, 0, 6.5);
          } else if (!newIsMobile && !newIsTablet && (isMobile || isTablet)) {
            camera.position.set(0, 0, 8);
          }
        };

        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
          window.removeEventListener("resize", handleResize);
          renderer.domElement.removeEventListener("click", handleClick);
          renderer.domElement.removeEventListener("mousemove", handleMouseMove);
          if (containerRef.current) {
            containerRef.current.innerHTML = "";
          }
        };
      } catch (error) {
        console.error("Error loading Three.js:", error);
        isLoaded = false; // Allow retry on error
      }
    };

    // Use Intersection Observer to load Globe only when it's about to be visible
    // This ensures hero section loads first, then Globe loads in parallel
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded) {
            loadGlobe();
            observer.disconnect(); // Only load once
          }
        });
      },
      {
        rootMargin: '300px', // Start loading 300px before it's visible
        threshold: 0.01,
      }
    );

    // Observe the container
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Also start loading if already visible (e.g., on small screens)
    const checkVisibility = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight + 300;
        if (isVisible && !isLoaded) {
          loadGlobe();
          observer.disconnect();
        }
      }
    };

    // Check immediately and after a short delay
    checkVisibility();
    const timeoutId = setTimeout(checkVisibility, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [countriesData]);

  const closeModal = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      setSelectedCountry(null);
    }, 300);

    // Restart globe rotation when modal closes
    if (controlsRef.current && controlsRef.current.autoRotate === false) {
      controlsRef.current.autoRotate = true;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle ESC key to exit fullscreen
  // Handle ESC key, move renderer between containers, and toggle zoom
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);

    // Enable/disable zoom and rotation based on fullscreen state and device type
    if (controlsRef.current) {
      const isMobile = window.innerWidth < 768;
      controlsRef.current.enableZoom = isFullscreen; // Enable zoom only in fullscreen

      // On mobile: only enable rotation in fullscreen. On desktop/tablet: always enable rotation
      if (isMobile) {
        controlsRef.current.enableRotate = isFullscreen;
        if (isFullscreen) {
          controlsRef.current.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
          };
        } else {
          controlsRef.current.touches = {
            ONE: THREE.TOUCH.NONE,
            TWO: THREE.TOUCH.NONE
          };
        }
      } else {
        controlsRef.current.enableRotate = true; // Always enable on desktop/tablet
      }

      console.log(`🔍 Zoom ${isFullscreen ? 'enabled' : 'disabled'}, Rotate ${controlsRef.current.enableRotate ? 'enabled' : 'disabled'} (fullscreen: ${isFullscreen}, mobile: ${isMobile})`);
    }

    // Move the renderer to the correct container when fullscreen state changes
    if (rendererRef.current) {
      const targetContainer = isFullscreen ? fullscreenContainerRef.current : containerRef.current;
      if (targetContainer && !targetContainer.contains(rendererRef.current.domElement)) {
        // Remove from current container
        if (rendererRef.current.domElement.parentNode) {
          rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
        }
        // Add to new container
        targetContainer.appendChild(rendererRef.current.domElement);

        // Update renderer size
        const width = targetContainer.clientWidth;
        const height = targetContainer.clientHeight;
        if (cameraRef.current) {
          cameraRef.current.aspect = width / height;
          cameraRef.current.updateProjectionMatrix();
        }
        rendererRef.current.setSize(width, height);
      }

      // Update pointer events based on fullscreen state and device type
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        // On mobile: disable pointer events when not in fullscreen (to allow scrolling)
        // Enable pointer events when in fullscreen (to allow interaction)
        rendererRef.current.domElement.style.pointerEvents = isFullscreen ? 'auto' : 'none';
        rendererRef.current.domElement.style.touchAction = isFullscreen ? 'auto' : 'none';
      } else {
        // On desktop/tablet: always enable pointer events
        rendererRef.current.domElement.style.pointerEvents = 'auto';
        rendererRef.current.domElement.style.touchAction = 'auto';
      }
    }

    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);

  return (
    <>
      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex items-center justify-center"
          onClick={(e) => {
            // Close fullscreen when clicking the background (not the globe)
            if (e.target === e.currentTarget) {
              setIsFullscreen(false);
            }
          }}
        >
          {/* Close Button - Left on both mobile and desktop */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 w-12 h-12 sm:w-14 sm:h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-[10000] group"
            aria-label="Exit fullscreen"
          >
            <Minimize2 className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:scale-110 transition-transform" />
          </button>

          {/* Fullscreen Globe Container */}
          <div className="w-full h-full relative">
            <div
              className="w-full h-full flex items-center justify-center relative"
              role="main"
              aria-label="Interactive 3D Globe of Sacred Flowers - Fullscreen Mode"
            >
              {/* Background Image */}
              {showBackground && (
                <Image
                  src="/bg_image.png"
                  alt="Galactic Garden Background"
                  fill
                  priority
                  quality={85}
                  sizes="100vw"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              )}

              {/* Main globe container in fullscreen */}
              <div
                ref={fullscreenContainerRef}
                className={`w-full h-full cursor-grab active:cursor-grabbing relative transition-opacity duration-1000 z-10 ${isGlobeLoaded ? "opacity-100" : "opacity-0"
                  }`}
                role="img"
                aria-label="Interactive 3D globe showing national flowers from different countries"
                tabIndex={0}
              />

              {/* Loading Animation */}
              {!isGlobeLoaded && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50"
                  role="status"
                  aria-live="polite"
                  aria-label="Loading interactive 3D globe"
                >
                  <GlobeLoader />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Normal View */}
      {!isFullscreen && (
        <div
          className="w-full h-full flex items-center justify-center relative group"
          style={{
            minHeight: '100%',
            minWidth: '100%',
            // On mobile, ensure the container doesn't block scrolling
            ...(typeof window !== 'undefined' && window.innerWidth < 768 ? {
              touchAction: 'pan-y',
            } : {})
          }}
          role="main"
          aria-label="Interactive 3D Globe of Sacred Flowers"
        >
          {/* Fullscreen Button Overlay - Always visible on mobile, hover on desktop */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 w-10 h-10 sm:w-12 sm:h-12 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Enter fullscreen"
          >
            <Maximize2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          {/* Background Image - Only show if showBackground is true (full page mode) */}
          {showBackground && (
            <Image
              src="/bg_image.png"
              alt="Galactic Garden Background - A cosmic view of Earth with floating flower representations from different countries"
              fill
              priority
              quality={85}
              sizes="100vw"
              className="object-cover"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          )}

          {/* Oval Border Frame - Contains the globe (only if showOvalBorder is true) */}
          {showOvalBorder && (
            <div
              className="absolute inset-0 flex items-center justify-center z-0"
              style={{
                clipPath: 'ellipse(85% 90% at 50% 50%)',
              }}
            >
              {/* Decorative border */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: 'ellipse(85% 90% at 50% 50%)',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  boxShadow: 'inset 0 0 60px rgba(255, 255, 255, 0.1), 0 0 80px rgba(0, 0, 0, 0.2)',
                }}
              />
            </div>
          )}

          {/* Main globe container */}
          <div
            ref={containerRef}
            className={`w-full h-full relative transition-opacity duration-1000 z-10 ${isGlobeLoaded ? "opacity-100" : "opacity-0"
              }`}
            style={{
              ...(showOvalBorder ? {
                clipPath: 'ellipse(85% 90% at 50% 50%)',
              } : {}),
              // On mobile when not in fullscreen, allow touch events to pass through for scrolling
              ...(typeof window !== 'undefined' && window.innerWidth < 768 && !isFullscreen ? {
                pointerEvents: 'none',
                touchAction: 'none',
              } : {})
            }}
            role="img"
            aria-label="Interactive 3D globe showing national flowers from different countries. Click on colored spheres to learn about each country's sacred flower."
            tabIndex={0}
          />

          {/* Loading Animation */}
          {!isGlobeLoaded && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50"
              role="status"
              aria-live="polite"
              aria-label="Loading interactive 3D globe"
            >
              <GlobeLoader />
            </div>
          )}

          {/* UI Overlay */}

          {/* Instructions */}
        </div>
      )}

      {/* Enhanced Flower Detail Modal */}
      {selectedCountry && (
        <FlowerDetailModal
          country={selectedCountry}
          isVisible={isModalVisible}
          onClose={closeModal}
        />
      )}
    </>
  );
}

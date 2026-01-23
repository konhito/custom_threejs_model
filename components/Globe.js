"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { X, MapPin, Flower, Info, Rotate3D, Target, Maximize2, Minimize2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import GlobeLoader from "./GlobeLoader";

// Three.js is loaded dynamically to avoid SSR issues
let THREE = null;
let GLTFLoader = null;
let OrbitControls = null;

// Promise to track Three.js loading
let threeLoadPromise = null;

async function loadThreeJS() {
  if (THREE) return { THREE, GLTFLoader, OrbitControls };
  
  if (!threeLoadPromise) {
    threeLoadPromise = (async () => {
      const threeModule = await import("three");
      const gltfModule = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const controlsModule = await import("three/examples/jsm/controls/OrbitControls.js");
      
      THREE = threeModule;
      GLTFLoader = gltfModule.GLTFLoader;
      OrbitControls = controlsModule.OrbitControls;
      
      return { THREE, GLTFLoader, OrbitControls };
    })();
  }
  
  return threeLoadPromise;
}

// Flower Detail Modal Component
function FlowerDetailModal({ country, isVisible, onClose }) {
  const modelViewerRef = useRef();
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    if (!isVisible || !country) return;

    // Load Three.js and create 3D viewer
    const loadModel = async () => {
      try {
        // Load Three.js dynamically
        const { THREE, GLTFLoader, OrbitControls } = await loadThreeJS();

        if (!modelViewerRef.current) return;

        // Clear previous content
        modelViewerRef.current.innerHTML = "";

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8fafc);

        const camera = new THREE.PerspectiveCamera(
          75,
          modelViewerRef.current.clientWidth /
            modelViewerRef.current.clientHeight,
          0.1,
          1000
        );

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(
          modelViewerRef.current.clientWidth,
          modelViewerRef.current.clientHeight
        );
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;

        modelViewerRef.current.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2;
        controls.enableZoom = true;
        controls.enablePan = false;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        const fillLight = new THREE.DirectionalLight(0x74c7ec, 0.4);
        fillLight.position.set(-5, 5, -5);
        scene.add(fillLight);

        // Load model or create fallback
        const loader = new GLTFLoader();

        if (country.gltfPath) {
          loader.load(
            country.gltfPath,
            (gltf) => {
              const model = gltf.scene;

              // Center and scale the model
              const box = new THREE.Box3().setFromObject(model);
              const center = box.getCenter(new THREE.Vector3());
              const size = box.getSize(new THREE.Vector3());
              const maxDim = Math.max(size.x, size.y, size.z);
              const scale = 3 / maxDim;

              model.scale.multiplyScalar(scale);
              model.position.sub(center.multiplyScalar(scale));

              // Enable shadows
              model.traverse((child) => {
                if (child.isMesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
                }
              });

              scene.add(model);
              setIsModelLoaded(true);

              // Position camera
              camera.position.set(5, 5, 5);
              camera.lookAt(0, 0, 0);
              controls.target.set(0, 0, 0);
            },
            (progress) => {
              console.log(
                `Loading model: ${(progress.loaded / progress.total) * 100}%`
              );
            },
            (error) => {
              console.error("Error loading model:", error);
              createFallbackFlower();
            }
          );
        } else {
          createFallbackFlower();
        }

        function createFallbackFlower() {
          // Create a beautiful 3D flower as fallback
          const flowerGroup = new THREE.Group();

          // Flower center
          const centerGeometry = new THREE.SphereGeometry(0.2, 16, 16);
          const centerMaterial = new THREE.MeshPhongMaterial({
            color: 0xffd700,
            shininess: 100,
          });
          const center = new THREE.Mesh(centerGeometry, centerMaterial);
          flowerGroup.add(center);

          // Petals
          const petalCount = 8;
          const petalGeometry = new THREE.ConeGeometry(0.5, 1.5, 8);
          const petalMaterial = new THREE.MeshPhongMaterial({
            color: country.color,
            shininess: 80,
            transparent: true,
            opacity: 0.9,
          });

          for (let i = 0; i < petalCount; i++) {
            const petal = new THREE.Mesh(petalGeometry, petalMaterial);
            const angle = (i / petalCount) * Math.PI * 2;
            petal.position.set(Math.cos(angle) * 0.8, 0, Math.sin(angle) * 0.8);
            petal.rotation.z = angle + Math.PI / 2;
            petal.rotation.x = Math.PI / 4;
            petal.castShadow = true;
            flowerGroup.add(petal);
          }

          // Stem
          const stemGeometry = new THREE.CylinderGeometry(0.05, 0.08, 2, 8);
          const stemMaterial = new THREE.MeshPhongMaterial({ color: 0x228b22 });
          const stem = new THREE.Mesh(stemGeometry, stemMaterial);
          stem.position.y = -1.5;
          stem.castShadow = true;
          flowerGroup.add(stem);

          scene.add(flowerGroup);
          setIsModelLoaded(true);

          camera.position.set(3, 3, 3);
          camera.lookAt(0, 0, 0);
          controls.target.set(0, 0, 0);
        }

        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshLambertMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.8,
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2;
        ground.receiveShadow = true;
        scene.add(ground);

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

  if (!country) return null;

  return (
    <div
      className={`fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 transition-all duration-500 ${
        isVisible
          ? "bg-black/80 backdrop-blur-md"
          : "bg-transparent pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="flower-modal-title"
      aria-describedby="flower-modal-description"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden transition-all duration-700 transform ${
          isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-8"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center transition-all duration-200 z-20 group"
          aria-label="Close flower details dialog"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:rotate-90 transition-transform duration-300" aria-hidden="true" />
        </button>

        <div className="flex flex-col lg:flex-row max-h-[90vh]">
          {/* 3D Model Viewer - Left Side */}
          <div className="lg:w-1/2 relative bg-gradient-to-br from-gray-50 to-gray-100">
            <div
              ref={modelViewerRef}
              className="w-full h-64 sm:h-80 lg:h-[90vh] rounded-lg"
            />

            {!isModelLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                  <div 
                    className="w-16 h-16 rounded-full animate-spin flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${country.color}40, ${country.color}80)`,
                    }}
                  >
                    <Rotate3D className="w-8 h-8 animate-pulse" style={{ color: country.color }} />
                  </div>
                  <p className="text-lg font-medium text-gray-600">
                    Loading...
                  </p>
                </div>
              </div>
            )}

            <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-md rounded-full px-4 py-2">
              <p className="text-xs text-white font-medium">
                Drag to rotate • Scroll to zoom
              </p>
            </div>
          </div>

          {/* Information Panel - Right Side */}
          <div className="lg:w-1/2 p-6 sm:p-8 lg:p-10 overflow-y-auto">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      backgroundColor: `${country.color}15`,
                    }}
                  >
                    <Flower className="w-6 h-6" style={{ color: country.color }} />
                  </div>
                  <div className="flex-1">
                    <h1 id="flower-modal-title" className="text-3xl sm:text-4xl font-bold text-gray-900">
                      {country.flowerName}
                    </h1>
                  </div>
                </div>
                
                <p className="text-lg sm:text-xl italic text-gray-500 font-light">
                  {country.flowerScientificName}
                </p>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" style={{ color: country.color }} />
                  <span className="text-sm font-medium">National flower of {country.country}</span>
                </div>
              </div>

              {/* Divider */}
              <div 
                className="h-px w-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${country.color}40, transparent)`,
                }}
              />

              {/* Description */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                  About
                </h4>
                <p className="text-gray-700 leading-relaxed text-base">
                  {country.flowerDescription}
                </p>
              </div>

              {/* Country Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Capital</p>
                  <p className="text-base font-semibold text-gray-900">{country.capital}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Language</p>
                  <p className="text-base font-semibold text-gray-900">{country.language}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</p>
                  <p className="text-base font-semibold text-gray-900">{country.currency}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Continent</p>
                  <p className="text-base font-semibold text-gray-900">{country.continent}</p>
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

  // Countries data array - India and USA only
  const countriesData = useMemo(() => [
    {
    id: "IN_LOTUS",
    name: "Lotus",
    country: "India",
    countryCode: "IN",
    lat: 20.5937,
      lng: -55.9629, // Your custom globe coordinates
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
    gltfPath: "/lotus.glb",
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
      gltfPath: null, // Will use fallback flower
    },
    {
      id: "RU_CHAMOMILE",
      name: "Chamomile",
      country: "Russia",
      countryCode: "RU",
      lat: 50.0,
      lng: -40.0, // Russia coordinates (moved away from USA)
      capital: "Moscow",
      population: "146 million",
      continent: "Europe/Asia",
      language: "Russian",
      currency: "Russian Ruble (RUB)",
      flowerName: "Chamomile",
      flowerScientificName: "Matricaria chamomilla",
      flowerDescription:
        "The chamomile is Russia's national flower, symbolizing simplicity, purity, and healing. It represents the country's vast natural landscapes and traditional medicine.",
      culturalSignificance:
        "Chamomile has deep roots in Russian culture, often used in traditional medicine and tea. It symbolizes the simple beauty and resilience of the Russian people.",
      botanicalInfo:
        "A small, daisy-like flowering plant with white petals and yellow centers. Known for its medicinal properties and pleasant aroma, it grows wild across Russia's vast territories.",
      color: "#ffffff",
      special: true,
      size: 0.09,
      gltfPath: null, // Will use fallback flower
    },
    {
      id: "CN_PEONY",
      name: "Peony",
      country: "China",
      countryCode: "CN",
      lat: 30.8617,
      lng: -30.1954, // China coordinates (positioned for your custom globe)
      capital: "Beijing",
      population: "1.4 billion",
      continent: "Asia",
      language: "Mandarin Chinese",
      currency: "Chinese Yuan (CNY)",
      flowerName: "Peony",
      flowerScientificName: "Paeonia suffruticosa",
      flowerDescription:
        "The peony is China's national flower, symbolizing prosperity, honor, and wealth. It represents the country's rich cultural heritage and natural beauty.",
      culturalSignificance:
        "Peonies have been revered in Chinese culture for over 1,000 years, often called the 'king of flowers.' They symbolize good fortune, happiness, and honor in Chinese tradition.",
      botanicalInfo:
        "A perennial flowering plant with large, fragrant, colorful blooms. The tree peony is particularly prized for its beauty and has been cultivated in China for centuries.",
      color: "#ff1744",
      special: true,
      size: 0.10,
      gltfPath: null, // Will use fallback flower
    },
    {
      id: "MN_SCABIOSA",
      name: "Scabiosa",
      country: "Mongolia",
      countryCode: "MN",
      lat: 40.0,
      lng: -40.0, // Mongolia coordinates (positioned between Russia and China)
      capital: "Ulaanbaatar",
      population: "3.3 million",
      continent: "Asia",
      language: "Mongolian",
      currency: "Mongolian Tugrik (MNT)",
      flowerName: "Scabiosa",
      flowerScientificName: "Scabiosa comosa",
      flowerDescription:
        "The scabiosa is Mongolia's national flower, symbolizing the country's vast steppes and nomadic heritage. It represents resilience and natural beauty in harsh climates.",
      culturalSignificance:
        "Scabiosa flowers are deeply connected to Mongolian nomadic culture, often found in the country's grasslands and representing the harmony between people and nature.",
      botanicalInfo:
        "A hardy perennial plant with delicate, pincushion-like flowers in shades of blue, purple, and white. It thrives in Mongolia's continental climate and steppe environment.",
      color: "#673ab7",
      special: false,
      size: 0.08,
      gltfPath: null, // Will use fallback flower
    },
    {
      id: "PK_JASMINE",
      name: "Jasmine",
      country: "Pakistan",
      countryCode: "PK",
      lat: 28.0,
      lng: -65.0, // Pakistan coordinates (positioned near India)
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
      gltfPath: null, // Will use fallback flower
    },
    {
      id: "BD_WATER_LILY",
      name: "Water Lily",
      country: "Bangladesh",
      countryCode: "BD",
      lat: 20.0,
      lng: -40.0, // Bangladesh coordinates (positioned near India and Pakistan)
      capital: "Dhaka",
      population: "165 million",
      continent: "Asia",
      language: "Bengali",
      currency: "Bangladeshi Taka (BDT)",
      flowerName: "Water Lily",
      flowerScientificName: "Nymphaea nouchali",
      flowerDescription:
        "The water lily is Bangladesh's national flower, symbolizing purity, beauty, and resilience. It represents the country's aquatic landscapes and natural heritage.",
      culturalSignificance:
        "Water lilies are deeply embedded in Bangladeshi culture, often found in the country's rivers and wetlands. They symbolize the connection between people and water in this riverine nation.",
      botanicalInfo:
        "An aquatic perennial plant with large, floating leaves and beautiful white or pink flowers. It thrives in Bangladesh's numerous rivers, ponds, and wetlands.",
      color: "#2196f3",
      special: false,
      size: 0.08,
      gltfPath: null, // Will use fallback flower
    },
    {
      id: "MM_PADAUK",
      name: "Padauk",
      country: "Myanmar",
      countryCode: "MM",
      lat: 18.0,
      lng: -35.0, // Myanmar coordinates (positioned near other South Asian countries)
      capital: "Naypyidaw",
      population: "54 million",
      continent: "Asia",
      language: "Burmese",
      currency: "Myanmar Kyat (MMK)",
      flowerName: "Padauk",
      flowerScientificName: "Pterocarpus indicus",
      flowerDescription:
        "The padauk is Myanmar's national flower, symbolizing strength, resilience, and beauty. It represents the country's rich natural heritage and cultural identity.",
      culturalSignificance:
        "Padauk flowers are deeply cherished in Myanmar culture, often associated with traditional festivals and ceremonies. They symbolize the strength and resilience of the Myanmar people.",
      botanicalInfo:
        "A large deciduous tree with bright golden-yellow flowers that bloom in spring. The padauk is known for its beautiful wood and fragrant flowers, making it highly valued in Myanmar.",
      color: "#ff9800",
      special: false,
      size: 0.06,
      gltfPath: null, // Will use fallback flower
    },
    {
      id: "TH_RATCHAPHRUEK",
      name: "Ratchaphruek",
      country: "Thailand",
      countryCode: "TH",
      lat: 12.0,
      lng: -30.0, // Thailand coordinates (positioned near Myanmar and Bangladesh)
      capital: "Bangkok",
      population: "70 million",
      continent: "Asia",
      language: "Thai",
      currency: "Thai Baht (THB)",
      flowerName: "Ratchaphruek",
      flowerScientificName: "Cassia fistula",
      flowerDescription:
        "The ratchaphruek is Thailand's national flower, symbolizing unity, harmony, and the Thai people. It represents the country's royal heritage and natural beauty.",
      culturalSignificance:
        "Ratchaphruek flowers are deeply revered in Thai culture, often associated with the monarchy and Buddhist traditions. They symbolize the unity and harmony of the Thai people.",
      botanicalInfo:
        "A medium-sized tree with bright yellow flowers that hang in long clusters. The ratchaphruek is known for its beautiful golden blooms and is widely planted throughout Thailand.",
      color: "#ffeb3b",
      special: true,
      size: 0.07,
      gltfPath: null, // Will use fallback flower
    },
    {
      id: "LA_FRANGIPANI",
      name: "Frangipani",
      country: "Laos",
      countryCode: "LA",
      lat: 10.0,
      lng: -25.0, // Laos coordinates (positioned near Thailand and Myanmar)
      capital: "Vientiane",
      population: "7.4 million",
      continent: "Asia",
      language: "Lao",
      currency: "Lao Kip (LAK)",
      flowerName: "Frangipani",
      flowerScientificName: "Plumeria alba",
      flowerDescription:
        "The frangipani is Laos' national flower, symbolizing beauty, grace, and spiritual enlightenment. It represents the country's Buddhist heritage and natural elegance.",
      culturalSignificance:
        "Frangipani flowers are deeply cherished in Lao culture, often used in Buddhist ceremonies and temple decorations. They symbolize spiritual purity and the beauty of life.",
      botanicalInfo:
        "A tropical tree with fragrant, waxy flowers in white, pink, or yellow. The frangipani is known for its sweet fragrance and is commonly found in temples and gardens throughout Laos.",
      color: "#e91e63",
      special: false,
      size: 0.06,
      gltfPath: null, // Will use fallback flower
    },
    {
      id: "KH_RUMDUL",
      name: "Rumdul",
      country: "Cambodia",
      countryCode: "KH",
      lat: 8.0,
      lng: -25.0, // Cambodia coordinates (positioned near Laos and Thailand)
      capital: "Phnom Penh",
      population: "17 million",
      continent: "Asia",
      language: "Khmer",
      currency: "Cambodian Riel (KHR)",
      flowerName: "Rumdul",
      flowerScientificName: "Mitrella mesnyi",
      flowerDescription:
        "The rumdul is Cambodia's national flower, symbolizing beauty, elegance, and the Khmer people. It represents the country's rich cultural heritage and natural beauty.",
      culturalSignificance:
        "Rumdul flowers are deeply cherished in Cambodian culture, often associated with traditional dances and ceremonies. They symbolize the grace and beauty of the Khmer people.",
      botanicalInfo:
        "A small tree with fragrant, white or cream-colored flowers that bloom in clusters. The rumdul is known for its sweet, intoxicating fragrance and is commonly found in Cambodian gardens.",
      color: "#9c27b0",
      special: false,
      size: 0.03,
      gltfPath: null, // Will use fallback flower
    },
    {
      id: "VN_LOTUS",
      name: "Lotus",
      country: "Vietnam",
      countryCode: "VN",
      lat: 6.0,
      lng: -22.0, // Vietnam coordinates (positioned near Cambodia, Laos, and Thailand)
      capital: "Hanoi",
      population: "98 million",
      continent: "Asia",
      language: "Vietnamese",
      currency: "Vietnamese Dong (VND)",
      flowerName: "Lotus",
      flowerScientificName: "Nelumbo nucifera",
      flowerDescription:
        "The lotus is Vietnam's national flower, symbolizing purity, enlightenment, and resilience. It represents the country's cultural heritage and the strength of the Vietnamese people.",
      culturalSignificance:
        "Lotus flowers are deeply revered in Vietnamese culture, often associated with Buddhism and traditional values. They symbolize purity, beauty, and the ability to rise above adversity.",
      botanicalInfo:
        "An aquatic perennial plant with large, fragrant pink or white flowers. The lotus is known for its ability to grow in muddy waters and bloom beautifully, representing resilience and purity.",
      color: "#00bcd4",
      special: true,
      size: 0.08,
      gltfPath: null, // Will use fallback flower
    },
    // African Countries - All with Rose flowers
    {
      id: "DZ_ROSE",
      name: "Rose",
      country: "Algeria",
      countryCode: "DZ",
      lat: 28.0,
      lng: 3.0,
      capital: "Algiers",
      population: "44 million",
      continent: "Africa",
      language: "Arabic, French",
      currency: "Algerian Dinar (DZD)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Algeria, symbolizing the country's natural heritage and cultural richness.",
      culturalSignificance: "Roses are cherished in Algerian culture, often used in gardens and celebrations.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.07,
      gltfPath: null,
    },
    {
      id: "AO_ROSE",
      name: "Rose",
      country: "Angola",
      countryCode: "AO",
      lat: -8.82,
      lng: 13.32,
      capital: "Luanda",
      population: "33 million",
      continent: "Africa",
      language: "Portuguese",
      currency: "Angolan Kwanza (AOA)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Angola, symbolizing the country's natural heritage.",
      culturalSignificance: "Roses are cherished in Angolan culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.07,
      gltfPath: null,
    },
    {
      id: "BJ_ROSE",
      name: "Rose",
      country: "Benin",
      countryCode: "BJ",
      lat: 6.48,
      lng: 2.6,
      capital: "Porto-Novo",
      population: "13 million",
      continent: "Africa",
      language: "French",
      currency: "West African CFA Franc (XOF)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Benin.",
      culturalSignificance: "Roses are cherished in Beninese culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.06,
      gltfPath: null,
    },
    {
      id: "BW_ROSE",
      name: "Rose",
      country: "Botswana",
      countryCode: "BW",
      lat: -22.0,
      lng: 24.0,
      capital: "Gaborone",
      population: "2.4 million",
      continent: "Africa",
      language: "English, Setswana",
      currency: "Botswana Pula (BWP)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Botswana.",
      culturalSignificance: "Roses are cherished in Botswanan culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.06,
      gltfPath: null,
    },
    {
      id: "BF_ROSE",
      name: "Rose",
      country: "Burkina Faso",
      countryCode: "BF",
      lat: 12.32,
      lng: -1.67,
      capital: "Ouagadougou",
      population: "22 million",
      continent: "Africa",
      language: "French",
      currency: "West African CFA Franc (XOF)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Burkina Faso.",
      culturalSignificance: "Roses are cherished in Burkinabe culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.06,
      gltfPath: null,
    },
    {
      id: "BI_ROSE",
      name: "Rose",
      country: "Burundi",
      countryCode: "BI",
      lat: -3.5,
      lng: 30.0,
      capital: "Gitega",
      population: "12 million",
      continent: "Africa",
      language: "Kirundi, French",
      currency: "Burundian Franc (BIF)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Burundi.",
      culturalSignificance: "Roses are cherished in Burundian culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.06,
      gltfPath: null,
    },
    {
      id: "CV_ROSE",
      name: "Rose",
      country: "Cape Verde",
      countryCode: "CV",
      lat: 15.11,
      lng: -23.62,
      capital: "Praia",
      population: "560,000",
      continent: "Africa",
      language: "Portuguese",
      currency: "Cape Verdean Escudo (CVE)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Cape Verde.",
      culturalSignificance: "Roses are cherished in Cape Verdean culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.05,
      gltfPath: null,
    },
    {
      id: "CM_ROSE",
      name: "Rose",
      country: "Cameroon",
      countryCode: "CM",
      lat: 3.87,
      lng: 11.52,
      capital: "Yaoundé",
      population: "27 million",
      continent: "Africa",
      language: "French, English",
      currency: "Central African CFA Franc (XAF)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Cameroon.",
      culturalSignificance: "Roses are cherished in Cameroonian culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.07,
      gltfPath: null,
    },
    {
      id: "CF_ROSE",
      name: "Rose",
      country: "Central African Republic",
      countryCode: "CF",
      lat: 4.22,
      lng: 18.35,
      capital: "Bangui",
      population: "5 million",
      continent: "Africa",
      language: "French, Sango",
      currency: "Central African CFA Franc (XAF)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Central African Republic.",
      culturalSignificance: "Roses are cherished in Central African culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.06,
      gltfPath: null,
    },
    {
      id: "TD_ROSE",
      name: "Rose",
      country: "Chad",
      countryCode: "TD",
      lat: 12.09,
      lng: 16.03,
      capital: "N'Djamena",
      population: "17 million",
      continent: "Africa",
      language: "French, Arabic",
      currency: "Central African CFA Franc (XAF)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Chad.",
      culturalSignificance: "Roses are cherished in Chadian culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.06,
      gltfPath: null,
    },
    {
      id: "KM_ROSE",
      name: "Rose",
      country: "Comoros",
      countryCode: "KM",
      lat: -12.17,
      lng: 44.25,
      capital: "Moroni",
      population: "900,000",
      continent: "Africa",
      language: "Comorian, French, Arabic",
      currency: "Comorian Franc (KMF)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Comoros.",
      culturalSignificance: "Roses are cherished in Comorian culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.05,
      gltfPath: null,
    },
    {
      id: "CD_ROSE",
      name: "Rose",
      country: "Democratic Republic of the Congo",
      countryCode: "CD",
      lat: -2.88,
      lng: 23.66,
      capital: "Kinshasa",
      population: "95 million",
      continent: "Africa",
      language: "French",
      currency: "Congolese Franc (CDF)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in DR Congo.",
      culturalSignificance: "Roses are cherished in Congolese culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: true,
      size: 0.08,
      gltfPath: null,
    },
    {
      id: "CG_ROSE",
      name: "Rose",
      country: "Republic of the Congo",
      countryCode: "CG",
      lat: -0.23,
      lng: 15.83,
      capital: "Brazzaville",
      population: "5.8 million",
      continent: "Africa",
      language: "French",
      currency: "Central African CFA Franc (XAF)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Republic of the Congo.",
      culturalSignificance: "Roses are cherished in Congolese culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.06,
      gltfPath: null,
    },
    {
      id: "CI_ROSE",
      name: "Rose",
      country: "Côte d'Ivoire",
      countryCode: "CI",
      lat: 7.54,
      lng: -5.55,
      capital: "Yamoussoukro",
      population: "28 million",
      continent: "Africa",
      language: "French",
      currency: "West African CFA Franc (XOF)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Côte d'Ivoire.",
      culturalSignificance: "Roses are cherished in Ivorian culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.07,
      gltfPath: null,
    },
    {
      id: "DJ_ROSE",
      name: "Rose",
      country: "Djibouti",
      countryCode: "DJ",
      lat: 11.58,
      lng: 43.17,
      capital: "Djibouti",
      population: "1 million",
      continent: "Africa",
      language: "French, Arabic",
      currency: "Djiboutian Franc (DJF)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Djibouti.",
      culturalSignificance: "Roses are cherished in Djiboutian culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.05,
      gltfPath: null,
    },
    {
      id: "EG_ROSE",
      name: "Rose",
      country: "Egypt",
      countryCode: "EG",
      lat: 26.0,
      lng: 30.0,
      capital: "Cairo",
      population: "109 million",
      continent: "Africa",
      language: "Arabic",
      currency: "Egyptian Pound (EGP)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Egypt.",
      culturalSignificance: "Roses are cherished in Egyptian culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: true,
      size: 0.08,
      gltfPath: null,
    },
    {
      id: "GQ_ROSE",
      name: "Rose",
      country: "Equatorial Guinea",
      countryCode: "GQ",
      lat: 1.65,
      lng: 10.27,
      capital: "Malabo",
      population: "1.5 million",
      continent: "Africa",
      language: "Spanish, French, Portuguese",
      currency: "Central African CFA Franc (XAF)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Equatorial Guinea.",
      culturalSignificance: "Roses are cherished in Equatorial Guinean culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.05,
      gltfPath: null,
    },
    {
      id: "ER_ROSE",
      name: "Rose",
      country: "Eritrea",
      countryCode: "ER",
      lat: 15.32,
      lng: 38.92,
      capital: "Asmara",
      population: "6 million",
      continent: "Africa",
      language: "Tigrinya, Arabic, English",
      currency: "Eritrean Nakfa (ERN)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Eritrea.",
      culturalSignificance: "Roses are cherished in Eritrean culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.06,
      gltfPath: null,
    },
    {
      id: "SZ_ROSE",
      name: "Rose",
      country: "Eswatini",
      countryCode: "SZ",
      lat: -26.32,
      lng: 31.12,
      capital: "Mbabane",
      population: "1.2 million",
      continent: "Africa",
      language: "Swati, English",
      currency: "Swazi Lilangeni (SZL)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Eswatini.",
      culturalSignificance: "Roses are cherished in Swazi culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.05,
      gltfPath: null,
    },
    {
      id: "ET_ROSE",
      name: "Rose",
      country: "Ethiopia",
      countryCode: "ET",
      lat: 9.01,
      lng: 38.75,
      capital: "Addis Ababa",
      population: "120 million",
      continent: "Africa",
      language: "Amharic",
      currency: "Ethiopian Birr (ETB)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Ethiopia.",
      culturalSignificance: "Roses are cherished in Ethiopian culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: true,
      size: 0.08,
      gltfPath: null,
    },
    {
      id: "GA_ROSE",
      name: "Rose",
      country: "Gabon",
      countryCode: "GA",
      lat: -0.81,
      lng: 11.61,
      capital: "Libreville",
      population: "2.3 million",
      continent: "Africa",
      language: "French",
      currency: "Central African CFA Franc (XAF)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Gabon.",
      culturalSignificance: "Roses are cherished in Gabonese culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.06,
      gltfPath: null,
    },
    {
      id: "GM_ROSE",
      name: "Rose",
      country: "Gambia",
      countryCode: "GM",
      lat: 13.47,
      lng: -16.6,
      capital: "Banjul",
      population: "2.5 million",
      continent: "Africa",
      language: "English",
      currency: "Gambian Dalasi (GMD)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Gambia.",
      culturalSignificance: "Roses are cherished in Gambian culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.05,
      gltfPath: null,
    },
    {
      id: "GH_ROSE",
      name: "Rose",
      country: "Ghana",
      countryCode: "GH",
      lat: 5.55,
      lng: -0.2,
      capital: "Accra",
      population: "32 million",
      continent: "Africa",
      language: "English",
      currency: "Ghanaian Cedi (GHS)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Ghana.",
      culturalSignificance: "Roses are cherished in Ghanaian culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.07,
      gltfPath: null,
    },
    {
      id: "GN_ROSE",
      name: "Rose",
      country: "Guinea",
      countryCode: "GN",
      lat: 9.52,
      lng: -13.7,
      capital: "Conakry",
      population: "13 million",
      continent: "Africa",
      language: "French",
      currency: "Guinean Franc (GNF)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Guinea.",
      culturalSignificance: "Roses are cherished in Guinean culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.06,
      gltfPath: null,
    },
    {
      id: "GW_ROSE",
      name: "Rose",
      country: "Guinea-Bissau",
      countryCode: "GW",
      lat: 12.0,
      lng: -15.0,
      capital: "Bissau",
      population: "2 million",
      continent: "Africa",
      language: "Portuguese",
      currency: "West African CFA Franc (XOF)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Guinea-Bissau.",
      culturalSignificance: "Roses are cherished in Bissau-Guinean culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.05,
      gltfPath: null,
    },
    {
      id: "KE_ROSE",
      name: "Rose",
      country: "Kenya",
      countryCode: "KE",
      lat: -1.27,
      lng: 36.8,
      capital: "Nairobi",
      population: "55 million",
      continent: "Africa",
      language: "Swahili, English",
      currency: "Kenyan Shilling (KES)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Kenya.",
      culturalSignificance: "Roses are cherished in Kenyan culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: true,
      size: 0.08,
      gltfPath: null,
    },
    {
      id: "LS_ROSE",
      name: "Rose",
      country: "Lesotho",
      countryCode: "LS",
      lat: -29.0,
      lng: 28.0,
      capital: "Maseru",
      population: "2.2 million",
      continent: "Africa",
      language: "Sesotho, English",
      currency: "Lesotho Loti (LSL)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Lesotho.",
      culturalSignificance: "Roses are cherished in Basotho culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.05,
      gltfPath: null,
    },
    {
      id: "LR_ROSE",
      name: "Rose",
      country: "Liberia",
      countryCode: "LR",
      lat: 6.32,
      lng: -10.8,
      capital: "Monrovia",
      population: "5.2 million",
      continent: "Africa",
      language: "English",
      currency: "Liberian Dollar (LRD)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Liberia.",
      culturalSignificance: "Roses are cherished in Liberian culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.06,
      gltfPath: null,
    },
    {
      id: "LY_ROSE",
      name: "Rose",
      country: "Libya",
      countryCode: "LY",
      lat: 27.0,
      lng: 17.0,
      capital: "Tripoli",
      population: "7 million",
      continent: "Africa",
      language: "Arabic",
      currency: "Libyan Dinar (LYD)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Libya.",
      culturalSignificance: "Roses are cherished in Libyan culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.06,
      gltfPath: null,
    },
    {
      id: "MG_ROSE",
      name: "Rose",
      country: "Madagascar",
      countryCode: "MG",
      lat: -20.0,
      lng: 47.0,
      capital: "Antananarivo",
      population: "29 million",
      continent: "Africa",
      language: "Malagasy, French",
      currency: "Malagasy Ariary (MGA)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Madagascar.",
      culturalSignificance: "Roses are cherished in Malagasy culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: true,
      size: 0.08,
      gltfPath: null,
    },
    {
      id: "MW_ROSE",
      name: "Rose",
      country: "Malawi",
      countryCode: "MW",
      lat: -13.94,
      lng: 33.7,
      capital: "Lilongwe",
      population: "20 million",
      continent: "Africa",
      language: "English, Chichewa",
      currency: "Malawian Kwacha (MWK)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Malawi.",
      culturalSignificance: "Roses are cherished in Malawian culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.07,
      gltfPath: null,
    },
    {
      id: "ML_ROSE",
      name: "Rose",
      country: "Mali",
      countryCode: "ML",
      lat: 12.65,
      lng: -8.0,
      capital: "Bamako",
      population: "21 million",
      continent: "Africa",
      language: "French",
      currency: "West African CFA Franc (XOF)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Mali.",
      culturalSignificance: "Roses are cherished in Malian culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.07,
      gltfPath: null,
    },
    {
      id: "MR_ROSE",
      name: "Rose",
      country: "Mauritania",
      countryCode: "MR",
      lat: 18.15,
      lng: -15.97,
      capital: "Nouakchott",
      population: "4.8 million",
      continent: "Africa",
      language: "Arabic, French",
      currency: "Mauritanian Ouguiya (MRU)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Mauritania.",
      culturalSignificance: "Roses are cherished in Mauritanian culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.06,
      gltfPath: null,
    },
    {
      id: "MU_ROSE",
      name: "Rose",
      country: "Mauritius",
      countryCode: "MU",
      lat: -20.1,
      lng: 57.31,
      capital: "Port Louis",
      population: "1.3 million",
      continent: "Africa",
      language: "English, French, Creole",
      currency: "Mauritian Rupee (MUR)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Mauritius.",
      culturalSignificance: "Roses are cherished in Mauritian culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.05,
      gltfPath: null,
    },
    {
      id: "MA_ROSE",
      name: "Rose",
      country: "Morocco",
      countryCode: "MA",
      lat: 32.0,
      lng: -6.0,
      capital: "Rabat",
      population: "37 million",
      continent: "Africa",
      language: "Arabic, Berber",
      currency: "Moroccan Dirham (MAD)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Morocco.",
      culturalSignificance: "Roses are cherished in Moroccan culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: true,
      size: 0.08,
      gltfPath: null,
    },
    {
      id: "MZ_ROSE",
      name: "Rose",
      country: "Mozambique",
      countryCode: "MZ",
      lat: -25.94,
      lng: 32.58,
      capital: "Maputo",
      population: "32 million",
      continent: "Africa",
      language: "Portuguese",
      currency: "Mozambican Metical (MZN)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Mozambique.",
      culturalSignificance: "Roses are cherished in Mozambican culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.07,
      gltfPath: null,
    },
    {
      id: "NA_ROSE",
      name: "Rose",
      country: "Namibia",
      countryCode: "NA",
      lat: -22.57,
      lng: 17.09,
      capital: "Windhoek",
      population: "2.6 million",
      continent: "Africa",
      language: "English",
      currency: "Namibian Dollar (NAD)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Namibia.",
      culturalSignificance: "Roses are cherished in Namibian culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.06,
      gltfPath: null,
    },
    {
      id: "NE_ROSE",
      name: "Rose",
      country: "Niger",
      countryCode: "NE",
      lat: 13.52,
      lng: 2.08,
      capital: "Niamey",
      population: "25 million",
      continent: "Africa",
      language: "French",
      currency: "West African CFA Franc (XOF)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Niger.",
      culturalSignificance: "Roses are cherished in Nigerien culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.07,
      gltfPath: null,
    },
    {
      id: "NG_ROSE",
      name: "Rose",
      country: "Nigeria",
      countryCode: "NG",
      lat: 8.0,
      lng: 10.0,
      capital: "Abuja",
      population: "218 million",
      continent: "Africa",
      language: "English",
      currency: "Nigerian Naira (NGN)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Nigeria.",
      culturalSignificance: "Roses are cherished in Nigerian culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: true,
      size: 0.09,
      gltfPath: null,
    },
    {
      id: "RW_ROSE",
      name: "Rose",
      country: "Rwanda",
      countryCode: "RW",
      lat: -1.94,
      lng: 29.87,
      capital: "Kigali",
      population: "13 million",
      continent: "Africa",
      language: "Kinyarwanda, French, English",
      currency: "Rwandan Franc (RWF)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Rwanda.",
      culturalSignificance: "Roses are cherished in Rwandan culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.06,
      gltfPath: null,
    },
    {
      id: "ST_ROSE",
      name: "Rose",
      country: "São Tomé and Príncipe",
      countryCode: "ST",
      lat: 0.34,
      lng: 6.73,
      capital: "São Tomé",
      population: "220,000",
      continent: "Africa",
      language: "Portuguese",
      currency: "São Tomé and Príncipe Dobra (STN)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in São Tomé and Príncipe.",
      culturalSignificance: "Roses are cherished in São Toméan culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.04,
      gltfPath: null,
    },
    {
      id: "SN_ROSE",
      name: "Rose",
      country: "Senegal",
      countryCode: "SN",
      lat: 14.67,
      lng: -17.42,
      capital: "Dakar",
      population: "17 million",
      continent: "Africa",
      language: "French",
      currency: "West African CFA Franc (XOF)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Senegal.",
      culturalSignificance: "Roses are cherished in Senegalese culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.07,
      gltfPath: null,
    },
    {
      id: "SC_ROSE",
      name: "Rose",
      country: "Seychelles",
      countryCode: "SC",
      lat: -4.37,
      lng: 55.27,
      capital: "Victoria",
      population: "100,000",
      continent: "Africa",
      language: "Seychellois Creole, English, French",
      currency: "Seychellois Rupee (SCR)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Seychelles.",
      culturalSignificance: "Roses are cherished in Seychellois culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.04,
      gltfPath: null,
    },
    {
      id: "SL_ROSE",
      name: "Rose",
      country: "Sierra Leone",
      countryCode: "SL",
      lat: 8.48,
      lng: -13.23,
      capital: "Freetown",
      population: "8.4 million",
      continent: "Africa",
      language: "English",
      currency: "Sierra Leonean Leone (SLL)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Sierra Leone.",
      culturalSignificance: "Roses are cherished in Sierra Leonean culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.06,
      gltfPath: null,
    },
    {
      id: "SO_ROSE",
      name: "Rose",
      country: "Somalia",
      countryCode: "SO",
      lat: 2.02,
      lng: 45.35,
      capital: "Mogadishu",
      population: "17 million",
      continent: "Africa",
      language: "Somali, Arabic",
      currency: "Somali Shilling (SOS)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Somalia.",
      culturalSignificance: "Roses are cherished in Somali culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.07,
      gltfPath: null,
    },
    {
      id: "ZA_ROSE",
      name: "Rose",
      country: "South Africa",
      countryCode: "ZA",
      lat: -30.0,
      lng: 25.0,
      capital: "Cape Town, Pretoria, Bloemfontein",
      population: "60 million",
      continent: "Africa",
      language: "English, Afrikaans, Zulu",
      currency: "South African Rand (ZAR)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in South Africa.",
      culturalSignificance: "Roses are cherished in South African culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: true,
      size: 0.09,
      gltfPath: null,
    },
    {
      id: "SS_ROSE",
      name: "Rose",
      country: "South Sudan",
      countryCode: "SS",
      lat: 6.88,
      lng: 31.31,
      capital: "Juba",
      population: "12 million",
      continent: "Africa",
      language: "English",
      currency: "South Sudanese Pound (SSP)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in South Sudan.",
      culturalSignificance: "Roses are cherished in South Sudanese culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.07,
      gltfPath: null,
    },
    {
      id: "SD_ROSE",
      name: "Rose",
      country: "Sudan",
      countryCode: "SD",
      lat: 15.0,
      lng: 32.0,
      capital: "Khartoum",
      population: "45 million",
      continent: "Africa",
      language: "Arabic, English",
      currency: "Sudanese Pound (SDG)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Sudan.",
      culturalSignificance: "Roses are cherished in Sudanese culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.08,
      gltfPath: null,
    },
    {
      id: "TZ_ROSE",
      name: "Rose",
      country: "Tanzania",
      countryCode: "TZ",
      lat: -6.31,
      lng: 34.85,
      capital: "Dodoma",
      population: "63 million",
      continent: "Africa",
      language: "Swahili, English",
      currency: "Tanzanian Shilling (TZS)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Tanzania.",
      culturalSignificance: "Roses are cherished in Tanzanian culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: true,
      size: 0.08,
      gltfPath: null,
    },
    {
      id: "TG_ROSE",
      name: "Rose",
      country: "Togo",
      countryCode: "TG",
      lat: 6.7,
      lng: 1.13,
      capital: "Lomé",
      population: "8.6 million",
      continent: "Africa",
      language: "French",
      currency: "West African CFA Franc (XOF)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Togo.",
      culturalSignificance: "Roses are cherished in Togolese culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.06,
      gltfPath: null,
    },
    {
      id: "TN_ROSE",
      name: "Rose",
      country: "Tunisia",
      countryCode: "TN",
      lat: 34.0,
      lng: 9.0,
      capital: "Tunis",
      population: "12 million",
      continent: "Africa",
      language: "Arabic, French",
      currency: "Tunisian Dinar (TND)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Tunisia.",
      culturalSignificance: "Roses are cherished in Tunisian culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.07,
      gltfPath: null,
    },
    {
      id: "UG_ROSE",
      name: "Rose",
      country: "Uganda",
      countryCode: "UG",
      lat: 1.07,
      lng: 31.88,
      capital: "Kampala",
      population: "47 million",
      continent: "Africa",
      language: "English, Swahili",
      currency: "Ugandan Shilling (UGX)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Uganda.",
      culturalSignificance: "Roses are cherished in Ugandan culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.08,
      gltfPath: null,
    },
    {
      id: "ZM_ROSE",
      name: "Rose",
      country: "Zambia",
      countryCode: "ZM",
      lat: -15.42,
      lng: 28.28,
      capital: "Lusaka",
      population: "19 million",
      continent: "Africa",
      language: "English",
      currency: "Zambian Kwacha (ZMW)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Zambia.",
      culturalSignificance: "Roses are cherished in Zambian culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.07,
      gltfPath: null,
    },
    {
      id: "ZW_ROSE",
      name: "Rose",
      country: "Zimbabwe",
      countryCode: "ZW",
      lat: -17.83,
      lng: 31.05,
      capital: "Harare",
      population: "15 million",
      continent: "Africa",
      language: "English, Shona, Ndebele",
      currency: "Zimbabwean Dollar (ZWL)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription: "The rose represents beauty and love in Zimbabwe.",
      culturalSignificance: "Roses are cherished in Zimbabwean culture.",
      botanicalInfo: "A woody perennial flowering plant with fragrant, colorful blooms.",
      color: "#ff69b4",
      special: false,
      size: 0.07,
      gltfPath: null,
    }
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
            console.log(`Ball distance from origin: ${Math.sqrt(coords.x*coords.x + coords.y*coords.y + coords.z*coords.z)}`);
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
          const intersects = raycaster.intersectObjects(intersectableObjects);

          if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            const countryData = clickedObject.userData.data;

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
                className={`w-full h-full cursor-grab active:cursor-grabbing relative transition-opacity duration-1000 z-10 ${
                  isGlobeLoaded ? "opacity-100" : "opacity-0"
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
            className={`w-full h-full relative transition-opacity duration-1000 z-10 ${
              isGlobeLoaded ? "opacity-100" : "opacity-0"
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

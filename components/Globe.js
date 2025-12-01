"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { X, MapPin, Flower, Info, Rotate3D, Target, Maximize2, Minimize2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GlobeLoader from "./GlobeLoader";

// Flower Detail Modal Component
function FlowerDetailModal({ country, isVisible, onClose }) {
  const modelViewerRef = useRef();
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    if (!isVisible || !country) return;

    // Load Three.js and create 3D viewer
    const loadModel = async () => {
      try {

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
  const normalCameraPosition = useRef({ x: 0, y: 0, z: 8 });

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
          
           // Mobile-friendly distance limits (expanded to support fullscreen)
           const minDistance = isMobile ? 3 : isTablet ? 2.5 : 3;
           const maxDistance = isMobile ? 20 : isTablet ? 19 : 22;
          
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
        
         // Mobile-friendly zoom limits (set high enough to support fullscreen mode)
         if (isMobile) {
           controls.minDistance = 3;
           controls.maxDistance = 25; // High enough for fullscreen
           controls.autoRotateSpeed = 0.3; // Slower rotation for mobile
         } else if (isTablet) {
           controls.minDistance = 2.5;
           controls.maxDistance = 24; // High enough for fullscreen
           controls.autoRotateSpeed = 0.4;
         } else {
           controls.minDistance = 3;
           controls.maxDistance = 28; // High enough for fullscreen
         }
        
        // Mobile touch settings - disable zoom/dolly
        controls.touches = {
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.ROTATE // Changed from DOLLY_PAN to ROTATE to prevent zoom
        };

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
          // Prevent any zoom or control changes from click
          event.preventDefault();
          event.stopPropagation();
          
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
              
              // Ensure zoom stays disabled
              controls.enableZoom = false;
              controls.enableDolly = false;

              // Show modal
              setSelectedCountry(countryData);
              setIsModalVisible(true);
              console.log(`🌸 Opening ${countryData.flowerName} dialog for ${countryData.country}`);
            }
          }
        };

        // Add click listener
        renderer.domElement.addEventListener("click", handleClick);

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
  
  // Handle fullscreen transitions
  useEffect(() => {
    if (!rendererRef.current || !cameraRef.current || !sceneRef.current) return;
    
    const handleFullscreenChange = () => {
      const targetContainer = isFullscreen ? fullscreenContainerRef.current : containerRef.current;
      if (!targetContainer) return;
      
      // Move canvas to correct container
      if (!targetContainer.contains(rendererRef.current.domElement)) {
        // Save current camera position when entering fullscreen
        if (isFullscreen) {
          normalCameraPosition.current = {
            x: cameraRef.current.position.x,
            y: cameraRef.current.position.y,
            z: cameraRef.current.position.z
          };
        }
        
        targetContainer.appendChild(rendererRef.current.domElement);
        
        // Update renderer size
        const width = isFullscreen ? window.innerWidth : targetContainer.clientWidth;
        const height = isFullscreen ? window.innerHeight : targetContainer.clientHeight;
        rendererRef.current.setSize(width, height);
        
        // Update camera
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        
        // Adjust camera distance
        if (isFullscreen) {
          cameraRef.current.position.set(0, 0, 18);
        } else {
          cameraRef.current.position.set(
            normalCameraPosition.current.x,
            normalCameraPosition.current.y,
            normalCameraPosition.current.z
          );
        }
        
        // Render immediately
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    handleFullscreenChange();
    
    // ESC key handler
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);

    // Simple fullscreen handler - just show/hide overlay with cloned canvas view
    useEffect(() => {
      const handleEsc = (e) => {
        if (e.key === 'Escape' && isFullscreen) {
          setIsFullscreen(false);
        }
      };
      window.addEventListener('keydown', handleEsc);

      // Manage body scroll
      if (isFullscreen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    
      return () => {
        window.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = '';
      };
    }, [isFullscreen]);

  return (
    <>
      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[99999] bg-black">
          {/* Background */}
          {showBackground && (
            <div className="absolute inset-0">
              <Image
                src="/bg_image.png"
                alt="Galactic Garden Background"
                fill
                priority
                quality={90}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          )}
          
          {/* Close Button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-50"
            aria-label="Exit fullscreen"
          >
            <Minimize2 className="w-7 h-7 text-white" />
          </button>
          
          {/* Globe Container */}
          <div 
            ref={fullscreenContainerRef}
            className="absolute inset-0"
            style={{ cursor: 'grab' }}
          />
        </div>
      )}
      
      {/* Normal View */}
      <div 
        className="w-full h-full flex items-center justify-center relative group"
        style={{
          minHeight: '100%',
          minWidth: '100%',
        }}
        role="main"
        aria-label="Interactive 3D Globe of Sacred Flowers"
      >
        {/* Expand Button */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-50 opacity-0 group-hover:opacity-100"
          aria-label="Enter fullscreen"
        >
          <Maximize2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>

        {/* Background Image */}
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
          
          {/* Oval Border Frame */}
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
            className={`w-full h-full cursor-pointer relative transition-opacity duration-1000 z-10 ${
              isGlobeLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={showOvalBorder ? {
              clipPath: 'ellipse(85% 90% at 50% 50%)',
            } : {}}
            role="img"
            aria-label="Interactive 3D globe showing national flowers from different countries. Click on colored spheres to learn about each country's sacred flower."
            tabIndex={0}
            onClick={(e) => {
              // Only toggle fullscreen if clicking on the canvas itself (not caught by flower click)
              if (e.target === e.currentTarget || e.target.tagName === 'CANVAS') {
                toggleFullscreen();
              }
            }}
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

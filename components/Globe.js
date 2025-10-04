"use client";
import { useEffect, useRef, useState } from "react";
import { X, MapPin, Flower, Info, Rotate3D, Target } from "lucide-react";
import Link from "next/link";

// Flower Detail Modal Component
function FlowerDetailModal({ country, isVisible, onClose }) {
  const modelViewerRef = useRef();
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    if (!isVisible || !country) return;

    // Load Three.js and create 3D viewer
    const loadModel = async () => {
      try {
        const THREE = await import("three");
        const { GLTFLoader } = await import(
          "three/examples/jsm/loaders/GLTFLoader.js"
        );
        const { OrbitControls } = await import(
          "three/examples/jsm/controls/OrbitControls.js"
        );

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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible
          ? "bg-black/70 backdrop-blur-sm"
          : "bg-transparent pointer-events-none"
      }`}
    >
      <div
        className={`bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden border border-white/20 transition-all duration-500 transform ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-10"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          <div className="flex items-center space-x-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${country.color}20, ${country.color}40)`,
                border: `2px solid ${country.color}`,
              }}
            >
              <Flower className="w-8 h-8" style={{ color: country.color }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">
                {country.flowerName}
              </h1>
              <p className="text-lg italic text-gray-600 mb-1">
                {country.flowerScientificName}
              </p>
              <p className="text-sm text-gray-500 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                National flower of {country.country}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row h-[calc(95vh-120px)]">
          {/* 3D Model Viewer */}
          <div className="lg:w-1/2 relative bg-gradient-to-br from-slate-50 to-blue-50">
            <div
              ref={modelViewerRef}
              className="w-full h-64 lg:h-full rounded-lg"
            />

            {!isModelLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full animate-spin flex items-center justify-center mx-auto mb-4">
                    <Rotate3D className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <p className="text-lg font-medium text-gray-600">
                    Loading 3D Model...
                  </p>
                </div>
              </div>
            )}

            <div className="absolute bottom-4 left-4 bg-black/20 backdrop-blur-sm rounded-lg p-2">
              <p className="text-xs text-white">
                Click and drag to rotate • Scroll to zoom
              </p>
            </div>
          </div>

          {/* Information Panel */}
          <div className="lg:w-1/2 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Country Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-1 text-sm">
                    Country
                  </h4>
                  <p className="text-lg font-bold text-blue-600">
                    {country.country}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-1 text-sm">
                    Population
                  </h4>
                  <p className="text-lg font-bold text-green-600">
                    {country.population}
                  </p>
                </div>
              </div>

              {/* Flower Information */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-5 rounded-xl border border-pink-200/50">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Flower
                      className="w-4 h-4 mr-2"
                      style={{ color: country.color }}
                    />
                    Description
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {country.flowerDescription}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Cultural Significance
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {country.culturalSignificance}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Botanical Information
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {country.botanicalInfo}
                  </p>
                </div>
              </div>

              {/* Additional Country Details */}
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-600">Capital:</span>
                  <span className="text-gray-800">{country.capital}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-600">Language:</span>
                  <span className="text-gray-800">{country.language}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-600">Currency:</span>
                  <span className="text-gray-800">{country.currency}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-600">Continent:</span>
                  <span className="text-gray-800">{country.continent}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GlobeComponent() {
  const containerRef = useRef();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isGlobeLoaded, setIsGlobeLoaded] = useState(false);
  const controlsRef = useRef(); // Add this line to store controls reference

  // Countries data array - India and USA only
  const countriesData = [
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
  ];

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

    const loadGlobe = async () => {
      try {
        const THREE = await import("three");
        const { GLTFLoader } = await import(
          "three/examples/jsm/loaders/GLTFLoader.js"
        );
        const { OrbitControls } = await import(
          "three/examples/jsm/controls/OrbitControls.js"
        );

        // Clear container
        containerRef.current.innerHTML = "";

        // Create scene
        const scene = new THREE.Scene();
        scene.background = null; // Make background transparent so CSS background shows
        console.log("✅ Scene created");

        // Create camera
        const camera = new THREE.PerspectiveCamera(
          75,
          containerRef.current.clientWidth / containerRef.current.clientHeight,
          0.1,
          1000
        );
        camera.position.set(0, 0, 8);
        console.log("✅ Camera positioned at:", camera.position);

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

            // Add initial scale animation
            globe.scale.setScalar(0.1);
            scene.add(globe);
            console.log("✅ Globe loaded successfully");

            // Animate globe scale
            const scaleAnimation = () => {
              if (globe.scale.x < 4.0) {
                globe.scale.addScalar(0.1);
                requestAnimationFrame(scaleAnimation);
              } else {
                globe.scale.setScalar(4.0);
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

          // Add initial scale animation for fallback
          sphere.scale.setScalar(0.1);
          scene.add(sphere);
          console.log("✅ Fallback globe added to scene");

          // Animate fallback globe scale
          const scaleAnimation = () => {
            if (sphere.scale.x < 4.0) {
              sphere.scale.addScalar(0.1);
              requestAnimationFrame(scaleAnimation);
            } else {
              sphere.scale.setScalar(4.0);
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

          // Main sphere (ball) - this will be clickable
          const sphereGeometry = new THREE.SphereGeometry(
              countryData.size,
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

              // Subtle 3-layer glow effect for better visual balance
              // Inner glow (closest to ball)
              const innerGlowGeometry = new THREE.SphereGeometry(
                countryData.size * 1.3,
            16,
            16
          );
              const innerGlowMaterial = new THREE.MeshBasicMaterial({
                color: countryData.color,
                transparent: true,
                opacity: 0.25,
              });
              const innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
              innerGlow.userData = { data: countryData };
              ballGroup.add(innerGlow);

              // Middle glow
              const middleGlowGeometry = new THREE.SphereGeometry(
                countryData.size * 1.8,
                16,
                16
              );
              const middleGlowMaterial = new THREE.MeshBasicMaterial({
                color: countryData.color,
            transparent: true,
            opacity: 0.15,
          });
              const middleGlow = new THREE.Mesh(middleGlowGeometry, middleGlowMaterial);
              middleGlow.userData = { data: countryData };
              ballGroup.add(middleGlow);

              // Outer glow
              const outerGlowGeometry = new THREE.SphereGeometry(
                countryData.size * 2.4,
                16,
                16
              );
              const outerGlowMaterial = new THREE.MeshBasicMaterial({
                color: countryData.color,
                transparent: true,
                opacity: 0.08,
              });
              const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
              outerGlow.userData = { data: countryData };
              ballGroup.add(outerGlow);

            // Subtle ring effect for special countries
            if (countryData.special) {
              // Single elegant ring
          const ringGeometry = new THREE.RingGeometry(
                countryData.size * 1.6,
                countryData.size * 1.9,
            32
          );
          const ringMaterial = new THREE.MeshBasicMaterial({
                color: countryData.color,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide,
          });
          const ring = new THREE.Mesh(ringGeometry, ringMaterial);
          ring.rotateX(Math.PI / 2);
              ring.userData = { data: countryData };
          ballGroup.add(ring);
            }

            // Position the ball using the helper function
            const coords = calculate3DCoordinates(countryData.lat, countryData.lng);
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

        // Function to scale and reposition satellites based on camera distance (zoom level)
        const scaleSatellitesBasedOnZoom = (camera) => {
          const distance = camera.position.length();
          const minDistance = 3; // Minimum zoom distance
          const maxDistance = 15; // Maximum zoom distance
          
          // Calculate normalized distance (0 = closest, 1 = farthest)
          const normalizedDistance = Math.max(0, Math.min(1, (distance - minDistance) / (maxDistance - minDistance)));
          
          // Calculate base scale factor (closer = smaller satellites)
          // Scale from 0.4x to 1.2x based on distance
          const baseScaleFactor = 0.4 + (normalizedDistance * 0.8); // Range from 0.4 to 1.2
          
          // Calculate dynamic radius (closer zoom = satellites closer to globe)
          // Radius from 4.2 to 4.8 based on distance
          const dynamicRadius = 4.2 + (normalizedDistance * 0.6); // Range from 4.2 to 4.8
          
          // Debug logging (remove in production)
          if (Math.random() < 0.01) { // Only log occasionally to avoid spam
            console.log(`Zoom: ${distance.toFixed(1)}, Base Scale: ${baseScaleFactor.toFixed(2)}, Radius: ${dynamicRadius.toFixed(2)}`);
          }
          
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
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.minDistance = 3;
        controls.maxDistance = 15;

        // Add zoom event listener to immediately scale satellites
        controls.addEventListener('change', () => {
          scaleSatellitesBasedOnZoom(camera);
        });

        // Store controls reference so closeModal can access it
        controlsRef.current = controls;

        // Add click detection using raycasting
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const handleClick = (event) => {
          // Get mouse position
          const rect = containerRef.current.getBoundingClientRect();
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

        // Add hover effect for balls
        let hoveredBall = null;
        
        const handleMouseMove = (event) => {
          const mouse = new THREE.Vector2();
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

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
          
          // Add dynamic pulsing glow animation based on screen position
          const time = Date.now() * 0.001;
          scene.traverse((child) => {
            if (child.userData && child.userData.data && child.material && child.material.transparent) {
              // Only animate glow materials (not the main ball)
              if (child.geometry.type === 'SphereGeometry' && child.material.opacity < 0.6) {
                const ballGroup = child.parent;
                if (ballGroup && ballGroup.userData && ballGroup.userData.data) {
                  const distanceFromCenter = getDistanceFromScreenCenter(ballGroup.position, camera, renderer);
                  
                  // More pulsing for center satellites, less for edge satellites
                  const pulseIntensity = 0.15 * (1 - distanceFromCenter); // 0.15 at center, 0 at edge
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

        // Handle resize
        const handleResize = () => {
          if (!containerRef.current) return;
          const width = containerRef.current.clientWidth;
          const height = containerRef.current.clientHeight;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
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
      }
    };

    loadGlobe();
  }, []);

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
      {/* Main globe container */}
      <div
        ref={containerRef}
        className={`w-full h-full cursor-grab active:cursor-grabbing relative transition-opacity duration-1000 ${
          isGlobeLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Loading Animation */}
      {!isGlobeLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Loading Galactic Garden
            </h2>
            <p className="text-blue-300 text-lg">
              Preparing your cosmic journey...
            </p>
          </div>
        </div>
      )}

      {/* UI Overlay */}

      {/* Instructions */}

      {/* Enhanced Flower Detail Modal */}
      {selectedCountry && (
        <FlowerDetailModal
          country={selectedCountry}
          isVisible={isModalVisible}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

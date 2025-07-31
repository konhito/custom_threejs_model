"use client";
import { useEffect, useRef, useState } from "react";
import { X, MapPin, Flower, Info, Rotate3D } from "lucide-react";

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
        renderer.outputEncoding = THREE.sRGBEncoding;
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
  const globeRef = useRef();
  const containerRef = useRef();
  const [Globe, setGlobe] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Enhanced country data with national flowers
  const countryData = [
    {
      id: "IN_ROSE",
      name: "Rose",
      country: "India",
      countryCode: "IN",
      lat: 20.5937,
      lng: 78.9629,
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
      size: 2.8,
      gltfPath: "/lotus.glb", // Added GLB path for India
    },
    {
      id: "JP_CHERRY",
      name: "Cherry Blossom",
      country: "Japan",
      countryCode: "JP",
      lat: 36.2048,
      lng: 138.2529,
      capital: "Tokyo",
      population: "125 million",
      continent: "Asia",
      language: "Japanese",
      currency: "Japanese Yen (JPY)",
      flowerName: "Cherry Blossom (Sakura)",
      flowerScientificName: "Prunus × yedoensis",
      flowerDescription:
        "Cherry blossoms represent the fleeting nature of life and beauty. These delicate pink and white flowers bloom briefly each spring, creating spectacular displays across Japan.",
      culturalSignificance:
        "Central to Japanese culture, sakura season is celebrated with hanami (flower viewing) festivals. It symbolizes the ephemeral nature of life and renewal.",
      botanicalInfo:
        "Ornamental cherry trees that bloom for only 1-2 weeks in spring. There are over 200 varieties of cherry blossoms in Japan, each with unique characteristics.",
      color: "#ff9ec7",
      special: true,
      size: 2.6,
    },
    {
      id: "BR_IPEYELLOW",
      name: "Golden Trumpet Tree",
      country: "Brazil",
      countryCode: "BR",
      lat: -14.235,
      lng: -51.9253,
      capital: "Brasília",
      population: "215 million",
      continent: "South America",
      language: "Portuguese",
      currency: "Brazilian Real (BRL)",
      flowerName: "Ipê-amarelo (Golden Trumpet Tree)",
      flowerScientificName: "Handroanthus albus",
      flowerDescription:
        "The golden trumpet tree produces brilliant yellow flowers that create stunning displays across Brazil. It blooms during the dry season, bringing vibrant color to the landscape.",
      culturalSignificance:
        "Symbol of Brazilian identity and natural beauty. The tree represents strength, resilience, and the country's rich biodiversity.",
      botanicalInfo:
        "A deciduous tree that can reach 30 meters in height. It blooms abundantly with trumpet-shaped yellow flowers before the leaves appear.",
      color: "#ffd700",
      special: true,
      size: 2.7,
    },
    {
      id: "US_ROSE",
      name: "Rose",
      country: "United States",
      countryCode: "US",
      lat: 39.8283,
      lng: -98.5795,
      capital: "Washington D.C.",
      population: "333 million",
      continent: "North America",
      language: "English",
      currency: "US Dollar (USD)",
      flowerName: "Rose",
      flowerScientificName: "Rosa",
      flowerDescription:
        "The rose is America's national flower, representing love, beauty, and passion. With thousands of varieties, roses have been cultivated for centuries and remain one of the most beloved flowers worldwide.",
      culturalSignificance:
        "Symbol of love and romance in American culture. Different colored roses carry different meanings - red for love, white for purity, yellow for friendship.",
      botanicalInfo:
        "Perennial flowering plants with over 300 species. They feature thorny stems, compound leaves, and fragrant flowers in various colors.",
      color: "#dc143c",
      special: true,
      size: 2.5,
    },
    {
      id: "FR_IRIS",
      name: "Iris",
      country: "France",
      countryCode: "FR",
      lat: 46.6034,
      lng: 1.8883,
      capital: "Paris",
      population: "68 million",
      continent: "Europe",
      language: "French",
      currency: "Euro (EUR)",
      flowerName: "Iris (Fleur-de-lis)",
      flowerScientificName: "Iris pseudacorus",
      flowerDescription:
        "The iris, stylized as the fleur-de-lis, has been a symbol of French royalty for centuries. These elegant flowers feature intricate petals and come in many colors.",
      culturalSignificance:
        "Symbol of French monarchy and national identity. The fleur-de-lis appears on the French coat of arms and represents faith, wisdom, and chivalry.",
      botanicalInfo:
        "Perennial plants with sword-like leaves and showy flowers. They grow from rhizomes and prefer moist, well-drained soil.",
      color: "#4169e1",
      special: true,
      size: 2.4,
    },
  ];

  useEffect(() => {
    const loadGlobe = async () => {
      if (typeof window !== "undefined") {
        try {
          const GlobeGL = (await import("globe.gl")).default;
          setGlobe(() => GlobeGL);
        } catch (error) {
          console.error("Failed to load globe.gl:", error);
        }
      }
    };
    loadGlobe();
  }, []);

  useEffect(() => {
    if (!Globe || !containerRef.current) return;

    let globe;
    let THREE;

    const initializeGlobe = async () => {
      try {
        THREE = await import("three");

        globe = Globe()
          .globeImageUrl("//unpkg.com/three-globe/example/img/earth-day.jpg")
          .bumpImageUrl(
            "//unpkg.com/three-globe/example/img/earth-topology.png"
          )
          .backgroundColor("rgba(0,0,0,0)")
          .width(containerRef.current.clientWidth)
          .height(containerRef.current.clientHeight)
          .showGlobe(true)
          .showAtmosphere(true)
          .atmosphereColor("#4a90e2")
          .atmosphereAltitude(0.25);

        globe(containerRef.current);
        globeRef.current = globe;

        setTimeout(() => {
          const scene = globe.scene();
          const renderer = globe.renderer();
          const camera = globe.camera();

          if (scene && renderer && camera) {
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.antialias = true;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            // Clear existing lights
            const lightsToRemove = [];
            scene.traverse((child) => {
              if (child.isLight) lightsToRemove.push(child);
            });
            lightsToRemove.forEach((light) => scene.remove(light));

            // Enhanced lighting setup
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
            scene.add(ambientLight);

            const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
            mainLight.position.set(2, 2, 2);
            mainLight.castShadow = true;
            scene.add(mainLight);

            const fillLight = new THREE.DirectionalLight(0x74c7ec, 0.6);
            fillLight.position.set(-2, -1, -2);
            scene.add(fillLight);

            const rimLight = new THREE.DirectionalLight(0xff9f7a, 0.4);
            rimLight.position.set(0, 0, -3);
            scene.add(rimLight);

            renderer.toneMappingExposure = 1.2;

            // Add custom click detection using raycasting
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
              const intersects =
                raycaster.intersectObjects(intersectableObjects);

              console.log("Click detected! Intersects:", intersects.length);

              if (intersects.length > 0) {
                const clickedObject = intersects[0].object;
                const countryData = clickedObject.userData.data;

                console.log("Clicked country:", countryData);

                if (countryData) {
                  // Stop auto rotation
                  const controls = globe.controls();
                  if (controls) {
                    controls.autoRotate = false;
                  }

                  // Show modal
                  setSelectedCountry(countryData);
                  setIsModalVisible(true);

                  console.log("Modal should open for:", countryData.country);
                }
              }
            };

            // Add click listener to the renderer's DOM element
            renderer.domElement.addEventListener("click", handleClick);

            // Store cleanup function
            globe._customCleanup = () => {
              renderer.domElement.removeEventListener("click", handleClick);
            };
          }
        }, 100);

        // Smooth controls
        const controls = globe.controls();
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.8;
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.minDistance = 140;
        controls.maxDistance = 800;
        controls.enableDamping = true;
        controls.dampingFactor = 0.03;
        controls.rotateSpeed = 0.5;

        // Create simple 3D balls with proper click handling
        globe
          .objectsData(countryData)
          .objectThreeObject((d) => {
            const group = new THREE.Group();

            // Store data reference for click handling
            group.userData = { data: d };

            // Main sphere (ball) - this will be clickable
            const sphereGeometry = new THREE.SphereGeometry(d.size, 32, 32);
            const sphereMaterial = new THREE.MeshPhongMaterial({
              color: d.color,
              shininess: 120,
              specular: 0x666666,
              transparent: true,
              opacity: 0.9,
            });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

            // Store data directly on the sphere
            sphere.userData = { data: d };
            sphere.castShadow = true;
            sphere.receiveShadow = true;
            group.add(sphere);

            // Outer glow
            const glowGeometry = new THREE.SphereGeometry(d.size * 1.4, 16, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
              color: d.color,
              transparent: true,
              opacity: 0.15,
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.userData = { data: d };
            group.add(glow);

            // Ring effect for special countries
            if (d.special) {
              const ringGeometry = new THREE.RingGeometry(
                d.size * 1.8,
                d.size * 2.2,
                32
              );
              const ringMaterial = new THREE.MeshBasicMaterial({
                color: d.color,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide,
              });
              const ring = new THREE.Mesh(ringGeometry, ringMaterial);
              ring.rotateX(Math.PI / 2);
              ring.userData = { data: d };
              group.add(ring);
            }

            return group;
          })
          .objectAltitude((d) => (d.special ? 0.08 : 0.05))
          .onObjectClick((obj) => {
            console.log("CLICK EVENT TRIGGERED!"); // Debug log
            console.log("Clicked object:", obj); // Debug log

            if (!obj) {
              console.log("No object clicked");
              return;
            }

            // Try to find country data
            let data = null;

            // Check direct userData
            if (obj.userData && obj.userData.data) {
              data = obj.userData.data;
              console.log("Found data on object:", data);
            }
            // Check parent userData
            else if (
              obj.parent &&
              obj.parent.userData &&
              obj.parent.userData.data
            ) {
              data = obj.parent.userData.data;
              console.log("Found data on parent:", data);
            }

            if (data) {
              console.log(
                `Opening dialog for: ${data.country} - ${data.flowerName}`
              );

              // Stop auto rotation
              const controls = globe.controls();
              if (controls) {
                controls.autoRotate = false;
              }

              // Set state to show modal
              setSelectedCountry(data);
              setIsModalVisible(true);

              console.log("Modal should be visible now");
            } else {
              console.log("ERROR: No country data found!");
              console.log("Object structure:", obj);
              console.log("Object userData:", obj.userData);
              if (obj.parent) {
                console.log("Parent userData:", obj.parent.userData);
              }
            }
          })
          .onObjectHover((obj, prevObj) => {
            // Change cursor on hover for better UX
            if (obj) {
              document.body.style.cursor = "pointer";
              console.log(
                "Hovering over:",
                obj.userData?.data?.country || "unknown"
              );
            } else {
              document.body.style.cursor = "default";
            }
          });
      } catch (error) {
        console.error("Error initializing globe:", error);
      }
    };

    const handleResize = () => {
      if (globe && containerRef.current) {
        globe
          .width(containerRef.current.clientWidth)
          .height(containerRef.current.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    initializeGlobe();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && globe) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [Globe]);

  const closeModal = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      setSelectedCountry(null);
      // Reset globe view and restart auto rotation
      if (globeRef.current) {
        const controls = globeRef.current.controls();
        controls.autoRotate = true;
        globeRef.current.pointOfView({ altitude: 3 }, 1000);
      }
    }, 300);
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
      {!Globe ? (
        <div className="flex items-center justify-center h-full">
          <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/10">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 bg-blue-400 rounded-full animate-spin flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-xl font-light text-white">
                Loading Galactic Garden...
              </p>
              <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        />
      )}

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

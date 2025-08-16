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

  // India data for the lotus flower
  const indiaData = {
    id: "IN_LOTUS",
    name: "Lotus",
    country: "India",
    countryCode: "IN",
    lat: 20.5937,
    lng: -55.9629,
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
    size: 0.15, // Decreased from 0.2 to 0.15
    gltfPath: "/lotus.glb",
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const loadGlobe = async () => {
      try {
        const THREE = await import("three");
        const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");

        // Clear container
        containerRef.current.innerHTML = "";

        // Create scene
        const scene = new THREE.Scene();
        scene.background = null; // Make background transparent so CSS background shows

        // Create camera
        const camera = new THREE.PerspectiveCamera(
          75,
          containerRef.current.clientWidth / containerRef.current.clientHeight,
          0.1,
          1000
        );
        camera.position.set(0, 0, 8);

        // Create renderer
        const renderer = new THREE.WebGLRenderer({ 
          antialias: true,
          alpha: true // Enable alpha channel for transparency
        });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setClearColor(0x000000, 0); // Set clear color with 0 alpha (transparent)
        containerRef.current.appendChild(renderer.domElement);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // Load your custom Globe.glb
        const loader = new GLTFLoader();
        
                 loader.load(
           "/Globe.glb",
           (gltf) => {
             const globe = gltf.scene;
             globe.scale.setScalar(3);
             
             // Add initial scale animation
             globe.scale.setScalar(0.1);
             scene.add(globe);
             console.log("✅ Globe loaded successfully");

             // Animate globe scale
             const scaleAnimation = () => {
               if (globe.scale.x < 3) {
                 globe.scale.addScalar(0.1);
                 requestAnimationFrame(scaleAnimation);
               } else {
                 globe.scale.setScalar(3);
                 setIsGlobeLoaded(true);
               }
             };
             scaleAnimation();

             // Now add the small ball above India
             addIndiaBall(scene, camera);
           },
          undefined,
          (error) => {
            console.error("Failed to load Globe.glb:", error);
            createFallbackGlobe();
          }
        );
        
                 // Function to create fallback globe
         function createFallbackGlobe() {
           console.log("🔄 Creating fallback globe");
           // Create fallback sphere
           const geometry = new THREE.SphereGeometry(3, 32, 32);
           const material = new THREE.MeshPhongMaterial({ color: 0x4a90e2 });
           const sphere = new THREE.Mesh(geometry, material);
           
           // Add initial scale animation for fallback
           sphere.scale.setScalar(0.1);
           scene.add(sphere);
           
           // Animate fallback globe scale
           const scaleAnimation = () => {
             if (sphere.scale.x < 3) {
               sphere.scale.addScalar(0.1);
               requestAnimationFrame(scaleAnimation);
             } else {
               sphere.scale.setScalar(3);
               setIsGlobeLoaded(true);
             }
           };
           scaleAnimation();
           
           // Add India ball
           addIndiaBall(scene, camera);
         }

                 // Function to add India ball above the country
         function addIndiaBall(scene, camera) {
           const ballGroup = new THREE.Group();
           
           // Main sphere (ball) - this will be clickable
           const sphereGeometry = new THREE.SphereGeometry(indiaData.size, 32, 32);
           const sphereMaterial = new THREE.MeshPhongMaterial({
             color: indiaData.color,
             shininess: 120,
             specular: 0x666666,
             transparent: true,
             opacity: 0.9,
           });
           const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
           
           // Store country data for click handling
           sphere.userData = { data: indiaData };
           sphere.castShadow = true;
           sphere.receiveShadow = true;
           ballGroup.add(sphere);
           
           // Add initial scale animation for the ball
           ballGroup.scale.setScalar(0);
           scene.add(ballGroup);
           
           // Animate ball appearance with delay
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
           }, 1000); // Delay ball animation until globe is mostly loaded

          // Outer glow
          const glowGeometry = new THREE.SphereGeometry(indiaData.size * 1.4, 16, 16);
          const glowMaterial = new THREE.MeshBasicMaterial({
            color: indiaData.color,
            transparent: true,
            opacity: 0.15,
          });
          const glow = new THREE.Mesh(glowGeometry, glowMaterial);
          glow.userData = { data: indiaData };
          ballGroup.add(glow);

          // Ring effect for special countries
          const ringGeometry = new THREE.RingGeometry(
            indiaData.size * 1.8,
            indiaData.size * 2.2,
            32
          );
          const ringMaterial = new THREE.MeshBasicMaterial({
            color: indiaData.color,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide,
          });
          const ring = new THREE.Mesh(ringGeometry, ringMaterial);
          ring.rotateX(Math.PI / 2);
          ring.userData = { data: indiaData };
          ballGroup.add(ring);

          // Position the ball above India
          const lat = indiaData.lat;
          const lng = indiaData.lng;
          const radius = 3.5; // Closer to the globe surface
          
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lng + 180) * (Math.PI / 180);
          
          const x = -(radius * Math.sin(phi) * Math.cos(theta));
          const y = radius * Math.cos(phi);
          const z = radius * Math.sin(phi) * Math.sin(theta);
          
          ballGroup.position.set(x, y, z);
          ballGroup.userData = { data: indiaData };
          
                     console.log("🌸 India ball added above India");
        }

        // Move controls declaration BEFORE the click handler
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.minDistance = 3;
        controls.maxDistance = 15;
        
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
              console.log("🌸 Opening lotus dialog for India");
            }
          }
        };

        // Add click listener
        renderer.domElement.addEventListener("click", handleClick);

        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);
          controls.update();
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
           isGlobeLoaded ? 'opacity-100' : 'opacity-0'
         }`}
       />
       
       {/* Loading Animation */}
       {!isGlobeLoaded && (
         <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
           <div className="text-center">
             <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
             <h2 className="text-2xl font-bold text-white mb-2">Loading Galactic Garden</h2>
             <p className="text-blue-300 text-lg">Preparing your cosmic journey...</p>
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

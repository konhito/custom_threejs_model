"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Rotate3D } from "lucide-react";

export default function Pollinator3D({ type = "bee", size = 1, autoRotate = true }) {
  const containerRef = useRef();
  const [isLoaded, setIsLoaded] = useState(false);

  const createPollinator = useCallback((THREE, type, size) => {
    const group = new THREE.Group();

    switch (type) {
      case "bee":
        createBee(THREE, group, size);
        break;
      case "butterfly":
        createButterfly(THREE, group, size);
        break;
      case "hummingbird":
        createHummingbird(THREE, group, size);
        break;
      case "bat":
        createBat(THREE, group, size);
        break;
      default:
        createBee(THREE, group, size);
    }

    return group;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const load3D = async () => {
      try {
        const THREE = await import("three");
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");

        // Clear container
        containerRef.current.innerHTML = "";

        // Create scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8fafc);

        // Create camera
        const camera = new THREE.PerspectiveCamera(
          75,
          containerRef.current.clientWidth / containerRef.current.clientHeight,
          0.1,
          1000
        );
        camera.position.set(3, 3, 3);

        // Create renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        );
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        containerRef.current.appendChild(renderer.domElement);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // Create pollinator based on type
        const pollinator = createPollinator(THREE, type, size);
        scene.add(pollinator);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = autoRotate;
        controls.autoRotateSpeed = 2;
        controls.enableZoom = true;
        controls.enablePan = false;

        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        const groundMaterial = new THREE.MeshLambertMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.5,
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1.5;
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
          if (!containerRef.current) return;
          const width = containerRef.current.clientWidth;
          const height = containerRef.current.clientHeight;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };

        window.addEventListener("resize", handleResize);
        setIsLoaded(true);

        // Cleanup
        return () => {
          window.removeEventListener("resize", handleResize);
          if (containerRef.current) {
            containerRef.current.innerHTML = "";
          }
        };
      } catch (error) {
        console.error("Error loading 3D viewer:", error);
        setIsLoaded(false);
      }
    };

    load3D();
  }, [type, size, autoRotate, createPollinator]);


  function createBee(THREE, group, size) {
    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.2 * size, 0.6 * size, 8, 16);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0xffd700,
      shininess: 100,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    group.add(body);

    // Wings
    const wingGeometry = new THREE.PlaneGeometry(0.8 * size, 0.6 * size);
    const wingMaterial = new THREE.MeshPhongMaterial({
      color: 0x87ceeb,
      shininess: 80,
      transparent: true,
      opacity: 0.7,
    });

    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-0.3 * size, 0, 0);
    leftWing.rotation.y = Math.PI / 6;
    leftWing.castShadow = true;
    group.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0.3 * size, 0, 0);
    rightWing.rotation.y = -Math.PI / 6;
    rightWing.castShadow = true;
    group.add(rightWing);

    // Antennae
    const antennaGeometry = new THREE.CylinderGeometry(0.02 * size, 0.02 * size, 0.3 * size, 8);
    const antennaMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

    const leftAntenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    leftAntenna.position.set(-0.1 * size, 0.4 * size, 0);
    leftAntenna.rotation.z = Math.PI / 6;
    group.add(leftAntenna);

    const rightAntenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    rightAntenna.position.set(0.1 * size, 0.4 * size, 0);
    rightAntenna.rotation.z = -Math.PI / 6;
    group.add(rightAntenna);

    // Stripes
    const stripeGeometry = new THREE.CapsuleGeometry(0.18 * size, 0.1 * size, 8, 16);
    const stripeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

    for (let i = 0; i < 3; i++) {
      const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
      stripe.position.y = 0.1 * size - i * 0.2 * size;
      group.add(stripe);
    }
  }

  function createButterfly(THREE, group, size) {
    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.05 * size, 0.4 * size, 8, 16);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0x8b4513,
      shininess: 80,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    group.add(body);

    // Wings (larger and more colorful)
    const wingGeometry = new THREE.PlaneGeometry(1.2 * size, 0.8 * size);

    // Left wings
    const leftWingMaterial = new THREE.MeshPhongMaterial({
      color: 0xff69b4,
      shininess: 60,
      transparent: true,
      opacity: 0.8,
    });

    const leftWing = new THREE.Mesh(wingGeometry, leftWingMaterial);
    leftWing.position.set(-0.4 * size, 0, 0);
    leftWing.rotation.y = Math.PI / 4;
    leftWing.castShadow = true;
    group.add(leftWing);

    // Right wings
    const rightWingMaterial = new THREE.MeshPhongMaterial({
      color: 0x9370db,
      shininess: 60,
      transparent: true,
      opacity: 0.8,
    });

    const rightWing = new THREE.Mesh(wingGeometry, rightWingMaterial);
    rightWing.position.set(0.4 * size, 0, 0);
    rightWing.rotation.y = -Math.PI / 4;
    rightWing.castShadow = true;
    group.add(rightWing);

    // Antennae
    const antennaGeometry = new THREE.CylinderGeometry(0.01 * size, 0.01 * size, 0.4 * size, 8);
    const antennaMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });

    const leftAntenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    leftAntenna.position.set(-0.05 * size, 0.25 * size, 0);
    leftAntenna.rotation.z = Math.PI / 8;
    group.add(leftAntenna);

    const rightAntenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    rightAntenna.position.set(0.05 * size, 0.25 * size, 0);
    rightAntenna.rotation.z = -Math.PI / 8;
    group.add(rightAntenna);
  }

  function createHummingbird(THREE, group, size) {
    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.15 * size, 0.5 * size, 8, 16);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0x32cd32,
      shininess: 120,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    group.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.2 * size, 16, 16);
    const headMaterial = new THREE.MeshPhongMaterial({
      color: 0x32cd32,
      shininess: 120,
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.35 * size;
    head.castShadow = true;
    group.add(head);

    // Beak
    const beakGeometry = new THREE.ConeGeometry(0.02 * size, 0.3 * size, 8);
    const beakMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
    const beak = new THREE.Mesh(beakGeometry, beakMaterial);
    beak.position.y = 0.5 * size;
    beak.rotation.z = Math.PI / 2;
    group.add(beak);

    // Wings (small and fast)
    const wingGeometry = new THREE.PlaneGeometry(0.6 * size, 0.4 * size);
    const wingMaterial = new THREE.MeshPhongMaterial({
      color: 0x4169e1,
      shininess: 80,
      transparent: true,
      opacity: 0.7,
    });

    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-0.2 * size, 0, 0);
    leftWing.rotation.y = Math.PI / 6;
    leftWing.castShadow = true;
    group.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0.2 * size, 0, 0);
    rightWing.rotation.y = -Math.PI / 6;
    rightWing.castShadow = true;
    group.add(rightWing);

    // Tail
    const tailGeometry = new THREE.PlaneGeometry(0.3 * size, 0.2 * size);
    const tailMaterial = new THREE.MeshPhongMaterial({
      color: 0xff69b4,
      shininess: 80,
    });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.y = -0.35 * size;
    tail.rotation.x = Math.PI / 2;
    group.add(tail);
  }

  function createBat(THREE, group, size) {
    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.2 * size, 0.4 * size, 8, 16);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0x696969,
      shininess: 60,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    group.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.25 * size, 16, 16);
    const headMaterial = new THREE.MeshPhongMaterial({
      color: 0x696969,
      shininess: 60,
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.3 * size;
    head.castShadow = true;
    group.add(head);

    // Wings (large and leathery)
    const wingGeometry = new THREE.PlaneGeometry(1.5 * size, 0.8 * size);
    const wingMaterial = new THREE.MeshPhongMaterial({
      color: 0x2f4f4f,
      shininess: 40,
      transparent: true,
      opacity: 0.8,
    });

    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-0.4 * size, 0, 0);
    leftWing.rotation.y = Math.PI / 3;
    leftWing.castShadow = true;
    group.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0.4 * size, 0, 0);
    rightWing.rotation.y = -Math.PI / 3;
    rightWing.castShadow = true;
    group.add(rightWing);

    // Ears
    const earGeometry = new THREE.ConeGeometry(0.08 * size, 0.2 * size, 8);
    const earMaterial = new THREE.MeshPhongMaterial({ color: 0x696969 });

    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(-0.15 * size, 0.45 * size, 0);
    leftEar.rotation.z = -Math.PI / 6;
    group.add(leftEar);

    const rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(0.15 * size, 0.45 * size, 0);
    rightEar.rotation.z = Math.PI / 6;
    group.add(rightEar);
  }

  return (
    <div className="w-full h-full relative">
      <div
        ref={containerRef}
        className="w-full h-full rounded-lg"
      />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-500 rounded-full animate-spin flex items-center justify-center mx-auto mb-4">
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
  );
}

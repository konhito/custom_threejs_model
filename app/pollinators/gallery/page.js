"use client";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, TrendingDown, AlertTriangle, Globe, Heart, Rotate3D, Bot, Zap, Cpu, Wifi, Bug, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation as SwiperNavigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import Pollinator3D from "../../../components/Pollinator3D";
import { naturalPollinators, roboticPollinators, createGLBPath } from "./pollinatorData";

// Enhanced 3D Model Viewer Component with GLB support
function Pollinator3DViewer({ pollinator, onClose }) {
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !pollinator.glbPath || !canvasRef.current) return;

    let renderer, scene, camera, animationId;
    const cleanupFns = [];

    const loadGLB = async () => {
      try {
        const THREE = await import("three");
        const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
        const { DRACOLoader } = await import("three/examples/jsm/loaders/DRACOLoader.js");
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");

        const container = canvasRef.current;
        if (!container) return;

        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f5f0);

        camera = new THREE.PerspectiveCamera(
          45,
          container.clientWidth / container.clientHeight,
          0.1,
          100
        );
        camera.position.set(0, 1.5, 3);
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(container.clientWidth, container.clientHeight, false);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        container.appendChild(renderer.domElement);
        cleanupFns.push(() => {
          if (renderer?.domElement?.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
          }
          renderer?.dispose();
        });

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(4, 6, 3);
        scene.add(directionalLight);

        const fillLight = new THREE.DirectionalLight(0xfff1d6, 0.6);
        fillLight.position.set(-3, 2, -2);
        scene.add(fillLight);

        // Load GLB
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
        dracoLoader.setDecoderConfig({ type: "js" });

        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        loader.setCrossOrigin("anonymous");

        loader.load(
          pollinator.glbPath,
          (gltf) => {
            const model = gltf.scene;
            model.traverse((node) => {
              if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
              }
            });

            model.updateMatrixWorld(true);
            const box = new THREE.Box3();
            model.traverse((node) => {
              if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                node.geometry.computeBoundingBox();
                const nodeBox = node.geometry.boundingBox.clone();
                nodeBox.applyMatrix4(node.matrixWorld);
                box.expandByPoint(nodeBox.min);
                box.expandByPoint(nodeBox.max);
              }
            });
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 1.8 / maxDim;
            model.scale.setScalar(scale);
            model.position.sub(center.multiplyScalar(scale));

            scene.add(model);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.8;
            controls.enablePan = false;
            cleanupFns.push(() => controls.dispose());

            const animate = () => {
              animationId = requestAnimationFrame(animate);
              controls.update();
              renderer.render(scene, camera);
            };
            animate();
            cleanupFns.push(() => cancelAnimationFrame(animationId));

            setIsLoaded(true);
          },
          undefined,
          (err) => {
            console.error("GLB load error:", err);
            setError("Failed to load 3D model");
          }
        );
      } catch (err) {
        console.error("Three.js error:", err);
        setError("Failed to initialize 3D viewer");
      }
    };

    loadGLB();

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, [isMounted, pollinator.glbPath]);

  // Map pollinator types to procedural 3D types
  const getPollinatorType = (name, scientificName) => {
    const lowerName = name.toLowerCase();
    const lowerScientific = scientificName?.toLowerCase() || "";

    if (lowerName.includes("bee") || lowerScientific.includes("apis") || lowerScientific.includes("bombus") || lowerScientific.includes("formicidae")) {
      return "bee";
    } else if (lowerName.includes("butterfly") || lowerName.includes("moth") || lowerScientific.includes("danaus") || lowerScientific.includes("papilionidae") || lowerScientific.includes("hemaris")) {
      return "butterfly";
    } else if (lowerName.includes("hummingbird") || lowerName.includes("sunbird") || lowerScientific.includes("archilochus") || lowerScientific.includes("nectariniidae")) {
      return "hummingbird";
    } else if (lowerName.includes("bat") || lowerScientific.includes("leptonycteris")) {
      return "bat";
    } else if (lowerName.includes("beetle") || lowerScientific.includes("coleoptera") || lowerScientific.includes("cetoniinae")) {
      return "bee"; // Default for beetles
    } else if (lowerName.includes("robot") || lowerName.includes("droid") || lowerName.includes("drone") || lowerName.includes("system")) {
      // Try to determine robot type from name
      if (lowerName.includes("hummingbird")) return "hummingbird";
      if (lowerName.includes("bee")) return "bee";
      if (lowerName.includes("butterfly")) return "butterfly";
      if (lowerName.includes("moth")) return "butterfly"; // Use butterfly for moth
      if (lowerName.includes("bat")) return "bat";
      return "robot";
    } else {
      return "bee";
    }
  };

  const pollinatorType = getPollinatorType(pollinator.name, pollinator.scientificName);
  const hasGLBModel = pollinator.glbPath;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-white/20" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
          >
            <span className="text-xl">×</span>
          </button>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {pollinator.name} - 3D View
            </h2>
            <p className="text-gray-600 mb-4">{pollinator.scientificName}</p>
          </div>
        </div>

        {/* 3D Model Viewer */}
        <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 h-96">
          {hasGLBModel && isMounted ? (
            <div ref={canvasRef} className="w-full h-full" />
          ) : (
            <Pollinator3D
              type={pollinatorType}
              size={1.2}
              autoRotate={true}
            />
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}
          {!isLoaded && hasGLBModel && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Pollinator Information */}
        <div className="p-6 bg-gray-50 max-h-64 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
              <p className="text-gray-700 text-sm">{pollinator.description || pollinator.roleEn || "No description available."}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Region</h4>
              <p className="text-gray-700 text-sm">{pollinator.region || pollinator.country || "Global"}</p>
            </div>
            {pollinator.habitat && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Habitat</h4>
                <p className="text-gray-700 text-sm">{pollinator.habitat}</p>
              </div>
            )}
            {pollinator.conservation && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Conservation</h4>
                <p className="text-gray-700 text-sm">{pollinator.conservation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Robotic Pollinator 3D Sliding Window Viewer
const ROBOT_BACKGROUND_HEX = "#E8E6DF";
const ROBOT_VIEW_OPTION = {
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

function RoboticPollinator3DViewer({ robot, isActive = false }) {
  const canvasRef = useRef(null);
  const [isGLBLoaded, setIsGLBLoaded] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isMounted || !isActive || !robot.glbPath) return;

    let renderer, camera, animationId;
    const cleanupFns = [];

    setIsGLBLoaded(false);
    setError(null);

    const loadModel = async () => {
      try {
        const THREE = await import("three");
        const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
        const { DRACOLoader } = await import("three/examples/jsm/loaders/DRACOLoader.js");
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");

        const container = canvasRef.current;
        if (!container) return;

        while (container.firstChild) container.removeChild(container.firstChild);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(ROBOT_BACKGROUND_HEX);

        const viewSettings = ROBOT_VIEW_OPTION;
        camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.set(...viewSettings.camera.position);
        camera.lookAt(...viewSettings.camera.lookAt);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(container.clientWidth, container.clientHeight, false);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        renderer.shadowMap.enabled = true;

        renderer.domElement.style.touchAction = "none";
        renderer.domElement.style.pointerEvents = "auto";
        renderer.domElement.style.userSelect = "none";

        let removeDocListeners = null;
        const stopPropagationOnly = (e) => e.stopPropagation();
        const stopOnCanvas = (e) => { if (e.target !== renderer.domElement) return; e.stopPropagation(); };

        const bindDocListeners = () => {
          if (removeDocListeners) return;
          const docStop = (e) => e.stopPropagation();
          const docUp = (e) => { e.stopPropagation(); removeDocListeners?.(); removeDocListeners = null; };
          const opts = { capture: true, passive: false };
          document.addEventListener("mousemove", docStop, opts);
          document.addEventListener("mouseup", docUp, opts);
          document.addEventListener("touchmove", docStop, opts);
          document.addEventListener("touchend", docUp, opts);
          document.addEventListener("touchcancel", docUp, opts);
          removeDocListeners = () => {
            document.removeEventListener("mousemove", docStop, opts);
            document.removeEventListener("mouseup", docUp, opts);
            document.removeEventListener("touchmove", docStop, opts);
            document.removeEventListener("touchend", docUp, opts);
            document.removeEventListener("touchcancel", docUp, opts);
          };
        };

        const canvasPointerDown = (e) => {
          if (e.target !== renderer.domElement) return;
          e.stopPropagation();
          bindDocListeners();
        };

        renderer.domElement.addEventListener("mousedown", canvasPointerDown, { capture: true, passive: false });
        renderer.domElement.addEventListener("touchstart", canvasPointerDown, { capture: true, passive: false });
        renderer.domElement.addEventListener("mousemove", stopOnCanvas, { capture: true, passive: false });
        renderer.domElement.addEventListener("mouseup", stopOnCanvas, { capture: true, passive: false });
        renderer.domElement.addEventListener("touchmove", stopOnCanvas, { capture: true, passive: false });
        renderer.domElement.addEventListener("touchend", stopOnCanvas, { capture: true, passive: false });
        renderer.domElement.addEventListener("click", stopPropagationOnly, { capture: true, passive: false });
        renderer.domElement.addEventListener("wheel", stopPropagationOnly, { capture: true, passive: false });
        renderer.domElement.addEventListener("contextmenu", stopPropagationOnly, { capture: true, passive: false });

        container.style.pointerEvents = "auto";
        container.appendChild(renderer.domElement);
        cleanupFns.push(() => {
          removeDocListeners?.();
          if (renderer?.domElement?.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
          renderer?.dispose();
        });

        // Lighting
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

        // Ground shadow
        const groundGeo = new THREE.PlaneGeometry(20, 20);
        const groundMat = new THREE.ShadowMaterial({ opacity: 0.18 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1;
        ground.receiveShadow = true;
        scene.add(ground);

        // Load GLB
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
        dracoLoader.setDecoderConfig({ type: "js" });
        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        loader.setCrossOrigin("anonymous");

        loader.load(
          robot.glbPath,
          (gltf) => {
            const model = gltf.scene;
            model.traverse((node) => {
              if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                if (node.material) node.material.needsUpdate = true;
              }
            });
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 1.8 / maxDim;
            model.scale.setScalar(scale);
            model.position.sub(center.multiplyScalar(scale));
            scene.add(model);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.autoRotate = viewSettings.controls.autoRotate ?? true;
            controls.autoRotateSpeed = viewSettings.controls.autoRotateSpeed ?? 0.8;
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
            cleanupFns.push(() => window.removeEventListener("resize", handleResize));

            setIsGLBLoaded(true);
            setTimeout(() => setIsContentLoaded(true), 300);
          },
          undefined,
          (err) => {
            console.error("GLB load error", err);
            setError("Failed to load 3D model.");
            setIsGLBLoaded(false);
            setIsContentLoaded(true);
          }
        );
      } catch (err) {
        console.error("Three.js setup error", err);
        setError("Three.js could not initialize.");
        setIsGLBLoaded(false);
        setIsContentLoaded(true);
      }
    };

    loadModel();
    return () => cleanupFns.forEach((fn) => fn());
  }, [isMounted, isActive, robot.glbPath]);

  useEffect(() => {
    if (isActive && !robot.glbPath) {
      setTimeout(() => setIsContentLoaded(true), 100);
    }
  }, [isActive, robot.glbPath]);

  if (!isMounted) {
    return (
      <div className="w-full h-[260px] sm:h-[340px] md:h-[420px] lg:h-[500px] flex items-center justify-center bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl">
        <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-cyan-400/20 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:block" />

      {/* Card */}
      <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md flex-shrink-0">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h2
              className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 line-clamp-1 sm:line-clamp-none"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              {robot.name}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 italic line-clamp-1 sm:line-clamp-none">
              {robot.manufacturer} · {robot.year}
            </p>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
              Status: <span className="font-semibold">{robot.status}</span>
            </p>
          </div>
        </div>

        {/* 3D Viewer */}
        {robot.glbPath && (
          <div className="relative w-full h-[260px] sm:h-[340px] md:h-[420px] lg:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden isolate mb-4 sm:mb-6 swiper-no-swiping" style={{ pointerEvents: 'auto' }} data-canvas-container>
            <div ref={canvasRef} className="w-full h-full gpu-accelerated" style={{ pointerEvents: 'auto' }} />
            {!isGLBLoaded && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
                <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-blue-300 border-t-transparent rounded-full animate-spin mb-2 sm:mb-3" />
                <span className="text-xs sm:text-sm text-gray-500 px-2 text-center">Loading 3D model...</span>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 grid place-content-center bg-red-50 text-red-500 text-sm font-medium text-center px-4">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Robot Information - Lazy loaded after GLB */}
        {isContentLoaded && (
          <div className="space-y-4 sm:space-y-6" style={{ animation: 'fadeIn 0.5s ease-in' }}>
            {/* Description */}
            <div className="bg-blue-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
              <h3 className="text-[11px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-blue-700 mb-3 sm:mb-4">
                DESCRIPTION
              </h3>
              <p className="text-gray-800 text-xs sm:text-sm leading-relaxed">
                {robot.description}
              </p>
            </div>

            {/* Capabilities & Applications */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200">
              <h3 className="text-[11px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-purple-700 mb-3 sm:mb-4">
                CAPABILITIES & APPLICATIONS
              </h3>
              <div className="grid gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="bg-white/80 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 border-l-4 border-blue-500">
                  <div className="text-[10px] sm:text-[11px] font-semibold text-blue-700 uppercase mb-0.5 sm:mb-1 flex items-center">
                    <Zap className="w-3 h-3 mr-1" /> Capabilities
                  </div>
                  <div className="text-gray-800">{robot.capabilities}</div>
                </div>
                <div className="bg-white/80 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 border-l-4 border-purple-500">
                  <div className="text-[10px] sm:text-[11px] font-semibold text-purple-700 uppercase mb-0.5 sm:mb-1 flex items-center">
                    <Cpu className="w-3 h-3 mr-1" /> Applications
                  </div>
                  <div className="text-gray-800">{robot.applications}</div>
                </div>
              </div>
            </div>

            {/* Advantages & Limitations */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-amber-200">
              <h3 className="text-[11px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-amber-700 mb-3 sm:mb-4">
                ADVANTAGES & LIMITATIONS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <h5 className="text-xs font-semibold text-green-700 mb-1 flex items-center">
                    <span className="text-green-600 mr-1">✓</span> Advantages
                  </h5>
                  <p className="text-xs text-gray-700 leading-relaxed">{robot.advantages}</p>
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-orange-700 mb-1 flex items-center">
                    <span className="text-orange-600 mr-1">⚠</span> Limitations
                  </h5>
                  <p className="text-xs text-gray-700 leading-relaxed">{robot.limitations}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PollinatorsGalleryPage() {
  const [selected3DModel, setSelected3DModel] = useState(null);
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const robotSwiperRef = useRef(null);
  const [robotActiveIndex, setRobotActiveIndex] = useState(0);
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

      {/* Decorative elements - hidden on mobile for performance */}
      <GlowingOrb className="hidden md:block top-20 -right-20" color="amber" delay={0.2} size="xl" />
      <GlowingOrb className="hidden sm:block top-1/3 -left-32" color="amber" delay={0.4} size="lg" />
      <GlowingOrb className="bottom-1/4 right-4 sm:right-10 opacity-60 sm:opacity-100" color="amber" delay={0.6} size="md" />
      <GlowingOrb className="hidden lg:block bottom-40 left-1/4" color="amber" delay={0.8} size="lg" />

      <FloralDecoration className="hidden sm:block top-32 right-20 opacity-60" delay={1} />
      <FloralDecoration className="hidden md:block top-1/2 left-10 opacity-40" delay={1.2} />
      <FloralDecoration className="hidden lg:block bottom-60 right-1/3 opacity-50" delay={1.4} />

      <Navigation />

      <div className="relative pt-20 px-4 lg:pr-24 lg:pl-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/pollinators"
              className="inline-flex items-center space-x-2 text-amber-600 hover:text-amber-700 transition-colors duration-200 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to pollinators</span>
            </Link>

            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Pollinators Gallery
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl">
              Discover the invisible guardians of life on Earth. This gallery showcases the diverse natural pollinators that keep our planet&apos;s biodiversity in balance, from tiny bees to magnificent hummingbirds, and explores emerging robotic pollination technologies.
            </p>
          </div>

          {/* Crisis Infographic */}
          <section className="mb-16 bg-gradient-to-r from-red-50 to-orange-100 rounded-3xl p-8 border border-red-200">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-red-800 mb-4">
                Pollinator Decline (2016–2025)
              </h2>
              <p className="text-lg text-red-700">
                The urgent reality we must address
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/80 rounded-2xl p-6 border border-red-200 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-blue-800 mb-2">2016 IPBES Report</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <div className="text-2xl font-bold text-blue-600">90%</div>
                    <div className="text-blue-700">Wild flowering plants depend on pollinators</div>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-2">
                    <div className="text-2xl font-bold text-blue-600">75%</div>
                    <div className="text-blue-700">Global food crops require pollination</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 rounded-2xl p-6 border border-red-300 text-center">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-red-800 mb-2">2025 Crisis</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-red-100 rounded-lg p-2">
                    <div className="text-2xl font-bold text-red-600">40%</div>
                    <div className="text-red-700">Pollinating insects highly threatened</div>
                  </div>
                  <div className="bg-red-100 rounded-lg p-2">
                    <div className="text-2xl font-bold text-red-600">9%</div>
                    <div className="text-red-700">Annual insect population decline</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 rounded-2xl p-6 border border-orange-300 text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-orange-800 mb-2">US Bee Colonies</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <div className="text-2xl font-bold text-orange-600">60-70%</div>
                    <div className="text-orange-700">Annual colony losses</div>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-2">
                    <div className="text-2xl font-bold text-orange-600">22%</div>
                    <div className="text-orange-700">Native pollinators at risk</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 border border-amber-300 text-center">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-amber-800 mb-2">Urgent Action</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-amber-100 rounded-lg p-2">
                    <div className="text-lg font-bold text-amber-600">Next Decade</div>
                    <div className="text-amber-700">Decides restoration or collapse</div>
                  </div>
                  <div className="bg-amber-100 rounded-lg p-2">
                    <div className="text-lg font-bold text-amber-600">Global</div>
                    <div className="text-amber-700">Coordination required</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Natural Pollinators Gallery */}
          <div className="space-y-16 mb-20">
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-8 h-8 bg-yellow-400 rounded-full mr-3 flex items-center justify-center text-yellow-800 font-bold text-sm">🐝</span>
                Bees & Ants
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {naturalPollinators.bees.map((pollinator, index) => (
                  <PollinatorCard key={index} pollinator={pollinator} onView3D={setSelected3DModel} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-8 h-8 bg-blue-400 rounded-full mr-3 flex items-center justify-center text-blue-800 font-bold text-sm">🐦</span>
                Birds
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {naturalPollinators.birds.map((pollinator, index) => (
                  <PollinatorCard key={index} pollinator={pollinator} onView3D={setSelected3DModel} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-8 h-8 bg-purple-400 rounded-full mr-3 flex items-center justify-center text-purple-800 font-bold text-sm">🦋</span>
                Butterflies & Moths
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {naturalPollinators.butterflies.map((pollinator, index) => (
                  <PollinatorCard key={index} pollinator={pollinator} onView3D={setSelected3DModel} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-8 h-8 bg-gray-400 rounded-full mr-3 flex items-center justify-center text-gray-800 font-bold text-sm">🦇</span>
                Bats
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {naturalPollinators.bats.map((pollinator, index) => (
                  <PollinatorCard key={index} pollinator={pollinator} onView3D={setSelected3DModel} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-8 h-8 bg-green-400 rounded-full mr-3 flex items-center justify-center text-green-800 font-bold text-sm">🪲</span>
                Beetles & Other Pollinators
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {naturalPollinators.beetles.map((pollinator, index) => (
                  <PollinatorCard key={index} pollinator={pollinator} onView3D={setSelected3DModel} />
                ))}
              </div>
            </section>
          </div>

          {/* Robotic Pollinators Sliding Window Section - COMMENTED OUT */}
          {false && (
            <section className="mb-20">
              <div className="mb-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  Robotic Pollinators
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  As natural pollinator populations decline, scientists and engineers are developing robotic alternatives. While these technologies show promise for specific applications, they cannot fully replace the complex ecosystem services provided by natural pollinators.
                </p>
              </div>

              <div className="relative px-2 sm:px-0 mb-12">
                <style jsx>{`
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .robot-swiper .swiper-slide {
                  opacity: 0.3;
                  transition: opacity 0.3s;
                }
                .robot-swiper .swiper-slide-active {
                  opacity: 1;
                }
              `}</style>
                <Swiper
                  ref={robotSwiperRef}
                  modules={[SwiperNavigation]}
                  navigation={{
                    nextEl: '.swiper-button-next-robot',
                    prevEl: '.swiper-button-prev-robot',
                  }}
                  spaceBetween={16}
                  slidesPerView={1}
                  loop={true}
                  allowTouchMove={true}
                  simulateTouch={true}
                  noSwipingClass="swiper-no-swiping"
                  noSwipingSelector="[data-canvas-container]"
                  touchEventsTarget="container"
                  className="robot-swiper"
                  onSlideChange={(swiper) => setRobotActiveIndex(swiper.realIndex)}
                  onSwiper={(swiper) => { robotSwiperRef.current = swiper; }}
                >
                  {roboticPollinators.map((robot, index) => (
                    <SwiperSlide key={index}>
                      <RoboticPollinator3DViewer
                        robot={robot}
                        isActive={robotActiveIndex === index}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <button className="swiper-button-prev-robot absolute left-0 sm:left-0 top-[42%] sm:top-1/2 -translate-y-1/2 z-10 -translate-x-1 sm:-translate-x-4 lg:-translate-x-12 w-9 h-9 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-white/95 hover:bg-white backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-300 active:scale-95 sm:hover:scale-110 group touch-manipulation" aria-label="Previous robot">
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-gray-700 group-hover:text-blue-600 transition-colors" />
                </button>
                <button className="swiper-button-next-robot absolute right-0 sm:right-0 top-[42%] sm:top-1/2 -translate-y-1/2 z-10 translate-x-1 sm:translate-x-4 lg:translate-x-12 w-9 h-9 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-white/95 hover:bg-white backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-300 active:scale-95 sm:hover:scale-110 group touch-manipulation" aria-label="Next robot">
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-gray-700 group-hover:text-blue-600 transition-colors" />
                </button>
              </div>
            </section>
          )}

          {/* Comparison Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-200">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Natural vs. Robotic Pollinators
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Natural Pollinators */}
              <div className="bg-white/80 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800">Natural Pollinators</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      Advantages
                    </h5>
                    <ul className="space-y-2 text-sm text-gray-600 ml-6">
                      <li>• Self-sustaining populations that reproduce naturally</li>
                      <li>• Provide ecosystem services beyond pollination (soil health, food web support)</li>
                      <li>• Adapt to environmental changes and flower diversity</li>
                      <li>• No energy infrastructure required</li>
                      <li>• Contribute to biodiversity and ecosystem resilience</li>
                      <li>• Co-evolved with plants over millions of years</li>
                      <li>• Support entire ecosystems, not just crops</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <span className="text-red-600 mr-2">⚠</span>
                      Challenges
                    </h5>
                    <ul className="space-y-2 text-sm text-gray-600 ml-6">
                      <li>• Vulnerable to pesticides, habitat loss, and climate change</li>
                      <li>• Populations declining globally</li>
                      <li>• Cannot be controlled or directed like machines</li>
                      <li>• Seasonal availability in some regions</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Robotic Pollinators */}
              <div className="bg-white/80 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800">Robotic Pollinators</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      Potential Benefits
                    </h5>
                    <ul className="space-y-2 text-sm text-gray-600 ml-6">
                      <li>• Can work 24/7 without rest</li>
                      <li>• Not affected by pesticides or environmental toxins</li>
                      <li>• Precise control over pollination process</li>
                      <li>• Useful for controlled environments (greenhouses)</li>
                      <li>• Can collect data while pollinating</li>
                      <li>• No risk of stings or allergic reactions</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <span className="text-red-600 mr-2">⚠</span>
                      Limitations
                    </h5>
                    <ul className="space-y-2 text-sm text-gray-600 ml-6">
                      <li>• Cannot replace ecosystem services provided by natural pollinators</li>
                      <li>• High initial cost and maintenance requirements</li>
                      <li>• Limited battery life requires charging infrastructure</li>
                      <li>• Cannot fully replicate natural pollination behaviors</li>
                      <li>• Not suitable for wild ecosystems or diverse plant communities</li>
                      <li>• Require technical expertise and ongoing support</li>
                      <li>• Cannot contribute to biodiversity or ecosystem health</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <div className="mt-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6 border border-amber-300">
              <h4 className="text-xl font-bold text-gray-800 mb-3 text-center">
                The Path Forward
              </h4>
              <p className="text-gray-700 text-center leading-relaxed">
                Robotic pollinators may serve as valuable tools for specific applications, particularly in controlled agricultural environments. However, they should be viewed as <strong>supplements, not replacements</strong> for natural pollinators. The ultimate goal must be to protect and restore natural pollinator populations, as they provide irreplaceable ecosystem services that support life on Earth. Conservation efforts, habitat restoration, and sustainable agricultural practices remain the most critical priorities for ensuring food security and ecosystem health.
              </p>
            </div>
          </div>


          {/* Future Vision */}
          <div className="mt-20 mb-20 p-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border border-amber-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Future Vision</h3>
            <p className="text-gray-700 mb-4">
              This gallery is part of our comprehensive living archive of Earth&apos;s pollinators. Explore these magnificent creatures in three dimensions, discover their connections with national flowers, and understand their vital role in our ecosystem. As we continue to build this archive, we&apos;ll add more species, detailed information, and interactive 3D models.
            </p>
            <p className="text-sm text-gray-600">
              All images are sourced from free-to-use platforms and are properly attributed. This collection will continue to grow as we build our living archive of Earth&apos;s pollinators.
            </p>
          </div>
        </div>
      </div>

      {/* 3D Model Viewer Modal */}
      {
        selected3DModel && (
          <Pollinator3DViewer
            pollinator={selected3DModel}
            onClose={() => setSelected3DModel(null)}
          />
        )
      }

      <Footer />
    </div >
  );
}

function PollinatorCard({ pollinator, onView3D }) {
  return (
    <Link
      href={`/pollinators/gallery/${pollinator.slug}`}
      className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      <div className="relative overflow-hidden">
        <Image
          src={pollinator.image}
          alt={pollinator.name}
          width={400}
          height={300}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {pollinator.imageAttribution}
        </div>
        {pollinator.glbPath && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Rotate3D className="w-3 h-3 mr-1" />
            <span>3D Model</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{pollinator.name}</h3>
        <p className="text-sm text-gray-600 italic mb-2">{pollinator.scientificName}</p>
        <p className="text-sm text-gray-700 mb-4">{pollinator.region}</p>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {pollinator.description}
        </p>

        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center space-x-1 text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors duration-200"
          >
            <span>Read Details</span>
            <ExternalLink className="w-3 h-3" />
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onView3D(pollinator);
            }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <Rotate3D className="w-4 h-4" />
            <span>View 3D</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

function RoboticPollinatorCard({ robot, onView3D }) {
  return (
    <Link
      href={`/pollinators/gallery/${robot.slug}`}
      className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border-2 border-blue-100 cursor-pointer"
    >
      <div className="relative overflow-hidden">
        <Image
          src={robot.image}
          alt={robot.name}
          width={600}
          height={400}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
          <Bot className="w-3 h-3 mr-1" />
          <span>Robotic</span>
        </div>
        <div className="absolute top-2 left-2 flex gap-2">
          <div className="bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {robot.imageAttribution}
          </div>
          {robot.glbPath && (
            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Rotate3D className="w-3 h-3 mr-1" />
              <span>3D Model</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{robot.name}</h3>
            <p className="text-sm text-gray-600">{robot.manufacturer}</p>
          </div>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{robot.year}</span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {robot.description}
        </p>

        <div className="space-y-3 mb-4">
          <div>
            <h5 className="text-xs font-semibold text-gray-700 mb-1 flex items-center">
              <Zap className="w-3 h-3 mr-1 text-blue-600" />
              Capabilities
            </h5>
            <p className="text-xs text-gray-600">{robot.capabilities}</p>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-gray-700 mb-1 flex items-center">
              <Cpu className="w-3 h-3 mr-1 text-purple-600" />
              Applications
            </h5>
            <p className="text-xs text-gray-600">{robot.applications}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
            <div>
              <h5 className="text-xs font-semibold text-green-700 mb-1">Advantages</h5>
              <p className="text-xs text-gray-600">{robot.advantages}</p>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-orange-700 mb-1">Limitations</h5>
              <p className="text-xs text-gray-600 line-clamp-3">{robot.limitations}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            {robot.status}
          </span>
          <div className="flex items-center gap-2">
            {robot.glbPath && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onView3D(robot);
                }}
                className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs transition-colors duration-200 font-medium"
              >
                <Rotate3D className="w-3 h-3" />
                <span>View 3D</span>
              </button>
            )}
            <span
              className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors duration-200"
            >
              <span>Read Details</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

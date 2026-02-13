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
import { naturalPollinators, roboticPollinators, createGLBPath, uiTranslations } from "./pollinatorData";

// Helper for localized content
const getLocalizedContent = (content, lang = 'en') => {
  if (typeof content === 'string') return content;
  if (typeof content === 'object' && content !== null) {
    if (Array.isArray(content)) return content;
    const val = content[lang] || content['en'] || Object.values(content)[0] || '';
    if (typeof val === 'object') return JSON.stringify(val); // Safety net to prevent crashes
    return val;
  }
  return '';
};

// Enhanced 3D Model Viewer Component with GLB support
function Pollinator3DViewer({ pollinator, onClose, language = 'en' }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
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
              {pollinator.name} - {uiTranslations[language].card.view3d}
            </h2>
            <p className="text-gray-600 mb-4">{pollinator.scientificName}</p>
          </div>
        </div>

        {/* 3D Model Viewer */}
        <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 h-64 sm:h-96">
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
              <h4 className="font-semibold text-gray-800 mb-2">{uiTranslations[language].card.description}</h4>
              <p className="text-gray-700 text-sm">{getLocalizedContent(pollinator.description, language) || getLocalizedContent(pollinator.role, language) || "No description available."}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">{uiTranslations[language].card.region}</h4>
              <p className="text-gray-700 text-sm">{pollinator.region || pollinator.country || "Global"}</p>
            </div>
            {pollinator.habitat && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">{uiTranslations[language].card.habitat}</h4>
                <p className="text-gray-700 text-sm">{getLocalizedContent(pollinator.habitat, language)}</p>
              </div>
            )}
            {pollinator.conservation && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">{uiTranslations[language].card.conservation}</h4>
                <p className="text-gray-700 text-sm">{getLocalizedContent(pollinator.conservation, language)}</p>
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

function RoboticPollinator3DViewer({ robot, isActive = false, language = 'en' }) {
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
              {uiTranslations[language].card.statusLabel}: <span className="font-semibold">{robot.status}</span>
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
                <span className="text-xs sm:text-sm text-gray-500 px-2 text-center">{uiTranslations[language].card.loadingModel}</span>
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
                {uiTranslations[language].card.description}
              </h3>
              <p className="text-gray-800 text-xs sm:text-sm leading-relaxed">
                {getLocalizedContent(robot.description, language)}
              </p>
            </div>

            {/* Capabilities & Applications */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200">
              <h3 className="text-[11px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-purple-700 mb-3 sm:mb-4">
                {uiTranslations[language].card.capabilities} & {uiTranslations[language].card.applications}
              </h3>
              <div className="grid gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="bg-white/80 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 border-l-4 border-blue-500">
                  <div className="text-[10px] sm:text-[11px] font-semibold text-blue-700 uppercase mb-0.5 sm:mb-1 flex items-center">
                    <Zap className="w-3 h-3 mr-1" /> {uiTranslations[language].card.capabilities}
                  </div>
                  <div className="text-gray-800">{getLocalizedContent(robot.capabilities, language)}</div>
                </div>
                <div className="bg-white/80 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 border-l-4 border-purple-500">
                  <div className="text-[10px] sm:text-[11px] font-semibold text-purple-700 uppercase mb-0.5 sm:mb-1 flex items-center">
                    <Cpu className="w-3 h-3 mr-1" /> {uiTranslations[language].card.applications}
                  </div>
                  <div className="text-gray-800">{getLocalizedContent(robot.applications, language)}</div>
                </div>
              </div>
            </div>

            {/* Advantages & Limitations */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-amber-200">
              <h3 className="text-[11px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-amber-700 mb-3 sm:mb-4">
                {uiTranslations[language].card.advantages} & {uiTranslations[language].card.limitations}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <h5 className="text-xs font-semibold text-green-700 mb-1 flex items-center">
                    <span className="text-green-600 mr-1">✓</span> {uiTranslations[language].card.advantages}
                  </h5>
                  <p className="text-xs text-gray-700 leading-relaxed">{getLocalizedContent(robot.advantages, language)}</p>
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-orange-700 mb-1 flex items-center">
                    <span className="text-orange-600 mr-1">⚠</span> {uiTranslations[language].card.limitations}
                  </h5>
                  <p className="text-xs text-gray-700 leading-relaxed">{getLocalizedContent(robot.limitations, language)}</p>
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
  const [language, setLanguage] = useState('en');
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
              <span>{uiTranslations[language].header.back}</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm font-medium text-gray-600 mr-2">{uiTranslations[language].header.language}</span>
              {[
                { code: 'en', label: 'English', flag: '🇺🇸' },
                { code: 'es', label: 'Español', flag: '🇪🇸' },
                { code: 'fr', label: 'Français', flag: '🇫🇷' },
                { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
                { code: 'zh', label: '中文', flag: '🇨🇳' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${language === lang.code
                    ? 'bg-amber-600 text-white shadow-md transform scale-105'
                    : 'bg-white text-gray-600 hover:bg-amber-50 hover:text-amber-600 border border-gray-200'
                    }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span className="hidden sm:inline">{lang.label}</span>
                </button>
              ))}
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
              {uiTranslations[language].header.title}
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl">
              {uiTranslations[language].header.subtitle}
            </p>
          </div>

          {/* Crisis Infographic */}
          <section className="mb-16 bg-gradient-to-r from-red-50 to-orange-100 rounded-3xl p-8 border border-red-200">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-red-800 mb-4">
                {uiTranslations[language].crisis.title}
              </h2>
              <p className="text-lg text-red-700">
                {uiTranslations[language].crisis.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/80 rounded-2xl p-6 border border-red-200 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-blue-800 mb-2">{uiTranslations[language].crisis.report.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <div className="text-2xl font-bold text-blue-600">{uiTranslations[language].crisis.report.stat1}</div>
                    <div className="text-blue-700">{uiTranslations[language].crisis.report.desc1}</div>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-2">
                    <div className="text-2xl font-bold text-blue-600">{uiTranslations[language].crisis.report.stat2}</div>
                    <div className="text-blue-700">{uiTranslations[language].crisis.report.desc2}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 rounded-2xl p-6 border border-red-300 text-center">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-red-800 mb-2">{uiTranslations[language].crisis.crisis2025.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-red-100 rounded-lg p-2">
                    <div className="text-2xl font-bold text-red-600">{uiTranslations[language].crisis.crisis2025.stat1}</div>
                    <div className="text-red-700">{uiTranslations[language].crisis.crisis2025.desc1}</div>
                  </div>
                  <div className="bg-red-100 rounded-lg p-2">
                    <div className="text-2xl font-bold text-red-600">{uiTranslations[language].crisis.crisis2025.stat2}</div>
                    <div className="text-red-700">{uiTranslations[language].crisis.crisis2025.desc2}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 rounded-2xl p-6 border border-orange-300 text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-orange-800 mb-2">{uiTranslations[language].crisis.usBees.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <div className="text-2xl font-bold text-orange-600">{uiTranslations[language].crisis.usBees.stat1}</div>
                    <div className="text-orange-700">{uiTranslations[language].crisis.usBees.desc1}</div>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-2">
                    <div className="text-2xl font-bold text-orange-600">{uiTranslations[language].crisis.usBees.stat2}</div>
                    <div className="text-orange-700">{uiTranslations[language].crisis.usBees.desc2}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 border border-amber-300 text-center">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-amber-800 mb-2">{uiTranslations[language].crisis.urgentAction.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-amber-100 rounded-lg p-2">
                    <div className="text-lg font-bold text-amber-600">{uiTranslations[language].crisis.urgentAction.stat1}</div>
                    <div className="text-amber-700">{uiTranslations[language].crisis.urgentAction.desc1}</div>
                  </div>
                  <div className="bg-amber-100 rounded-lg p-2">
                    <div className="text-lg font-bold text-amber-600">{uiTranslations[language].crisis.urgentAction.stat2}</div>
                    <div className="text-amber-700">{uiTranslations[language].crisis.urgentAction.desc2}</div>
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
                {uiTranslations[language].sections.beesAnts}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {naturalPollinators.bees.map((pollinator, index) => (
                  <PollinatorCard key={index} pollinator={pollinator} onView3D={setSelected3DModel} language={language} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-8 h-8 bg-blue-400 rounded-full mr-3 flex items-center justify-center text-blue-800 font-bold text-sm">🐦</span>
                {uiTranslations[language].sections.birds}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {naturalPollinators.birds.map((pollinator, index) => (
                  <PollinatorCard key={index} pollinator={pollinator} onView3D={setSelected3DModel} language={language} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-8 h-8 bg-purple-400 rounded-full mr-3 flex items-center justify-center text-purple-800 font-bold text-sm">🦋</span>
                {uiTranslations[language].sections.butterfliesMoths}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {naturalPollinators.butterflies.map((pollinator, index) => (
                  <PollinatorCard key={index} pollinator={pollinator} onView3D={setSelected3DModel} language={language} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-8 h-8 bg-gray-400 rounded-full mr-3 flex items-center justify-center text-gray-800 font-bold text-sm">🦇</span>
                {uiTranslations[language].sections.bats}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {naturalPollinators.bats.map((pollinator, index) => (
                  <PollinatorCard key={index} pollinator={pollinator} onView3D={setSelected3DModel} language={language} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-8 h-8 bg-green-400 rounded-full mr-3 flex items-center justify-center text-green-800 font-bold text-sm">🪲</span>
                {uiTranslations[language].sections.beetlesOther}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {naturalPollinators.beetles.map((pollinator, index) => (
                  <PollinatorCard key={index} pollinator={pollinator} onView3D={setSelected3DModel} language={language} />
                ))}
              </div>
            </section>
          </div>

          <section className="mb-20">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                {uiTranslations[language].sections.robotic}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {uiTranslations[language].sections.roboticSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {roboticPollinators.map((pollinator, index) => (
                <RoboticPollinatorCard key={index} robot={pollinator} onView3D={setSelected3DModel} language={language} />
              ))}
            </div>
          </section>

          {/* Comparison Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-200">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {uiTranslations[language].comparison.title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Natural Pollinators */}
              <div className="bg-white/80 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800">{uiTranslations[language].comparison.natural.title}</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      {uiTranslations[language].comparison.natural.advantages.title}
                    </h5>
                    <ul className="space-y-2 text-sm text-gray-600 ml-6">
                      <li>{uiTranslations[language].comparison.natural.advantages.item1}</li>
                      <li>{uiTranslations[language].comparison.natural.advantages.item2}</li>
                      <li>{uiTranslations[language].comparison.natural.advantages.item3}</li>
                      <li>{uiTranslations[language].comparison.natural.advantages.item4}</li>
                      <li>{uiTranslations[language].comparison.natural.advantages.item5}</li>
                      <li>{uiTranslations[language].comparison.natural.advantages.item6}</li>
                      <li>{uiTranslations[language].comparison.natural.advantages.item7}</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <span className="text-red-600 mr-2">⚠</span>
                      {uiTranslations[language].comparison.natural.challenges.title}
                    </h5>
                    <ul className="space-y-2 text-sm text-gray-600 ml-6">
                      <li>{uiTranslations[language].comparison.natural.challenges.item1}</li>
                      <li>{uiTranslations[language].comparison.natural.challenges.item2}</li>
                      <li>{uiTranslations[language].comparison.natural.challenges.item3}</li>
                      <li>{uiTranslations[language].comparison.natural.challenges.item4}</li>
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
                  <h4 className="text-2xl font-bold text-gray-800">{uiTranslations[language].comparison.robotic.title}</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      {uiTranslations[language].comparison.robotic.benefits.title}
                    </h5>
                    <ul className="space-y-2 text-sm text-gray-600 ml-6">
                      <li>{uiTranslations[language].comparison.robotic.benefits.item1}</li>
                      <li>{uiTranslations[language].comparison.robotic.benefits.item2}</li>
                      <li>{uiTranslations[language].comparison.robotic.benefits.item3}</li>
                      <li>{uiTranslations[language].comparison.robotic.benefits.item4}</li>
                      <li>{uiTranslations[language].comparison.robotic.benefits.item5}</li>
                      <li>{uiTranslations[language].comparison.robotic.benefits.item6}</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <span className="text-red-600 mr-2">⚠</span>
                      {uiTranslations[language].comparison.robotic.limitations.title}
                    </h5>
                    <ul className="space-y-2 text-sm text-gray-600 ml-6">
                      <li>{uiTranslations[language].comparison.robotic.limitations.item1}</li>
                      <li>{uiTranslations[language].comparison.robotic.limitations.item2}</li>
                      <li>{uiTranslations[language].comparison.robotic.limitations.item3}</li>
                      <li>{uiTranslations[language].comparison.robotic.limitations.item4}</li>
                      <li>{uiTranslations[language].comparison.robotic.limitations.item5}</li>
                      <li>{uiTranslations[language].comparison.robotic.limitations.item6}</li>
                      <li>{uiTranslations[language].comparison.robotic.limitations.item7}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <div className="mt-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6 border border-amber-300">
              <h4 className="text-xl font-bold text-gray-800 mb-3 text-center">
                {uiTranslations[language].comparison.conclusion.title}
              </h4>
              <p className="text-gray-700 text-center leading-relaxed">
                {uiTranslations[language].comparison.conclusion.text}
              </p>
            </div>
          </div>


          {/* Future Vision */}
          <div className="mt-20 mb-20 p-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border border-amber-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{uiTranslations[language].futureVision.title}</h3>
            <p className="text-gray-700 mb-4">
              {uiTranslations[language].futureVision.paragraph1}
            </p>
            <p className="text-sm text-gray-600">
              {uiTranslations[language].futureVision.paragraph2}
            </p>
          </div>
        </div>
      </div >

      {/* 3D Model Viewer Modal */}
      {
        selected3DModel && (
          <Pollinator3DViewer
            pollinator={selected3DModel}
            onClose={() => setSelected3DModel(null)}
            language={language}
          />
        )
      }

      <Footer />
    </div >
  );
}

function PollinatorCard({ pollinator, onView3D, language = 'en' }) {
  return (
    <Link
      href={`/pollinators/gallery/${pollinator.slug}?lang=${language}`}
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
            <span>{uiTranslations[language].card.model3d}</span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{pollinator.name}</h3>
        <p className="text-sm text-gray-600 italic mb-2">{pollinator.scientificName}</p>
        <p className="text-sm text-gray-700 mb-4">{pollinator.region}</p>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {getLocalizedContent(pollinator.description, language)}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-amber-600 font-medium group-hover:text-amber-700 transition-colors duration-200">
            <span>{uiTranslations[language].card.readDetails}</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView3D(pollinator);
            }}
            className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium hover:bg-amber-200 transition-colors duration-200 flex items-center space-x-1"
          >
            <Box className="w-3 h-3" />
            <span>{uiTranslations[language].card.view3d}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

function RoboticPollinatorCard({ robot, onView3D, language = 'en' }) {
  return (
    <Link
      href={`/pollinators/gallery/${robot.slug}?lang=${language}`}
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
          <span>{uiTranslations[language].card.typeRobotic}</span>
        </div>
        <div className="absolute top-2 left-2 flex gap-2">
          <div className="bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {robot.imageAttribution}
          </div>
          {robot.glbPath && (
            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Rotate3D className="w-3 h-3 mr-1" />
              <span>{uiTranslations[language].card.model3d}</span>
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
          {getLocalizedContent(robot.description, language)}
        </p>

        <div className="space-y-3 mb-4">
          <div>
            <span className="text-blue-600 font-medium text-xs uppercase tracking-wider">{uiTranslations[language].card.capabilities}</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {getLocalizedContent(robot.capabilities, language).split(',').map((cap, i) => (
                <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">
                  {cap.trim()}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-blue-600 font-medium text-xs uppercase tracking-wider">{uiTranslations[language].card.applications}</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {getLocalizedContent(robot.applications, language).split(',').map((app, i) => (
                <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full border border-purple-100">
                  {app.trim()}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
            <div>
              <span className="text-green-600 font-medium text-xs uppercase tracking-wider">{uiTranslations[language].card.advantages}</span>
              <ul className="mt-1 space-y-1">
                {getLocalizedContent(robot.advantages, language).split(',').map((adv, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-start">
                    <span className="text-green-500 mr-1.5">•</span>
                    {adv.trim()}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-red-600 font-medium text-xs uppercase tracking-wider">{uiTranslations[language].card.limitations}</span>
              <ul className="mt-1 space-y-1">
                {getLocalizedContent(robot.limitations, language).split(',').map((lim, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-start">
                    <span className="text-red-500 mr-1.5">•</span>
                    {lim.trim()}
                  </li>
                ))}
              </ul>
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
                  e.stopPropagation();
                  onView3D(robot);
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Box className="w-4 h-4" />
                <span>{uiTranslations[language].card.view3d}</span>
              </button>
            )}
            <span
              className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors duration-200"
            >
              <span>{uiTranslations[language].card.readDetails}</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

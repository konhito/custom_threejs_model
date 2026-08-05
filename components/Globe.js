"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  X,
  MapPin,
  Flower,
  Info,
  Rotate3D,
  Target,
  Maximize2,
  Minimize2,
  ArrowLeft,
  Palette,
} from "lucide-react";
import { MusicToggleButton } from "./MusicToggleButton";
import { computeSANCode } from "../lib/sanCode";
import { useTranslation } from "../lib/useTranslation";
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
      const gltfModule =
        await import("three/examples/jsm/loaders/GLTFLoader.js");
      const dracoModule =
        await import("three/examples/jsm/loaders/DRACOLoader.js");
      const controlsModule =
        await import("three/examples/jsm/controls/OrbitControls.js");

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
  const { t } = useTranslation();

  // Helper: try to get translated version of a flower data field,
  // falling back to the raw English value from countriesData.
  const tField = (field, fallback) => {
    if (!country?.translationKey) return fallback;
    const key = `countries.${country.translationKey}.${field}`;
    const val = t(key);
    // If the translation hook returns the key itself it means no translation exists
    return val === key ? fallback : val;
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || !country) return;

    // Load Three.js and create 3D viewer
    const loadModel = async () => {
      try {
        // Load Three.js dynamically
        const { THREE, GLTFLoader, DRACOLoader, OrbitControls } =
          await loadThreeJS();

        if (!modelViewerRef.current) return;

        // Clear previous content
        modelViewerRef.current.innerHTML = "";

        // Scene setup
        const scene = new THREE.Scene();
        // Use a warm neutral background similar to test page
        scene.background = new THREE.Color(0xf2f1ed);

        const camera = new THREE.PerspectiveCamera(
          45,
          modelViewerRef.current.clientWidth /
            modelViewerRef.current.clientHeight,
          0.1,
          100,
        );

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: false,
        });
        renderer.setSize(
          modelViewerRef.current.clientWidth,
          modelViewerRef.current.clientHeight,
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
          "https://www.gstatic.com/draco/versioned/decoders/1.5.6/",
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
                    if (node.material.map)
                      node.material.map.encoding = THREE.sRGBEncoding;
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
            },
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
      className={`fixed inset-0 z-[100000] flex items-center justify-center p-0 sm:p-4 transition-all duration-500 ${
        isVisible
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
        className={`bg-white w-full h-full sm:h-auto sm:max-w-6xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-700 transform ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-90 opacity-0 translate-y-8"
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
              {t("globeModal.back") || "Back"}
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
            <div ref={modelViewerRef} className="w-full h-[40vh] lg:h-full" />

            {!isModelLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm text-gray-500">
                  {t("globeModal.loadingModel") || "Loading model..."}
                </p>
              </div>
            )}

            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md rounded-full px-4 py-2 border border-white/50 shadow-sm hidden sm:block">
              <p className="text-xs text-gray-600 font-medium">
                {t("globeModal.dragToRotate") ||
                  "Drag to rotate • Scroll to zoom"}
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
                {country.flowerNameLocal &&
                  country.flowerNameLocal !== country.flowerName && (
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
                  {t("globeModal.botanicalData") || "1. BOTANICAL DATA"}
                </h2>
                <div className="bg-rose-50 rounded-xl p-5 border border-rose-100 space-y-4">
                  <div>
                    <span className="text-xs font-bold text-rose-700 uppercase block mb-1">
                      {t("globeModal.scientificName") || "Scientific Name"}
                    </span>
                    <span className="text-gray-800 italic">
                      {country.flowerScientificName}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-rose-700 uppercase block mb-1">
                      {t("globeModal.commonNames") || "Common Names"}
                    </span>
                    <span className="text-gray-800">
                      {tField("commonNames", country.flowerName)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-rose-700 uppercase block mb-1">
                      {t("globeModal.description") || "Description"}
                    </span>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {tField("botanicalInfo", country.botanicalInfo)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cultural Significance */}
              <div className="space-y-4">
                <h2 className="text-xs uppercase tracking-[0.3em] text-gray-400 font-semibold">
                  {t("globeModal.culturalHistorical") ||
                    "2. CULTURAL & HISTORICAL DATA"}
                </h2>
                <div className="prose prose-sm text-gray-600">
                  <p>
                    {tField("flowerDescription", country.flowerDescription)}
                  </p>
                  <p className="mt-2">
                    {tField(
                      "culturalSignificance",
                      country.culturalSignificance,
                    )}
                  </p>
                </div>
                {country.historicalOrigin && (
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 mt-3">
                    <span className="text-xs font-bold text-purple-700 uppercase block mb-1">
                      {t("globeModal.historicalOrigin") ||
                        "📖 Historical Origin"}
                    </span>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {tField("historicalOrigin", country.historicalOrigin)}
                    </p>
                  </div>
                )}
                {(country.nationalStatus || country.traditionalUses) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {country.nationalStatus && (
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
                          {t("globeModal.nationalStatus") || "National Status"}
                        </span>
                        <span className="text-sm text-gray-800">
                          {tField("nationalStatus", country.nationalStatus)}
                        </span>
                      </div>
                    )}
                    {country.traditionalUses && (
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
                          {t("globeModal.traditionalUses") ||
                            "Traditional Uses"}
                        </span>
                        <span className="text-sm text-gray-800">
                          {tField("traditionalUses", country.traditionalUses)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Morphology Table */}
              {country.morphology && (
                <div className="space-y-4">
                  <h2 className="text-xs uppercase tracking-[0.3em] text-emerald-500 font-semibold">
                    {t("globeModal.morphology") || "3. MORPHOLOGY"}
                  </h2>
                  <div className="bg-emerald-50 rounded-xl border border-emerald-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody>
                        {[
                          {
                            label: t("globeModal.color") || "Color",
                            value: country.morphology.color,
                          },
                          {
                            label: t("globeModal.shape") || "Shape",
                            value: country.morphology.shape,
                          },
                          {
                            label: t("globeModal.size") || "Size",
                            value: country.morphology.size,
                          },
                          {
                            label: t("globeModal.lifeCycle") || "Life Cycle",
                            value: country.morphology.lifeCycle,
                          },
                        ].map((row, i) => (
                          <tr
                            key={row.label}
                            className={
                              i % 2 === 0 ? "bg-emerald-50" : "bg-white"
                            }
                          >
                            <td className="px-4 py-3 font-bold text-emerald-700 uppercase text-xs w-[100px] align-top">
                              {row.label}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              {row.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {(country.habitat || country.distribution) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {country.habitat && (
                        <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                          <span className="text-xs font-bold text-emerald-700 uppercase block mb-1">
                            Habitat
                          </span>
                          <span className="text-sm text-gray-700">
                            {country.habitat}
                          </span>
                        </div>
                      )}
                      {country.distribution && (
                        <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                          <span className="text-xs font-bold text-emerald-700 uppercase block mb-1">
                            Distribution
                          </span>
                          <span className="text-sm text-gray-700">
                            {country.distribution}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Conservation Data */}
              {(country.conservationStatus || country.mainThreats) && (
                <div className="space-y-4">
                  <h2 className="text-xs uppercase tracking-[0.3em] text-blue-500 font-semibold">
                    {t("globeModal.conservationData") || "4. CONSERVATION DATA"}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {country.conservationStatus && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <span className="text-xs font-bold text-blue-700 uppercase block mb-1">
                          {t("globeModal.iucnStatus") || "🌍 IUCN Status"}
                        </span>
                        <span className="text-sm text-gray-800 font-medium">
                          {tField(
                            "conservationStatus",
                            country.conservationStatus,
                          )}
                        </span>
                      </div>
                    )}
                    {country.mainThreats && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <span className="text-xs font-bold text-blue-700 uppercase block mb-1">
                          {t("globeModal.mainThreats") || "⚠️ Main Threats"}
                        </span>
                        <span className="text-sm text-gray-700">
                          {tField("mainThreats", country.mainThreats)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Nahiara Metadata */}
              {(country.pfnoClassification || country.nahiaraMeasure) && (
                <div className="space-y-4">
                  <h2 className="text-xs uppercase tracking-[0.3em] text-violet-500 font-semibold">
                    {t("globeModal.nahiaraMetadata") || "5. NAHIARA METADATA"}
                  </h2>

                  {/* SAN Code Display */}
                  {country.sanCode && (
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-5 border border-violet-100 text-center">
                      <div className="text-2xl font-bold text-violet-800 font-mono tracking-wider mb-1">
                        {country.sanCode}
                      </div>
                      <div className="text-xs text-violet-500">
                        Assigned S.A.N. Code
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {country.pfnoClassification && (
                      <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
                        <span className="text-xs font-bold text-violet-700 uppercase block mb-1">
                          {t("globeModal.pfnoClassification") ||
                            "PFNO Classification"}
                        </span>
                        <span className="text-sm text-gray-800 font-medium">
                          {tField(
                            "pfnoClassification",
                            country.pfnoClassification,
                          )}
                        </span>
                      </div>
                    )}
                    {country.relevantPollinator && (
                      <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
                        <span className="text-xs font-bold text-violet-700 uppercase block mb-1">
                          {t("globeModal.relevantPollinator") ||
                            "🐝 Relevant Pollinator"}
                        </span>
                        <span className="text-sm text-gray-700">
                          {tField(
                            "relevantPollinator",
                            country.relevantPollinator,
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Nahiara Measure */}
              {country.nahiaraMeasure && (
                <div className="space-y-4">
                  <h2 className="text-xs uppercase tracking-[0.3em] text-amber-500 font-semibold">
                    {t("globeModal.nahiaraMeasure") || "6. NAHIARA MEASURE"}
                  </h2>

                  {/* Total Score */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100 text-center">
                    <div className="text-4xl font-bold text-amber-700 mb-1">
                      {country.nahiaraMeasure.total}/
                      {country.nahiaraMeasure.max}
                    </div>
                    <div className="text-sm text-amber-600 font-medium">
                      {country.nahiaraMeasure.statusEN ||
                        country.nahiaraMeasure.status}
                      {country.nahiaraMeasure.rank &&
                        ` · ${t("globeModal.rankGlobally", { rank: country.nahiaraMeasure.rank }) || "· Rank #" + country.nahiaraMeasure.rank + " globally"}`}
                    </div>
                  </div>

                  {/* Sub-dimensions */}
                  <div className="space-y-3">
                    {[
                      {
                        label: "Floral Heartbeat (Population)",
                        value: country.nahiaraMeasure.latidoFloral,
                        color: "bg-green-500",
                      },
                      {
                        label: "Cultural Memory",
                        value: country.nahiaraMeasure.memoriaCultural,
                        color: "bg-purple-500",
                      },
                      {
                        label: "Public Voice",
                        value: country.nahiaraMeasure.vozPublica,
                        color: "bg-blue-500",
                      },
                      {
                        label: "Protection Shield",
                        value: country.nahiaraMeasure.escudoProteccion,
                        color: "bg-amber-500",
                      },
                      {
                        label: "Petal of Hope",
                        value: country.nahiaraMeasure.petaloEsperanza,
                        color: "bg-rose-500",
                      },
                    ].map((dim) => (
                      <div key={dim.label}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600 font-medium">
                            {dim.label}
                          </span>
                          <span className="text-xs font-bold text-gray-800">
                            {dim.value}/5
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className={`${dim.color} h-2.5 rounded-full transition-all duration-700`}
                            style={{ width: `${(dim.value / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scorfidon Protocol */}
              {country.scorfidon && (
                <div className="space-y-4">
                  <h2 className="text-xs uppercase tracking-[0.3em] text-red-500 font-semibold">
                    {t("globeModal.scorfidonProtocol") ||
                      "7. SCORFIDON PROTOCOL"}
                  </h2>
                  <p className="text-xs text-gray-500 italic">
                    {t("globeModal.scorfidonSubtitle") ||
                      "Threats and their guardians — the balance between destruction and restoration."}
                  </p>
                  <div className="space-y-3">
                    {Object.values(country.scorfidon).map((entry) => (
                      <div
                        key={entry.code}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-gray-400">
                              {entry.code}
                            </span>
                            <span className="text-sm font-bold text-gray-800">
                              {tField(
                                `scorfidon.${entry.code}.threat`,
                                entry.threat,
                              )}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-red-600">
                            {entry.impact} {t("globeModal.petals") || "petals"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          {tField(
                            `scorfidon.${entry.code}.description`,
                            entry.description,
                          )}
                        </p>
                        <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-100">
                          <span className="text-xs text-emerald-700">
                            🛡️{" "}
                            {tField(
                              `scorfidon.${entry.code}.guardian`,
                              entry.guardian,
                            )}
                          </span>
                          <span className="text-xs font-bold text-emerald-600 ml-auto">
                            +{entry.guardianPower}{" "}
                            {t("globeModal.petals") || "petals"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Araihan Measurement */}
              {country.araihanScore && (
                <div className="space-y-4">
                  <h2 className="text-xs uppercase tracking-[0.3em] text-indigo-500 font-semibold">
                    {t("globeModal.araihanMeasurement") ||
                      "8. ARAIHAN MEASUREMENT"}
                  </h2>
                  <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 text-center">
                    <div className="text-3xl font-bold text-indigo-700 mb-1">
                      {country.araihanScore}
                    </div>
                    <div className="text-xs text-indigo-500">
                      {t("globeModal.araihanScore") || "Araihan Score"}
                    </div>
                  </div>
                </div>
              )}

              {/* Final Synthesis */}
              {country.nahiaraSynthesis && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                  <h2 className="text-xs uppercase tracking-[0.3em] text-green-600 font-semibold mb-3">
                    {t("globeModal.nahiaraSynthesis") || "✅ NAHIARA SYNTHESIS"}
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {tField("nahiaraSynthesis", country.nahiaraSynthesis)}
                  </p>
                </div>
              )}

              {/* Country Stats */}
              <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {t("globeModal.country") || "Country"}
                  </p>
                  <p className="font-semibold text-gray-900">
                    {country.country}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {t("globeModal.capital") || "Capital"}
                  </p>
                  <p className="font-semibold text-gray-900">
                    {country.capital}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {t("globeModal.language") || "Language"}
                  </p>
                  <p className="font-semibold text-gray-900">
                    {country.language}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {t("globeModal.currency") || "Currency"}
                  </p>
                  <p className="font-semibold text-gray-900">
                    {country.currency}
                  </p>
                </div>
              </div>

              {/* Action Button - Explore Details & Quiz */}
              <Link 
                href={`/game?country=${country.id}`}
                className="block w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl text-center transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center gap-3">
                  <Flower className="w-5 h-5" />
                  <span>Explore 8 Parameters & Take Quiz</span>
                  <span className="text-xl">→</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GlobeComponent({
  showOvalBorder = true,
  showBackground = true,
}) {
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
  const countriesData = useMemo(
    () => [
      {
        id: "IN_LOTUS",
        translationKey: "indiaLotus",
        name: "Sacred Lotus",
        country: "India",
        countryCode: "IN",
        lat: 20.5937,
        lng: -55.9629, // Adjusted for custom globe
        capital: "New Delhi",
        population: "1.4 billion",
        continent: "Asia",
        language: "Hindi, English",
        currency: "Indian Rupee (INR)",
        flowerName: "Sacred Lotus",
        flowerScientificName: "Nelumbo nucifera Gaertn.",
        flowerDescription:
          "The Sacred Lotus is India's national flower, officially adopted in 1950. It symbolizes purity, enlightenment, and rebirth — rising from muddy waters to bloom magnificently, representing the journey from darkness to light. Its presence in Indian civilization spans over 5,000 years.",
        culturalSignificance:
          "Sacred in Hinduism and Buddhism, the lotus is the seat of deities Lakshmi, Saraswati, and Brahma. In Buddhist iconography, the Buddha is often depicted sitting upon a lotus throne. The flower represents divine beauty, purity, and spiritual awakening. It appears in the Rigveda, the oldest Hindu scripture, and is woven into art, architecture, and philosophy across South and Southeast Asia.",
        botanicalInfo:
          "An aquatic perennial rhizomatous plant with large, fragrant pink or white flowers that can reach 30 cm in diameter. The lotus possesses a remarkable self-cleaning mechanism (the 'lotus effect') due to its superhydrophobic leaf surface. Its seeds can remain viable for centuries — a 1,300-year-old seed was successfully germinated in 1994.",
        // Extended Botanical Data (Diamond Journal)
        botanicalFamily: "Nelumbonaceae",
        commonNames:
          "Sacred Lotus, Indian Lotus, Bean of India, Kamal (कमल), Padma (पद्म), Tāmarai (தாமரை)",
        morphology: {
          color:
            "Pink to white petals with a golden-yellow receptacle; leaves are blue-green, peltate, and superhydrophobic",
          shape:
            "Large solitary flowers, actinomorphic, with 20–30 petals arranged spirally; distinctive flat-topped seed pod (torus)",
          size: "Flowers 15–30 cm diameter; leaves up to 60 cm; plant height 100–150 cm above water",
          lifeCycle:
            "Perennial aquatic herb with thick rhizomes; flowers June–September in the Northern Hemisphere",
        },
        habitat:
          "Shallow, warm, still or slow-moving freshwater — lakes, ponds, marshes, flooded paddy fields, and temple tanks across tropical and subtropical regions",
        distribution:
          "Native to the Indian subcontinent, Southeast Asia, and northern Australia. Widely cultivated across East Asia (China, Japan, Korea, Vietnam) and introduced to Egypt, Iran, and parts of the Americas",
        // Cultural & Historical Data
        historicalOrigin:
          "The lotus has been revered in the Indian subcontinent since the Vedic period (1500 BCE). Ancient texts including the Rigveda, Bhagavad Gita, and Lotus Sutra reference it as a symbol of creation and cosmic order. In Egyptian-Indian trade routes, the lotus connected two of the world's oldest civilizations. The Mughal emperors incorporated lotus motifs into architectural masterworks including the Taj Mahal.",
        nationalStatus:
          "Official national flower of India since 1950, adopted at the time of the Constitution",
        traditionalUses:
          "Religious offerings and temple decoration; Ayurvedic medicine (seeds, rhizomes, petals used for digestive and cardiac remedies); cuisine (lotus root/kamal kakdi is a staple vegetable; seeds eaten roasted or in desserts); textile fiber from stems (lotus silk); ornamental cultivation in temple tanks and gardens",
        // Conservation Data
        conservationStatus: "Least Concern (LC) — IUCN Red List",
        mainThreats:
          "Wetland drainage and conversion for agriculture; water pollution from industrial and agricultural runoff; habitat loss due to urbanization; over-harvesting of rhizomes and seeds in some regions; invasive aquatic species competition",
        // Nahiara Metadata
        pfnoClassification: "Official National Flower",
        relevantPollinator:
          "Coleoptera (beetles) — the lotus employs thermogenic cantharophily, raising its flower temperature to attract beetle pollinators. Also visited by Apis cerana (Asian honeybee).",
        // Nahiara Measure (from official Medida Nahiara platform)
        nahiaraMeasure: {
          total: 22,
          max: 25,
          rank: 7,
          status: "Living EcoRoot",
          latidoFloral: 4, // Population health
          memoriaCultural: 5, // Cultural memory
          vozPublica: 5, // Public voice
          escudoProteccion: 4, // Protection shield
          petaloEsperanza: 4, // Petal of hope
        },
        // Araihan Measurement
        araihanScore: 22,
        // Scorfidon Protocol — threats and guardians
        scorfidon: {
          cambiClimatico: {
            code: "SCF-001",
            threat: "Climate Change",
            impact: -1,
            description:
              "Rising temperatures and altered monsoon patterns threaten wetland ecosystems essential for lotus habitats.",
            guardian: "Natural Balance",
            guardianPower: +1,
          },
          deforestacion: {
            code: "SCF-002",
            threat: "Deforestation",
            impact: -2,
            description:
              "Clearing of forested wetlands disrupts the interconnected water systems that sustain lotus populations.",
            guardian: "Reforestation",
            guardianPower: +2,
          },
          explotacion: {
            code: "SCF-003",
            threat: "Exploitation",
            impact: -3,
            description:
              "Over-harvesting of lotus rhizomes and seeds for commercial purposes; uncontrolled tourism at sacred lotus lakes.",
            guardian: "Floral Justice",
            guardianPower: +3,
          },
          ignorancia: {
            code: "SCF-004",
            threat: "Ignorance",
            impact: -4,
            description:
              "Urban populations losing connection with traditional wetland ecosystems and the cultural significance of lotus cultivation.",
            guardian: "Education",
            guardianPower: +4,
          },
          fuegoIntencionado: {
            code: "SCF-005",
            threat: "Intentional Fire",
            impact: -5,
            description:
              "Deliberate burning of wetland margins for land conversion destroys lotus seed banks and rhizome networks.",
            guardian: "Water",
            guardianPower: +5,
          },
        },
        // Final Synthesis
        nahiaraSynthesis:
          "Nelumbo nucifera integrates into the Nahiara universe with code SAN-F-161,001, evaluated at level 22/25 (Living EcoRoot) in the Nahiara Measure — ranking 7th globally. As the official national flower of India since 1950, the Sacred Lotus is one of humanity's most culturally significant plants, revered across Hinduism, Buddhism, and ancient Egyptian civilization. Despite threats from wetland loss and climate change, its deep cultural roots, legal protection, and widespread cultivation ensure its persistence. The lotus serves as the Master Reference Model for the AquaMundi flower system.",
        color: "#ff6b9d",
        special: true,
        size: 0.14,
        flowerNameLocal: "कमल",
        localLanguageName: "Hindi",
        gltfPath: "/lotus.glb",
        musicPath:
          "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/National_music/Folk+Project+(India).mp3.mpeg",
        sanCode: "SAN-F-161,001",
      },
      {
        id: "US_ROSE",
        translationKey: "usRose",
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
        historicalOrigin:
          "Roses have been cultivated for over 5,000 years. Ancient Romans used them in festivals and perfumery. In 1986, President Ronald Reagan signed legislation designating Rosa as the official national floral emblem of the United States. The rose's symbolic power spans Greek mythology (sacred to Aphrodite), Christianity (the Virgin Mary's flower), and heraldry (the Wars of the Roses in England).",
        nationalStatus:
          "Official national floral emblem of the United States since 1986.",
        traditionalUses:
          "Perfumery and essential oil production (rose water, attar); ornamental gardening; cut-flower industry for romantic and ceremonial occasions; culinary uses (rose petal jam, tea); and traditional medicine for skin inflammations.",
        conservationStatus:
          "Least Concern (LC) — IUCN Red List (for most wild species). Wild habitats are generally stable, though some rare native species are protected.",
        mainThreats:
          "Habitat fragmentation for native wild roses; in commercial cultivation, heavy reliance on pesticides and monoculture practices reducing genetic diversity and harming local pollinators.",
        pfnoClassification: "Official National Floral Emblem",
        relevantPollinator:
          "Apis mellifera (European Honey Bee) and various Bombus (Bumblebee) species; wild single-petaled roses are particularly important for native bee populations.",
        nahiaraSynthesis:
          "Rosa (hybrid cultivars) integrates into the Nahiara universe evaluated at 23/25 (Living EcoRoot) in the Nahiara Measure. It is arguably the most globally recognized flower in the AquaMundi registry, blending ancient human cultivation history with profound cultural resonance. Its ecological role as a pollinator anchor is sometimes overshadowed by its commercial cut-flower status.",
        botanicalFamily: "Rosaceae",
        commonNames: "Rose, American Rose",
        scorfidon: {
          enfermedad: {
            code: "SCF-010",
            threat: "Rose Rosette Disease",
            impact: -3,
            description:
              "A devastating viral disease spread by microscopic mites that deforms and kills roses.",
            guardian: "Genetic Resistance",
            guardianPower: 3,
          },
          quimicos: {
            code: "SCF-011",
            threat: "Pesticide Overuse",
            impact: -2,
            description:
              "Heavy chemical use in commercial cultivation harms local pollinator populations.",
            guardian: "Organic Cultivation",
            guardianPower: 2,
          },
        },
        morphology: {
          color:
            "Shades of red, pink, white, yellow; cultivated varieties offer extensive palettes",
          shape:
            "Multi-petaled, radial symmetry (actinomorphic) with stamens and pistils central",
          size: "Flowers 5–15 cm in diameter; bushes reach up to 2m in height",
          lifeCycle:
            "Perennial woody shrub blooming profusely from late spring to autumn",
        },
        habitat:
          "Adaptable to temperate zones worldwide — gardens, parks, roadsides; native species in meadows, forest edges, and rocky hillsides across the Northern Hemisphere.",
        distribution:
          "Native to Asia, Europe, North America, and North Africa. The US grows approximately 1.2 billion cut roses annually; major cultivation in California, Oregon, and Texas.",
        color: "#e91e63",
        special: true,
        size: 0.13,
        flowerNameLocal: "Rose",
        localLanguageName: "English",
        gltfPath:
          "/api/glb-proxy?url=" +
          encodeURIComponent(
            "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/Flower_America_Web.glb",
          ),
        musicPath:
          "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/National_music/Folk+Project+(USA).mp3.mpeg",
        sanCode: computeSANCode("Rosa", "F"),
      },
      {
        id: "CA_MAPLE",
        translationKey: "canadaMaple",
        name: "Maple Leaf",
        country: "Canada",
        countryCode: "CA",
        lat: 67.756,
        lng: 120.852,
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
        historicalOrigin:
          "The maple leaf became a symbol of Canadian identity as early as 1700. French Canadians adopted it as an emblem in the 1800s. It appeared on Canadian coins since 1876, and became the central emblem of the Canadian flag on February 15, 1965.",
        nationalStatus:
          "National symbol of Canada — featured prominently on the national flag since 1965.",
        traditionalUses:
          "Maple syrup production (Canada produces ~70% of the world's maple syrup); decoration; cultural festivals; woodworking and furniture; the sugar maple is an important timber tree.",
        conservationStatus:
          "Least Concern (LC) — IUCN Red List. Sugar maple populations face pressure from climate change and acid rain.",
        mainThreats:
          "Climate change shifting the maple range northward; acid rain depleting soil nutrients; invasive pests (Asian longhorned beetle, spongy moth); urban development encroaching on forest habitat.",
        pfnoClassification: "National Cultural Symbol",
        relevantPollinator:
          "Apis mellifera (honeybee) and Bombus spp. (bumblebees) — maple flowers produce abundant early-spring nectar vital for overwintering colonies.",
        nahiaraSynthesis:
          "Acer saccharum integrates into the Nahiara universe, evaluated at 20/25 (Stable) in the Nahiara Measure. Canada's maple leaf is one of the world's most instantly recognized national symbols. Its cultural depth — from indigenous traditions to the national flag — and its ecological role as a keystone forest tree make it an anchor species in AquaMundi.",
        nahiaraMeasure: {
          total: 20,
          max: 25,
          rank: 15,
          status: "Stable",
          latidoFloral: 4,
          memoriaCultural: 5,
          vozPublica: 4,
          escudoProteccion: 4,
          petaloEsperanza: 3,
        },
        araihanScore: 20,
        botanicalFamily: "Sapindaceae",
        commonNames: "Sugar Maple, Rock Maple, Hard Maple",
        scorfidon: {
          acido: {
            code: "SCF-020",
            threat: "Acid Rain",
            impact: -3,
            description:
              "Industrial pollution alters soil chemistry, stripping essential nutrients and weakening maple roots.",
            guardian: "Clean Air Regulations",
            guardianPower: 3,
          },
          plaga: {
            code: "SCF-021",
            threat: "Asian Longhorned Beetle",
            impact: -4,
            description:
              "An invasive insect pest that bores into hardwood and can destroy vast swathes of maple forests.",
            guardian: "Forestry Stewardship",
            guardianPower: 4,
          },
        },
        color: "#ff0000",
        special: true,
        size: 0.15,
        flowerNameLocal: "Feuille d'érable",
        localLanguageName: "French",
        gltfPath: null,
        musicPath:
          "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/National_music/Folk+Project+(Canada).mp3+(1).mpeg",
        sanCode: computeSANCode("Acer", "F"),
      },
      {
        id: "ES_CARNATION",
        translationKey: "spainCarnation",
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
        nahiaraMeasure: {
          total: 19,
          max: 25,
          rank: 22,
          status: "Stable",
          latidoFloral: 5,
          memoriaCultural: 4,
          vozPublica: 4,
          escudoProteccion: 3,
          petaloEsperanza: 3,
        },
        araihanScore: 19,
        historicalOrigin:
          "The carnation (Dianthus, meaning 'flower of the gods') was cultivated by ancient Greeks and Romans for garlands. In Spain, the red carnation (clavel) became deeply associated with folklore, flamenco dancing, and religious festivals. It represents passion and affection in Spanish culture.",
        nationalStatus:
          "Widely regarded as the national flower of Spain, though deeply rooted in popular culture rather than official absolute decree.",
        traditionalUses:
          "Ornamental use in Spanish festivals, particularly during Semana Santa and flamenco performances; commercial cut-flower industry; traditional medicine uses in teas to relieve stress and inflammation.",
        conservationStatus:
          "Least Concern (LC) for cultivated varieties; some wild Dianthus species face local habitat pressures.",
        mainThreats:
          "Intensive agricultural practices in commercial farming depleting local water tables; climate-change induced droughts in the Mediterranean basin.",
        pfnoClassification: "National Cultural Symbol",
        relevantPollinator:
          "Lepidoptera (butterflies and moths) — the deep tubular flowers are specialized for long-tongued pollinators.",
        nahiaraSynthesis:
          "Dianthus caryophyllus integrates into the Nahiara universe evaluated at 19/25 (Stable) in the Nahiara Measure. The Spanish carnation is a vibrant expression of human emotion within AquaMundi, representing the intersection of cultural passion and agricultural resilience in arid Mediterranean climates.",
        botanicalFamily: "Caryophyllaceae",
        commonNames: "Carnation, Clove Pink, Clavel",
        scorfidon: {
          sequia: {
            code: "SCF-030",
            threat: "Water Scarcity",
            impact: -3,
            description:
              "Intensifying Mediterranean droughts threaten traditional un-irrigated cultivation methods.",
            guardian: "Water Conservation",
            guardianPower: 3,
          },
          monocultivo: {
            code: "SCF-031",
            threat: "Monoculture Farming",
            impact: -2,
            description:
              "Industrial cut-flower production limits genetic diversity.",
            guardian: "Crop Diversity",
            guardianPower: 2,
          },
        },
        morphology: {
          color:
            "Classic reds and pinks, often bi-colored or speckled in cultivated forms",
          shape:
            "Fringed or deeply toothed petals forming a dense, ruffled bloom",
          size: "Blooms 3–5 cm in diameter; stems grow 40–80 cm tall",
          lifeCycle:
            "Herbaceous perennial blooming profusely in warm Mediterranean climates",
        },
        habitat:
          "Mediterranean gardens, ornamental fields, and rocky limestone slopes; native to the Mediterranean basin from southern Europe to western Asia.",
        distribution:
          "Native to the Mediterranean region. Cultivated globally as one of the world's most popular cut flowers. Spain is a major European producer.",
        color: "#ff8f00",
        special: false,
        size: 0.07,
        flowerNameLocal: "Clavel",
        localLanguageName: "Spanish",
        gltfPath:
          "/api/glb-proxy?url=" +
          encodeURIComponent(
            "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/Espana_Carnation.glb",
          ),
        musicPath: "/Folk Project (España).mp3",
        sanCode: computeSANCode("Dianthus caryophyllus", "F"),
      },
      {
        id: "ZA_PROTEA",
        translationKey: "southAfricaProtea",
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
        historicalOrigin:
          "The King Protea has been part of the Cape Floral Kingdom for millions of years. It was formally declared South Africa's national flower in 1976. The genus Protea was named by Carl Linnaeus after the Greek god Proteus — who could change form — reflecting the extraordinary variety within the family. The flower features on the South African coat of arms and the Proteas cricket team badge.",
        nationalStatus:
          "Official national flower of South Africa since 1976; features on coins and the national cricket team badge.",
        traditionalUses:
          "Ornamental flower in the global cut flower industry; Fynbos ecosystem keystone for local pollinators; seeds eaten historically by indigenous peoples; honey produced from protea nectar is a Cape specialty.",
        conservationStatus:
          "Least Concern (LC) globally — IUCN Red List. However, the Cape Floral Kingdom (Fynbos biome) is a global biodiversity hotspot with many related species under threat.",
        mainThreats:
          "Invasive alien plants smothering Fynbos habitat; inappropriate fire regimes; urban sprawl; climate change altering rainfall patterns in the Cape; over-collection for the cut flower trade.",
        pfnoClassification: "Official National Flower",
        relevantPollinator:
          "Sugarbirds (Promerops cafer) and sunbirds (Nectarinia spp.) — the King Protea is primarily bird-pollinated. Also visited by Cape honey bees (Apis mellifera capensis).",
        nahiaraSynthesis:
          "Protea cynaroides integrates into the Nahiara universe, evaluated at 21/25 (Stable) in the Nahiara Measure. The King Protea is a symbol of the Cape Floral Kingdom, one of the world's six plant kingdoms and the most botanically diverse. As South Africa's national flower, it bridges ancient evolutionary lineages and modern conservation imperatives.",
        nahiaraMeasure: {
          total: 21,
          max: 25,
          rank: 11,
          status: "Stable",
          latidoFloral: 3,
          memoriaCultural: 5,
          vozPublica: 4,
          escudoProteccion: 5,
          petaloEsperanza: 4,
        },
        araihanScore: 21,
        botanicalFamily: "Proteaceae",
        commonNames: "King Protea, Giant Protea, Honeypot",
        scorfidon: {
          invasoras: {
            code: "SCF-040",
            threat: "Invasive Alien Plants",
            impact: -4,
            description:
              "Fast-growing invasive trees like pines and wattles outcompete the Protea for water and light.",
            guardian: "Habitat Restoration",
            guardianPower: 4,
          },
          fuegocontrolado: {
            code: "SCF-041",
            threat: "Unnatural Fire Regimes",
            impact: -3,
            description:
              "Fires that burn too frequently prevent the slow-growing Protea from reaching maturity.",
            guardian: "Ecological Fire Management",
            guardianPower: 3,
          },
        },
        color: "#f06292",
        special: true,
        size: 0.1,
        flowerNameLocal: "Koningsuikerbos",
        localLanguageName: "Afrikaans",
        gltfPath:
          "/api/glb-proxy?url=" +
          encodeURIComponent(
            "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/King_Protea.glb",
          ),
        musicPath: "/music/SouthAfrica.mp3",
        sanCode: computeSANCode("Protea cynaroides", "F"),
      },
      {
        id: "CO_ORCHID",
        translationKey: "colombiaOrchid",
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
        historicalOrigin:
          "Declared Colombia's national flower on October 16, 1936. Named in honor of Dr. José Jerónimo Triana, a pioneering 19th-century Colombian botanist. The Cattleya trianae is also known as the Christmas Orchid (Orquídea de Navidad) as it blooms in December. Colombia is home to over 4,000 orchid species — more than any other country.",
        nationalStatus: "Official national flower of Colombia since 1936.",
        traditionalUses:
          "Ornamental cultivation and high-end floristry; ecotourism attraction in cloud forests; traditional medicine by indigenous Andean communities; international orchid shows and exhibitions.",
        conservationStatus:
          "Endangered (EN) — IUCN Red List. Its cloud forest habitat is severely threatened and wild populations have declined sharply from over-collection.",
        mainThreats:
          "Deforestation of Andean cloud forests for agriculture and cattle ranching; illegal collection for the orchid trade; climate change altering cloud forest microclimates; habitat loss from coca cultivation eradication programs.",
        pfnoClassification: "Official National Flower — Endangered Species",
        relevantPollinator:
          "Eulaema spp. (orchid bees) — long-tongued bees that are the primary pollinators of Cattleya orchids, collecting fragrance compounds from the flowers.",
        nahiaraSynthesis:
          "Cattleya trianae integrates into the Nahiara universe, evaluated at 20/25 (Stable) in the Nahiara Measure. Colombia's Christmas Orchid is one of the most exquisitely beautiful national flowers in AquaMundi. As a cloud forest species, it serves as a sentinel indicator of Andean ecosystem health — its decline mirrors the broader crisis of tropical montane biodiversity.",
        nahiaraMeasure: {
          total: 20,
          max: 25,
          rank: 18,
          status: "Stable",
          latidoFloral: 2,
          memoriaCultural: 5,
          vozPublica: 5,
          escudoProteccion: 3,
          petaloEsperanza: 5,
        },
        araihanScore: 20,
        botanicalFamily: "Orchidaceae",
        commonNames: "Christmas Orchid, Flor de Mayo",
        scorfidon: {
          deforestacion: {
            code: "SCF-050",
            threat: "Deforestation",
            impact: -5,
            description:
              "Loss of primary cloud forest habitat removes the host trees on which these epiphytes depend.",
            guardian: "Cloud Forest Conservation",
            guardianPower: 4,
          },
          caza: {
            code: "SCF-051",
            threat: "Illegal Collection",
            impact: -4,
            description:
              "Poaching of wild specimens for the black-market horticultural trade.",
            guardian: "Ethical Cultivation",
            guardianPower: 4,
          },
        },
        color: "#ba68c8",
        special: true,
        size: 0.09,
        flowerNameLocal: "Orquídea de Navidad",
        localLanguageName: "Spanish",
        gltfPath:
          "/api/glb-proxy?url=" +
          encodeURIComponent(
            "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/Orqui%CC%81dea_Tricolor.glb",
          ),
        musicPath: "/music/Colombia.mp3",
        sanCode: computeSANCode("Cattleya trianae", "F"),
      },
      {
        id: "PK_JASMINE",
        translationKey: "pakistanJasmine",
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
        nahiaraMeasure: {
          total: 20,
          max: 25,
          rank: 16,
          status: "Stable",
          latidoFloral: 4,
          memoriaCultural: 5,
          vozPublica: 4,
          escudoProteccion: 3,
          petaloEsperanza: 4,
        },
        araihanScore: 20,
        historicalOrigin:
          "Jasmine was brought to South Asia along ancient Silk Road trade routes. In Mughal India, it adorned imperial gardens and was used in attar (essential oil) production. In Pakistan, 'Chambeli' appears in classical Urdu poetry by Mirza Ghalib and Allama Iqbal, symbolizing spiritual longing.",
        nationalStatus: "Official national flower of Pakistan.",
        traditionalUses:
          "Garlands for weddings and religious ceremonies; essential oil production; hair decoration for women (gajra); brewing of jasmine tea; Ayurvedic and Unani medicine.",
        conservationStatus:
          "Least Concern (LC) — IUCN Red List. Wild populations in Himalayan foothills are stable.",
        mainThreats:
          "Habitat loss in foothills from agricultural expansion; climate change altering bloom timing; over-collection for essential oil industry.",
        pfnoClassification: "Official National Flower",
        relevantPollinator:
          "Sphingidae (Sphinx moths) — primarily night-pollinated by long-tongued hawk-moths attracted by its nocturnal fragrance.",
        nahiaraSynthesis:
          "Jasminum officinale integrates into the Nahiara universe evaluated at 20/25 (Stable) in the Nahiara Measure. As Pakistan's official national flower, jasmine carries extraordinary cultural weight in Urdu poetry and Sufi tradition. Its nocturnal perfume makes it one of the most lyrically potent flowers in the AquaMundi system.",
        botanicalFamily: "Oleaceae",
        commonNames: "Common Jasmine, Poet's Jasmine, Chambeli",
        scorfidon: {
          calor: {
            code: "SCF-060",
            threat: "Urban Heat Islands",
            impact: -2,
            description:
              "Increasing temperatures in dense cities interfere with nocturnal scent release.",
            guardian: "Cooling Urban Canopies",
            guardianPower: 2,
          },
          cosecha: {
            code: "SCF-061",
            threat: "Over-harvesting",
            impact: -3,
            description:
              "Unregulated picking of wild flowers for essential oils reduces natural seed set.",
            guardian: "Sustainable Harvesting",
            guardianPower: 3,
          },
        },
        morphology: {
          color:
            "Pure white, star-shaped blossoms known for intense evening fragrance",
          shape: "Tubular base opening into five (or more) spreading petals",
          size: "Flowers 2-3 cm; sprawling climbing shrub grows up to 10m",
          lifeCycle:
            "Perennial deciduous climbing shrub blooming heavily in summer",
        },
        habitat:
          "Gardens, parks, hedgerows, and cultivated areas throughout Pakistan and South Asia; native to the Himalayas, the Caucasus, and western China at altitudes of 1,500–4,000 m.",
        distribution:
          "Native to the Himalayas and adjacent regions; naturalized across South Asia, the Mediterranean, and parts of the Americas. Pakistan is a major producer of jasmine essential oil.",
        color: "#4caf50",
        special: false,
        size: 0.08,
        flowerNameLocal: "چنبیلی",
        localLanguageName: "Urdu",
        gltfPath:
          "/api/glb-proxy?url=" +
          encodeURIComponent(
            "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/Pakistani_Jasmine.glb",
          ),
        musicPath:
          "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/National_music/Folk+Project+(Pakistan).mp3.mpeg",
        sanCode: computeSANCode("Jasminum officinale", "F"),
      },
      {
        id: "AR_CEIBO",
        translationKey: "argentinaCeibo",
        name: "Ceibo",
        country: "Argentina",
        countryCode: "AR",
        lat: -29.9511,
        lng: 151.9987,
        capital: "Buenos Aires",
        population: "46 million",
        continent: "South America",
        language: "Spanish",
        currency: "Argentine Peso (ARS)",
        flowerName: "Ceibo",
        flowerScientificName: "Erythrina crista-galli",
        flowerDescription:
          "The ceibo is Argentina's national flower, declared in 1942. Its vivid crimson blossoms symbolize the strength, courage, and passionate spirit of the Argentine people.",
        culturalSignificance:
          "Legend tells of Anaí, a Guaraní woman who was burned at the stake but transformed into a ceibo tree, its red flowers representing her undying spirit. The tree is deeply woven into Argentine folklore and identity.",
        botanicalInfo:
          "A deciduous tree reaching 5–10 m, the ceibo produces striking coral-red, claw-shaped flowers in clusters. It thrives along riverbanks and wetlands across the Río de la Plata basin and is also the national tree of Uruguay.",
        historicalOrigin:
          "The ceibo was declared Argentina's national flower on December 2, 1942 by Presidential Decree No. 138.974. It is also the national tree of Uruguay (since 1966). The Guaraní people wove the ceibo into their oral traditions long before European colonization. The Guaraní name 'seibo' predates Spanish contact.",
        nationalStatus:
          "Official national flower of Argentina since 1942; also the national tree of Uruguay.",
        traditionalUses:
          "Traditional Guaraní medicine (bark for skin conditions); ornamental tree along riverbankss and plazas; timber used for light construction; nectar-rich flowers important for hummingbirds and native bees.",
        conservationStatus:
          "Least Concern (LC) — IUCN Red List. Populations are stable across the Plata basin.",
        mainThreats:
          "Wetland drainage and river canalization disrupting riparian habitats; urbanization of Río de la Plata riverbanks; climate-driven flooding and drought cycles affecting seedling establishment.",
        pfnoClassification: "Official National Flower",
        relevantPollinator:
          "Trochilidae (hummingbirds) — primarily pollinated by the Glittering-bellied Emerald (Chlorostilbon lucidus) and Gilded Hummingbird (Hylocharis chrysura). Also visited by large Xylocopa bees.",
        nahiaraSynthesis:
          "Erythrina crista-galli integrates into the Nahiara universe, evaluated at 19/25 (Stable) in the Nahiara Measure. Argentina's ceibo bridges indigenous Guaraní mythology and modern national identity. As a wetland tree, it is an indicator of Río de la Plata ecosystem health and a keystone species for hummingbird migration corridors.",
        nahiaraMeasure: {
          total: 19,
          max: 25,
          rank: 25,
          status: "Stable",
          latidoFloral: 4,
          memoriaCultural: 5,
          vozPublica: 3,
          escudoProteccion: 4,
          petaloEsperanza: 3,
        },
        araihanScore: 19,
        botanicalFamily: "Fabaceae",
        commonNames: "Cockspur Coral Tree, Ceibo, Seibo",
        scorfidon: {
          erosion: {
            code: "SCF-070",
            threat: "Riverbank Erosion",
            impact: -3,
            description:
              "Altered river flows along the Paraná delta destabilize the ceibo's natural gallery forest habitat.",
            guardian: "Riparian Restoration",
            guardianPower: 3,
          },
          urbano: {
            code: "SCF-071",
            threat: "Urban Expansion",
            impact: -2,
            description:
              "Clearing of wetland areas restricts the tree's natural range.",
            guardian: "Wetland Protection",
            guardianPower: 3,
          },
        },
        color: "#d32f2f",
        special: true,
        size: 0.12,
        flowerNameLocal: "Ceibo",
        localLanguageName: "Spanish",
        gltfPath:
          "/api/glb-proxy?url=" +
          encodeURIComponent(
            "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/National_music/Argentina_Ceibo.glb",
          ),
        musicPath: "/music/Argentina.mp3",
        sanCode: computeSANCode("Erythrina crista-galli", "F"),
      },
      {
        id: "EG_LOTUS",
        translationKey: "egyptLotus",
        name: "Blue Lotus",
        country: "Egypt",
        countryCode: "EG",
        lat: 26.8144,
        lng: -106.6949,
        capital: "Cairo",
        population: "104 million",
        continent: "Africa",
        language: "Arabic",
        currency: "Egyptian Pound (EGP)",
        flowerName: "Blue Lotus",
        flowerScientificName: "Nymphaea caerulea",
        flowerDescription:
          "The Blue Lotus, also known as the Blue Water Lily, is Egypt's iconic flower. Revered since ancient times, it symbolizes creation, rebirth, and the sun — blooming at dawn and closing at dusk.",
        culturalSignificance:
          "Sacred to the ancient Egyptians, the Blue Lotus appears extensively in temple art, tomb paintings, and hieroglyphics. It was associated with the sun god Ra and the myth of creation, where the first lotus emerged from primordial waters.",
        botanicalInfo:
          "An aquatic perennial with floating leaves and star-shaped blue flowers that rise above the water's surface. It contains mild psychoactive alkaloids and was used in ancient Egyptian ceremonies and medicine.",
        historicalOrigin:
          "The Blue Lotus has been sacred to Egypt for over 5,000 years. It appears in the earliest hieroglyphic texts and tomb paintings from the Old Kingdom. In Egyptian cosmology, the creation myth describes the first sunrise emerging from a lotus floating on primordial waters. The flower was used in religious ceremonies by pharaohs and depicted in Tutankhamun's tomb.",
        nationalStatus:
          "Iconic national flower of Egypt; UNESCO-recognized symbol of ancient Egyptian civilization.",
        traditionalUses:
          "Ancient ceremonial use — petals soaked in wine or water as a mild relaxant in pharaonic ritual; temple decoration and offering to the gods; depicted in papyrus art and hieroglyphics; modern use as ornamental water garden plant; research into psychoactive alkaloids (nuciferine, apomorphine).",
        conservationStatus:
          "Near Threatened (NT) — IUCN Red List. Wild populations in the Nile Delta have dramatically declined due to pollution and habitat loss.",
        mainThreats:
          "Nile pollution and agricultural chemical runoff destroying aquatic habitats; draining of Nile Delta wetlands for agriculture and urban development; climate change reducing Nile flood cycles that historically regenerated lotus habitats; over-collection from wild populations.",
        pfnoClassification: "National Cultural Symbol — Historic Sacred Flower",
        relevantPollinator:
          "Scarab beetles (Scarabaeidae) — the Blue Lotus practices thermogenic beetle pollination, heating its flowers to attract pollinators, just like the Sacred Lotus. Also pollinated by Apis mellifera.",
        nahiaraSynthesis:
          "Nymphaea caerulea integrates into the Nahiara universe, evaluated at 21/25 (Stable) in the Nahiara Measure. Egypt's Blue Lotus is one of the oldest sacred flowers in human civilization — a symbol that connects pharaonic creation mythology to modern botanical science. Its alkaloid compounds and divine symbolism make it unique in the AquaMundi catalog.",
        nahiaraMeasure: {
          total: 21,
          max: 25,
          rank: 9,
          status: "Living EcoRoot",
          latidoFloral: 2,
          memoriaCultural: 5,
          vozPublica: 5,
          escudoProteccion: 4,
          petaloEsperanza: 5,
        },
        araihanScore: 21,
        botanicalFamily: "Nymphaeaceae",
        commonNames: "Blue Lotus, Blue Egyptian Water Lily, Sacred Blue Lily",
        scorfidon: {
          inundacion: {
            code: "SCF-080",
            threat: "Loss of Flooding Cycles",
            impact: -4,
            description:
              "Damming of the Nile eliminated the annual floods that naturally rejuvenated habitats.",
            guardian: "Hydrological Restoration",
            guardianPower: 3,
          },
          contaminacion: {
            code: "SCF-081",
            threat: "Water Pollution",
            impact: -4,
            description:
              "Agricultural runoff and industrial waste poison shallow water environments.",
            guardian: "River Purification",
            guardianPower: 4,
          },
        },
        color: "#1565c0",
        special: false,
        size: 0.08,
        flowerNameLocal: "لوتس أزرق",
        localLanguageName: "Arabic",
        gltfPath:
          "/api/glb-proxy?url=" +
          encodeURIComponent(
            "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/Egypt_Blue_Lotus.glb",
          ),
        musicPath:
          "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/National_music/Folk+Project+(Egipto).mp3",
        sanCode: computeSANCode("Nymphaea caerulea", "F"),
      },
      {
        id: "ID_JASMINE",
        translationKey: "indonesiaJasmine",
        name: "Jasmine",
        country: "Indonesia",
        countryCode: "ID",
        lat: -15.1694,
        lng: -17.0172,
        capital: "Jakarta",
        population: "275 million",
        continent: "Asia",
        language: "Indonesian (Bahasa Indonesia)",
        currency: "Indonesian Rupiah (IDR)",
        flowerName: "Melati Putih",
        flowerScientificName: "Jasminum sambac",
        flowerDescription:
          "The Melati Putih (White Jasmine) is Indonesia's national flower, symbolizing purity, grace, and simplicity. It is deeply embedded in the traditions and daily life of the Indonesian people.",
        culturalSignificance:
          "Jasmine garlands are essential in Javanese and Sundanese weddings, draping the bride and groom. The flower is offered in spiritual ceremonies and adorns sacred spaces, representing sincerity and eternal devotion.",
        botanicalInfo:
          "A small evergreen shrub producing clusters of intensely fragrant, waxy white flowers. It blooms year-round in Indonesia's tropical climate and is widely cultivated for perfumery, tea, and ceremonial use.",
        historicalOrigin:
          "Melati Putih was formally declared one of Indonesia's three national flowers on July 5, 1990 by Presidential Decree. In Javanese court culture, jasmine has been used in royal ceremonies for over 1,000 years. The scent of melati is used to anoint Sultan palaces in Yogyakarta and Solo.",
        nationalStatus:
          "One of three official national flowers of Indonesia (since 1990) — alongside Moon Orchid and Giant Padma.",
        traditionalUses:
          "Wedding garlands (ronce melati) draping the bride; Javanese and Balinese ritual offerings; jasmine tea (teh melati) — the most popular tea in Indonesia; production of natural jasmine absolute for perfumery; spiritual protection in Kejawen (Javanese mysticism).",
        conservationStatus:
          "Least Concern (LC) — IUCN Red List. Widely cultivated; wild populations in tropical Asia stable.",
        mainThreats:
          "No significant conservation threat to cultivated populations. Wild habitat loss in tropical forests; demand for synthetic jasmine fragrance compounds reducing cultivation incentives.",
        pfnoClassification: "Official National Flower",
        relevantPollinator:
          "Sphinx moths (Sphingidae) at night; Apis cerana (Asian honeybee) and Trigona spp. (stingless bees) during daytime. The intense night fragrance is an evolutionary adaptation for moth pollination.",
        nahiaraSynthesis:
          "Jasminum sambac integrates into the Nahiara universe, evaluated at 20/25 (Stable) in the Nahiara Measure. Indonesia's Melati Putih is one of the most culturally embedded flowers in Southeast Asia — inseparable from Javanese wedding ceremony, Islamic spirituality, and Indonesian identity across thousands of islands.",
        nahiaraMeasure: {
          total: 22,
          max: 25,
          rank: 8,
          status: "Living EcoRoot",
          latidoFloral: 5,
          memoriaCultural: 5,
          vozPublica: 4,
          escudoProteccion: 4,
          petaloEsperanza: 4,
        },
        araihanScore: 22,
        botanicalFamily: "Oleaceae",
        commonNames: "Arabian Jasmine, Melati Putih",
        scorfidon: {
          quimicos: {
            code: "SCF-090",
            threat: "Chemical Farming",
            impact: -3,
            description:
              "Modern reliance on agricultural chemicals hurts local insect populations tied to the flower.",
            guardian: "Traditional Agriculture",
            guardianPower: 3,
          },
          cultura: {
            code: "SCF-091",
            threat: "Cultural Disconnection",
            impact: -2,
            description:
              "Younger generations moving away from traditional ceremonies utilizing the flowers.",
            guardian: "Cultural Education",
            guardianPower: 2,
          },
        },
        color: "#e8d5b7",
        special: true,
        size: 0.11,
        flowerNameLocal: "Melati Putih",
        localLanguageName: "Bahasa Indonesia",
        gltfPath:
          "/api/glb-proxy?url=" +
          encodeURIComponent(
            "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/Indonesia_Jazmine.glb",
          ),
        musicPath:
          "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/National_music/Folk+Project+(Indonesia).mp3",
        sanCode: computeSANCode("Jasminum sambac", "F"),
      },
      {
        id: "JM_LIGNUMVITAE",
        translationKey: "jamaicaLignum",
        name: "Lignum Vitae",
        country: "Jamaica",
        countryCode: "JM",
        lat: 34.0798,
        lng: 134.3422,
        capital: "Kingston",
        population: "3 million",
        continent: "North America",
        language: "English, Jamaican Patois",
        currency: "Jamaican Dollar (JMD)",
        flowerName: "Lignum Vitae",
        flowerScientificName: "Guaiacum officinale",
        flowerDescription:
          "The Lignum Vitae is Jamaica's national flower, bearing delicate blue-purple blossoms. Its name means 'wood of life' in Latin, reflecting the tree's legendary medicinal properties.",
        culturalSignificance:
          "Adopted as Jamaica's national flower in 1971, the Lignum Vitae represents strength, resilience, and healing — qualities deeply valued in Jamaican culture. The tree is now protected due to over-harvesting.",
        botanicalInfo:
          "A slow-growing evergreen tree producing clusters of star-shaped blue-purple flowers. It yields one of the densest and hardest woods in the world, and its resin (guaiac) has been used medicinally for centuries.",
        nahiaraMeasure: {
          total: 20,
          max: 25,
          rank: 19,
          status: "Stable",
          latidoFloral: 2,
          memoriaCultural: 5,
          vozPublica: 4,
          escudoProteccion: 5,
          petaloEsperanza: 4,
        },
        araihanScore: 20,
        historicalOrigin:
          "Lignum Vitae ('Tree of Life' in Latin) was discovered by Columbus and highly prized in Renaissance Europe as a supposed cure for syphilis. It was adopted as Jamaica's national flower upon independence in 1962.",
        nationalStatus: "Official national flower of Jamaica.",
        traditionalUses:
          "The densest trade wood known, historically used for ship propeller shafts, clocks, and police batons; medicinal resin used for arthritis and coughs.",
        conservationStatus:
          "Endangered (EN) — IUCN Red List. Decimated by centuries of over-harvesting for its valuable timber and resin.",
        mainThreats:
          "Coastal development and destruction of dry forest habitats; historical over-exploitation; slow growth rate hindering population recovery.",
        pfnoClassification: "Official National Flower",
        relevantPollinator:
          "Hymenoptera (bees) and Lepidoptera (butterflies) — specifically native Caribbean solitary bees.",
        nahiaraSynthesis:
          "Guaiacum officinale integrates into the Nahiara universe evaluated at 20/25 (Stable) in the Nahiara Measure. Jamaica's 'Tree of Life' represents unparalleled botanical resilience and the heavy ecological cost of historical exploitation in AquaMundi.",
        botanicalFamily: "Zygophyllaceae",
        commonNames: "Lignum Vitae, Tree of Life, Guaiacum",
        scorfidon: {
          tala: {
            code: "SCF-100",
            threat: "Timber Poaching",
            impact: -5,
            description:
              "Illegal logging of mature trees for carving and specialized high-density wood products.",
            guardian: "Forest Patrols",
            guardianPower: 5,
          },
          desarrollo: {
            code: "SCF-101",
            threat: "Coastal Development",
            impact: -4,
            description:
              "Hotels and infrastructure destroying its native rocky dry coastal habitat.",
            guardian: "Protected Coastlines",
            guardianPower: 4,
          },
        },
        morphology: {
          color:
            "Vibrant blue to purple blossoms that fade to pale silvery-white",
          shape:
            "Five distinct, slightly twisted petals forming a star-like cluster",
          size: "Flowers 2 cm across; slow-growing small tree reaching 10m",
          lifeCycle:
            "Evergreen slow-growing hardwood tree, flowering primarily in spring",
        },
        habitat:
          "Dry coastal forests, limestone karst scrubland, and tropical dry woodlands throughout the Caribbean; tolerates salt spray and seasonal drought.",
        distribution:
          "Native to the Caribbean islands and northern coast of South America. Jamaica holds significant native populations.",
        color: "#5c6bc0",
        special: false,
        size: 0.05,
        flowerNameLocal: "Lignum Vitae",
        localLanguageName: "English",
        gltfPath:
          "/api/glb-proxy?url=" +
          encodeURIComponent(
            "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/Lignum_Vitae_Textured.glb",
          ),
        musicPath: "/music/Jamaica.mp3",
        sanCode: computeSANCode("Guaiacum officinale", "F"),
      },
      {
        id: "MX_DAHLIA",
        translationKey: "mexicoDahlia",
        name: "Dahlia",
        country: "Mexico",
        countryCode: "MX",
        lat: 35.0928,
        lng: 106.1846,
        capital: "Mexico City",
        population: "129 million",
        continent: "North America",
        language: "Spanish",
        currency: "Mexican Peso (MXN)",
        flowerName: "Dahlia",
        flowerScientificName: "Dahlia pinnata",
        flowerDescription:
          "The Dahlia is Mexico's national flower, declared in 1963. Native to the highlands of Mexico and Central America, it dazzles with an extraordinary range of colors, shapes, and sizes.",
        culturalSignificance:
          "The Aztecs cultivated dahlias for food, medicine, and ceremony long before European contact. The hollow stems were used as water pipes. Today the flower is a proud symbol of Mexican botanical heritage and biodiversity.",
        botanicalInfo:
          "A tuberous perennial in the Asteraceae family with over 40 species and thousands of cultivars. Flowers range from tiny pompons to dinner-plate blooms exceeding 30 cm in diameter, in every color except true blue.",
        historicalOrigin:
          "The Aztecs called the dahlia 'Acocotli' or 'Cocoxochitl' (hollow-stemmed flower) and cultivated it for waterpiping, food, and medicine. Spanish botanists brought it to Europe in the 18th century. It was named after Swedish botanist Anders Dahl. Mexico declared it the national flower on May 13, 1963.",
        nationalStatus:
          "Official national flower of Mexico since 1963. Mexico is the center of origin and genetic diversity for all dahlia species.",
        traditionalUses:
          "Aztec food source (tubers eaten); hollow stems used as drinking straws and water pipes; traditional medicine for treating fever and skin conditions; ornamental garden plant worldwide; Day of the Dead (Día de Muertos) decoration alongside marigolds.",
        conservationStatus:
          "Least Concern (LC) — IUCN Red List for cultivated species. Several wild Dahlia species endemic to Mexican highlands are Under Assessment.",
        mainThreats:
          "Habitat loss in Mexican highland meadows; illegal collection of rare wild species; climate change affecting high-altitude habitats; hybridization pressure on wild gene pools from cultivated escapes.",
        pfnoClassification: "Official National Flower",
        relevantPollinator:
          "Bombus spp. (bumblebees) and Apis mellifera (honeybees) — the open composite flower head is one of the most accessible for generalist pollinators. Also visited by butterflies, hoverflies, and beetles.",
        nahiaraSynthesis:
          "Dahlia pinnata integrates into the Nahiara universe, evaluated at 21/25 (Stable) in the Nahiara Measure. Mexico's dahlia is the origin point for one of the world's most diverse cultivated flower groups — from Aztec temple gardens to the global horticultural industry. As Mexico's center of dahlia genetic diversity, wild populations are a living genetic library essential for future breeding.",
        nahiaraMeasure: {
          total: 20,
          max: 25,
          rank: 17,
          status: "Stable",
          latidoFloral: 3,
          memoriaCultural: 5,
          vozPublica: 5,
          escudoProteccion: 3,
          petaloEsperanza: 4,
        },
        araihanScore: 20,
        botanicalFamily: "Asteraceae",
        commonNames: "Dahlia, Pinnate Dahlia, Acocoxochitl",
        scorfidon: {
          recoleccion: {
            code: "SCF-160",
            threat: "Tuber Poaching",
            impact: -4,
            description:
              "Collection of wild Mexican tubers by enthusiasts threatens original genetic variations.",
            guardian: "Gene Bank Protection",
            guardianPower: 4,
          },
          habitat: {
            code: "SCF-161",
            threat: "Highland Degradation",
            impact: -4,
            description:
              "Conversion of montane pine-oak forests into commercial agricultural lands.",
            guardian: "Sustainable Land Use",
            guardianPower: 4,
          },
        },
        color: "#e65100",
        special: true,
        size: 0.11,
        flowerNameLocal: "Dalia",
        localLanguageName: "Spanish",
        gltfPath:
          "/api/glb-proxy?url=" +
          encodeURIComponent(
            "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/Dalia.glb",
          ),
        musicPath:
          "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/National_music/Folk+Project+(Mexico).mp3",
        sanCode: computeSANCode("Dahlia pinnata", "F"),
      },
      {
        id: "GB_THISTLE",
        translationKey: "scotlandThistle",
        name: "Thistle",
        country: "Scotland",
        countryCode: "GB-SCT",
        lat: 64.7611,
        lng: -126.0279,
        capital: "Edinburgh",
        population: "5.5 million",
        continent: "Europe",
        language: "English, Scots, Scottish Gaelic",
        currency: "Pound Sterling (GBP)",
        flowerName: "Thistle",
        flowerScientificName: "Onopordum acanthium",
        flowerDescription:
          "The Thistle is Scotland's national emblem, representing resilience, defiance, and nobility. Its prickly exterior conceals a striking purple flower, much like the fierce spirit of the Scottish people.",
        culturalSignificance:
          "Legend holds that a Norse army's night raid was foiled when a barefoot Viking stepped on a thistle and cried out, alerting the Scots. It has been Scotland's royal emblem since the 13th century and features on the Order of the Thistle, the nation's highest honour.",
        botanicalInfo:
          "A robust biennial growing up to 2.5 m tall, with spiny-winged stems and large spherical flower heads of violet-purple florets. It thrives in dry, disturbed ground across Scotland's lowlands and is a vital nectar source for pollinators.",
        nahiaraMeasure: {
          total: 18,
          max: 25,
          rank: 30,
          status: "Stable",
          latidoFloral: 5,
          memoriaCultural: 5,
          vozPublica: 3,
          escudoProteccion: 2,
          petaloEsperanza: 3,
        },
        araihanScore: 18,
        historicalOrigin:
          "According to legend, during a night attack by Norsemen in the 13th century (Battle of Largs, 1263), a barefoot Viking stepped on a thistle and cried out, alerting the sleeping Scottish clans. The thistle was subsequently adopted as the emblem of Scotland.",
        nationalStatus:
          "Official national emblem of Scotland since the reign of Alexander III.",
        traditionalUses:
          "Heraldic symbol used on coins, coats of arms, and the Order of the Thistle; historically used in herbal medicine for digestive issues; the down was used to stuff pillows.",
        conservationStatus:
          "Least Concern (LC). A highly successful and adaptable plant.",
        mainThreats:
          "Habitat management practices targeting it as an agricultural weed; intensive herbicide use.",
        pfnoClassification: "National Emblem",
        relevantPollinator:
          "Bombus (Bumblebees) and Lepidoptera (butterflies) like the Painted Lady butterfly; an exceptionally rich nectar source.",
        nahiaraSynthesis:
          "Onopordum acanthium integrates into the Nahiara universe evaluated at 18/25 (Stable) in the Nahiara Measure. A symbol of rugged independence, the Scottish thistle in AquaMundi demonstrates how an ordinary 'weed' can become an extraordinary cultural guardian.",
        botanicalFamily: "Asteraceae",
        commonNames: "Cotton Thistle, Scotch Thistle, Heraldic Thistle",
        scorfidon: {
          herbicida: {
            code: "SCF-110",
            threat: "Herbicide Campaigns",
            impact: -3,
            description:
              "Vigorous agricultural eradication programs targeting the plant as a noxious weed.",
            guardian: "Pollinator Margins",
            guardianPower: 3,
          },
          homogeneidad: {
            code: "SCF-111",
            threat: "Habitat Homogenization",
            impact: -3,
            description:
              "Conversion of rough pasture into uniform modern agricultural fields.",
            guardian: "Rewilding",
            guardianPower: 3,
          },
        },
        morphology: {
          color:
            "Vivid magenta to purple florets emerging from a silver-green base",
          shape:
            "Dense composite flower head protected by formidable, sharp spiny bracts",
          size: "Flower heads 3-5 cm; stems grow 1-2.5m tall",
          lifeCycle:
            "Biennial herbaceous plant forming a rosette year 1 and flowering year 2",
        },
        habitat:
          "Meadows, grasslands, disturbed ground, roadsides, and field margins throughout Scotland and the British Isles; tolerates poor, rocky soils.",
        distribution:
          "Native to Europe and Western Asia. Introduced widely across the globe.",
        color: "#ab47bc",
        special: false,
        size: 0.06,
        flowerNameLocal: "Cluaran",
        localLanguageName: "Scottish Gaelic",
        gltfPath:
          "/api/glb-proxy?url=" +
          encodeURIComponent(
            "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/Onopordum_Acanthium.glb",
          ),
        musicPath:
          "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/National_music/Folk+Project+(Escocia).mp3",
        sanCode: computeSANCode("Onopordum acanthium", "F"),
      },
    ],
    [],
  );

  useEffect(() => {
    const countryParam = new URLSearchParams(window.location.search)
      .get("country")
      ?.trim()
      .toLowerCase();
    if (!countryParam) return;

    const country = countriesData.find(
      (item) => item.country.toLowerCase() === countryParam,
    );
    if (country) {
      setSelectedCountry(country);
      setIsModalVisible(true);
    }
  }, [countriesData]);

  // Helper function to calculate 3D coordinates from lat/lng
  const calculate3DCoordinates = (lat, lng, radius = 4.5) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    return {
      x: -(radius * Math.sin(phi) * Math.cos(theta)),
      y: radius * Math.cos(phi),
      z: radius * Math.sin(phi) * Math.sin(theta),
    };
  };

  // Helper function to create a new country entry
  const createCountryData = (
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
    special = false,
    size = 0.06,
    gltfPath = null,
  ) => {
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
      gltfPath,
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
          1000,
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

          const currentDistance =
            startDistance + (targetDistance - startDistance) * easeProgress;
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
          containerRef.current.clientHeight,
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
            z: radius * Math.sin(phi) * Math.sin(theta),
          };
        };

        // Function to calculate distance from screen center
        const getDistanceFromScreenCenter = (
          worldPosition,
          camera,
          renderer,
        ) => {
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
            Math.pow(x - screenCenterX, 2) + Math.pow(y - screenCenterY, 2),
          );

          // Normalize distance (0 = center, 1 = edge)
          const maxDistance = Math.sqrt(
            Math.pow(screenCenterX, 2) + Math.pow(screenCenterY, 2),
          );

          return Math.min(distance / maxDistance, 1);
        };

        // Function to create dynamic color based on distance from screen center
        const getDynamicColor = (baseColor, distanceFromCenter) => {
          // Parse base color
          const color = new THREE.Color(baseColor);

          // Calculate brightness factor with dramatic range (1.5 at center, 0.2 at edge)
          const brightness = 1.5 - distanceFromCenter * 1.3;

          // Calculate saturation factor (1.2 at center, 0.4 at edge)
          const saturation = 1.2 - distanceFromCenter * 0.8;

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
                const distanceFromCenter = getDistanceFromScreenCenter(
                  ballGroup.position,
                  camera,
                  renderer,
                );
                const dynamicColor = getDynamicColor(
                  countryData.color,
                  distanceFromCenter,
                );

                // Calculate dramatic opacity factor (1.5 at center, 0.3 at edge)
                const opacityFactor = 1.5 - distanceFromCenter * 1.2;
                const clampedOpacityFactor = Math.max(
                  0.1,
                  Math.min(opacityFactor, 1.0),
                );

                // Update main ball color
                if (child.material.color) {
                  child.material.color.copy(dynamicColor);
                }

                // Store original opacity if not already stored
                if (!child.material.userData) {
                  child.material.userData = {};
                }
                if (child.material.userData.originalOpacity === undefined) {
                  child.material.userData.originalOpacity =
                    child.material.opacity || 0.9;
                }

                // Update opacity with dramatic range
                if (child.material.opacity !== undefined) {
                  child.material.opacity =
                    child.material.userData.originalOpacity *
                    clampedOpacityFactor;
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
            console.log(
              `Loading Globe.glb: ${Math.round((progress.loaded / progress.total) * 100)}%`,
            );
          },
          (error) => {
            console.error("Failed to load Globe.glb:", error);
            createFallbackGlobe();
          },
        );

        // Function to create fallback globe
        function createFallbackGlobe() {
          console.log("🔄 Creating fallback globe");
          // Create fallback sphere with better visibility
          const geometry = new THREE.SphereGeometry(1, 32, 32);
          const material = new THREE.MeshPhongMaterial({
            color: 0x4a90e2,
            transparent: false,
            opacity: 1.0,
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
              ? countryData.size * 1.2 // 20% larger on mobile for better visibility
              : isTablet
                ? countryData.size * 0.9 // 10% smaller on tablet
                : countryData.size; // Original size on desktop

            // Main sphere (ball) - this will be clickable
            const sphereGeometry = new THREE.SphereGeometry(
              adjustedSize,
              16,
              16,
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
            setTimeout(
              () => {
                const ballAnimation = () => {
                  if (ballGroup.scale.x < 1) {
                    ballGroup.scale.addScalar(0.1);
                    requestAnimationFrame(ballAnimation);
                  } else {
                    ballGroup.scale.setScalar(1);
                  }
                };
                ballAnimation();
              },
              1000 + index * 200,
            ); // Staggered delay for each country

            // Gradient glow effect — each layer shifts toward a softer pastel
            const baseColor = new THREE.Color(countryData.color);
            const baseHSL = { h: 0, s: 0, l: 0 };
            baseColor.getHSL(baseHSL);

            // Inner glow: saturated, close to original
            const innerGlowColor = new THREE.Color();
            innerGlowColor.setHSL(
              baseHSL.h,
              Math.min(baseHSL.s * 0.9, 1.0),
              Math.min(baseHSL.l * 1.1, 0.85),
            );
            const innerGlowGeometry = new THREE.SphereGeometry(
              adjustedSize * 1.4,
              16,
              16,
            );
            const innerGlowMaterial = new THREE.MeshBasicMaterial({
              color: innerGlowColor,
              transparent: true,
              opacity: 0.4,
            });
            const innerGlow = new THREE.Mesh(
              innerGlowGeometry,
              innerGlowMaterial,
            );
            innerGlow.userData = { data: countryData };
            ballGroup.add(innerGlow);

            // Middle glow: desaturated + lighter
            const middleGlowColor = new THREE.Color();
            middleGlowColor.setHSL(
              baseHSL.h,
              Math.min(baseHSL.s * 0.55, 1.0),
              Math.min(baseHSL.l * 1.4, 0.9),
            );
            const middleGlowGeometry = new THREE.SphereGeometry(
              adjustedSize * 2.0,
              16,
              16,
            );
            const middleGlowMaterial = new THREE.MeshBasicMaterial({
              color: middleGlowColor,
              transparent: true,
              opacity: 0.25,
            });
            const middleGlow = new THREE.Mesh(
              middleGlowGeometry,
              middleGlowMaterial,
            );
            middleGlow.userData = { data: countryData };
            ballGroup.add(middleGlow);

            // Outer glow: soft pastel wash
            const outerGlowColor = new THREE.Color();
            outerGlowColor.setHSL(
              baseHSL.h,
              Math.min(baseHSL.s * 0.25, 1.0),
              Math.min(baseHSL.l * 1.7, 0.95),
            );
            const outerGlowGeometry = new THREE.SphereGeometry(
              adjustedSize * 2.8,
              16,
              16,
            );
            const outerGlowMaterial = new THREE.MeshBasicMaterial({
              color: outerGlowColor,
              transparent: true,
              opacity: 0.15,
            });
            const outerGlow = new THREE.Mesh(
              outerGlowGeometry,
              outerGlowMaterial,
            );
            outerGlow.userData = { data: countryData };
            ballGroup.add(outerGlow);

            // Elegant ring for special countries
            if (countryData.special) {
              const ringColor = new THREE.Color();
              ringColor.setHSL(
                baseHSL.h,
                Math.min(baseHSL.s * 0.7, 1.0),
                Math.min(baseHSL.l * 1.3, 0.85),
              );
              const ringGeometry = new THREE.RingGeometry(
                adjustedSize * 1.6,
                adjustedSize * 2.0,
                32,
              );
              const ringMaterial = new THREE.MeshBasicMaterial({
                color: ringColor,
                transparent: true,
                opacity: 0.45,
                side: THREE.DoubleSide,
              });
              const ring = new THREE.Mesh(ringGeometry, ringMaterial);
              ring.rotateX(Math.PI / 2);
              ring.userData = { data: countryData };
              ballGroup.add(ring);
            }

            // Pollen particle dust — tiny sparkles orbiting around each satellite
            const particleCount = 6;
            const particleSpread = adjustedSize * 3.5;
            for (let p = 0; p < particleCount; p++) {
              const particleSize = adjustedSize * (0.08 + Math.random() * 0.1);
              const particleGeo = new THREE.SphereGeometry(particleSize, 6, 6);
              const particleColor = new THREE.Color();
              particleColor.setHSL(
                baseHSL.h,
                Math.min(baseHSL.s * 0.6, 1.0),
                0.7 + Math.random() * 0.25,
              );
              const particleMat = new THREE.MeshBasicMaterial({
                color: particleColor,
                transparent: true,
                opacity: 0.4 + Math.random() * 0.3,
              });
              const particle = new THREE.Mesh(particleGeo, particleMat);
              // Random position in a sphere around the satellite
              const angle1 = Math.random() * Math.PI * 2;
              const angle2 = Math.random() * Math.PI * 2;
              const dist = particleSpread * (0.5 + Math.random() * 0.5);
              particle.position.set(
                Math.cos(angle1) * Math.sin(angle2) * dist,
                Math.cos(angle2) * dist * 0.6,
                Math.sin(angle1) * Math.sin(angle2) * dist,
              );
              particle.userData = {
                data: countryData,
                isParticle: true,
                orbitSpeed: 0.2 + Math.random() * 0.4,
                orbitAngle: angle1,
                orbitRadius: dist,
                orbitTilt: angle2,
              };
              ballGroup.add(particle);
            }

            // Position the ball using the helper function with closer radius for mobile
            const initialRadius = isMobile ? 2.0 : isTablet ? 3.0 : 4.5;
            const coords = calculate3DCoordinates(
              countryData.lat,
              countryData.lng,
              initialRadius,
            );
            ballGroup.position.set(coords.x, coords.y, coords.z);
            ballGroup.userData = {
              data: countryData,
              isHovered: false,
            };

            // Store ball group for zoom scaling
            ballGroups.push(ballGroup);

            console.log(
              `🌸 ${countryData.country} ball added at coordinates:`,
              coords,
            );
            console.log(
              `Ball distance from origin: ${Math.sqrt(coords.x * coords.x + coords.y * coords.y + coords.z * coords.z)}`,
            );
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
          const normalizedDistance = Math.max(
            0,
            Math.min(1, (distance - minDistance) / (maxDistance - minDistance)),
          );

          // Calculate base scale factor (closer = smaller satellites)
          // Mobile: Scale from 0.4x to 0.9x (larger for better visibility), Tablet: 0.25x to 0.8x, Desktop: 0.4x to 1.2x
          const baseScaleFactor = isMobile
            ? 0.4 + normalizedDistance * 0.5
            : isTablet
              ? 0.25 + normalizedDistance * 0.55
              : 0.4 + normalizedDistance * 0.8;

          // Calculate dynamic radius (closer zoom = satellites closer to globe)
          // Mobile: 1.8 to 2.4 (balanced), Tablet: 2.8 to 3.4, Desktop: 4.2 to 4.8
          const dynamicRadius = isMobile
            ? 1.8 + normalizedDistance * 0.6
            : isTablet
              ? 2.8 + normalizedDistance * 0.6
              : 4.2 + normalizedDistance * 0.6;

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
              const coords = calculate3DCoordsWithRadius(
                countryData.lat,
                countryData.lng,
                dynamicRadius,
              );
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
        controls.enableRotate = true; // Enable rotation on all devices

        // Device-specific zoom limits
        if (isMobile) {
          controls.minDistance = 3;
          controls.maxDistance = 12;
        } else if (isTablet) {
          controls.minDistance = 2.5;
          controls.maxDistance = 11;
        } else {
          controls.minDistance = 3;
          controls.maxDistance = 15;
        }

        // Touch settings - enable touch interaction on all devices
        controls.touches = {
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN,
        };

        // Add zoom event listener to immediately scale satellites
        controls.addEventListener("change", () => {
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
              if (
                intersect.object.isMesh &&
                (!intersect.object.userData || !intersect.object.userData.data)
              ) {
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
              let lng =
                Math.atan2(normalizedPoint.z, -normalizedPoint.x) *
                  (180 / Math.PI) +
                180;

              // Normalize to [-180, 180]
              while (lng <= -180) lng += 360;
              while (lng > 180) lng -= 360;

              console.log(
                "%c--- GLOBE COORDINATE FIXED ---",
                "color: #38a169; font-weight: bold;",
              );
              console.log(
                `📍 Clicked Location: lat: ${lat.toFixed(4)}, lng: ${lng.toFixed(4)}`,
              );
              console.log(`📏 Distance from origin: ${distance.toFixed(4)}`);
            }
            // -----------------------------

            const countryData =
              clickedObject.userData?.data ||
              clickedObject.parent?.userData?.data;

            if (countryData) {
              // Prevent fullscreen toggle when clicking on a flower
              event.stopPropagation();

              // Stop auto rotation
              controls.autoRotate = false;

              // Show modal
              setSelectedCountry(countryData);
              setIsModalVisible(true);
              console.log(
                `🌸 Opening ${countryData.flowerName} dialog for ${countryData.country}`,
              );
            }
          }
        };

        // Add click listener
        renderer.domElement.addEventListener("click", handleClick);

        // On mobile, prevent page scroll while swiping the globe
        if (isMobile) {
          renderer.domElement.style.touchAction = "none";
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
            if (
              child.userData &&
              child.userData.data &&
              child.material &&
              child.material.transparent
            ) {
              // Only animate glow materials (not the main ball)
              if (
                child.geometry.type === "SphereGeometry" &&
                child.material.opacity < 0.9
              ) {
                const ballGroup = child.parent;
                if (
                  ballGroup &&
                  ballGroup.userData &&
                  ballGroup.userData.data
                ) {
                  const distanceFromCenter = getDistanceFromScreenCenter(
                    ballGroup.position,
                    camera,
                    renderer,
                  );

                  // Stronger pulsing effect for better visibility
                  const pulseIntensity = 0.25 * (1 - distanceFromCenter); // 0.25 at center, 0 at edge
                  const pulseSpeed = 1.2 + 0.8 * (1 - distanceFromCenter); // Faster pulse at center

                  const pulse =
                    Math.sin(time * pulseSpeed) * pulseIntensity +
                    (1 - pulseIntensity);
                  child.material.opacity = child.material.opacity * pulse;
                }
              }

              // Animate pollen particles — gentle orbit drift
              if (child.userData && child.userData.isParticle) {
                const pd = child.userData;
                pd.orbitAngle += pd.orbitSpeed * 0.008;
                child.position.x =
                  Math.cos(pd.orbitAngle) *
                  Math.sin(pd.orbitTilt) *
                  pd.orbitRadius;
                child.position.y =
                  Math.cos(pd.orbitTilt) * pd.orbitRadius * 0.6;
                child.position.z =
                  Math.sin(pd.orbitAngle) *
                  Math.sin(pd.orbitTilt) *
                  pd.orbitRadius;
                // Gentle opacity flicker
                child.material.opacity =
                  0.3 + Math.sin(time * pd.orbitSpeed * 2) * 0.2;
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
          const newIsTablet =
            window.innerWidth >= 768 && window.innerWidth < 1024;

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
        rootMargin: "300px", // Start loading 300px before it's visible
        threshold: 0.01,
      },
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
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);

    // Enable/disable zoom and rotation based on fullscreen state and device type
    if (controlsRef.current) {
      const isMobile = window.innerWidth < 768;
      controlsRef.current.enableZoom = isFullscreen; // Enable zoom only in fullscreen
      controlsRef.current.enableRotate = true; // Always enable rotation on all devices
      controlsRef.current.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      };

      console.log(
        `🔍 Zoom ${isFullscreen ? "enabled" : "disabled"}, Rotate ${controlsRef.current.enableRotate ? "enabled" : "disabled"} (fullscreen: ${isFullscreen}, mobile: ${isMobile})`,
      );
    }

    // Move the renderer to the correct container when fullscreen state changes
    if (rendererRef.current) {
      const targetContainer = isFullscreen
        ? fullscreenContainerRef.current
        : containerRef.current;
      if (
        targetContainer &&
        !targetContainer.contains(rendererRef.current.domElement)
      ) {
        // Remove from current container
        if (rendererRef.current.domElement.parentNode) {
          rendererRef.current.domElement.parentNode.removeChild(
            rendererRef.current.domElement,
          );
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
        rendererRef.current.domElement.style.pointerEvents = isFullscreen
          ? "auto"
          : "none";
        rendererRef.current.domElement.style.touchAction = isFullscreen
          ? "auto"
          : "none";
      } else {
        // On desktop/tablet: always enable pointer events
        rendererRef.current.domElement.style.pointerEvents = "auto";
        rendererRef.current.domElement.style.touchAction = "auto";
      }
    }

    return () => window.removeEventListener("keydown", handleEsc);
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
            minHeight: "100%",
            minWidth: "100%",
            // On mobile, ensure the container doesn't block scrolling
            ...(typeof window !== "undefined" && window.innerWidth < 768
              ? {
                  touchAction: "pan-y",
                }
              : {}),
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
                clipPath: "ellipse(85% 90% at 50% 50%)",
              }}
            >
              {/* Decorative border */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: "ellipse(85% 90% at 50% 50%)",
                  border: "3px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "50%",
                  boxShadow:
                    "inset 0 0 60px rgba(255, 255, 255, 0.1), 0 0 80px rgba(0, 0, 0, 0.2)",
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
              ...(showOvalBorder
                ? {
                    clipPath: "ellipse(85% 90% at 50% 50%)",
                  }
                : {}),
              // On mobile when not in fullscreen, allow touch events to pass through for scrolling
              ...(typeof window !== "undefined" &&
              window.innerWidth < 768 &&
              !isFullscreen
                ? {
                    pointerEvents: "none",
                    touchAction: "none",
                  }
                : {}),
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

"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Palette } from "lucide-react";
import Link from "next/link";

const FLOWER_DATA = {
  commonName: "Russian Chamomile",
  scientificName: "Matricaria chamomilla",
  country: "Russia",
  glbPath: "/Russia_Chamomile.glb",
};

const BACKGROUND_HEX = "#E8E6DF"; // warm neutral chosen for testing

const BACKGROUND_OPTIONS = [
  { label: "Warm Sand", hex: "#E8E6DF" },
  { label: "Soft Cloud", hex: "#F2F1ED" },
  { label: "Muted Clay", hex: "#D9D2C4" },
  { label: "Calm Stone", hex: "#CBCBC4" },
  { label: "Cool Mist", hex: "#DDE3E1" },
];

const VIEW_OPTION = {
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

export default function TestFlowerPage() {
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [bgHex, setBgHex] = useState(BACKGROUND_HEX);
  const [viewMode] = useState("side");

  useEffect(() => {
    let renderer;
    let camera;
    let animationId;
    const cleanupFns = [];

    setIsLoaded(false);
    setLoadError(null);

    const loadFlower = async () => {
      try {
        const THREE = await import("three");
        const { GLTFLoader } = await import(
          "three/examples/jsm/loaders/GLTFLoader.js"
        );
        const { OrbitControls } = await import(
          "three/examples/jsm/controls/OrbitControls.js"
        );

        const container = canvasRef.current;
        if (!container) return;

        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(bgHex);

        const viewSettings = VIEW_OPTION;

        camera = new THREE.PerspectiveCamera(
          45,
          container.clientWidth / container.clientHeight,
          0.1,
          100
        );
        camera.position.set(...viewSettings.camera.position);
        camera.lookAt(
          viewSettings.camera.lookAt[0],
          viewSettings.camera.lookAt[1],
          viewSettings.camera.lookAt[2]
        );

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(container.clientWidth, container.clientHeight, false);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);
        cleanupFns.push(() => {
          renderer?.domElement?.parentNode?.removeChild(renderer.domElement);
          renderer?.dispose();
        });

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

        // Soft ground shadow
        const groundGeo = new THREE.PlaneGeometry(20, 20);
        const groundMat = new THREE.ShadowMaterial({
          opacity: 0.18,
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1;
        ground.receiveShadow = true;
        scene.add(ground);

        const loader = new GLTFLoader();
        loader.setCrossOrigin("anonymous");
        loader.load(
          FLOWER_DATA.glbPath,
          (gltf) => {
            const model = gltf.scene;
            model.traverse((node) => {
              if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                if (node.material) {
                  node.material.needsUpdate = true;
                }
              }
            });

            // Normalize model size and center
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const targetHeight = 1.8;
            const scale = targetHeight / maxDim;
            model.scale.setScalar(scale);
            model.position.sub(center.multiplyScalar(scale));

            scene.add(model);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.autoRotate = viewSettings.controls.autoRotate ?? true;
            controls.autoRotateSpeed =
              viewSettings.controls.autoRotateSpeed ?? 0.8;
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
            setIsLoaded(true);
            cleanupFns.push(() =>
              window.removeEventListener("resize", handleResize)
            );
          },
          undefined,
          (error) => {
            console.error("GLB load error", error);
            setLoadError("Failed to load 3D model.");
            setIsLoaded(false);
          }
        );
      } catch (err) {
        console.error("Three.js setup error", err);
        setLoadError("Three.js could not initialize.");
        setIsLoaded(false);
      }
    };

    loadFlower();

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, [bgHex, viewMode]);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Neutral: <span className="font-mono">{bgHex}</span>
            </div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500">
              View: {VIEW_OPTION.label}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.8fr_1fr] gap-8">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="relative w-full h-[480px] rounded-xl overflow-hidden isolate">
              <div ref={canvasRef} className="w-full h-full gpu-accelerated" />
              {!isLoaded && !loadError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
                  <div className="w-10 h-10 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mb-3" />
                  <span className="text-sm text-gray-500">
                    Preparing render…
                  </span>
                </div>
              )}
              {loadError && (
                <div className="absolute inset-0 grid place-content-center bg-red-50 text-red-500 text-sm font-medium text-center px-4">
                  {loadError}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
              <section>
                <h2 className="text-sm uppercase tracking-[0.3em] text-gray-400">
                  Flower
                </h2>
                <p className="text-3xl font-semibold tracking-tight">
                  {FLOWER_DATA.commonName}
                </p>
              </section>

              <section>
                <h2 className="text-sm uppercase tracking-[0.3em] text-gray-400">
                  Scientific
                </h2>
                <p className="text-xl italic text-gray-700">
                  {FLOWER_DATA.scientificName}
                </p>
              </section>

              <section>
                <h2 className="text-sm uppercase tracking-[0.3em] text-gray-400">
                  Country
                </h2>
                <p className="text-lg text-gray-800">{FLOWER_DATA.country}</p>
              </section>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-[0.3em] text-gray-400">
                  Background Options
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {BACKGROUND_OPTIONS.map((option) => (
                    <button
                      key={option.hex}
                      onClick={() => setBgHex(option.hex)}
                      aria-label={`Use ${option.label} background`}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                        bgHex === option.hex
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <span
                        className="inline-block h-8 w-8 rounded-full border border-black/5"
                        style={{ backgroundColor: option.hex }}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {option.label}
                        </p>
                        <p className="text-xs font-mono text-gray-500">
                          {option.hex}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-[0.3em] text-gray-400">
                  Background Rationale
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Testing a curated palette of warm-to-cool neutrals devised to
                  avoid color casting while keeping petals, stems, and shadows
                  readable. Switch between tones to verify how each species
                  responds before locking the universal standard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


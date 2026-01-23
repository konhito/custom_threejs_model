"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Palette } from "lucide-react";
import Link from "next/link";
import { MusicToggleButton } from "../../components/MusicToggleButton";

const FLOWER_DATA = {
  commonName: "Clavel / Carnation",
  scientificName: "Dianthus caryophyllus L.",
  country: "España (Spain)",
  // S3 URL for GLB file - update with your actual S3 filename
  glbPath: "https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/Espana_Carnation.glb",
  sanCode: "SAN-F-191998",
};

const POLLINATOR_DATA = {
  commonName: "Hormiga / Ant",
  scientificName: "Formicidae sp.",
  roleEs: "Polinizador terrestre asociado al clavel",
  roleEn: "Ground pollinator associated with carnation",
  sanCode: "SAN-P-ANT001",
  glbPath: "/ant.glb",
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
  const flowerCanvasRef = useRef(null);
  const antCanvasRef = useRef(null);

  const [isFlowerLoaded, setIsFlowerLoaded] = useState(false);
  const [flowerError, setFlowerError] = useState(null);

  const [isAntLoaded, setIsAntLoaded] = useState(false);
  const [antError, setAntError] = useState(null);

  const [bgHex, setBgHex] = useState(BACKGROUND_HEX);
  const [viewMode] = useState("side");
  const [lang, setLang] = useState("es"); // "es" | "en"
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Shared Three.js loader for a single canvas/model
  const useModelLoader = (canvasRef, glbPath, setLoaded, setError) => {
    useEffect(() => {
      // Ensure we're in the browser
      if (typeof window === "undefined") return;

      let renderer;
      let camera;
      let animationId;
      const cleanupFns = [];

      setLoaded(false);
      setError(null);

      const loadModel = async () => {
        try {
          const THREE = await import("three");
          const { GLTFLoader } = await import(
            "three/examples/jsm/loaders/GLTFLoader.js"
          );
          const { DRACOLoader } = await import(
            "three/examples/jsm/loaders/DRACOLoader.js"
          );
          const { OrbitControls } = await import(
            "three/examples/jsm/controls/OrbitControls.js"
          );

          const container = canvasRef.current;
          if (!container) {
            console.warn("Canvas container not found");
            return;
          }

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

          const groundGeo = new THREE.PlaneGeometry(20, 20);
          const groundMat = new THREE.ShadowMaterial({
            opacity: 0.18,
          });
          const ground = new THREE.Mesh(groundGeo, groundMat);
          ground.rotation.x = -Math.PI / 2;
          ground.position.y = -1;
          ground.receiveShadow = true;
          scene.add(ground);

          const dracoLoader = new DRACOLoader();
          dracoLoader.setDecoderPath(
            "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
          );
          dracoLoader.setDecoderConfig({ type: "js" });

          const loader = new GLTFLoader();
          loader.setDRACOLoader(dracoLoader);
          loader.setCrossOrigin("anonymous");
          loader.load(
            glbPath,
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
              setLoaded(true);
              cleanupFns.push(() =>
                window.removeEventListener("resize", handleResize)
              );
            },
            undefined,
            (error) => {
              console.error("GLB load error", error);
              setError("Failed to load 3D model.");
              setLoaded(false);
            }
          );
        } catch (err) {
          console.error("Three.js setup error", err);
          setError("Three.js could not initialize.");
          setLoaded(false);
        }
      };

      loadModel();

      return () => {
        cleanupFns.forEach((fn) => fn());
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bgHex, viewMode, canvasRef, glbPath]);
  };

  // Hook up loaders
  useModelLoader(flowerCanvasRef, FLOWER_DATA.glbPath, setIsFlowerLoaded, setFlowerError);
  useModelLoader(antCanvasRef, POLLINATOR_DATA.glbPath, setIsAntLoaded, setAntError);

  const isLoaded = isFlowerLoaded && isAntLoaded;

  // Show loading state until mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-50 text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span className="text-sm text-gray-500">Loading page...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 overflow-x-hidden">
      {/* Music Toggle Button - Bottom Left */}
      {typeof window !== "undefined" && (
        <div className="fixed bottom-6 left-6 z-50">
          <MusicToggleButton
            src="/Folk Project (España).mp3"
            autoPlay={true}
            onLoadComplete={isLoaded}
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* Top bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {lang === "es" ? "Volver" : "Back"}
            </Link>
            <span className="text-xs rounded-full bg-rose-50 px-3 py-1 text-rose-700 font-medium">
              Test · Clavel &amp; Polinizador
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
          <h1 className="text-2xl font-bold">Multilangual off its a test page</h1>

            <button
              type="button"
              onClick={() => setLang((prev) => (prev === "es" ? "en" : "es"))}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium shadow-sm hover:bg-gray-50"
            >
              <span>{lang === "es" ? "🇺🇸 English" : "🇪🇸 Español"}</span>
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Neutral: <span className="font-mono">{bgHex}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Background options row */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
          <h3 className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">
            {lang === "es" ? "Fondos neutros de prueba" : "Neutral background tests"}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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
                <div className="hidden sm:block">
                  <p className="text-xs font-medium text-gray-900">
                    {option.label}
                  </p>
                  <p className="text-[11px] font-mono text-gray-500">
                    {option.hex}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-600 leading-relaxed">
            {lang === "es"
              ? "Paleta de neutros cálidos y fríos para evitar dominantes de color y mantener legibles pétalos, tallos y sombras tanto del clavel como de la hormiga polinizadora."
              : "Warm‑to‑cool neutral palette to avoid color casting and keep petals, stems and shadows readable for both the carnation and the ant pollinator."}
          </p>
        </div>

        {/* Flower section */}
        <section className="space-y-6">
          <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <div className="text-3xl mb-1">🌸</div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                {lang === "es" ? "Clavel de España" : "Spanish Carnation"}
              </h1>
              <p className="text-sm text-gray-600">
                <em>{FLOWER_DATA.scientificName}</em> · {FLOWER_DATA.country}
              </p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <div className="font-mono">
                S.A.N.: <span className="font-semibold">{FLOWER_DATA.sanCode}</span>
              </div>
              <div>
                {lang === "es" ? "Medida Nahiara: 19 / 25 (Estable)" : "Nahiara Measure: 19 / 25 (Stable)"}
              </div>
            </div>
          </header>

          <div className="grid lg:grid-cols-[1.7fr_1.3fr] gap-8">
            {/* Flower 3D viewer */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="relative w-full h-[420px] sm:h-[480px] rounded-xl overflow-hidden isolate">
                <div ref={flowerCanvasRef} className="w-full h-full gpu-accelerated" />
                {!isFlowerLoaded && !flowerError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
                    <div className="w-10 h-10 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mb-3" />
                    <span className="text-sm text-gray-500">
                      {lang === "es" ? "Preparando render del clavel…" : "Preparing carnation render…"}
                    </span>
                  </div>
                )}
                {flowerError && (
                  <div className="absolute inset-0 grid place-content-center bg-red-50 text-red-500 text-sm font-medium text-center px-4">
                    {flowerError}
                  </div>
                )}
              </div>
            </div>

            {/* Flower ficha content (compressed from HTML ficha) */}
            <div className="space-y-6">
              {/* 1. Botanical data */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
                <h2 className="text-sm uppercase tracking-[0.3em] text-rose-500">
                  {lang === "es" ? "1. DATOS BOTÁNICOS" : "1. BOTANICAL DATA"}
                </h2>
                <div className="grid gap-3 text-sm">
                  <div className="bg-rose-50 rounded-lg px-3 py-2 border-l-4 border-rose-500">
                    <div className="text-[11px] font-semibold text-rose-700 uppercase">
                      {lang === "es" ? "Nombre científico" : "Scientific name"}
                    </div>
                    <div className="text-gray-800">
                      <em>{FLOWER_DATA.scientificName}</em>
                    </div>
                  </div>
                  <div className="bg-rose-50 rounded-lg px-3 py-2 border-l-4 border-rose-500">
                    <div className="text-[11px] font-semibold text-rose-700 uppercase">
                      {lang === "es" ? "Familia botánica" : "Botanical family"}
                    </div>
                    <div className="text-gray-800">Caryophyllaceae</div>
                  </div>
                  <div className="bg-rose-50 rounded-lg px-3 py-2 border-l-4 border-rose-500">
                    <div className="text-[11px] font-semibold text-rose-700 uppercase mb-1">
                      {lang === "es" ? "Nombres comunes" : "Common names"}
                    </div>
                    <p className="text-gray-800">
                      {lang === "es"
                        ? "Español: Clavel, Clavel común, Clavel de jardín · Inglés: Carnation, Clove Pink, Gillyflower"
                        : "Spanish: Clavel, Clavel común, Clavel de jardín · English: Carnation, Clove Pink, Gillyflower"}
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-700 space-y-1">
                  <p>
                    <span className="font-semibold">
                      {lang === "es" ? "Morfología básica:" : "Basic morphology:"}
                    </span>{" "}
                    {lang === "es"
                      ? "Amplia gama cromática (blanco, rosa, rojo, amarillo), flores muy fragantes con pétalos dentados y porte de 40‑80 cm."
                      : "Wide chromatic range (white, pink, red, yellow), highly fragrant flowers with toothed petals and a height of 40‑80 cm."}
                  </p>
                  <p>
                    <span className="font-semibold">
                      {lang === "es" ? "Hábitat y distribución:" : "Habitat & distribution:"}
                    </span>{" "}
                    {lang === "es"
                      ? "Cultivos ornamentales y jardines mediterráneos; nativo de la cuenca mediterránea y muy extendido en España."
                      : "Ornamental crops and Mediterranean gardens; native to the Mediterranean basin and widely cultivated in Spain."}
                  </p>
                </div>
              </div>

              {/* 2–5. Cultural, conservation, measure & synthesis (high‑level) */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4 text-sm">
                <h2 className="text-sm uppercase tracking-[0.3em] text-rose-500">
                  {lang === "es"
                    ? "2‑5. CULTURA, CONSERVACIÓN Y MEDIDA NAHIARA"
                    : "2‑5. CULTURE, CONSERVATION & NAHIARA MEASURE"}
                </h2>
                <p className="text-gray-800">
                  {lang === "es"
                    ? "El Clavel simboliza amor verdadero, pasión y resistencia. Desde el siglo XVI está ligado a la realeza española y hoy es inseparable del flamenco, las fiestas populares y la identidad mediterránea."
                    : "The Carnation symbolizes true love, passion and resilience. Since the 16th century it has been linked to Spanish royalty and today is inseparable from flamenco, popular festivities and Mediterranean identity."}
                </p>
                <p className="text-gray-800">
                  {lang === "es"
                    ? "Aunque no es flor nacional oficial, su peso cultural y su cultivo extensivo le otorgan una Medida Nahiara estable (19/25), con buena protección cultural pero expuesto a amenazas de clima y pérdida de hábitat."
                    : "Although not an official national flower, its cultural weight and extensive cultivation give it a stable Nahiara Measure (19/25), with strong cultural protection but exposure to climate and habitat‑loss threats."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pollinator section */}
        <section className="space-y-6">
          <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <div className="text-3xl mb-1">🐜</div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                {lang === "es" ? "Polinizador · Hormiga" : "Pollinator · Ant"}
              </h2>
              <p className="text-sm text-gray-600">
                <em>{POLLINATOR_DATA.scientificName}</em> ·{" "}
                {lang === "es" ? POLLINATOR_DATA.roleEs : POLLINATOR_DATA.roleEn}
              </p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <div className="font-mono">
                S.A.N.: <span className="font-semibold">{POLLINATOR_DATA.sanCode}</span>
              </div>
              <div>
                {lang === "es" ? "Medida Araihan: 18 / 25 (Estable)" : "Araihan Measure: 18 / 25 (Stable)"}
              </div>
            </div>
          </header>

          <div className="grid lg:grid-cols-[1.7fr_1.3fr] gap-8">
            {/* Ant 3D viewer */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="relative w-full h-[380px] sm:h-[440px] rounded-xl overflow-hidden isolate">
                <div ref={antCanvasRef} className="w-full h-full gpu-accelerated" />
                {!isAntLoaded && !antError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
                    <div className="w-10 h-10 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mb-3" />
                    <span className="text-sm text-gray-500">
                      {lang === "es" ? "Preparando render de la hormiga…" : "Preparing ant render…"}
                    </span>
                  </div>
                )}
                {antError && (
                  <div className="absolute inset-0 grid place-content-center bg-red-50 text-red-500 text-sm font-medium text-center px-4">
                    {antError}
                  </div>
                )}
              </div>
            </div>

            {/* Pollinator ficha content, inspired by Lepidoptera ficha but adapted to ant */}
            <div className="space-y-6 text-sm">
              {/* 1. Biological data */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
                <h2 className="text-sm uppercase tracking-[0.3em] text-violet-600">
                  {lang === "es" ? "1. DATOS BIOLÓGICOS" : "1. BIOLOGICAL DATA"}
                </h2>
                <div className="grid gap-3">
                  <div className="bg-violet-50 rounded-lg px-3 py-2 border-l-4 border-violet-500">
                    <div className="text-[11px] font-semibold text-violet-700 uppercase">
                      {lang === "es" ? "Nombre científico" : "Scientific name"}
                    </div>
                    <div className="text-gray-800">
                      <em>{POLLINATOR_DATA.scientificName}</em>
                    </div>
                  </div>
                  <div className="bg-violet-50 rounded-lg px-3 py-2 border-l-4 border-violet-500">
                    <div className="text-[11px] font-semibold text-violet-700 uppercase">
                      {lang === "es" ? "Grupo" : "Group"}
                    </div>
                    <div className="text-gray-800">
                      {lang === "es"
                        ? "Insectos sociales (Orden Hymenoptera)"
                        : "Social insects (Order Hymenoptera)"}
                    </div>
                  </div>
                  <div className="bg-violet-50 rounded-lg px-3 py-2 border-l-4 border-violet-500">
                    <div className="text-[11px] font-semibold text-violet-700 uppercase mb-1">
                      {lang === "es" ? "Nombres comunes" : "Common names"}
                    </div>
                    <p className="text-gray-800">
                      {lang === "es"
                        ? "Hormiga, hormiga de jardín · Inglés: Ant, Garden ant"
                        : "Ant, garden ant · Spanish: Hormiga, hormiga de jardín"}
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-700 space-y-1">
                  <p>
                    <span className="font-semibold">
                      {lang === "es" ? "Morfología básica:" : "Basic morphology:"}
                    </span>{" "}
                    {lang === "es"
                      ? "Cuerpo dividido en cabeza, tórax y abdomen, antenas acodadas y fuerte aparato mandibular; tamaño de pocos milímetros a 1–2 cm."
                      : "Body divided into head, thorax and abdomen, elbowed antennae and strong mandibles; size from a few millimetres to 1–2 cm."}
                  </p>
                  <p>
                    <span className="font-semibold">
                      {lang === "es" ? "Hábitat y distribución:" : "Habitat & distribution:"}
                    </span>{" "}
                    {lang === "es"
                      ? "Presente en casi todos los ecosistemas terrestres, especialmente en suelos, bordes de caminos y jardines."
                      : "Present in almost all terrestrial ecosystems, especially soils, path edges and gardens."}
                  </p>
                </div>
              </div>

              {/* 2–5. Role as pollinator, conservation & Araihan measure */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
                <h2 className="text-sm uppercase tracking-[0.3em] text-violet-600">
                  {lang === "es"
                    ? "2‑5. ROL POLINIZADOR, CONSERVACIÓN Y MEDIDA ARAIHAN"
                    : "2‑5. POLLINATOR ROLE, CONSERVATION & ARAIHAN MEASURE"}
                </h2>
                <p className="text-gray-800">
                  {lang === "es"
                    ? "Las hormigas visitan los claveles atraídas por el néctar y las sustancias azucaradas de los pétalos. Aunque suelen considerarse polinizadores secundarios frente a lepidópteros o abejas, favorecen el contacto con el polen en la base de la flor."
                    : "Ants visit carnations attracted by nectar and sugary exudates on the petals. Although often considered secondary pollinators compared to lepidoptera or bees, they promote contact with pollen at the base of the flower."}
                </p>
                <p className="text-gray-800">
                  {lang === "es"
                    ? "El conjunto de hormigas polinizadoras se evalúa con una Medida Araihan estimada de 18/25: alta eficiencia local y fuerte interdependencia ecológica, pero vulnerable a pesticidas, pérdida de hábitat y cambios en el microclima del suelo."
                    : "Ant pollinator guilds receive an estimated Araihan Measure of 18/25: high local efficiency and strong ecological interdependence, yet vulnerable to pesticides, habitat loss and changes in soil micro‑climate."}
                </p>
                <p className="text-xs text-gray-600">
                  {lang === "es"
                    ? "Proteger a estas poblaciones de hormigas ayuda a mantener la fertilidad del clavel y de muchas otras especies herbáceas con las que cohabitan."
                    : "Protecting these ant populations helps maintain carnation fertility and that of many other co‑occurring herbaceous species."}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

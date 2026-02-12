"use client";
import { useParams } from "next/navigation";
import Navigation from "../../../../components/Navigation";
import Footer from "../../../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Globe, Heart, Rotate3D, Bot, Zap, Cpu, MapPin, Shield, TreePine, Lightbulb, AlertTriangle, Star, BookOpen } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { getPollinatorBySlug, getAllPollinators } from "../pollinatorData";

// ── 3D Model Viewer ──────────────────────────────────────
function PollinatorModelViewer({ glbPath }) {
    const canvasRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { setIsMounted(true); }, []);

    useEffect(() => {
        if (!isMounted || !glbPath || !canvasRef.current) return;
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
                while (container.firstChild) container.removeChild(container.firstChild);

                scene = new THREE.Scene();
                scene.background = new THREE.Color(0xf5f5f0);

                camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
                camera.position.set(0, 1.5, 3);
                camera.lookAt(0, 0, 0);

                renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
                renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
                renderer.setSize(container.clientWidth, container.clientHeight, false);
                renderer.outputColorSpace = THREE.SRGBColorSpace;
                renderer.toneMapping = THREE.ACESFilmicToneMapping;
                renderer.toneMappingExposure = 1.1;
                renderer.shadowMap.enabled = true;
                container.appendChild(renderer.domElement);
                cleanupFns.push(() => {
                    if (renderer?.domElement?.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
                    renderer?.dispose();
                });

                scene.add(new THREE.AmbientLight(0xffffff, 0.6));
                const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
                dirLight.position.set(4, 6, 3);
                dirLight.castShadow = true;
                scene.add(dirLight);
                const fill = new THREE.DirectionalLight(0xfff1d6, 0.6);
                fill.position.set(-3, 2, -2);
                scene.add(fill);
                const rim = new THREE.DirectionalLight(0xd8ecff, 0.45);
                rim.position.set(0, 4, -4);
                scene.add(rim);

                const groundGeo = new THREE.PlaneGeometry(20, 20);
                const groundMat = new THREE.ShadowMaterial({ opacity: 0.15 });
                const ground = new THREE.Mesh(groundGeo, groundMat);
                ground.rotation.x = -Math.PI / 2;
                ground.position.y = -1;
                ground.receiveShadow = true;
                scene.add(ground);

                const dracoLoader = new DRACOLoader();
                dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
                dracoLoader.setDecoderConfig({ type: "js" });
                const loader = new GLTFLoader();
                loader.setDRACOLoader(dracoLoader);
                loader.setCrossOrigin("anonymous");

                loader.load(
                    glbPath,
                    (gltf) => {
                        const model = gltf.scene;
                        model.traverse((node) => {
                            if (node.isMesh) { node.castShadow = true; node.receiveShadow = true; }
                        });

                        model.updateMatrixWorld(true);
                        const box = new THREE.Box3();
                        model.traverse((node) => {
                            if (node.isMesh) {
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

                        const onResize = () => {
                            if (!container) return;
                            camera.aspect = container.clientWidth / container.clientHeight;
                            camera.updateProjectionMatrix();
                            renderer.setSize(container.clientWidth, container.clientHeight);
                        };
                        window.addEventListener("resize", onResize);
                        cleanupFns.push(() => window.removeEventListener("resize", onResize));

                        setIsLoaded(true);
                    },
                    undefined,
                    (err) => { console.error("GLB error:", err); setError("Failed to load 3D model"); }
                );
            } catch (err) { console.error("Three.js error:", err); setError("Failed to initialize 3D viewer"); }
        };

        loadGLB();
        return () => cleanupFns.forEach((fn) => fn());
    }, [isMounted, glbPath]);

    if (!isMounted) return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="relative w-full h-full">
            <div ref={canvasRef} className="w-full h-full" />
            {!isLoaded && !error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
                    <span className="text-sm text-gray-500">Loading 3D model…</span>
                </div>
            )}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50">
                    <div className="text-center">
                        <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Araihan Measure Progress Bar ─────────────────────────
function AraihanBar({ score, max = 25 }) {
    const pct = (score / max) * 100;
    const color =
        score >= 21 ? "from-green-400 to-emerald-500" :
            score >= 19 ? "from-yellow-400 to-amber-500" :
                score >= 17 ? "from-orange-400 to-red-500" :
                    "from-red-500 to-rose-600";
    return (
        <div className="w-full">
            <div className="flex justify-between text-sm mb-1.5">
                <span className="font-semibold text-gray-700">Araihan Measure</span>
                <span className="font-bold text-gray-900">{score}/{max}</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                />
            </div>
            <p className="text-xs text-gray-500 mt-1">Ecological health index (0–25)</p>
        </div>
    );
}

// ── Badge component ──────────────────────────────────────
function Badge({ children, variant = "default" }) {
    const styles = {
        default: "bg-gray-100 text-gray-700",
        green: "bg-green-100 text-green-700",
        amber: "bg-amber-100 text-amber-700",
        red: "bg-red-100 text-red-700",
        blue: "bg-blue-100 text-blue-700",
        purple: "bg-purple-100 text-purple-700",
    };
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${styles[variant] || styles.default}`}>
            {children}
        </span>
    );
}

function getStatusVariant(status) {
    if (!status) return "default";
    const s = status.toLowerCase();
    if (s.includes("declining")) return "red";
    if (s.includes("recovering")) return "amber";
    if (s.includes("stable")) return "green";
    if (s.includes("prototype")) return "blue";
    if (s.includes("development")) return "purple";
    if (s.includes("concept")) return "amber";
    if (s.includes("research")) return "blue";
    return "default";
}

// ── Main Page ────────────────────────────────────────────
export default function PollinatorDetailPage() {
    const params = useParams();
    const slug = params?.slug;
    const pollinator = slug ? getPollinatorBySlug(slug) : null;

    if (!pollinator) {
        return (
            <div className="min-h-screen bg-white">
                <Navigation />
                <div className="flex flex-col items-center justify-center py-40">
                    <h1 className="text-4xl font-bold text-gray-300 mb-4">Pollinator Not Found</h1>
                    <p className="text-gray-500 mb-8">The pollinator you're looking for doesn't exist in our gallery.</p>
                    <Link href="/pollinators/gallery" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Gallery
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const isRobotic = pollinator.type === "robotic";

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/30 to-white">
            <Navigation />

            {/* ── Hero Section ──────────────────────────────── */}
            <section className="relative">
                {/* Hero Image */}
                <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] min-h-[400px] overflow-hidden">
                    <Image
                        src={pollinator.image}
                        alt={pollinator.name}
                        fill
                        className="object-cover"
                        priority
                        unoptimized={pollinator.image?.startsWith("data:")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Hero Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
                        <div className="max-w-5xl mx-auto">
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                                <Link
                                    href="/pollinators/gallery"
                                    className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back to Gallery
                                </Link>

                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-3xl">{pollinator.categoryIcon}</span>
                                    <Badge variant={isRobotic ? "blue" : "green"}>
                                        {isRobotic ? "Robotic Pollinator" : pollinator.category}
                                    </Badge>
                                    {pollinator.conservationStatus && (
                                        <Badge variant={getStatusVariant(pollinator.conservationStatus)}>
                                            {pollinator.conservationStatus}
                                        </Badge>
                                    )}
                                    {pollinator.status && (
                                        <Badge variant={getStatusVariant(pollinator.status)}>
                                            {pollinator.status}
                                        </Badge>
                                    )}
                                </div>

                                <h1
                                    className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-2"
                                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                                >
                                    {pollinator.name}
                                </h1>
                                {pollinator.scientificName && (
                                    <p className="text-lg sm:text-xl text-white/70 italic">{pollinator.scientificName}</p>
                                )}
                                {isRobotic && (
                                    <p className="text-sm text-white/60 mt-1">{pollinator.manufacturer} · {pollinator.year}</p>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Main Content ─────────────────────────────── */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

                {/* Quick Stats Row */}
                <motion.div
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {pollinator.region && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Region</span>
                            </div>
                            <p className="text-sm font-bold text-gray-900">{pollinator.region}</p>
                        </div>
                    )}

                    {pollinator.araihanMeasure && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Araihan Score</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{pollinator.araihanMeasure}<span className="text-sm text-gray-400">/25</span></p>
                        </div>
                    )}

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Rotate3D className="w-4 h-4 text-purple-500" />
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">3D Model</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">{pollinator.glbPath ? "✅ Available" : "❌ Not available"}</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            {isRobotic ? <Bot className="w-4 h-4 text-blue-500" /> : <Heart className="w-4 h-4 text-rose-500" />}
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">{isRobotic ? "Robotic" : "Natural"}</p>
                    </div>
                </motion.div>

                {/* 3D Model Viewer */}
                {pollinator.glbPath && (
                    <motion.section
                        className="mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <Rotate3D className="w-6 h-6 text-purple-500" />
                            Interactive 3D Model
                        </h2>
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
                            <div className="w-full h-[350px] sm:h-[450px] lg:h-[550px]">
                                <PollinatorModelViewer glbPath={pollinator.glbPath} />
                            </div>
                            <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100">
                                <p className="text-xs text-gray-500">🖱️ Drag to rotate · Scroll to zoom · The model auto-rotates</p>
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* Araihan Measure */}
                {pollinator.araihanMeasure && (
                    <motion.section
                        className="mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                    >
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                            <AraihanBar score={pollinator.araihanMeasure} />
                        </div>
                    </motion.section>
                )}

                {/* Description */}
                <motion.section
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-amber-500" />
                        About {pollinator.name}
                    </h2>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                        <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                            {pollinator.detailedDescription || pollinator.description}
                        </p>
                    </div>
                </motion.section>

                {/* Habitat & Conservation (for natural pollinators) */}
                {!isRobotic && (
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        {pollinator.habitat && (
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 border border-green-200">
                                <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                                    <TreePine className="w-5 h-5" /> Habitat
                                </h3>
                                <p className="text-green-900/80 leading-relaxed">{pollinator.habitat}</p>
                            </div>
                        )}

                        {pollinator.conservation && (
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-200">
                                <h3 className="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
                                    <Shield className="w-5 h-5" /> Conservation
                                </h3>
                                <p className="text-amber-900/80 leading-relaxed">{pollinator.conservation}</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Fun Facts */}
                {pollinator.funFacts && pollinator.funFacts.length > 0 && (
                    <motion.section
                        className="mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.55 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <Lightbulb className="w-6 h-6 text-yellow-500" />
                            Did You Know?
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {pollinator.funFacts.map((fact, i) => (
                                <motion.div
                                    key={i}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                            {i + 1}
                                        </span>
                                        <p className="text-gray-700 text-sm leading-relaxed">{fact}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Robotic-specific sections */}
                {isRobotic && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        {/* Capabilities & Applications */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <Zap className="w-6 h-6 text-blue-500" />
                                Technical Specifications
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-200">
                                    <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                                        <Zap className="w-5 h-5" /> Capabilities
                                    </h3>
                                    <p className="text-blue-900/80 leading-relaxed">{pollinator.capabilities}</p>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 sm:p-8 border border-purple-200">
                                    <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
                                        <Cpu className="w-5 h-5" /> Applications
                                    </h3>
                                    <p className="text-purple-900/80 leading-relaxed">{pollinator.applications}</p>
                                </div>
                            </div>
                        </section>

                        {/* Advantages & Limitations */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <Star className="w-6 h-6 text-amber-500" />
                                Advantages & Limitations
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 border border-green-200">
                                    <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                                        <span className="text-green-600">✓</span> Advantages
                                    </h3>
                                    <p className="text-green-900/80 leading-relaxed">{pollinator.advantages}</p>
                                </div>

                                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 sm:p-8 border border-orange-200">
                                    <h3 className="text-lg font-bold text-orange-800 mb-3 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" /> Limitations
                                    </h3>
                                    <p className="text-orange-900/80 leading-relaxed">{pollinator.limitations}</p>
                                </div>
                            </div>
                        </section>
                    </motion.div>
                )}

                {/* Related Pollinators */}
                <motion.section
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore More Pollinators</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {getAllPollinators()
                            .filter((p) => p.slug !== slug)
                            .slice(0, 8)
                            .map((p) => (
                                <Link
                                    key={p.slug}
                                    href={`/pollinators/gallery/${p.slug}`}
                                    className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="relative h-28 sm:h-32 overflow-hidden">
                                        <Image
                                            src={p.image}
                                            alt={p.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            unoptimized={p.image?.startsWith("data:")}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        <span className="absolute bottom-2 left-2 text-xs text-white/80">{p.categoryIcon}</span>
                                    </div>
                                    <div className="p-3">
                                        <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{p.name}</h4>
                                        {p.scientificName && (
                                            <p className="text-[11px] text-gray-500 italic line-clamp-1">{p.scientificName}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                    </div>
                </motion.section>

                {/* Back to Gallery CTA */}
                <div className="text-center py-8">
                    <Link
                        href="/pollinators/gallery"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Gallery
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}

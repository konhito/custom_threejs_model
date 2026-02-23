"use client";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, TrendingDown, AlertTriangle, Globe, Heart, Rotate3D, Bot, Zap, Cpu, Wifi } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Pollinator3D from "../../../components/Pollinator3D";

// Helper function to create GLB path
const createGLBPath = (fileName) => {
  return `/api/glb-proxy?url=${encodeURIComponent(`https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/${fileName}`)}`;
};

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
        <div className="overflow-y-auto max-h-72 bg-white border-t border-gray-100">
          <div className="p-6 space-y-6">

            {/* 1. Botanical / Taxonomic Data */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-[0.3em] text-amber-600 font-bold">1. TAXONOMIC &amp; BOTANICAL DATA</h3>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase block mb-1">Scientific Name</span>
                  <span className="text-gray-800 italic text-sm">{pollinator.scientificName}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase block mb-1">Region</span>
                  <span className="text-gray-800 text-sm">{pollinator.region || "Global"}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase block mb-1">Habitat</span>
                  <span className="text-gray-800 text-sm">{pollinator.habitat || "Varied"}</span>
                </div>
                {pollinator.botanicalInfo && (
                  <div className="sm:col-span-2">
                    <span className="text-xs font-bold text-amber-700 uppercase block mb-1">Morphology &amp; Biology</span>
                    <p className="text-gray-700 text-sm leading-relaxed">{pollinator.botanicalInfo}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Ecological Role */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-[0.3em] text-gray-400 font-bold">2. ECOLOGICAL ROLE</h3>
              <div className="space-y-2">
                <p className="text-gray-600 text-sm leading-relaxed">{pollinator.description || pollinator.roleEn}</p>
                {pollinator.ecologicalRole && (
                  <p className="text-gray-600 text-sm leading-relaxed">{pollinator.ecologicalRole}</p>
                )}
              </div>
            </div>

            {/* Conservation status */}
            {pollinator.conservation && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs uppercase tracking-[0.3em] text-red-500 font-bold mb-2">3. CONSERVATION STATUS</h3>
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <p className="text-gray-700 text-sm leading-relaxed">{pollinator.conservation}</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default function PollinatorsGalleryPage() {
  const [selected3DModel, setSelected3DModel] = useState(null);

  // Natural Pollinators Data with GLB paths
  const naturalPollinators = {
    bees: [
      {
        name: "Ant",
        scientificName: "Formicidae sp.",
        region: "Global",
        country: "Global",
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop&q=80",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/ant-on-flower-petals",
        description: "Ground pollinator associated with flowers. Ants visit flowers attracted by nectar and sugary exudates on the petals.",
        habitat: "Present in almost all terrestrial ecosystems, especially soils, path edges and gardens.",
        conservation: "Ant pollinator guilds receive an estimated Araihan Measure of 18/25: high local efficiency and strong ecological interdependence.",
        botanicalInfo: "Ants belong to the family Formicidae, order Hymenoptera. They are eusocial insects with a colonial lifecycle, comprising workers, queens, and males. Their exoskeleton, segmented body, and powerful mandibles are key morphological features.",
        ecologicalRole: "Though less efficient than bees due to the absence of specialized pollen-carrying structures (corbiculae), ants contribute to pollination by transferring pollen grains between flowers of low-growing plants while foraging for nectar. They are also important seed dispersers (myrmecochory).",
        glbPath: "/ant.glb",
        roleEn: "Ground pollinator associated with flowers"
      },
      {
        name: "Honeybee",
        scientificName: "Apis mellifera",
        region: "Global",
        country: "Global",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&h=600&fit=crop&q=80",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/bee-on-yellow-flower",
        description: "Essential pollinator responsible for pollinating many of the world's food crops. Honeybees are among the most important pollinators, responsible for pollinating approximately 80% of flowering plants and 75% of food crops worldwide.",
        habitat: "Found worldwide in diverse habitats, from forests to urban gardens, wherever flowering plants grow.",
        conservation: "Honeybee populations face significant threats from pesticides, habitat loss, climate change, and diseases. Araihan Measure: 20 / 25 (Declining).",
        botanicalInfo: "Apis mellifera belongs to the family Apidae. The worker bee's body is covered in branched hairs that electrostatically attract pollen. Specialised hind-leg structures called corbiculae (pollen baskets) allow them to carry large pollen loads back to the hive. The colony superorganism comprises a single queen, up to 60,000 workers, and seasonal drones.",
        ecologicalRole: "Honeybees employ a 'waggle dance' communication system to recruit nestmates to high-quality food sources, making them extraordinarily efficient at exploiting floral patches. Their fuzzy bodies passively pick up pollen and deposit it on stigmas during subsequent visits. They pollinate over 400 agricultural plant species globally, contributing an estimated $235 billion in annual crop value.",
        glbPath: null,
        roleEn: "Essential pollinator responsible for pollinating many of the world's food crops"
      },
      {
        name: "Bumblebee",
        scientificName: "Bombus terrestris",
        region: "Europe, Asia, North America",
        country: "Europe, Asia, North America",
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=600&fit=crop&q=80",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/bumblebee-on-flower",
        description: "Large, fuzzy bees that are excellent pollinators for many wildflowers and crops. Bumblebees are excellent pollinators due to their large size and ability to 'buzz pollinate' flowers that require vibration to release pollen.",
        habitat: "Temperate regions, grasslands, meadows, and gardens with abundant flowering plants.",
        conservation: "Many bumblebee species are declining due to habitat loss and pesticide use. Araihan Measure: 19 / 25 (Stable to Declining).",
        botanicalInfo: "Bombus terrestris belongs to family Apidae, subfamily Apinae. Queens are 20–23 mm long; workers 11–17 mm. Their robust, densely hairy bodies are adapted to colder climates, and they can thermoregulate by shivering their flight muscles. Unlike honeybees, colonies are annual — only mated queens overwinter.",
        ecologicalRole: "Bumblebees are the primary practitioners of 'sonication' or buzz pollination, where they grip the anthers and vibrate at ~400 Hz to dislodge pollen. This is critical for solanaceous crops (tomatoes, peppers, aubergines) and wild plants like Solanum. Their large body size allows them to access flowers inaccessible to smaller insects.",
        glbPath: null,
        roleEn: "Large, fuzzy bees that are excellent pollinators for many wildflowers and crops"
      }
    ],
    birds: [
      {
        name: "Ruby-throated Hummingbird",
        scientificName: "Archilochus colubris",
        region: "North America",
        country: "North America",
        image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&h=600&fit=crop&q=80",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/hummingbird-in-flight",
        description: "Tiny, fast-flying birds that pollinate tubular flowers with their long beaks. Hummingbirds are important pollinators for many tubular flowers, transferring pollen as they feed on nectar with their long, specialized beaks.",
        habitat: "Forests, gardens, and meadows throughout North America, especially areas with abundant nectar-producing flowers.",
        conservation: "While not currently endangered, habitat loss and climate change pose threats. Araihan Measure: 22 / 25 (Stable).",
        botanicalInfo: "Archilochus colubris is the only hummingbird species that regularly breeds in eastern North America. Adults weigh ~3 g and have a wing-beat frequency of 53 Hz. Males display an iridescent ruby-red gorget produced by structural coloration of feather barbules. They enter daily torpor to conserve energy.",
        ecologicalRole: "Hummingbirds co-evolved with ornithophilous (bird-pollinated) flowers characterised by red or orange tubular corollas with dilute nectar. Their long, curved bills and extensible tongues allow nectar extraction while the forehead brushes against anthers and stigmas. Key plant relationships include Lobelia cardinalis, Campsis radicans, and Monarda didyma.",
        glbPath: createGLBPath("Humming_bird.glb"),
        roleEn: "Tiny, fast-flying birds that pollinate tubular flowers with their long beaks"
      },
      {
        name: "Sunbird",
        scientificName: "Nectariniidae",
        region: "Africa, Asia, Australia",
        country: "Africa, Asia, Australia",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/colorful-sunbird-on-branch",
        description: "Colorful nectar-feeding birds that pollinate many tropical flowers. Sunbirds are important pollinators in tropical and subtropical regions, visiting a wide variety of flowering plants.",
        habitat: "Tropical and subtropical regions of Africa, Asia, and Australia, in forests, gardens, and open areas with flowering plants.",
        conservation: "Sunbird populations are generally stable but face threats from habitat destruction. Araihan Measure: 21 / 25 (Stable).",
        botanicalInfo: "The family Nectariniidae comprises ~145 species. Males are typically iridescent and highly colourful due to structural coloration; females are duller. Bills are long, slender, and down-curved — morphologically convergent with hummingbirds through parallel evolution. Body mass ranges from 5 to 20 g depending on species.",
        ecologicalRole: "Sunbirds are the ecological equivalents of hummingbirds in the Old World. They are obligate nectarivores and primary pollinators of many African and Asian flowers including Strelitzia (bird-of-paradise), Aloe, and Erythrina. Unlike hummingbirds, many sunbirds are able to perch while feeding, sometimes piercing flower bases to access nectar (nectar robbing).",
        glbPath: null,
        roleEn: "Colorful nectar-feeding birds that pollinate many tropical flowers"
      }
    ],
    butterflies: [
      {
        name: "Monarch Butterfly",
        scientificName: "Danaus plexippus",
        region: "North America",
        country: "North America",
        image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&h=600&fit=crop",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/monarch-butterfly",
        description: "Famous migratory butterflies that pollinate milkweed and other wildflowers. Monarchs are important pollinators during their long migrations, visiting numerous flowering plants along their route.",
        habitat: "Meadows, fields, and gardens across North America, with specific overwintering sites in Mexico and California.",
        conservation: "Monarch populations have declined significantly due to habitat loss and pesticide use. Araihan Measure: 17 / 25 (Declining).",
        botanicalInfo: "Danaus plexippus (family Nymphalidae) displays aposematic orange-and-black wing patterning warning predators of cardiac glycoside toxicity acquired from its host plant, Asclepias (milkweed). Wingspan: 86–124 mm. The four-stage holometabolous lifecycle (egg → larva → chrysalis → adult) takes 4 weeks in summer.",
        ecologicalRole: "Monarchs are generalist pollinators, visiting a wide range of nectar plants (goldenrod, asters, lantana) during 4,800 km annual migrations. Pollen adheres to their bodies passively and is deposited across vast geographic ranges, contributing to long-distance gene flow between plant populations. Larvae are specialist feeders on Asclepias, influencing milkweed population dynamics.",
        glbPath: createGLBPath("Final_Textured_Butterfly.glb"),
        roleEn: "Famous migratory butterflies that pollinate milkweed and other wildflowers"
      },
      {
        name: "Hummingbird Moth",
        scientificName: "Hemaris spp.",
        region: "North America, Europe, Asia",
        country: "North America, Europe, Asia",
        image: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&h=600&fit=crop&q=80",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/hummingbird-moth-on-flower",
        description: "Moth species that mimic hummingbirds in appearance and behavior. Hummingbird moths are important pollinators, especially for tubular flowers. They hover like hummingbirds while feeding on nectar.",
        habitat: "Gardens, meadows, and open areas with abundant flowering plants. Found in temperate regions worldwide.",
        conservation: "Hummingbird moth populations are generally stable but face threats from habitat loss and pesticide use. Araihan Measure: 19 / 25 (Stable).",
        botanicalInfo: "Hemaris (family Sphingidae, clearwing hawkmoths) are diurnal moths with a wingspan of 38–55 mm. Wing scales are shed after the first flight, leaving transparent 'windows' — an adaptation for visual mimicry of hummingbirds. The proboscis can exceed 25 mm, enabling deep-flower nectar extraction while hovering.",
        ecologicalRole: "As hawkmoths, Hemaris spp. are key pollinators of long-tubed flowers including Phlox, Lonicera (honeysuckle), Viburnum, and Dianthus. Their hovering flight and long proboscis allow exploitation of floral resources inaccessible to shorter-tongued insects. Being diurnal also means they bridge the gap between bee activity periods and nocturnal sphinx moths.",
        glbPath: createGLBPath("Normal__Humming_Bird_Moth_Glb.glb"),
        roleEn: "Moth species that mimic hummingbirds in appearance and behavior"
      },
      {
        name: "Swallowtail Butterfly",
        scientificName: "Papilionidae",
        region: "Global",
        country: "Global",
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&q=80",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/swallowtail-butterfly-on-flower",
        description: "Large, colorful butterflies with distinctive tail-like extensions on their wings. Swallowtails are important pollinators for many flowering plants, especially those with deep corollas.",
        habitat: "Found in diverse habitats worldwide, from forests to gardens, wherever flowering plants grow.",
        conservation: "Many swallowtail species are stable, but some face threats from habitat loss. Araihan Measure: 20 / 25 (Stable).",
        botanicalInfo: "Papilionidae is one of the largest butterfly families with ~600 species. Wingspans range 45–280 mm. Many species exhibit sexual dimorphism and Batesian mimicry. Larvae are notable for the osmeterium — a forked glandular organ that emits repellent terpenes when threatened. Compound eyes detect UV-wavelength floral guides invisible to humans.",
        ecologicalRole: "Swallowtails preferentially visit large, flat-headed flowers (Asteraceae, Apiaceae, Zinnias) and deep-tubular blooms. Their long proboscis enables nectaring at flowers with restricted access. As wide-ranging insects they transfer pollen across larger areas than most bee species, contributing to cross-pollination and genetic diversity of plant populations.",
        glbPath: null,
        roleEn: "Large, colorful butterflies with distinctive tail-like extensions on their wings"
      }
    ],
    bats: [
      {
        name: "Lesser Long-nosed Bat",
        scientificName: "Leptonycteris yerbabuenae",
        region: "Mexico, Southwestern US",
        country: "Mexico, Southwestern US",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&q=80",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/bat-pollinating-flower",
        description: "Nocturnal pollinators that feed on nectar and pollinate night-blooming flowers. These bats are crucial pollinators for agave, cacti, and other night-blooming plants in desert ecosystems.",
        habitat: "Desert and semi-desert regions of Mexico and the southwestern United States, especially areas with agave and cacti.",
        conservation: "Once endangered, populations have recovered but still face threats from habitat loss. Araihan Measure: 18 / 25 (Recovering).",
        botanicalInfo: "Leptonycteris yerbabuenae (family Phyllostomidae) is a medium-sized bat (~22 g) with a greatly reduced tail and extensible tongue adapted for nectar feeding. The tongue tip bears papillae that mop up nectar and pollen. Echolocation calls are low-intensity compared to insectivorous bats. They undertake seasonal migrations tracking the 'nectar corridor' of blooming plants.",
        ecologicalRole: "Leptonycteris bats are obligate mutualists of columnar cacti (Carnegiea gigantea — saguaro) and Agave species. Pollen is deposited on the bat's face and chest as it hovers and probes flowers. Without bat pollination, many agave species fail to set seed. The Tequila Bat is sometimes called the 'guardian of the tequila plant' due to its role in blue agave reproduction.",
        glbPath: null,
        roleEn: "Nocturnal pollinators that feed on nectar and pollinate night-blooming flowers"
      }
    ],
    beetles: [
      {
        name: "Flower Beetle",
        scientificName: "Coleoptera sp.",
        region: "Global",
        country: "Global",
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop&q=80",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/beetle-on-flower",
        description: "Diverse group of insects that pollinate flowers while feeding on pollen and nectar. Beetles are among the oldest pollinators, visiting flowers to feed on pollen and nectar. They are particularly important for primitive flowering plants.",
        habitat: "Found in almost all terrestrial ecosystems worldwide, from forests to deserts, gardens to grasslands.",
        conservation: "Beetle pollinator populations are generally stable but face threats from habitat loss and pesticide use. Araihan Measure: 20 / 25 (Stable).",
        botanicalInfo: "Coleoptera is the largest insect order (~400,000 described species). Flower-visiting beetles (Cetoniidae, Nitidulidae, Melyridae) possess chewing mouthparts that allow them to consume both pollen and floral tissues. Their heavily sclerotised exoskeleton carries pollen less efficiently than hairy bees, but body spines and setae aid passive transport.",
        ecologicalRole: "Beetles are the oldest known pollinators — fossil evidence dates their association with primitive flowering plants (magnolias, water lilies) to the Cretaceous period (~125 Ma). They are primary pollinators of bowl-shaped, strongly scented white or green flowers that provide easy landing access (e.g., Magnolia, Camellia, Nelumbo). Their pollination syndrome is called 'cantharophily'.",
        glbPath: createGLBPath("Beetle_Final_With_Texture.glb"),
        roleEn: "Diverse group of insects that pollinate flowers while feeding on pollen and nectar"
      }
    ]
  };

  // Robotic Pollinators Data
  const roboticPollinators = [
    {
      name: "RoboBee",
      manufacturer: "Harvard University",
      year: "2013",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&q=80",
      imageAttribution: "Unsplash",
      imageUrl: "https://unsplash.com/photos/robotic-technology",
      description: "Miniature flying robot inspired by honeybees, designed for artificial pollination. Weighs only 80 milligrams and can hover, fly, and land on surfaces.",
      capabilities: "Autonomous flight, precision landing, payload carrying, swarm coordination",
      applications: "Greenhouse pollination, crop monitoring, search and rescue, environmental monitoring",
      status: "Research & Development",
      advantages: "Can work 24/7, unaffected by pesticides, precise pollination control",
      limitations: "Limited battery life, requires charging infrastructure, cannot fully replicate natural bee behavior"
    },
    {
      name: "B-Droid",
      manufacturer: "Warsaw University of Technology",
      year: "2017",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop&q=80",
      imageAttribution: "Unsplash",
      imageUrl: "https://unsplash.com/photos/agricultural-robot",
      description: "Autonomous ground robot designed for precision pollination in greenhouses. Uses computer vision to identify flowers and apply pollen with precision.",
      capabilities: "Autonomous navigation, flower recognition, precise pollen application, data collection",
      applications: "Greenhouse crops, controlled environment agriculture, research applications",
      status: "Prototype",
      advantages: "Precise pollination, data collection capabilities, works in controlled environments",
      limitations: "Limited to ground-based plants, requires structured environments, high initial cost"
    },
    {
      name: "Strawberry Pollination Drone",
      manufacturer: "Various",
      year: "2020",
      image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop&q=80",
      imageAttribution: "Unsplash",
      imageUrl: "https://unsplash.com/photos/agricultural-drone",
      description: "Small drone systems designed specifically for pollinating strawberry plants in greenhouses. Uses air currents to distribute pollen effectively.",
      capabilities: "Autonomous flight patterns, pollen distribution, crop monitoring, precision agriculture",
      applications: "Strawberry greenhouses, high-value crops, controlled environment agriculture",
      status: "Commercial Development",
      advantages: "Effective for specific crops, reduces labor costs, consistent pollination",
      limitations: "Limited to specific crop types, requires greenhouse infrastructure, ongoing maintenance"
    },
    {
      name: "AI-Powered Pollination System",
      manufacturer: "Various Tech Companies",
      year: "2022",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
      imageAttribution: "Unsplash",
      imageUrl: "https://unsplash.com/photos/ai-robotics-agriculture",
      description: "Advanced robotic systems using artificial intelligence and machine learning to identify flowers, assess pollination needs, and apply pollen with precision.",
      capabilities: "AI-powered flower recognition, adaptive pollination strategies, real-time monitoring, data analytics",
      applications: "Large-scale agriculture, precision farming, research, commercial greenhouses",
      status: "Advanced Development",
      advantages: "Intelligent decision-making, scalable solutions, data-driven optimization",
      limitations: "High complexity, requires technical expertise, significant investment, cannot replace ecosystem services"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <Navigation />

      <div className="pt-20 px-4 lg:pr-24 lg:pl-8">
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

          {/* Robotic Pollinators Section */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {roboticPollinators.map((robot, index) => (
                <RoboticPollinatorCard key={index} robot={robot} />
              ))}
            </div>

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
          </section>

          {/* SAN Calculator Reference */}
          <section className="mt-20 mb-12">
            <Link href="/san-calculator" className="block group">
              <div className="relative overflow-hidden bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 lg:p-10 border border-indigo-200 hover:border-indigo-300 transition-all duration-500 hover:shadow-2xl">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-200/30 to-amber-200/30 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl group-hover:scale-110 transition-transform duration-700" />

                <div className="relative flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all duration-300">
                      <span className="text-3xl lg:text-4xl font-bold text-white font-mono">SAN</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2 group-hover:text-indigo-700 transition-colors duration-300">
                      SAN Code Calculator
                    </h3>
                    <p className="text-gray-600 text-sm lg:text-base leading-relaxed max-w-2xl">
                      Explore the <strong>Fibonacci Nomenclature System (S.A.N.)</strong> — a unique classification code for every species in our database.
                      Enter any scientific name to generate its SAN code instantly, or look up existing species codes.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                      <span className="inline-flex items-center gap-1.5 bg-white/80 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-200">
                        🔢 Fibonacci-based encoding
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-white/80 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-purple-200">
                        🧬 Species classification
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-white/80 text-pink-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-pink-200">
                        🌿 AquaMundi standard
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 hidden lg:flex">
                    <div className="w-12 h-12 rounded-full bg-white/80 border border-indigo-200 flex items-center justify-center group-hover:bg-indigo-500 group-hover:border-indigo-500 transition-all duration-300">
                      <ExternalLink className="w-5 h-5 text-indigo-500 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>

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
      {selected3DModel && (
        <Pollinator3DViewer
          pollinator={selected3DModel}
          onClose={() => setSelected3DModel(null)}
        />
      )}

      <Footer />
    </div>
  );
}

function PollinatorCard({ pollinator, onView3D }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
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
        <h3 className="text-xl font-bold text-gray-800 mb-1">{pollinator.name}</h3>
        <p className="text-sm text-gray-500 italic mb-3">{pollinator.scientificName}</p>

        {/* Botanical snippet chip */}
        {pollinator.botanicalInfo && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-3 line-clamp-2">
            {pollinator.botanicalInfo}
          </p>
        )}

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {pollinator.description}
        </p>

        <div className="flex items-center justify-between">
          <a
            href={pollinator.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-amber-600 hover:text-amber-700 text-sm transition-colors duration-200"
          >
            <span>View source</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={() => onView3D(pollinator)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <Rotate3D className="w-4 h-4" />
            <span>View 3D</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function RoboticPollinatorCard({ robot }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border-2 border-blue-100">
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
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {robot.imageAttribution}
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
          <a
            href={robot.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs transition-colors duration-200"
          >
            <span>Learn more</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

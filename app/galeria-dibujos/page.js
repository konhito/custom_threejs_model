"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback, useRef } from "react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { useTranslation } from "../../lib/useTranslation";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Flower2,
  Globe2,
  Sparkles,
  Paintbrush,
  Eye,
  Play,
  Pause,
  Shuffle,
  BookOpen,
} from "lucide-react";

// ====== ARTWORK DATA (from curatorial HTML) ======
const OBRAS = [
  {
    id: 1, file: "Dibujo 3.jpeg", autor: "Alison", pais: "Venezuela", tecnica: "Lápiz de color",
    titulo: null, mensaje: "Con el tiempo, todo florece",
    es: "Alison compone un ramo de dos rosas abiertas —una rosada, otra azul lavanda— rodeadas por un follaje generoso de hojas verdes cuidadosamente veteadas. Dos capullos rosados asoman tímidamente en la esquina superior, como promesas a punto de cumplirse.",
    en: "Alison presents a pair of fully open roses — one in soft pink, the other in cool lavender blue — cradled by a lush arrangement of green leaves whose veins are carefully traced. Two small pink buds peek from the upper corner, still tightly furled.",
  },
  {
    id: 2, file: "Dibujo 5.jpeg", autor: "Santiago Senti", pais: null, tecnica: "Lápiz de color",
    titulo: null, mensaje: null,
    es: "Santiago Senti firma un hibisco azul de generosas proporciones que ocupa casi toda la hoja. Los pétalos despliegan un degradado de azules —del celeste al cobalto— con vetas finamente trazadas que imitan la textura natural de la flor.",
    en: "Santiago Senti signs a blue hibiscus of generous proportions that commands nearly the entire page. The petals unfold in a gradient of blues — from sky to cobalt — with finely traced veins that mimic the flower's natural texture.",
  },
  {
    id: 3, file: "Dibujo 6.jpeg", autor: "Bri", pais: null, tecnica: "Lápiz de color",
    titulo: null, mensaje: "La flor de mi imaginación",
    es: "Bri nos invita a su jardín interior con tres flores de cinco pétalos en azul celeste, rosa y lavanda pálido, nacidas directamente de su imaginación.",
    en: "Bri invites us into a personal garden with three five-petaled flowers in sky blue, pink, and pale lavender, born entirely from imagination.",
  },
  {
    id: 4, file: "Dibujo 7.jpeg", autor: "Theylor", pais: null, tecnica: "Lápiz / Tinta",
    titulo: null, mensaje: null,
    es: "Theylor dibuja una rosa rosada solitaria que se abre con precisión espiral desde su centro apretado hasta los pétalos exteriores más amplios y relajados.",
    en: "Theylor draws a solitary pink rose that unfurls in a precise spiral from its tight center to the broader, more relaxed outer petals.",
  },
  {
    id: 5, file: "Dibujo 8.jpeg", autor: "Sheyla", pais: null, tecnica: "Lápiz de color",
    titulo: null, mensaje: null,
    es: "Sheyla presenta un trío de hibiscos en tonalidades azules —turquesa, azul medio y lavanda pálido— dispuestos en una composición compacta con hojas verdes de nervaduras marcadas.",
    en: "Sheyla presents a trio of hibiscus blooms in blue tones — turquoise, medium blue, and pale lavender — arranged in a compact cluster with green leaves whose veins are firmly drawn.",
  },
  {
    id: 6, file: "Dibujo 9.jpeg", autor: "Isaias", pais: null, tecnica: "Lápiz de color",
    titulo: null, mensaje: null,
    es: "Isaias ejecuta un hibisco rosa de factura casi botánica, con pétalos que transitan del rosa pálido en los bordes al rosa intenso en la garganta de la flor.",
    en: "Isaias renders a pink hibiscus with near-botanical precision. The petals transition from pale pink at the edges to a deeper rose in the flower's throat.",
  },
  {
    id: 7, file: "Dibujo 10.jpeg", autor: "Owen", pais: null, tecnica: "Lápiz / Tinta",
    titulo: null, mensaje: "De Owen El PRO",
    es: "Owen, quien se presenta con orgullo como «El PRO», dibuja un dúo de rosas en tonos fríos: la principal en un azul celeste luminoso con un centro más oscuro.",
    en: "Owen, who proudly introduces himself as 'El PRO,' draws a duo of roses in cool tones: the main bloom in a luminous sky blue with a darker center.",
  },
  {
    id: 8, file: "Dibujo 11.jpeg", autor: "Arthuro", pais: null, tecnica: "Grafito + color",
    titulo: null, mensaje: null,
    es: "Arthuro elige una vía diferente: su hibisco se construye casi enteramente en grafito, con sombras profundas en el centro de la flor que contrastan con la blancura luminosa de los pétalos.",
    en: "Arthuro takes a different path: his hibiscus is built almost entirely in graphite, with deep shadows at the flower's center contrasting against the luminous whiteness of the petals.",
  },
  {
    id: 9, file: "Dibujo 26.jpeg", autor: "Gabriela", pais: null, tecnica: "Lápiz de color",
    titulo: null, mensaje: null,
    es: "Gabriela firma en la esquina inferior de esta margarita blanca de gran formato. La flor ocupa casi toda la página: pétalos blancos con sombras azuladas se abren en torno a un centro amarillo verdoso.",
    en: "Gabriela signs at the lower right corner of this large-format white daisy. The flower occupies nearly the entire page: white petals with bluish shadows open around a yellow-green center.",
  },
  {
    id: 10, file: "Dibujo 27.jpeg", autor: "Dayana Nicolalde", pais: "Ecuador", tecnica: "Lápiz de color",
    titulo: null, mensaje: null,
    es: "Dayana Nicolalde presenta un ramillete de gerberas ejecutado con lápiz de color y delineado en tinta. Cuatro flores ocupan la composición en tonos celeste y turquesa.",
    en: "Dayana Nicolalde offers a bouquet of gerbera daisies rendered in colored pencil over ink outlines. Four blooms fill the composition in turquoise and sky blue.",
  },
  {
    id: 11, file: "Dibujo 28.jpeg", autor: "Vixti", pais: null, tecnica: "Lápiz de color",
    titulo: null, mensaje: null,
    es: "Vixti despliega tres girasoles en distintas etapas de apertura que dominan esta composición resuelta con lápiz de color y tinta.",
    en: "Vixti unfolds three sunflowers at different stages of bloom that command this composition executed in colored pencil and ink.",
  },
  {
    id: 12, file: "Dibujo 29.jpeg", autor: "Flor Guardia", pais: null, tecnica: "Lápiz de color",
    titulo: null, mensaje: null,
    es: "Flor Guardia compone un ramillete silvestre donde una rosa abierta en tonos lila y violeta ocupa el centro, rodeada por un capullo rosa, un capullo amarillo y una flor celeste.",
    en: "Flor Guardia arranges a wild bouquet with a large open rose in lilac and violet tones at its center, accompanied by a pink bud, a yellow bud, and a sky-blue flower.",
  },
  {
    id: 13, file: "Dibujo 20.jpeg", autor: "Owen", pais: null, tecnica: "Lápiz de color",
    titulo: "Segunda obra", mensaje: null,
    es: "Owen firma con «PE Owen» esta segunda pieza: un nenúfar rosa resuelto en lápiz de color sobre papel blanco.",
    en: "Owen signs 'PE Owen' on this second piece: a pink water lily rendered in colored pencil on white paper.",
  },
  {
    id: 14, file: "Dibujo 33.jpeg", autor: "Emely", pais: null, tecnica: "Lápiz de color",
    titulo: null, mensaje: null,
    es: "Emely firma esta rosa en tonos lavanda y blanco, rodeada de capullos azul turquesa y hojas verdes. La flor central despliega sus pétalos en espiral con un sombreado sutil.",
    en: "Emely signs this rose in lavender and white tones, surrounded by turquoise-blue buds and green leaves. The central flower spirals open with subtle shading.",
  },
  {
    id: 15, file: "Dibujo 34.jpeg", autor: "YCR", pais: null, tecnica: "Lápiz / Tinta",
    titulo: null, mensaje: "Eres mucho y mereces todo",
    es: "Una rosa monumental en rojo y rosa ocupa el centro de esta composición firmada con las iniciales YCR.",
    en: "A monumental rose in red and pink dominates this composition signed with the initials YCR.",
  },
  {
    id: 16, file: "Dibujo 35.jpeg", autor: "Khaleesi", pais: null, tecnica: "Lápiz de color",
    titulo: null, mensaje: null,
    es: "Khaleesi presenta tres nenúfares en distintas fases de apertura, flotando sobre un espejo de agua esbozado en azul.",
    en: "Khaleesi presents three water lilies at different stages of bloom, floating on a mirror of water sketched in blue.",
  },
  {
    id: 17, file: "Dibujo 12.jpeg", autor: "Theylor", pais: null, tecnica: "Lápiz de color",
    titulo: "Segunda obra", mensaje: null,
    es: "Theylor presenta aquí una segunda pieza: dos margaritas amarillas de pétalos largos y centros texturizados en ocre y verde.",
    en: "Theylor presents here a second piece: two yellow daisies with long petals and textured centers in ochre and green.",
  },
  {
    id: 18, file: "Dibujo 13.jpeg", autor: "Christian", pais: null, tecnica: "Lápiz / Tinta",
    titulo: null, mensaje: null,
    es: "Christian dibuja una rama en flor con una flor principal de pétalos amplios en amarillo cálido con bordes rosados.",
    en: "Christian draws a flowering branch with a main bloom of broad yellow petals edged in pink.",
  },
  {
    id: 19, file: "Dibujo 14.jpeg", autor: "Yixia", pais: null, tecnica: "Lápiz de color",
    titulo: null, mensaje: null,
    es: "Yixia presenta un ramo de magnolias o camelias rosadas en distintas etapas de apertura: desde capullos cerrados hasta flores plenamente abiertas.",
    en: "Yixia presents a bouquet of pink magnolias or camellias at various stages of bloom: from tightly closed buds to fully open flowers.",
  },
  {
    id: 20, file: "Dibujo 15.jpeg", autor: "Anónimo/a", pais: null, tecnica: "Grafito + color",
    titulo: null, mensaje: null,
    es: "Un ramo de margaritas se despliega sobre el papel en un boceto donde conviven el grafito y sutiles trazos de color.",
    en: "A cluster of daisies unfolds across the page in a sketch that blends graphite line work with faint touches of ochre and green.",
  },
  {
    id: 21, file: "Dibujo 16.jpeg", autor: "Estefanía", pais: null, tecnica: "Lápiz de color",
    titulo: null, mensaje: null,
    es: "Estefanía firma este ramillete de margaritas resuelto íntegramente en lápiz de color. Cuatro flores ocupan el centro de la composición, cada una en un tono distinto.",
    en: "Estefanía signs her name at the lower right corner of this bouquet of mixed daisies, executed entirely in colored pencil. Four blooms occupy the center.",
  },
  {
    id: 22, file: "Dibujo 17.jpeg", autor: "Carla", pais: null, tecnica: "Lápiz de color",
    titulo: null, mensaje: null,
    es: "Carla presenta una flor de loto rosa en plena apertura, resuelta en lápiz de color con un nivel de detalle notable.",
    en: "Carla presents a pink lotus flower in full bloom, rendered in colored pencil with remarkable attention to detail.",
  },
  {
    id: 23, file: "Dibujo 18.jpeg", autor: "Khaleesi", pais: null, tecnica: "Lápiz / Tinta",
    titulo: "Segunda obra", mensaje: null,
    es: "Khaleesi firma al pie de esta rosa de tonos rojo-coral, su segunda obra en la colección.",
    en: "Khaleesi signs at the bottom of this red-coral rose, her second contribution to the collection.",
  },
  {
    id: 24, file: "Dibujo 19.jpeg", autor: "Juan María Unsain", pais: "Argentina", tecnica: "Lápiz / Tinta",
    titulo: null, mensaje: null,
    es: "Juan María Unsain despliega sobre el papel un estanque de nenúfares en tonos lilas y azulados.",
    en: "Juan María Unsain unfolds across the paper a water lily pond in lilac and blue tones.",
  },
  {
    id: 25, file: "Dibujo 31.jpeg", autor: "Owen", pais: null, tecnica: "Lápiz de color",
    titulo: "Tercera obra", mensaje: null,
    es: "Owen firma con «DE Owen» esta rosa rosa de tallo largo, dibujada con lápiz de color sobre contornos suaves.",
    en: "Signed 'DE Owen,' this long-stemmed pink rose is drawn in colored pencil with soft outlines.",
  },
  {
    id: 26, file: "Dibujo 21.jpeg", autor: "Atenea", pais: null, tecnica: "Lápiz de color",
    titulo: null, mensaje: null,
    es: "Atenea presenta un nenúfar rojo de gran formato resuelto en lápiz de color. La flor abierta muestra pétalos rojos y rosados dispuestos en varias capas.",
    en: "Atenea presents a large-format red water lily in colored pencil. The open bloom displays red and pink petals arranged in multiple layers.",
  },
  {
    id: 27, file: "Dibujo 22.jpeg", autor: "Emely", pais: null, tecnica: "Lápiz / Tinta",
    titulo: "Segunda obra", mensaje: null,
    es: "Emely firma esta composición de nenúfares blancos con matices lilas, resuelta en lápiz y tinta.",
    en: "Emely signs this composition of white water lilies with lilac undertones, rendered in pencil and ink.",
  },
  {
    id: 28, file: "Dibujo 23.jpeg", autor: "Anónimo/a", pais: null, tecnica: "Lápiz / Tinta",
    titulo: null, mensaje: null,
    es: "Sin firma visible, esta pieza muestra una flor abierta de cinco pétalos amplios en tonos rosa pálido con bordes más intensos.",
    en: "Though no signature is visible, this piece displays an open flower with five broad petals in pale pink with deeper edges.",
  },
  {
    id: 29, file: "Dibujo 24.jpeg", autor: "Gabriela", pais: null, tecnica: "Ceras",
    titulo: "Segunda obra", mensaje: "Llena tu mundo de colores",
    es: "Gabriela escribe su nombre y acompaña el dibujo con la frase «Llena tu mundo de colores». Desde un florero apenas esbozado, brota una explosión de pequeñas flores.",
    en: "Gabriela writes her name and accompanies the drawing with 'Fill your world with colors.' From a vase barely sketched, an explosion of small flowers bursts upward.",
  },
  {
    id: 30, file: "Dibujo 36.jpeg", autor: "Isaias", pais: null, tecnica: "Lápiz de color",
    titulo: "Segunda obra", mensaje: null,
    es: "Isaias firma esta rosa roja resuelta con lápiz de color y contornos en tinta. La flor, abierta y robusta, muestra pétalos en capas densas de rojo intenso.",
    en: "Isaias signs this red rose rendered in colored pencil with ink outlines. The bloom, open and robust, shows densely layered petals in vivid red.",
  },
  {
    id: 31, file: "Dibujo 2.jpeg", autor: "Participante", pais: null, tecnica: "Ceras",
    titulo: null, mensaje: null,
    es: "Dos cactus emergen sobre el papel blanco con la sencillez directa de las ceras: uno en verde oscuro, otro en verde claro, ambos coronados por pequeñas flores rosas.",
    en: "Two cacti rise on a vast white page with the directness that only crayons can achieve: one in dark green, the other in lighter green, each topped with tiny pink blossoms.",
  },
  {
    id: 32, file: "Dibujo 32.jpeg", autor: "Pilar", pais: "Argentina", tecnica: "Ceras",
    titulo: "Flor Nacional Argentina — El Ceibo", mensaje: null,
    es: "Pilar dedica su dibujo a la flor nacional argentina: el ceibo (Erythrina crista-galli). Sobre un fondo de franjas celestes y blancas que evocan la bandera.",
    en: "Pilar dedicates her drawing to Argentina's national flower: the ceibo (Erythrina crista-galli). Against a background of light-blue and white bands echoing the national flag.",
  },
  {
    id: 33, file: "Dibujo 30.jpeg", autor: "Theylor", pais: null, tecnica: "Lápiz / Tinta",
    titulo: "Tercera obra", mensaje: null,
    es: "Theylor presenta una rosa rosa de gran formato resuelta con lápiz de color y contornos en tinta negra. La flor ocupa casi toda la superficie del papel.",
    en: "Theylor delivers a large-format pink rose rendered in colored pencil with black ink outlines. The bloom occupies nearly the entire page.",
  },
  {
    id: 34, file: "Dibujo 4.jpeg", autor: "Theylor", pais: null, tecnica: "Lápiz de color",
    titulo: "Cuarta obra", mensaje: null,
    es: "Theylor cierra su serie de cuatro obras con esta composición de margaritas multicolor donde una gran flor central despliega pétalos en rojo, turquesa, verde, amarillo y azul.",
    en: "Theylor closes a series of four works with this multicolored daisy composition where a large central flower fans its petals in red, turquoise, green, yellow, and blue.",
  },
];

const IMG_BASE = "/Dibujos Evento 11 de Abril, Drawings April 11/";

// ====== Lightbox Component ======
function Lightbox({ obra, lang, onClose, onPrev, onNext, currentIndex, total }) {
  const [showCuratorial, setShowCuratorial] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); onNext(); }
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onNext, onPrev]);

  // Touch support
  const touchRef = useRef(0);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[220] w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Nav arrows */}
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-[220] w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors opacity-70 hover:opacity-100"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-[220] w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors opacity-70 hover:opacity-100"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Image */}
      <motion.div
        key={obra.id}
        className="relative z-[210] max-w-[92vw] max-h-[78vh] flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.25 }}
        onTouchStart={(e) => { touchRef.current = e.changedTouches[0].screenX; }}
        onTouchEnd={(e) => {
          const diff = e.changedTouches[0].screenX - touchRef.current;
          if (Math.abs(diff) > 50) { diff < 0 ? onNext() : onPrev(); }
        }}
      >
        <img
          src={IMG_BASE + obra.file}
          alt={`${obra.titulo || "Artwork"} by ${obra.autor}`}
          className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-2xl select-none"
          draggable={false}
        />
      </motion.div>

      {/* Ficha (bottom bar) */}
      <div className="absolute bottom-0 left-0 right-0 z-[215] bg-black/60 backdrop-blur-xl border-t border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-white font-semibold text-lg">{obra.autor}</p>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              {obra.pais && <span>{obra.pais}</span>}
              {obra.pais && <span className="text-gray-600">·</span>}
              <span>{obra.tecnica}</span>
            </div>
            {obra.titulo && <p className="text-emerald-400 text-sm italic mt-0.5">{obra.titulo}</p>}
            {obra.mensaje && <p className="text-gray-400 text-sm italic mt-0.5">«{obra.mensaje}»</p>}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCuratorial(!showCuratorial)}
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-medium"
            >
              <BookOpen className="w-4 h-4" />
              {showCuratorial ? "Close" : "Curatorial text"}
            </button>
            <span className="text-xs text-gray-500">{currentIndex + 1} / {total}</span>
          </div>
        </div>
        <AnimatePresence>
          {showCuratorial && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="max-w-5xl mx-auto text-gray-300 text-sm leading-relaxed mt-3 pt-3 border-t border-white/10" style={{ fontFamily: "Georgia, serif" }}>
                {lang === "es" ? obra.es : obra.en}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ====== Main Page Component ======
export default function GaleriaDibujos() {
  const { t, locale } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [lang, setLang] = useState("es");
  const [filter, setFilter] = useState("all");

  // Derive unique artists/countries for stats
  const uniqueArtists = [...new Set(OBRAS.map((o) => o.autor))];
  const uniqueCountries = [...new Set(OBRAS.filter((o) => o.pais).map((o) => o.pais))];
  const uniqueTechniques = [...new Set(OBRAS.map((o) => o.tecnica))];

  // Filter works
  const filteredObras = filter === "all" ? OBRAS : OBRAS.filter((o) => o.tecnica === filter);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextSlide = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredObras.length : null));
  }, [filteredObras.length]);
  const prevSlide = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + filteredObras.length) % filteredObras.length : null));
  }, [filteredObras.length]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navigation />

      <main className="pt-20 pb-16">
        {/* ===== Hero Section ===== */}
        <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-6 lg:px-8">
          {/* Decorative orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-emerald-200/30 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-radial from-pink-200/20 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-0 w-64 h-64 bg-gradient-radial from-purple-200/20 to-transparent blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-emerald-200/60 shadow-sm mb-8">
                <Paintbrush className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700 tracking-wide uppercase">
                  Evento 11 de Abril 2026
                </span>
              </div>

              {/* Title */}
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-[1.1]"
                style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
              >
                Dibuja la Flor{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 bg-clip-text text-transparent">
                  de Tu País
                </span>
              </h1>

              <div className="w-24 h-px bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 mx-auto mb-8" />

              <p
                className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed italic mb-10"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Una convocatoria abierta y permanente a cualquier persona en el mundo para crear y compartir
                una obra artística relacionada con flores o naturaleza.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{OBRAS.length}</div>
                  <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Obras</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{uniqueCountries.length}</div>
                  <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Países</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{uniqueArtists.length}</div>
                  <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Artistas</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== Curatorial Introduction ===== */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-green-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  {/* Language toggle */}
                  <div className="flex items-center gap-2 mb-6">
                    <button
                      onClick={() => setLang("es")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${lang === "es" ? "bg-emerald-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                      ES
                    </button>
                    <button
                      onClick={() => setLang("en")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${lang === "en" ? "bg-emerald-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                      EN
                    </button>
                  </div>

                  <h2
                    className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {lang === "es" ? "Galería Global" : "Global Gallery"}
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4" style={{ fontFamily: "Georgia, serif" }}>
                    {lang === "es"
                      ? "Cada dibujo es una voz, cada pétalo un país. Bienvenidos al primer recorrido museográfico de esta colección fundacional — 34 obras nacidas de una invitación simple: dibuja la flor de tu país."
                      : "Each drawing is a voice, each petal a country. Welcome to the first museographic tour of this foundational collection — 34 artworks born from a simple invitation: draw the flower of your country."}
                  </p>
                  <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                    {lang === "es"
                      ? "Lo que encontramos son 34 miradas únicas sobre la naturaleza, el color y la identidad. Gracias a cada participante por compartir su visión."
                      : "What we found are 34 unique perspectives on nature, color, and identity. We thank every participant for sharing their vision."}
                  </p>

                  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-emerald-100/50 to-transparent rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== Filter Bar ===== */}
        <section className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === "all" ? "bg-gray-900 text-white shadow-lg" : "bg-white/80 text-gray-600 border border-gray-200 hover:bg-white hover:shadow-md"}`}
              >
                {lang === "es" ? "Todas" : "All"} ({OBRAS.length})
              </button>
              {uniqueTechniques.map((tech) => (
                <button
                  key={tech}
                  onClick={() => setFilter(tech)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === tech ? "bg-gray-900 text-white shadow-lg" : "bg-white/80 text-gray-600 border border-gray-200 hover:bg-white hover:shadow-md"}`}
                >
                  {tech} ({OBRAS.filter((o) => o.tecnica === tech).length})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Gallery Grid ===== */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredObras.map((obra, index) => (
                <motion.div
                  key={obra.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4) }}
                >
                  <div
                    className="group relative cursor-pointer"
                    onClick={() => openLightbox(index)}
                  >
                    {/* Hover glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-green-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Card */}
                    <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1">
                      {/* Image wrapper */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F3EE]">
                        <img
                          src={IMG_BASE + obra.file}
                          alt={`${obra.titulo || "Artwork"} by ${obra.autor}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-4">
                          <div className="flex items-center gap-2 text-white">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm font-medium">{lang === "es" ? "Ver obra" : "View artwork"}</span>
                          </div>
                        </div>
                        {/* Country badge */}
                        {obra.pais && (
                          <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                            {obra.pais}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <p className="font-semibold text-gray-900 text-sm">{obra.autor}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{obra.tecnica}</p>
                        {obra.titulo && (
                          <p className="text-xs text-emerald-600 italic mt-1">{obra.titulo}</p>
                        )}
                        {obra.mensaje && (
                          <p className="text-xs text-gray-400 italic mt-1 truncate">«{obra.mensaje}»</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Closing Quote ===== */}
        <section className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse" />

                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/50 shadow-2xl text-center overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.5) 0%, transparent 40%),
                        radial-gradient(circle at 80% 70%, rgba(249, 168, 212, 0.5) 0%, transparent 40%)
                      `,
                    }}
                  />
                  <div className="relative">
                    <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-6" />

                    <blockquote
                      className="text-xl sm:text-2xl lg:text-3xl text-gray-800 leading-relaxed mb-8 italic"
                      style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                    >
                      {lang === "es"
                        ? "«Cada obra de esta colección nació de una invitación simple: dibuja la flor de tu país. Lo que encontramos son 34 miradas únicas sobre la naturaleza, el color y la identidad.»"
                        : '"Every artwork in this collection was born from a simple invitation: draw the flower of your country. What we found are 34 unique perspectives on nature, color, and identity."'}
                    </blockquote>

                    <div className="flex items-center justify-center gap-4 mb-8">
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                      <Flower2 className="w-5 h-5 text-emerald-400" />
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    </div>

                    <div className="text-sm text-gray-500 mb-6">
                      Asociación Internacional en Defensa de las Flores (Proveneya & Nahiara)
                    </div>

                    <a
                      href="/flowers"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full shadow-lg hover:bg-gray-800 hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <span>{lang === "es" ? "Explorar las Flores" : "Explore the Flowers"}</span>
                      <Flower2 className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* ===== Lightbox ===== */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredObras[lightboxIndex] && (
          <Lightbox
            obra={filteredObras[lightboxIndex]}
            lang={lang}
            onClose={closeLightbox}
            onNext={nextSlide}
            onPrev={prevSlide}
            currentIndex={lightboxIndex}
            total={filteredObras.length}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

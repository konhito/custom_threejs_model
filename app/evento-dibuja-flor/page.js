import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import EventGallery from "./EventGallery";

export const metadata = {
  title: "Evento: Dibuja la Flor de Tu País — 11 de abril 2026",
  description:
    "Así fue la primera jornada de 'Dibuja la Flor de Tu País' — una iniciativa global de arte comunitario en Vecindario, Gran Canaria. Galería de fotos y vídeos del evento del 11 de abril de 2026.",
};

/* ── photo + video manifest (from public folder) ── */
const MEDIA_DIR = "/Photographs and videos of the April 11 event";

const PHOTOS = [
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-11 at 18.01.44.jpeg`, alt: "Vista general del evento — familias y participantes dibujando flores en el Local Social Unión Sardina" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-12 at 10.14.28 (3).jpeg`, alt: "Participantes adultas dibujando flores con lápices de colores" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-12 at 10.14.29 (1).jpeg`, alt: "Familias dibujando flores juntas — adultos y niños compartiendo la mesa" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-12 at 10.15.04 (2).jpeg`, alt: "Exposición de obras terminadas — rosas, margaritas, claveles y flores de fantasía" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-12 at 10.14.29 (4).jpeg`, alt: "Madre e hijas dibujando juntas con lápices y crayones" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-11 at 18.00.27 (2).jpeg`, alt: "Niños y padre dibujando flores en familia" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-11 at 18.00.22 (1).jpeg`, alt: "Niños participando en el taller de dibujo comunitario" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-11 at 18.00.22 (3).jpeg`, alt: "Participantes concentrados dibujando sus flores" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-12 at 10.14.29 (2).jpeg`, alt: "Mesa de dibujo con crayones y flores de colores" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-12 at 10.14.29 (3).jpeg`, alt: "Participantes dibujando con el mapa del mundo de fondo" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-11 at 18.00.24 (1).jpeg`, alt: "Artistas comunitarios creando obras florales" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-11 at 18.00.24 (2).jpeg`, alt: "Niños dibujando flores con ceras y crayones" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-11 at 18.00.24.jpeg`, alt: "Participante dibujando una rosa con colores" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-11 at 18.00.27 (1).jpeg`, alt: "Artista comunitario trabajando en una flor detallada" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-11 at 18.00.27.jpeg`, alt: "Niños disfrutando del evento de dibujo" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-11 at 18.00.56 (1).jpeg`, alt: "Taller creativo con materiales de arte disponibles" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-11 at 18.00.56.jpeg`, alt: "Ambiente del evento — mesas, materiales y creatividad" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-11 at 18.01.45 (3).jpeg`, alt: "Obra terminada de una participante" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-11 at 18.01.49 (3).jpeg`, alt: "Proceso creativo en el taller" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-11 at 18.01.51 (4).jpeg`, alt: "Participantes disfrutando de la jornada creativa" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-11 at 18.05.01 (2).jpeg`, alt: "Dibujos de flores completados" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-11 at 18.05.02 (1).jpeg`, alt: "Obra artística floral en proceso" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-11 at 18.05.02 (3).jpeg`, alt: "Detalles de las flores dibujadas" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-11 at 18.00.22.jpeg`, alt: "Actividad de dibujo para todos las edades" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-11 at 18.00.23.jpeg`, alt: "Espacio comunitario con actividades artísticas" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-11 at 18.00.24 (3).jpeg`, alt: "Momento del evento con niños y mascotas" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-11 at 18.00.24 (4).jpeg`, alt: "Detalle de las flores dibujadas por los participantes" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-12 at 10.14.28.jpeg`, alt: "Obra finalizada con pétalos vibrantes" },
  { src: `${MEDIA_DIR}/WhatsApp Image 2026-04-12 at 10.14.29.jpeg`, alt: "Mesa con materiales y flores terminadas" },
];

const VIDEOS = [
  { src: `${MEDIA_DIR}/WhatsApp Video 2026-04-12 at 10.14.45.mp4`, title: "El ambiente del taller en acción" },
  { src: `${MEDIA_DIR}/WhatsApp Video 2026-04-12 at 10.15.00.mp4`, title: "Familias dibujando juntas" },
  { src: `${MEDIA_DIR}/WhatsApp Video 2026-04-12 at 10.15.04.mp4`, title: "Obras terminadas en exposición" },
];

export default function EventoDibujaFlorPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Navigation />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden pt-20 pb-0">
        {/* decorative background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-emerald-200/40 via-teal-100/30 to-transparent blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full bg-gradient-to-tl from-rose-200/30 via-amber-100/20 to-transparent blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-violet-100/15 via-sky-100/10 to-transparent blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 md:px-6">
          {/* badge */}
          <div className="flex flex-col items-center text-center">
            <span
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Evento realizado · 11 de abril 2026
            </span>

            <h1
              className="max-w-4xl text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ fontFamily: "Bangers, cursive", letterSpacing: "0.03em" }}
            >
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Dibuja la Flor
              </span>{" "}
              <br className="hidden sm:inline" />
              de Tu País
            </h1>

            <p
              className="mt-5 max-w-2xl text-lg text-slate-600 sm:text-xl"
              style={{ fontFamily: "Rubik, sans-serif" }}
            >
              Una galería sin fronteras, hecha por el mundo — así fue nuestra primera jornada de arte comunitario en Vecindario, Gran Canaria.
            </p>
          </div>

          {/* hero image — the overview shot */}
          <div className="relative mt-10 overflow-hidden rounded-3xl shadow-2xl shadow-emerald-900/10 ring-1 ring-slate-200/60">
            <img
              src={PHOTOS[0].src}
              alt={PHOTOS[0].alt}
              className="h-auto w-full object-cover"
              style={{ maxHeight: "540px", objectPosition: "center 40%" }}
            />
            {/* gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-6 pb-6 md:px-10 md:pb-8">
              <p className="text-sm font-medium text-white/80" style={{ fontFamily: "Manrope, sans-serif" }}>
                Local Social Unión Sardina · Calle Joaquín Blume nº 2 · Vecindario, Gran Canaria
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ EVENT DETAILS ═══════════ */}
      <section className="mx-auto max-w-6xl px-4 md:px-6 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "📅", label: "Fecha", value: "Sábado, 11 de abril de 2026" },
            { icon: "🕐", label: "Horario", value: "10:00 – 13:00 h" },
            { icon: "📍", label: "Lugar", value: "Local Social Unión Sardina, Vecindario" },
            { icon: "🎨", label: "Participación", value: "Entrada libre · Todas las edades" },
          ].map((item) => (
            <div
              key={item.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-100/40 hover:-translate-y-0.5"
            >
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-emerald-50/50 transition-transform duration-500 group-hover:scale-150" />
              <span className="relative text-2xl">{item.icon}</span>
              <p className="relative mt-2 text-xs font-bold uppercase tracking-wider text-emerald-700" style={{ fontFamily: "Manrope, sans-serif" }}>
                {item.label}
              </p>
              <p className="relative mt-1 text-sm font-medium text-slate-800" style={{ fontFamily: "Rubik, sans-serif" }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ ABOUT THE INITIATIVE ═══════════ */}
      <section className="mx-auto max-w-6xl px-4 md:px-6 pb-16">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* text */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <h2
              className="text-2xl font-bold text-slate-900 sm:text-3xl"
              style={{ fontFamily: "Archivo, sans-serif" }}
            >
              Sobre la iniciativa
            </h2>
            <div className="mt-5 space-y-4 text-slate-700 leading-relaxed" style={{ fontFamily: "Manrope, sans-serif", fontSize: "0.975rem" }}>
              <p>
                <strong>&ldquo;Dibuja la Flor de Tu País&rdquo;</strong> es una iniciativa de participación comunitaria global impulsada por la{" "}
                <em>Asociación Internacional en Defensa de las Flores (Proveneya &amp; Nahiara)</em>. Invita a cualquier persona en el mundo — sin importar su edad, formación artística, país de origen o técnica — a crear y compartir una obra relacionada con flores o naturaleza.
              </p>
              <p>
                En algún lugar del mundo hay una flor que solo tú conoces. Puede ser la flor nacional de tu país, la que crece en el jardín de tu infancia, la que existe únicamente en tu imaginación, o la que dibujaste por primera vez hoy. <strong>Queremos verla.</strong>
              </p>
              <p>
                No importa la técnica: lápiz, ceras, acuarela, acrílico, collage, diseño digital, tinta, técnica mixta. No importa el nivel: el trazo de un niño de cinco años y la ilustración de un artista profesional tienen el mismo lugar en esta galería. No importa el país: cada rincón del planeta tiene una flor que merece ser dibujada.
              </p>

              {/* What makes it different */}
              <div className="mt-6 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 p-5">
                <h3 className="text-base font-bold text-emerald-800" style={{ fontFamily: "Archivo, sans-serif" }}>
                  No es un concurso
                </h3>
                <p className="mt-2 text-sm text-slate-700">
                  No hay ganadores, no hay premios económicos, no hay jurado valorativo. Cada obra tiene el mismo peso que las demás. Lo que se construye no es una clasificación sino un <strong>mosaico</strong> — y un mosaico solo existe cuando todas sus piezas están.
                </p>
              </div>
            </div>
          </div>

          {/* featured photo */}
          <div className="lg:col-span-2 order-1 lg:order-2 flex items-center">
            <div className="relative w-full overflow-hidden rounded-2xl shadow-xl">
              <img
                src={PHOTOS[3].src}
                alt={PHOTOS[3].alt}
                className="aspect-[3/4] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5">
                <p className="text-sm font-semibold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
                  🌸 Obras terminadas — rosas, margaritas, claveles y flores de fantasía, creadas durante la jornada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ WHY? ═══════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 py-16 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center md:px-6">
          <h2
            className="text-3xl font-bold sm:text-4xl"
            style={{ fontFamily: "Bangers, cursive", letterSpacing: "0.04em" }}
          >
            ¿Por qué?
          </h2>
          <div className="mt-8 space-y-4 text-lg text-emerald-100/90" style={{ fontFamily: "Rubik, sans-serif" }}>
            <p>Porque las flores no entienden de fronteras.</p>
            <p>Porque la biodiversidad floral del planeta es uno de los patrimonios más frágiles y más hermosos que existen.</p>
            <p>Porque cada dibujo es un acto de defensa de aquello que nos importa.</p>
            <p className="text-white font-semibold text-xl pt-2">
              Cada obra que se suma a esta galería es una pieza de un mosaico que el mundo construye para sí mismo.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ HOW TO PARTICIPATE ═══════════ */}
      <section className="mx-auto max-w-6xl px-4 md:px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl" style={{ fontFamily: "Archivo, sans-serif" }}>
          ¿Cómo participar?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-600" style={{ fontFamily: "Rubik, sans-serif" }}>
          La convocatoria permanece abierta. Envía tu obra desde cualquier lugar del mundo.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { step: "01", title: "Crea tu obra", desc: "En el formato y técnica que prefieras — lápiz, acuarela, collage, digital…" },
            { step: "02", title: "Fotografía o escanea", desc: "Con la mejor calidad posible. Formatos: JPG, PNG, PDF, TIFF (máx. 20 MB)." },
            { step: "03", title: "Envía tu obra", desc: "A través del formulario en AquaMundi.org. Incluye tu nombre, país y dedicatoria." },
            { step: "04", title: "Revisión en 72 h", desc: "Nuestro equipo revisa cada envío. Recibirás email de confirmación." },
            { step: "05", title: "Publicación", desc: "Tu obra se publica en la Galería Global junto a tu nombre y país de origen." },
            { step: "06", title: "Autoría siempre tuya", desc: "La asociación usa la obra solo con fines educativos, sin uso comercial." },
          ].map((item) => (
            <div
              key={item.step}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-0.5"
            >
              <span
                className="absolute right-4 top-3 text-5xl font-black text-emerald-100/60 transition-colors duration-300 group-hover:text-emerald-200/80"
                style={{ fontFamily: "Bangers, cursive" }}
              >
                {item.step}
              </span>
              <h3 className="relative text-base font-bold text-slate-900" style={{ fontFamily: "Archivo, sans-serif" }}>
                {item.title}
              </h3>
              <p className="relative mt-2 text-sm text-slate-600" style={{ fontFamily: "Manrope, sans-serif" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ PHOTO + VIDEO GALLERY (client component) ═══════════ */}
      <EventGallery photos={PHOTOS} videos={VIDEOS} />

      {/* ═══════════ INITIATIVE INFO ═══════════ */}
      <section className="mx-auto max-w-6xl px-4 md:px-6 py-16">
        <div className="rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/60 p-8 md:p-12">
          <h2
            className="text-2xl font-bold text-emerald-900 sm:text-3xl"
            style={{ fontFamily: "Archivo, sans-serif" }}
          >
            Sobre la Asociación
          </h2>
          <p className="mt-4 max-w-3xl text-slate-700 leading-relaxed" style={{ fontFamily: "Manrope, sans-serif" }}>
            La <strong>Asociación Internacional en Defensa de las Flores (Proveneya &amp; Nahiara)</strong> impulsa esta iniciativa como parte del proyecto transmedia <em>Universo Nahiara</em>. A medida que la galería crezca, acumulará un valor documental, educativo y simbólico de primer orden: un <strong>archivo visual</strong> de la relación entre culturas y flores, generado de forma colaborativa y descentralizada por ciudadanos de todo el planeta.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/galeria-dibujos"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:bg-emerald-700 hover:shadow-emerald-600/30 hover:-translate-y-0.5"
              style={{ fontFamily: "Comfortaa, cursive" }}
            >
              🎨 Ver la Galería Global
            </a>
            <a
              href="/dibuja-la-flor-de-tu-pais"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-6 py-3 text-sm font-bold text-emerald-800 transition-all duration-300 hover:bg-emerald-50 hover:-translate-y-0.5"
              style={{ fontFamily: "Comfortaa, cursive" }}
            >
              ✏️ Envía tu obra
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-slate-50 hover:-translate-y-0.5"
              style={{ fontFamily: "Comfortaa, cursive" }}
            >
              ← Volver al inicio
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ ENGLISH VERSION (brief) ═══════════ */}
      <section className="border-t border-slate-200/60 bg-white">
        <div className="mx-auto max-w-4xl px-4 md:px-6 py-16 text-center">
          <span className="mb-4 inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-700" style={{ fontFamily: "Manrope, sans-serif" }}>
            English
          </span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl" style={{ fontFamily: "Archivo, sans-serif" }}>
            Draw the Flower of Your Country
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600 leading-relaxed" style={{ fontFamily: "Rubik, sans-serif" }}>
            Somewhere in the world there is a flower that only you know. &ldquo;Draw the Flower of Your Country&rdquo; is an open invitation to anyone in the world to create and share an artwork related to flowers or nature. The technique doesn&apos;t matter. The skill level doesn&apos;t matter. The country doesn&apos;t matter. Every artwork added to this gallery is one piece of a mosaic that the world builds for itself.
          </p>
          <p className="mt-6 text-sm text-slate-500" style={{ fontFamily: "Manrope, sans-serif" }}>
            This event was held on <strong>April 11, 2026</strong> at Local Social Unión Sardina, Vecindario (Gran Canaria, Spain).
            <br />
            The gallery is permanently open — submit your artwork at <a href="/dibuja-la-flor-de-tu-pais" className="text-emerald-600 font-semibold hover:underline">AquaMundi.org</a>.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

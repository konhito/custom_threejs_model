import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3, MapPin, Palette, Users } from "lucide-react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

export const metadata = {
  title: "Evento: Dibuja la Flor de Tu País",
  description:
    "Evento comunitario en Vecindario para dibujar la flor de tu país. Entrada libre, actividad abierta a todas las edades.",
};

export default function EventoDibujaFlorPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="relative mx-auto max-w-6xl px-4 pb-16 pt-24 md:px-6">
        <section className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6 shadow-sm md:p-10">
          <p
            className="mb-4 inline-flex rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Evento destacado
          </p>

          <h1
            className="text-3xl font-bold text-emerald-900 sm:text-4xl md:text-5xl"
            style={{ fontFamily: "Bangers, cursive", letterSpacing: "0.04em" }}
          >
            Dibuja la Flor de Tu País
          </h1>
          <p className="mt-3 max-w-3xl text-base text-slate-700 sm:text-lg" style={{ fontFamily: "Rubik, sans-serif" }}>
            La Asociación Internacional en Defensa de las Flores invita a toda la comunidad a participar en una jornada creativa y abierta
            para celebrar la diversidad floral y cultural.
          </p>

          <div className="mt-6 grid gap-3 text-sm text-slate-800 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-emerald-100 bg-white/80 p-3">
              <p className="mb-1 inline-flex items-center gap-2 font-semibold text-emerald-800">
                <CalendarDays className="h-4 w-4" />
                Fecha
              </p>
              <p>Sábado, 11 de abril de 2026</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-white/80 p-3">
              <p className="mb-1 inline-flex items-center gap-2 font-semibold text-emerald-800">
                <Clock3 className="h-4 w-4" />
                Hora
              </p>
              <p>10:00 - 13:00 h</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-white/80 p-3">
              <p className="mb-1 inline-flex items-center gap-2 font-semibold text-emerald-800">
                <MapPin className="h-4 w-4" />
                Lugar
              </p>
              <p>Local Social Unión Sardina</p>
              <p>Calle Joaquín Blume nº 2, Vecindario</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-white/80 p-3">
              <p className="mb-1 inline-flex items-center gap-2 font-semibold text-emerald-800">
                <Users className="h-4 w-4" />
                Acceso
              </p>
              <p>Entrada libre</p>
              <p>Abierto a todas las edades</p>
            </div>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <Image
            src="/events/dibuja-flor-2026.png"
            alt="Cartel del evento Dibuja la Flor de Tu País"
            width={1600}
            height={1200}
            className="h-auto w-full object-cover"
            priority
          />
        </section>

        <section className="mt-8 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm md:p-8">
          <h2 className="inline-flex items-center gap-2 text-2xl font-semibold text-emerald-900" style={{ fontFamily: "Archivo, sans-serif" }}>
            <Palette className="h-6 w-6" />
            Sobre el evento
          </h2>

          <div className="mt-4 space-y-4 text-slate-700" style={{ fontFamily: "Manrope, sans-serif" }}>
            <p>
              La Asociación Internacional en Defensa de las Flores invita a la comunidad a dibujar la flor nacional de su país de origen o de
              adopción, o simplemente la flor que más les inspire. La participación es completamente libre y abierta a todo el mundo.
            </p>
            <p>
              La Asociación pondrá a disposición los materiales básicos: folios, lápices de colores y crayones. Quienes deseen trabajar con
              técnicas específicas - acuarela, collage, formato digital u otras - deberán traer sus propios materiales.
            </p>
            <p>
              No hay restricciones de nacionalidad, flor ni estilo artístico: cualquier forma de crear es bienvenida. Juntos construiremos un
              mosaico vivo de diversidad floral que refleja la riqueza cultural de nuestra comunidad.
            </p>
            <p className="font-semibold text-emerald-800">Este evento forma parte del proyecto transmedia Universo Nahiara.</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              style={{ fontFamily: "Comfortaa, cursive" }}
            >
              Volver al inicio
            </Link>
            <a
              href="mailto:partnerships@asociacionnahiara.org?subject=Consulta%20evento%20Dibuja%20la%20Flor%20de%20Tu%20Pa%C3%ADs"
              className="rounded-xl border border-emerald-200 px-5 py-3 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-50"
              style={{ fontFamily: "Comfortaa, cursive" }}
            >
              Contactar por email
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

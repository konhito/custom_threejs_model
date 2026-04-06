import Link from "next/link";
import { CalendarDays, Clock3, MapPin, Sparkles } from "lucide-react";

export default function EventAnnouncementBanner({ compact = false }) {
  const wrapperClass = compact
    ? "px-4 py-4 md:px-6"
    : "px-4 py-6 md:px-8";

  return (
    <section className="w-full">
      <div className="mx-auto max-w-6xl">
        <div
          className={`rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 shadow-sm ${wrapperClass}`}
          role="region"
          aria-label="Anuncio principal del evento Dibuja la Flor de Tu País"
        >
          <p
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Anuncio principal
          </p>

          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h2
                className="text-2xl font-bold text-emerald-900 sm:text-3xl"
                style={{ fontFamily: "Bangers, cursive", letterSpacing: "0.04em" }}
              >
                Dibuja la Flor de Tu País
              </h2>
              <p className="text-sm text-slate-700 sm:text-base" style={{ fontFamily: "Rubik, sans-serif" }}>
                Entrada libre y abierta a todas las edades.
              </p>
              <div className="flex flex-col gap-2 text-sm text-slate-700 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-emerald-700" />
                  Sábado, 11 de abril de 2026
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4 text-emerald-700" />
                  10:00 - 13:00 h
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-emerald-700" />
                  Vecindario, Gran Canaria
                </span>
              </div>
            </div>

            <div className="flex-shrink-0">
              <Link
                href="/evento-dibuja-flor"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                style={{ fontFamily: "Comfortaa, cursive" }}
              >
                Ver anuncio completo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

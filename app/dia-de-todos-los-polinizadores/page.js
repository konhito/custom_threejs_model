import Link from "next/link";

export const metadata = {
  title: "Dia de Todos los Polinizadores",
  description:
    "Manifiesto del Dia de Todos los Polinizadores dentro del universo AquaMundi.",
  alternates: {
    canonical: "https://www.aquamundi.org/dia-de-todos-los-polinizadores",
  },
};

const MANIFESTO_TEXT = [
  "[Inserta aqui, sin alterar una sola palabra, el texto integro del manifiesto oficial del Dia de Todos los Polinizadores recibido en el Google Doc.]",
  "[Este marcador mantiene la estructura de publicacion hasta integrar el documento fundacional definitivo.]",
];

export default function DiaPolinizadoresManifestoPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071a25] text-[#f9f3e6]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-[#2d6c8c]/45 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#d98a3b]/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-[#5f8f57]/35 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
        <header className="rounded-3xl border border-[#f9f3e6]/20 bg-[#0b2533]/75 p-6 backdrop-blur md:p-10">
          <p
            className="text-xs uppercase tracking-[0.28em] text-[#f1c271]"
            style={{ fontFamily: "Lexend, sans-serif" }}
          >
            Universo Nahiara
          </p>

          <h1
            className="mt-4 text-4xl leading-tight md:text-6xl"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Dia de Todos los Polinizadores
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-[#f9f3e6]/85" style={{ fontFamily: "Karla, sans-serif" }}>
            Manifesto fundacional para el 21 de junio, publicado en su URL permanente.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/reloj-dia-de-todos-los-polinizadores"
              className="rounded-full border border-[#f1c271] bg-[#f1c271] px-5 py-2.5 text-sm font-semibold text-[#1b1b1b] transition hover:-translate-y-0.5"
            >
              Ver reloj vivo
            </Link>
            <Link
              href="/pollinators"
              className="rounded-full border border-[#f9f3e6]/35 bg-[#f9f3e6]/8 px-5 py-2.5 text-sm font-semibold text-[#f9f3e6] transition hover:-translate-y-0.5"
            >
              Explorar polinizadores
            </Link>
          </div>
        </header>

        <article className="mt-8 rounded-3xl border border-[#f9f3e6]/20 bg-[#0e2a3a]/80 p-6 md:p-10">
          <p className="text-xs uppercase tracking-[0.26em] text-[#9ac8d8]">Texto oficial · misma version para ambos sitios</p>

          <div className="mt-6 space-y-6 text-[1.05rem] leading-8 text-[#f9f3e6]/92" style={{ fontFamily: "Karla, sans-serif" }}>
            {MANIFESTO_TEXT.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <p className="mt-8 border-t border-[#f9f3e6]/15 pt-6 text-sm text-[#f9f3e6]/70">
            Publicado en: https://www.aquamundi.org/dia-de-todos-los-polinizadores
          </p>
        </article>
      </section>
    </main>
  );
}

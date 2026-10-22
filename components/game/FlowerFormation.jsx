"use client";

import { useEffect, useState } from "react";
import { getCompleteFlowerPath } from "@/lib/gameData";
import { useTranslation } from "@/lib/useTranslation";

export default function FlowerFormation({ country, onComplete }) {
  const [ready, setReady] = useState(false);
  const { t, locale } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 350);
    import("@/lib/soundUtils").then((m) => m.default.play("flower-complete"));
    return () => clearTimeout(timer);
  }, [country]);

  return (
    <main data-lenis-prevent className="fixed inset-0 z-50 overflow-y-auto bg-[#18483a] px-5 text-center text-[#fff8e8]">
      <div className="mx-auto flex min-h-full w-full max-w-xl flex-col items-center justify-center py-8" style={{ opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(18px)", transition: "opacity .6s ease, transform .6s ease" }}>
        <p className="mb-3 text-sm font-bold uppercase tracking-[.2em] text-[#d6eeb9]">{locale === "es" ? t(`countries.${country.id.toLowerCase()}.name`) : country.country}</p>
        <h1 className="font-['Fredoka_One'] text-4xl leading-tight sm:text-5xl">{locale === "es" ? "¡Una flor está floreciendo!" : "A flower is blooming!"}</h1>
        <div className="my-6 aspect-[552/516] w-[min(78vw,370px)] rotate-[-2deg] overflow-hidden rounded-[1.75rem] border-[7px] border-[#fff5d9] bg-[#fff5d9] shadow-[0_14px_0_#103c30]">
          <img src={getCompleteFlowerPath(country.folder, "svg")} alt={locale === "es" ? t(`countries.${country.id.toLowerCase()}.flowerName`) : country.flowerName} className="h-full w-full object-cover" />
        </div>
        <h2 className="font-['Fredoka_One'] text-3xl sm:text-4xl">{locale === "es" ? t(`countries.${country.id.toLowerCase()}.flowerName`) : country.flowerName}</h2>
        <button onClick={onComplete} className="mt-6 min-h-12 rounded-full bg-[#f4cf75] px-9 py-3 text-lg font-extrabold text-[#194638] shadow-[0_5px_0_#ad853a] transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-white">
          {t("game.continueToNext")} →
        </button>
      </div>
    </main>
  );
}

"use client";

import { getCompleteFlowerPath } from "@/lib/gameData";
import { useTranslation } from "@/lib/useTranslation";

export default function GlobeAnimation({ country }) {
  const { t, locale } = useTranslation();
  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-[#18483a] px-6 text-center text-[#fff8e8]">
      <div>
        <p className="mb-4 text-5xl" aria-hidden="true">✦</p>
        {country && <img src={getCompleteFlowerPath(country.folder, "svg")} alt="" className="mx-auto mb-5 h-48 w-48 object-contain sm:h-56 sm:w-56" />}
        <h1 className="font-['Fredoka_One'] text-3xl sm:text-5xl">{t("gamePilot.ui.gardenGrew")}</h1>
        <p className="mt-3 text-lg text-[#d6eeb9]">{t("gamePilot.ui.gardenExplore", { flowerName: locale === "es" ? t(`countries.${country.id.toLowerCase()}.flowerName`) : country?.flowerName })}</p>
      </div>
    </main>
  );
}

"use client";

import WorldMapGarden from "@/components/game/WorldMapGarden";
import { useTranslation } from "@/lib/useTranslation";

export default function VictoryScreen({ selectedCountry, completedFlowers, onRestart, onShare, isSharing }) {
  const { t } = useTranslation();

  return (
    <main data-lenis-prevent className="fixed inset-0 z-50 overflow-y-auto bg-[#fff8e8] px-4 py-8 text-[#194638] sm:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 text-center">
          <span className="inline-block rounded-full bg-[#dcecc8] px-5 py-2 text-sm font-bold uppercase tracking-wider">✦ {t("game.restoredFlower")}</span>
          <h1 className="mt-4 font-['Fredoka_One'] text-4xl leading-tight sm:text-6xl">{selectedCountry.flowerName}<br /><span className="text-[#4b8064]">{t("game.of")} {selectedCountry.country}</span></h1>
          <p className="mt-3 text-lg">Your flower has a place in the garden!</p>
        </div>
        <div className="overflow-hidden rounded-[2rem] border-2 border-[#c8ddba] bg-white p-3 shadow-[0_8px_0_#d7e5c5] sm:p-6">
          <WorldMapGarden completedFlowers={completedFlowers} currentFlower={selectedCountry} />
        </div>
        <div className="mx-auto mt-8 max-w-2xl text-center">
          <p className="text-lg font-bold">{t("game.guardianOfNature")} 🌿</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button onClick={onRestart} className="min-h-12 rounded-full bg-[#194638] px-8 py-3 font-bold text-white transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-[#f4cf75]">{t("game.playAgain")} →</button>
            <button onClick={onShare} disabled={isSharing} className="min-h-12 rounded-full border-2 border-[#194638] px-8 py-3 font-bold transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-[#f4cf75] disabled:opacity-50">{isSharing ? t("game.creating") : t("game.shareVictory")}</button>
          </div>
        </div>
      </div>
    </main>
  );
}

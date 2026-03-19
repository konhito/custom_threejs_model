"use client";
import { useState, useEffect } from "react";
import { countriesData, getPetalPath, getCardBackPath, minionTypes, guardianTypes } from "@/lib/gameData";

export function useGameLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const MIN_LOADER_TIME = 4000;
    const startTime = Date.now();

    try {
      if (typeof window !== "undefined") {
        import("@/lib/soundUtils").then((m) => m.default.play("loading")).catch(() => {});
      }
    } catch {}

    const preloadAssets = async () => {
      const loadImage = (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        });

      const assets = [loadImage(getCardBackPath())];
      if (countriesData.length > 0) {
        for (let i = 1; i <= 6; i++) assets.push(loadImage(getPetalPath(countriesData[0].folder, i)));
      }
      guardianTypes.forEach((g) => assets.push(loadImage(g.image)));
      minionTypes.forEach((m) => assets.push(loadImage(m.image)));

      await Promise.race([Promise.allSettled(assets), new Promise((r) => setTimeout(r, 3000))]);
    };

    preloadAssets().then(() => {
      const elapsed = Date.now() - startTime;
      setTimeout(() => setIsLoading(false), Math.max(0, MIN_LOADER_TIME - elapsed));
    });
  }, []);

  return { isLoading };
}

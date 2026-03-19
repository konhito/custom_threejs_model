"use client";
import { useState, useCallback } from "react";
import { getPetalPath, getCardBackPath, minionTypes, guardianTypes } from "@/lib/gameData";

export function useGameAssets({ selectedCountry, setGameState }) {
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [showStartButton, setShowStartButton] = useState(true);

  const loadAllFlowerAssets = useCallback(async () => {
    setIsLoadingAssets(true);
    const loadImage = (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = src;
      });

    const promises = [loadImage(getCardBackPath())];
    if (selectedCountry) {
      for (let i = 1; i <= 6; i++) promises.push(loadImage(getPetalPath(selectedCountry.folder, i)));
    }
    minionTypes.forEach((m) => promises.push(loadImage(m.image)));
    guardianTypes.forEach((g) => promises.push(loadImage(g.image)));

    try {
      await Promise.race([Promise.all(promises), new Promise((r) => setTimeout(r, 5000))]);
    } catch {}

    setIsLoadingAssets(false);
    setShowStartButton(false);
    setGameState("playing");

    if (typeof window !== "undefined") {
      import("@/lib/soundUtils").then((m) => m.default.playAmbient()).catch(() => {});
    }
  }, [selectedCountry, setGameState]);

  const handleStartButtonClick = useCallback(() => {
    setShowStartButton(false);
    setGameState("playing");

    if (typeof window !== "undefined") {
      import("@/lib/soundUtils").then((m) => {
        if (m.default.audioContext?.state === "suspended") m.default.audioContext.resume();
        m.default.play("button-click");
        m.default.playAmbient();
      }).catch(() => {});
    }

    // Load assets in background without showing loader
    loadAllFlowerAssets().catch(() => {});
  }, [loadAllFlowerAssets, setGameState]);

  return { isLoadingAssets, showStartButton, handleStartButtonClick };
}

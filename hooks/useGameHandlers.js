"use client";
import { useState, useCallback } from "react";

export function useGameHandlers({ selectedCountry, setSelectedCountry, hasGuardian, setHasGuardian, setPetalsCollected, setCollectedPetals, setGameState, setShowIntro, addCompletedFlower, countriesData }) {
  const [lastCardType, setLastCardType] = useState(null);
  const [lastCardData, setLastCardData] = useState(null);

  const handlePetalCollected = useCallback(() => {
    setPetalsCollected((prev) => {
      const next = prev + 1;
      if (next >= 6) {
        if (typeof window !== "undefined") {
          import("@/lib/soundUtils").then((m) => m.default.play("flower-complete")).catch(() => {});
        }
        setTimeout(() => setGameState("flowerFormation"), 1000);
      }
      return next;
    });
  }, [setPetalsCollected, setGameState]);

  const handleMinionRevealed = useCallback(() => {
    if (hasGuardian) {
      setHasGuardian(false);
      return "protected";
    }
    setPetalsCollected(0);
    return "reset";
  }, [hasGuardian, setHasGuardian, setPetalsCollected]);

  const handleGuardianActivated = useCallback(() => {
    setHasGuardian(true);
  }, [setHasGuardian]);

  const handleFlowerComplete = useCallback(() => {
    // After flower formation animation, go to detail reveal
    setGameState("flowerDetails");
  }, [setGameState]);

  const handleFlowerDetailsComplete = useCallback(() => {
    // After detail reveal, go to quiz
    setGameState("quiz");
  }, [setGameState]);

  const handleQuizComplete = useCallback((score, total, isPerfect) => {
    // Only unlock flower in digital garden if user got ALL questions correct
    if (isPerfect && selectedCountry) {
      // Perfect score - unlock the flower
      if (typeof window !== "undefined") {
        import("@/lib/soundUtils").then((m) => m.default.play("victory")).catch(() => {});
      }
      addCompletedFlower(selectedCountry.id);
      setGameState("globeAnimation");
      setTimeout(() => setGameState("completed"), 4000);
    } else {
      // Not perfect - stay in quiz state for retry (handled by PollinatorQuiz component)
      // Note: The quiz component will handle showing retry UI
    }
  }, [selectedCountry, addCompletedFlower, setGameState]);

  const handleRestart = useCallback(() => {
    const others = countriesData.filter((c) => c.id !== selectedCountry?.id);
    const pool = others.length > 0 ? others : countriesData;
    const newCountry = pool[Math.floor(Math.random() * pool.length)];

    setSelectedCountry(newCountry);
    setGameState("playing");
    setPetalsCollected(0);
    setHasGuardian(false);
    setCollectedPetals([]);
    setShowIntro(false);
    setLastCardType(null);
    setLastCardData(null);
  }, [selectedCountry, setSelectedCountry, countriesData, setGameState, setPetalsCollected, setHasGuardian, setCollectedPetals, setShowIntro]);

  const handleCardTypeChange = useCallback((type, data) => {
    setLastCardType(type);
    setLastCardData(data);
  }, []);

  return {
    lastCardType,
    lastCardData,
    handlePetalCollected,
    handleMinionRevealed,
    handleGuardianActivated,
    handleFlowerComplete,
    handleFlowerDetailsComplete,
    handleQuizComplete,
    handleRestart,
    handleCardTypeChange,
  };
}

"use client";
import { useState, useEffect } from "react";
import { countriesData, verifyCompleteFlowerImages } from "@/lib/gameData";

export function useGamePersistence() {
  const [showIntro, setShowIntro] = useState(false);
  const [completedFlowers, setCompletedFlowers] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!localStorage.getItem("araihanIntroSeen")) setShowIntro(true);

    try {
      const saved = localStorage.getItem("completedFlowers");
      if (saved) setCompletedFlowers(JSON.parse(saved));
    } catch {}

    verifyCompleteFlowerImages();
  }, []);

  useEffect(() => {
    if (!selectedCountry && countriesData.length > 0) {
      setSelectedCountry(countriesData[Math.floor(Math.random() * countriesData.length)]);
    }
  }, []);

  const markIntroSeen = () => {
    setShowIntro(false);
    if (typeof window !== "undefined") localStorage.setItem("araihanIntroSeen", "true");
  };

  const addCompletedFlower = (countryId) => {
    setCompletedFlowers((prev) => {
      const updated = [...new Set([...prev, countryId])];
      if (typeof window !== "undefined") localStorage.setItem("completedFlowers", JSON.stringify(updated));
      return updated;
    });
  };

  return { showIntro, markIntroSeen, completedFlowers, addCompletedFlower, selectedCountry, setSelectedCountry };
}

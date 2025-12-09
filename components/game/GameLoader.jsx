"use client";

import { useEffect, useRef, useState } from "react";
import React from "react";
import styles from "./GameLoader.module.css";
import { countriesData, getPetalPath, getCardBackPath, minionTypes, guardianTypes } from "@/lib/gameData";

export default function GameLoader({ onComplete }) {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);
  const startTimeRef = useRef(Date.now());
  const MIN_DURATION = 4000; // Minimum loader display in ms
  const MAX_DURATION = 8000; // Hard cap in ms

  // Update ref when onComplete changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (completedRef.current) return; // Prevent multiple completions

    // Play unique loading sound effect from sound manager
    const playLoadingSound = () => {
      try {
        if (typeof window !== "undefined") {
          import("@/lib/soundUtils").then((module) => {
            module.default.play("loading");
          }).catch(() => {});
        }
      } catch (error) {
        console.log("Could not play loading sound");
      }
    };

    // Play sound immediately
    playLoadingSound();

    startTimeRef.current = Date.now();

    // Preload essential assets
    const preloadAssets = async () => {
      const assetsToLoad = [];

      // Helper function to load an image
      const loadImage = (src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve; // Resolve even on error to prevent blocking
          img.src = src;
          // Add timeout to prevent hanging
          setTimeout(resolve, 1000);
        });
      };

      // Load card back
      assetsToLoad.push(loadImage(getCardBackPath()));

      // Load first country's petals (most likely to be used)
      if (countriesData.length > 0) {
        const firstCountry = countriesData[0];
        for (let i = 1; i <= 6; i++) {
          assetsToLoad.push(loadImage(getPetalPath(firstCountry.folder, i)));
        }
      }

      // Load all guardian images
      guardianTypes.forEach((guardian) => {
        assetsToLoad.push(loadImage(guardian.image));
      });

      // Load all minion images
      minionTypes.forEach((minion) => {
        assetsToLoad.push(loadImage(minion.image));
      });

      // Load assets with timeout
      await Promise.race([
        Promise.allSettled(assetsToLoad),
        new Promise(resolve => setTimeout(resolve, 3000)) // Max 3 seconds for loading
      ]);

      setAssetsLoaded(true);
    };

    // Start loading assets
    preloadAssets();

    // Maximum duration safeguard
    const maxTimeout = setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current();
      }
    }, MAX_DURATION);

    return () => {
      clearTimeout(maxTimeout);
    };
  }, []);

  // Complete once assets are loaded AND minimum duration has passed
  useEffect(() => {
    if (!assetsLoaded || completedRef.current) return;

    const elapsed = Date.now() - startTimeRef.current;
    const remaining = Math.max(0, MIN_DURATION - elapsed);

    const timer = setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current();
      }
    }, remaining);

    return () => clearTimeout(timer);
  }, [assetsLoaded]);

  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.brandText}>Card Games</div>
      <div className={styles.gifContainer}>
        <img
          src="/giphy.gif"
          alt="Loading animation"
          className={styles.gifImage}
          loading="eager"
        />
      </div>
    </div>
  );
}

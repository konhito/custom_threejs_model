"use client";

import { useState, useEffect } from "react";
import { getPetalPath } from "@/lib/gameData";

// SVG petal dimensions from the actual files (195.6 x 266.5)
const PETAL_WIDTH = 195.6;
const PETAL_HEIGHT = 266.5;

export default function CompleteFlower({ country, size = 400, className = "" }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPetals, setShowPetals] = useState(false);

  useEffect(() => {
    // Preload all 6 petal images
    const loadImages = async () => {
      const loadPromises = [];
      for (let i = 1; i <= 6; i++) {
        const img = new window.Image();
        img.src = getPetalPath(country.folder, i);
        loadPromises.push(
          new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          })
        );
      }
      await Promise.all(loadPromises);
      setIsLoaded(true);
      
      setTimeout(() => {
        setShowPetals(true);
      }, 100);
    };

    loadImages();
  }, [country]);

  // Calculate dimensions maintaining exact aspect ratio
  // Total flower aspect ratio = (3 * 195.6) / (2 * 266.5) = 1.101
  const totalAspectRatio = (3 * PETAL_WIDTH) / (2 * PETAL_HEIGHT);
  const totalHeight = size / totalAspectRatio;

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{
        width: `${size}px`,
        height: `${totalHeight}px`,
        opacity: showPetals ? 1 : 0,
        transform: showPetals ? 'scale(1)' : 'scale(0.8)',
        transition: 'all 0.8s ease-out',
      }}
    >
      {/* 6 petals positioned absolutely for pixel-perfect alignment */}
      {isLoaded && [1, 2, 3, 4, 5, 6].map((petalNum) => {
        const row = Math.floor((petalNum - 1) / 3);
        const col = (petalNum - 1) % 3;
        const leftPercent = (col / 3) * 100;
        const topPercent = (row / 2) * 100;
        
        return (
          <img
            key={petalNum}
            src={getPetalPath(country.folder, petalNum)}
            alt={`Petal ${petalNum}`}
            draggable={false}
            style={{
              position: 'absolute',
              left: `${leftPercent}%`,
              top: `${topPercent}%`,
              width: '33.3334%',
              height: '50.01%',
              display: 'block',
              margin: 0,
              padding: 0,
              border: 'none',
              imageRendering: 'auto',
              backfaceVisibility: 'hidden',
            }}
          />
        );
      })}
    </div>
  );
}


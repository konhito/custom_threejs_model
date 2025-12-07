"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getPetalPath } from "@/lib/gameData";

export default function CompleteFlower({ country, size = 400, className = "" }) {
  const [petalImages, setPetalImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPetals, setShowPetals] = useState(false);

  useEffect(() => {
    // Load all 6 petal images in order (1, 2, 3, 4, 5, 6)
    const loadImages = async () => {
      const images = [];
      for (let i = 1; i <= 6; i++) {
        const img = new window.Image();
        img.src = getPetalPath(country.folder, i);
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve; // Continue even if image fails
        });
        images.push({
          src: getPetalPath(country.folder, i),
          number: i, // Store the petal number (1-6)
        });
      }
      setPetalImages(images);
      setIsLoaded(true);
      
      // Trigger animation after a short delay
      setTimeout(() => {
        setShowPetals(true);
      }, 100);
    };

    loadImages();
  }, [country]);

  // Petals arranged in flower formation
  // Top layer: petals 1, 2, 3 (arranged in a circle at top)
  // Bottom layer: petals 4, 5, 6 (arranged in a circle at bottom)
  const petalSize = size * 0.6; // Slightly smaller to show the arrangement
  const radius = size * 0.25; // Distance from center

  // Calculate positions for each petal in flower formation
  // Top layer: petals 1, 2, 3 (arranged in upper half)
  // Bottom layer: petals 4, 5, 6 (arranged in lower half)
  const getPetalPosition = (petalNumber) => {
    let angle, layerOffset;
    
    if (petalNumber <= 3) {
      // Top layer: petals 1, 2, 3
      // Arrange in upper semi-circle: 1 at top-left, 2 at top-center, 3 at top-right
      const angles = [150, 90, 30]; // Degrees from center
      angle = (angles[petalNumber - 1] * Math.PI) / 180;
      layerOffset = -radius * 0.2; // Above center
    } else {
      // Bottom layer: petals 4, 5, 6
      // Arrange in lower semi-circle: 4 at bottom-left, 5 at bottom-center, 6 at bottom-right
      const angles = [210, 270, 330]; // Degrees from center
      angle = (angles[petalNumber - 4] * Math.PI) / 180;
      layerOffset = radius * 0.2; // Below center
    }
    
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius + layerOffset;
    
    return { x, y };
  };

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {isLoaded && petalImages.map((petal, index) => {
        const position = getPetalPosition(petal.number);
        const isTopLayer = petal.number <= 3;
        
        return (
          <div
            key={index}
            className="absolute transition-all duration-1000 ease-out"
            style={{
              width: `${petalSize}px`,
              height: `${petalSize}px`,
              left: `50%`,
              top: `50%`,
              transform: showPetals
                ? `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(1)`
                : `translate(-50%, -50%) scale(0)`,
              transformOrigin: 'center center',
              opacity: showPetals ? 1 : 0,
              zIndex: isTopLayer ? petal.number + 3 : petal.number, // Top layer (1-3) on top, bottom layer (4-6) below
              transitionDelay: `${index * 100}ms`, // Stagger the animation
            }}
          >
            <Image
              src={petal.src}
              alt={`Petal ${petal.number}`}
              width={petalSize}
              height={petalSize}
              className="object-contain"
              style={{
                filter: showPetals ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.2))' : 'none',
                transition: 'filter 0.5s ease-out',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}


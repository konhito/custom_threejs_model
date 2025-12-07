"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import CompleteFlower from "./CompleteFlower";
import { getPetalPath } from "@/lib/gameData";

export default function FlowerFormation({ country, onComplete }) {
  const [stage, setStage] = useState("convergence"); // convergence, particles, flower, story
  const [showFlower, setShowFlower] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [petalPositions, setPetalPositions] = useState([]);

  // Play sounds for different stages
  const playSound = (type) => {
    if (typeof window !== "undefined") {
      import("@/lib/soundUtils").then((module) => {
        module.default.play(type);
      });
    }
  };

  useEffect(() => {
    // Play flower complete sound when formation starts
    playSound("flower-complete");
    
    // Initialize petal positions in a circle
    const initialPositions = Array.from({ length: 6 }, (_, i) => {
      const angle = (i / 6) * Math.PI * 2;
      return {
        x: Math.cos(angle) * 150,
        y: Math.sin(angle) * 150,
        angle: angle,
        scale: 1,
      };
    });
    setPetalPositions(initialPositions);

    // Stage 1: Petals converge to center (1.5 seconds)
    const timer1 = setTimeout(() => {
      setPetalPositions(Array.from({ length: 6 }, () => ({ x: 0, y: 0, scale: 0.3 })));
      setStage("particles");
      playSound("petals-converge");
    }, 1500);

    // Stage 2: Particle animation (1.5 seconds)
    const timer2 = setTimeout(() => {
      setStage("flower");
      setShowFlower(true);
      playSound("flower-appear");
    }, 3000);

    // Stage 3: Show flower and story (2 seconds)
    const timer3 = setTimeout(() => {
      setStage("story");
      setShowStory(true);
    }, 5000);

    // Stage 4: Complete (after story is shown)
    const timer4 = setTimeout(() => {
      onComplete();
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Petal Convergence Animation */}
      {stage === "convergence" && (
        <div className="absolute inset-0 flex items-center justify-center">
          {petalPositions.map((pos, i) => (
            <div
              key={i}
              className="absolute transition-all duration-1500 ease-out"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${pos.scale})`,
                width: "80px",
                height: "80px",
              }}
            >
              <Image
                src={getPetalPath(country.folder, i + 1)}
                alt={`Petal ${i + 1}`}
                width={80}
                height={80}
                className="object-contain animate-petal-float"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Particle Animation Background */}
      {(stage === "particles" || stage === "flower") && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: "pulse 1s ease-in-out infinite",
                animationDelay: `${Math.random() * 1}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Flower Display */}
      {showFlower && (
        <div className="relative z-10 flex flex-col items-center animate-scale-in">
          <div className="relative w-64 h-64 md:w-96 md:h-96 mb-8 flex items-center justify-center">
            <CompleteFlower
              country={country}
              size={384}
            />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 text-center drop-shadow-lg">
            {country.flowerName}
          </h2>
          <p className="text-xl md:text-2xl text-purple-200 italic text-center">
            {country.flowerScientificName}
          </p>
        </div>
      )}

      {/* Story Display */}
      {showStory && (
        <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-white/20 to-purple-900/30 backdrop-blur-md rounded-3xl p-8 md:p-12 border-2 border-white/20 shadow-2xl">
              <p className="text-white text-lg md:text-xl leading-relaxed text-center">
                {country.flowerDescription}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Araihan Character - Same design as in game */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center flex-shrink-0 transition-all duration-500 animate-float">
            <svg
              width="64"
              height="64"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <path d="M28 40 Q20 38 18 32 Q16 26 20 24 Q18 22 22 20 Q26 18 28 22 Q30 18 34 20 Q38 22 36 24 Q40 26 38 32 Q36 38 28 40 Z" fill="#DC2626" />
              <ellipse cx="28" cy="18" rx="10" ry="11" fill="#DC2626" />
              <circle cx="24" cy="30" r="2.5" fill="#1F2937" opacity="0.7" />
              <circle cx="32" cy="28" r="2" fill="#1F2937" opacity="0.7" />
              <circle cx="26" cy="34" r="1.5" fill="#1F2937" opacity="0.6" />
              <circle cx="24" cy="18" r="3" fill="#1F2937" />
              <circle cx="32" cy="18" r="3" fill="#1F2937" />
              <circle cx="24" cy="18" r="1.5" fill="#DC2626" />
              <circle cx="32" cy="18" r="1.5" fill="#DC2626" />
              <ellipse cx="28" cy="22" rx="3" ry="2" fill="#1F2937" opacity="0.6" />
              <ellipse cx="16" cy="26" rx="2" ry="5" fill="#DC2626" transform="rotate(-30 16 26)" />
              <ellipse cx="40" cy="26" rx="2" ry="5" fill="#DC2626" transform="rotate(30 40 26)" />
              <ellipse cx="20" cy="36" rx="2" ry="4" fill="#DC2626" transform="rotate(-20 20 36)" />
              <ellipse cx="36" cy="36" rx="2" ry="4" fill="#DC2626" transform="rotate(20 36 36)" />
            </svg>
          </div>
          {/* Message Bubble */}
          {(stage === "convergence" || stage === "particles" || stage === "flower") && (
            <div className="absolute top-1/2 -translate-y-1/2 left-full ml-4 bg-purple-900/98 backdrop-blur-md rounded-xl px-4 py-3 animate-fade-in border-2 border-purple-400/60 shadow-2xl z-20 whitespace-nowrap max-w-[300px]">
              <p className="text-white text-sm font-medium">
                {stage === "convergence" && "The petals are coming together..."}
                {stage === "particles" && "The magic is happening..."}
                {stage === "flower" && `You restored the flower of ${country.country}. Here is its story…`}
              </p>
              <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-purple-900/98"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


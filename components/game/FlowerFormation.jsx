"use client";

import { useState, useEffect } from "react";
import { getPetalPath } from "@/lib/gameData";

// SVG petal dimensions from the actual files (195.6 x 266.5)
// The complete flower is a 3x2 grid = 586.8 x 533 total
const PETAL_WIDTH = 195.6;
const PETAL_HEIGHT = 266.5;

export default function FlowerFormation({ country, onComplete }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showFlower, setShowFlower] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [flowerSize, setFlowerSize] = useState({ width: 480, height: 435 });

  // Play sounds
  const playSound = (type) => {
    if (typeof window !== "undefined") {
      import("@/lib/soundUtils").then((module) => {
        if (
          module.default.audioContext &&
          module.default.audioContext.state === "suspended"
        ) {
          module.default.audioContext.resume();
        }
        module.default.play(type);
      });
    }
  };

  // Calculate flower size based on window
  useEffect(() => {
    const calculateSize = () => {
      const maxWidth = Math.min(window.innerWidth * 0.85, 540);
      // Maintain exact aspect ratio of 3 petals wide by 2 petals tall
      // Total aspect ratio = (3 * 195.6) / (2 * 266.5) = 586.8 / 533 = 1.101
      const totalAspectRatio = (3 * PETAL_WIDTH) / (2 * PETAL_HEIGHT);
      const width = maxWidth;
      const height = width / totalAspectRatio;
      setFlowerSize({ width, height });
    };

    calculateSize();
    window.addEventListener("resize", calculateSize);
    return () => window.removeEventListener("resize", calculateSize);
  }, []);

  useEffect(() => {
    // Preload all petal images
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

      // Play flower complete sound
      playSound("flower-complete");

      // Show flower with animation after brief delay
      setTimeout(() => {
        setShowFlower(true);
        playSound("flower-appear");
      }, 300);

      // Show text content after flower appears
      setTimeout(() => {
        setShowContent(true);
      }, 1200);
    };

    loadImages();
  }, [country]);

  const { width: flowerWidth, height: flowerHeight } = flowerSize;

  const handleContinue = () => {
    playSound("button-click");
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Beautiful gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, #fef9c3 0%, #fef3c7 25%, #fce7f3 50%, #f5f3ff 75%, #ecfdf5 100%)",
        }}
      />

      {/* Soft animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              background: ["#fcd34d", "#f9a8d4", "#c4b5fd", "#86efac"][
                Math.floor(Math.random() * 4)
              ],
              opacity: 0.4,
              animation: `float-particle ${
                8 + Math.random() * 6
              }s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Golden light rays emanating from flower */}
      {showFlower && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`ray-${i}`}
              className="absolute left-1/2 top-1/2 origin-bottom"
              style={{
                width: "2px",
                height: "150%",
                background:
                  "linear-gradient(to top, rgba(251, 191, 36, 0.3) 0%, transparent 60%)",
                transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
                animation: "ray-pulse 4s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-4 max-w-2xl w-full">
        {/* The Restored Flower - Single Unified Element */}
        <div
          className="relative mb-4"
          style={{
            opacity: showFlower ? 1 : 0,
            transform: showFlower ? "scale(1)" : "scale(0.5)",
            transition: "all 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Soft glow behind flower */}
          <div
            className="absolute -inset-8 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)",
              animation: "glow-pulse 3s ease-in-out infinite",
            }}
          />

          {/* Flower container with breathing animation */}
          <div
            className="relative overflow-hidden rounded-2xl shadow-2xl"
            style={{
              width: `${flowerWidth}px`,
              height: `${flowerHeight}px`,
              animation: showFlower
                ? "flower-breathe 4s ease-in-out infinite"
                : "none",
              boxShadow:
                "0 25px 80px -20px rgba(251, 191, 36, 0.5), 0 15px 40px -15px rgba(0, 0, 0, 0.2)",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "repeat(2, 1fr)",
              gap: "0px",
            }}
          >
            {/* 6 petals in a 3x2 grid, each with staggered animation */}
            {isLoaded &&
              [1, 2, 3, 4, 5, 6].map((petalNum, idx) => (
                <img
                  key={petalNum}
                  src={getPetalPath(country.folder, petalNum)}
                  alt={`Petal ${petalNum}`}
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    margin: 0,
                    padding: 0,
                    border: "none",
                    objectFit: "cover",
                    imageRendering: "auto",
                    backfaceVisibility: "hidden",
                    opacity: showFlower ? 1 : 0,
                    transform: showFlower ? "scale(1)" : "scale(0.7)",
                    transition: "opacity 0.5s, transform 0.5s",
                    transitionDelay: showFlower ? `${0.15 * idx + 0.2}s` : "0s",
                  }}
                />
              ))}

            {/* Subtle shimmer overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
                animation: "shimmer 3s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        {/* Message and CTA */}
        <div
          className="text-center"
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease-out",
          }}
        >
          {/* Flower name */}
          <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-2">
            {country.flowerName}
          </h2>
          <p className="text-lg md:text-xl text-purple-600 mb-3 italic">
            {country.country}
          </p>

          {/* Main message */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 mb-4 shadow-lg border border-purple-100">
            <p className="text-lg md:text-xl lg:text-2xl font-medium text-gray-800 whitespace-nowrap">
              🌸 Your flower has been restored and added to the garden 🌸
            </p>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="group relative px-10 py-4 bg-gradient-to-r from-yellow-100 via-pink-100 to-green-100 text-purple-700 text-lg md:text-xl font-bold rounded-full border-2 border-purple-200 shadow-lg hover:shadow-xl hover:bg-white/90 hover:text-purple-900 transform hover:scale-105 transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-300"
            style={{
              animation: "button-glow 2s ease-in-out infinite",
            }}
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-60 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            <span className="relative z-10 drop-shadow-sm">
              Continue to next flower →
            </span>
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        /* No extra keyframes needed, handled by inline transition */
        @keyframes flower-breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        @keyframes glow-pulse {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) rotate(0deg);
          }
          100% {
            transform: translateX(100%) rotate(0deg);
          }
        }

        @keyframes float-particle {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-5px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }

        @keyframes ray-pulse {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes button-glow {
          0%,
          100% {
            box-shadow: 0 10px 40px -10px rgba(147, 51, 234, 0.5);
          }
          50% {
            box-shadow: 0 15px 50px -10px rgba(147, 51, 234, 0.7);
          }
        }
      `}</style>
    </div>
  );
}

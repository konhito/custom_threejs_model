"use client";

import { useState, useEffect } from "react";
import { getCompleteFlowerPath, getCompleteFlowerPathFallbacks } from "@/lib/gameData";
import { useTranslation } from "@/lib/useTranslation";
import Image from "next/image";

export default function FlowerFormation({ country, onComplete }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showFlower, setShowFlower] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const { t } = useTranslation();

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

  useEffect(() => {
    // Preload complete flower image with improved error handling and case-insensitive fallbacks
    const loadImage = async () => {
      const svgFallbacks = getCompleteFlowerPathFallbacks(country.folder, 'svg');
      const pngFallbacks = getCompleteFlowerPathFallbacks(country.folder, 'png');
      
      let loadedSuccessfully = false;
      let finalImagePath = svgFallbacks[0];

      // Try loading image with multiple fallback paths
      const tryLoadImage = (imagePaths) => {
        return new Promise((resolve) => {
          let currentIndex = 0;
          let timeoutId = null;
          
          const tryNext = () => {
            // Clear any existing timeout
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            
            if (currentIndex >= imagePaths.length) {
              resolve(false);
              return;
            }
            
            const img = new window.Image();
            const currentPath = imagePaths[currentIndex];
            const indexToCheck = currentIndex; // Capture index for timeout check
            
            img.onload = () => {
              if (timeoutId) clearTimeout(timeoutId);
              loadedSuccessfully = true;
              finalImagePath = currentPath;
              console.log(`Successfully loaded: ${currentPath}`);
              resolve(true);
            };
            
            img.onerror = () => {
              if (timeoutId) clearTimeout(timeoutId);
              console.warn(`Failed to load ${currentPath}, trying next fallback...`);
              currentIndex++;
              tryNext();
            };
            
            img.src = currentPath;
            
            // Timeout after 3 seconds per path
            timeoutId = setTimeout(() => {
              if (!loadedSuccessfully && currentIndex === indexToCheck) {
                console.warn(`Timeout loading ${currentPath}`);
                currentIndex++;
                tryNext();
              }
            }, 3000);
          };
          
          tryNext();
        });
      };

      // Try SVG paths first (with all fallbacks)
      const svgLoaded = await tryLoadImage(svgFallbacks);
      
      // If SVG failed, try PNG paths (with all fallbacks)
      if (!svgLoaded) {
        const pngLoaded = await tryLoadImage(pngFallbacks);
        if (!pngLoaded) {
          console.error(`Failed to load complete flower for ${country.folder}. Tried all SVG and PNG fallbacks.`);
          // Still set loaded to true to show the UI, but image will show broken
          setIsLoaded(true);
          return;
        }
      }

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

    loadImage();
  }, [country]);

  const handleContinue = () => {
    playSound("button-click");
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden">
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
              animation: `float-particle ${8 + Math.random() * 6
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

      {/* Main Content Container - Scrollable with proper spacing */}
      <div className="relative z-10 flex flex-col items-center justify-start w-full min-h-screen py-4 px-4">

        {/* Flower Name and Country - Top Section */}
        <div
          className="text-center w-full max-w-2xl mb-3"
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease-out",
          }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-purple-800 mb-2">
            {country.flowerName}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-purple-600 italic">
            {country.country}
          </p>
        </div>

        {/* The Complete Flower Image - Middle Section */}
        <div
          className="relative w-full flex items-center justify-center mb-4"
          style={{
            opacity: showFlower ? 1 : 0,
            transform: showFlower ? "scale(1)" : "scale(0.5)",
            transition: "all 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Soft glow behind flower */}
          <div
            className="absolute -inset-12 sm:-inset-16 md:-inset-20 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)",
              animation: "glow-pulse 3s ease-in-out infinite",
            }}
          />

          {/* Complete Flower Image Container */}
          {isLoaded && (
            <div
              className="relative rounded-2xl shadow-2xl overflow-hidden bg-white/50 backdrop-blur-sm"
              style={{
                width: "100%",
                maxWidth: "min(85vw, 650px)",
                animation: showFlower
                  ? "flower-breathe 4s ease-in-out infinite"
                  : "none",
                boxShadow:
                  "0 25px 80px -20px rgba(251, 191, 36, 0.5), 0 15px 40px -15px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div className="relative w-full p-4 sm:p-6 md:p-8">
                <img
                  src={getCompleteFlowerPath(country.folder, 'svg')}
                  alt={`${country.flowerName} - ${country.country}`}
                  className="w-full h-auto block mx-auto"
                  draggable={false}
                  style={{
                    imageRendering: "auto",
                    backfaceVisibility: "hidden",
                    maxHeight: "50vh",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    const currentSrc = e.target.src;
                    const fallbacks = getCompleteFlowerPathFallbacks(country.folder, 
                      currentSrc.includes('.png') ? 'png' : 'svg'
                    );
                    
                    // Find current path index and try next fallback
                    const currentIndex = fallbacks.findIndex(path => currentSrc.includes(path.split('/').pop()));
                    const nextIndex = currentIndex + 1;
                    
                    if (nextIndex < fallbacks.length) {
                      console.log(`Trying fallback ${nextIndex + 1}/${fallbacks.length} for ${country.folder}...`);
                      e.target.src = fallbacks[nextIndex];
                    } else {
                      // If all SVG fallbacks failed, try PNG fallbacks
                      if (currentSrc.includes('.svg')) {
                        const pngFallbacks = getCompleteFlowerPathFallbacks(country.folder, 'png');
                        console.log(`All SVG paths failed, trying PNG fallbacks for ${country.folder}...`);
                        e.target.src = pngFallbacks[0];
                      } else {
                        console.error(`All paths failed for ${country.folder}. Last tried: ${currentSrc}`);
                      }
                    }
                  }}
                  onLoad={() => {
                    console.log(`Successfully loaded complete flower for ${country.folder}`);
                  }}
                />
              </div>

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
          )}
        </div>

        {/* Continue Button - Bottom Section */}
        <div
          className="text-center w-full max-w-2xl"
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease-out",
            transitionDelay: "0.2s",
          }}
        >
          <button
            onClick={handleContinue}
            className="group relative px-8 sm:px-10 md:px-12 py-4 sm:py-5 bg-gradient-to-r from-yellow-100 via-pink-100 to-green-100 text-purple-700 text-lg sm:text-xl md:text-2xl font-bold rounded-full border-2 border-purple-200 shadow-lg hover:shadow-xl hover:bg-white/90 hover:text-purple-900 transform hover:scale-105 transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-300"
            style={{
              animation: "button-glow 2s ease-in-out infinite",
            }}
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-60 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            <span className="relative z-10 drop-shadow-sm">
              {t('game.continueToNext')} →
            </span>
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
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

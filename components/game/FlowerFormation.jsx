"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import CompleteFlower from "./CompleteFlower";
import { getPetalPath } from "@/lib/gameData";

export default function FlowerFormation({ country, onComplete, collectedPetals }) {
  const [stage, setStage] = useState("convergence"); // convergence, assembled, completed
  const [petalPositions, setPetalPositions] = useState([]);
  const [showAssembled, setShowAssembled] = useState(false);
  const [cardsConnected, setCardsConnected] = useState(false);

  // Play sounds for different stages
  const playSound = (type) => {
    if (typeof window !== "undefined") {
      import("@/lib/soundUtils").then((module) => {
        // Resume audio context if suspended (browser autoplay policy)
        if (module.default.audioContext && module.default.audioContext.state === 'suspended') {
          module.default.audioContext.resume();
        }
        module.default.play(type);
      });
    }
  };

  useEffect(() => {
    // Play flower complete sound when formation starts
    playSound("flower-complete");
    
    // Get the container size
    const containerWidth = typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.8, 600) : 600;
    const cardWidth = containerWidth / 3;
    
    // Initialize petal positions scattered around the screen
    const initialPositions = Array.from({ length: 6 }, (_, i) => {
      const angle = (i / 6) * Math.PI * 2;
      const distance = Math.min(window?.innerWidth || 400, 500);
      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scale: 0.5,
        opacity: 1,
        rotation: Math.random() * 360,
      };
    });
    setPetalPositions(initialPositions);

    // Stage 1: Petals fly to grid positions (2 seconds)
    const timer1 = setTimeout(() => {
      // Calculate grid positions: 2 rows x 3 columns
      // Row 0: petals 1, 2, 3 (indices 0, 1, 2)
      // Row 1: petals 4, 5, 6 (indices 3, 4, 5)
      const finalPositions = Array.from({ length: 6 }, (_, i) => {
        const row = Math.floor(i / 3); // 0 or 1
        const col = i % 3; // 0, 1, or 2
        
        // Position relative to center of container
        // Offset from center: col 0 = -1, col 1 = 0, col 2 = 1
        // Offset from center: row 0 = -0.5, row 1 = 0.5
        const xOffset = (col - 1) * cardWidth;
        const yOffset = (row - 0.5) * cardWidth;
        
        return {
          x: xOffset,
          y: yOffset,
          scale: 1,
          opacity: 1,
          rotation: 0,
        };
      });
      
      setPetalPositions(finalPositions);
      setStage("assembled");
      playSound("petals-converge");
    }, 800);

    // Stage 2: Cards merge together (remove borders/padding)
    const timer2 = setTimeout(() => {
      setCardsConnected(true);
      playSound("flower-appear");
    }, 3500);

    // Stage 3: Switch to seamless grid view
    const timer3 = setTimeout(() => {
      setShowAssembled(true);
    }, 4000);

    // Stage 4: Complete - show collected petals page
    const timer4 = setTimeout(() => {
      onComplete();
    }, 6500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  // Calculate container width for both animations and final grid
  const containerWidth = typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.9, 800) : 600;
  const petalWidth = containerWidth / 3;

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Background particles for effect */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-300/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Petal Convergence Animation - Cards flying together and merging */}
      {!showAssembled && (
        <div className="absolute inset-0 flex items-center justify-center">
          {petalPositions.map((pos, i) => {
            const petalNum = i + 1;
            
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(${pos.scale}) rotate(${pos.rotation}deg)`,
                  width: `${petalWidth}px`,
                  height: `${petalWidth}px`,
                  opacity: pos.opacity || 1,
                  transition: cardsConnected 
                    ? 'all 0.5s ease-out' 
                    : 'all 2.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  zIndex: 10 + i,
                }}
              >
                <div 
                  className="relative w-full h-full bg-white overflow-hidden"
                  style={{
                    borderRadius: cardsConnected ? '0px' : '12px',
                    border: cardsConnected ? 'none' : '4px solid rgb(216, 180, 254)',
                    boxShadow: cardsConnected 
                      ? 'none' 
                      : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    padding: cardsConnected ? '0' : '12px',
                    transition: 'all 0.5s ease-out',
                  }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={getPetalPath(country.folder, petalNum)}
                      alt={`Petal ${petalNum}`}
                      fill
                      className={cardsConnected ? "object-cover" : "object-contain"}
                      style={{
                        transition: 'all 0.5s ease-out',
                      }}
                      priority
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assembled Flower - Perfect 2x3 Grid forming complete image */}
      {showAssembled && stage === "assembled" && (
        <div 
          className="relative z-20 shadow-2xl overflow-hidden rounded-2xl border-8 border-purple-300"
          style={{
            width: containerWidth,
            animation: 'scaleUp 0.8s ease-out',
            background: 'white',
          }}
        >
          {/* 2x3 Grid: No gaps, petals connect seamlessly */}
          <div 
            style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(2, 1fr)',
              gap: 0,
              lineHeight: 0,
              fontSize: 0,
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((petalNum) => (
              <div
                key={petalNum}
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1/1',
                  margin: 0,
                  padding: 0,
                  lineHeight: 0,
                  fontSize: 0,
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={getPetalPath(country.folder, petalNum)}
                  alt={`Petal ${petalNum}`}
                  fill
                  style={{
                    objectFit: 'cover',
                    display: 'block',
                    margin: 0,
                    padding: 0,
                  }}
                  priority
                />
              </div>
            ))}
          </div>
          
          {/* Magical glow effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/30 via-pink-300/30 to-purple-300/30 animate-pulse" 
                 style={{ mixBlendMode: 'overlay' }} />
          </div>
        </div>
      )}

      {/* Success message */}
      {showAssembled && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce">
          <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full shadow-xl border-2 border-purple-300">
            <p className="text-2xl font-bold text-purple-600">
              🌸 Flower Restored! 🌸
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scaleUp {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-in;
        }
      `}</style>
    </div>
  );
}


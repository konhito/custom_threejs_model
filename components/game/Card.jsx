"use client";

import { useState } from "react";
import Image from "next/image";
import { getCardBackPath } from "@/lib/gameData";

export default function Card({ card, isFlipped, onFlip, disabled, index = 0, totalCards = 20 }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (disabled || isFlipped || isAnimating) return;
    
    setIsAnimating(true);
    onFlip(card.id);
    
    // Reset animation state after flip completes
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Get card type colors for better visual feedback
  const getCardTypeStyle = () => {
    if (isFlipped) {
      switch (card.type) {
        case "petal":
          return "ring-4 ring-purple-300 shadow-purple-200";
        case "minion":
          return "ring-4 ring-red-300 shadow-red-200";
        case "guardian":
          return "ring-4 ring-green-300 shadow-green-200";
        default:
          return "";
      }
    }
    return "";
  };

  return (
    <div
      className={`relative cursor-pointer transition-all duration-300 w-[80px] h-[110px] md:w-[100px] md:h-[140px] lg:w-[110px] lg:h-[155px] ${
        disabled || isFlipped ? "cursor-not-allowed" : "cursor-pointer hover:scale-110"
      }`}
      onClick={handleClick}
      onMouseEnter={() => !isFlipped && !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        perspective: "1000px",
        transform: isHovered && !isFlipped 
          ? 'translateY(-50px) scale(1.25) rotate(0deg)' 
          : isFlipped 
          ? 'translateY(-20px) scale(1.1) rotate(0deg)' 
          : 'translateY(0) scale(1) rotate(0deg)',
        zIndex: isFlipped ? 1000 : (isHovered ? 500 : totalCards - index),
        filter: isHovered && !isFlipped 
          ? 'drop-shadow(0 15px 30px rgba(0,0,0,0.4))' 
          : isFlipped
          ? 'drop-shadow(0 10px 25px rgba(0,0,0,0.3))'
          : 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div
        className={`card-flip-container relative w-full h-full ${
          isFlipped ? "flipped" : ""
        }`}
      >
        {/* Card Back */}
        <div className="card-face card-face-back absolute inset-0 w-full h-full">
          <div className={`relative w-full h-full rounded-xl overflow-hidden shadow-xl border-[3px] border-white/30 ${
            isHovered && !isFlipped ? 'ring-2 ring-purple-400/50' : ''
          }`} style={{ background: 'linear-gradient(to bottom, #581c87, #1e3a8a, #312e81)' }}>
            <Image
              src={getCardBackPath()}
              alt="Card Back"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Card Front */}
        <div className={`card-face card-face-front absolute inset-0 w-full h-full ${getCardTypeStyle()}`}>
          <div className={`relative w-full h-full rounded-xl overflow-hidden shadow-2xl border-[3px] bg-white transition-all duration-300 ${
            card.type === "petal" ? "border-purple-200" :
            card.type === "minion" ? "border-red-200" :
            card.type === "guardian" ? "border-green-200" :
            "border-gray-200"
          }`}>
            <Image
              src={card.image}
              alt={
                card.type === "petal"
                  ? `Petal ${card.petalNumber} - ${card.country || ""}`
                  : card.type === "minion"
                  ? card.minionData?.name || "Minion"
                  : card.type === "guardian"
                  ? card.guardianData?.name || "Guardian"
                  : "Card"
              }
              fill
              className="object-contain p-2"
            />
            
            {/* Card type badge with better styling - Hidden on mobile */}
            {isFlipped && (
              <div className={`absolute top-2 right-2 px-3 py-1.5 rounded-full text-white text-xs font-bold items-center gap-1.5 shadow-lg hidden md:flex ${
                card.type === "petal" ? "bg-gradient-to-r from-purple-500 to-pink-500" :
                card.type === "minion" ? "bg-gradient-to-r from-red-500 to-orange-500" :
                card.type === "guardian" ? "bg-gradient-to-r from-green-500 to-emerald-500" :
                "bg-gray-500"
              }`}>
                {card.type === "petal" && "🌸 Petal"}
                {card.type === "minion" && "👹 Minion"}
                {card.type === "guardian" && "🛡️ Guardian"}
              </div>
            )}

            {/* Glow effect for flipped cards */}
            {isFlipped && (
              <div className={`absolute inset-0 rounded-xl pointer-events-none ${
                card.type === "petal" ? "bg-purple-200/20" :
                card.type === "minion" ? "bg-red-200/20" :
                card.type === "guardian" ? "bg-green-200/20" :
                ""
              }`} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


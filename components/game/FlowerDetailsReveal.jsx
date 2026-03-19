"use client";

import React, { useState, useEffect, useRef } from "react";
import { getCompleteFlowerPath } from "@/lib/gameData";
import { getFlowerDetail } from "@/lib/flowerDetailsData";
import { Leaf, Mountain, ScrollText, Building2, Shield, Bug, Heart, Sprout, Eye, Hand, ChevronsDown, Share2, X } from "lucide-react";
import BadgeUnlock from "./BadgeUnlock";
import ConfettiCanvas from "./ConfettiCanvas";
import CardParticles from "./CardParticles";

const SPARKLES = Array.from({ length: 16 });

// Icon mapping for parameters
const iconMap = {
  morphology: Leaf,
  habitat: Mountain,
  historicalOrigin: ScrollText,
  nationalStatus: Building2,
  conservationStatus: Shield,
  relevantPollinator: Bug,
  culturalSignificance: Heart,
  traditionalUses: Sprout,
};

export default function FlowerDetailsReveal({ country, onComplete }) {
  const detail = getFlowerDetail(country.id);

  const [phase, setPhase] = useState("bloom"); // bloom → revealed → reading
  const [revealedCards, setRevealedCards] = useState([]);
  const [flippedIndex, setFlippedIndex] = useState(null);
  const [allRevealed, setAllRevealed] = useState(false);
  const [exitAnim, setExitAnim] = useState(false);
  const scrollRef = useRef(null);
  
  // Phase 1: Quick Wins
  const [flippedCards, setFlippedCards] = useState([]); // Track all flipped cards for progress
  const [showGestureHint, setShowGestureHint] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const cardRefs = useRef([]);
  
  // Phase 2: Gamification
  const [currentBadge, setCurrentBadge] = useState(null);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [startTime] = useState(Date.now());
  
  // Phase 3: Visual Effects
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [particlePosition, setParticlePosition] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const containerRef = useRef(null);
  
  // Phase 4: Interactive Features
  const [focusedCardIndex, setFocusedCardIndex] = useState(-1);
  const [scrollProgress, setScrollProgress] = useState({});

  const params = detail?.parameters || [];

  useEffect(() => {
    // Bloom phase: show flower first
    const t1 = setTimeout(() => setPhase("revealed"), 1200);
    
    // Check if first visit for gesture hint
    if (typeof window !== "undefined") {
      const hasVisited = localStorage.getItem("flowerReveal_visited");
      if (!hasVisited) {
        setTimeout(() => setShowGestureHint(true), 2000);
        localStorage.setItem("flowerReveal_visited", "true");
      }
      
      // Load earned badges
      const savedBadges = JSON.parse(localStorage.getItem("earnedBadges") || "[]");
      setEarnedBadges(savedBadges);
    }
    
    // Check if favorited
    if (typeof window !== "undefined" && detail?.flowerName) {
      const favorites = JSON.parse(localStorage.getItem("favoriteFlowers") || "[]");
      setIsFavorited(favorites.includes(detail.flowerName));
    }
    
    return () => clearTimeout(t1);
  }, []);

  // Parallax scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollY = containerRef.current.scrollTop;
      
      // Apply parallax to background stars (slower)
      const stars = document.querySelectorAll(".parallax-star");
      stars.forEach((star, i) => {
        const speed = 0.3 + (i % 3) * 0.1;
        star.style.transform = `translate(-50%, -50%) translateY(${scrollY * speed}px)`;
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (phase !== "revealed") return;
      
      const visibleCards = params.length;
      
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedCardIndex(prev => {
          const next = prev < visibleCards - 1 ? prev + 1 : 0;
          // Scroll to focused card
          if (cardRefs.current[next]) {
            cardRefs.current[next].scrollIntoView({ behavior: "smooth", block: "center" });
          }
          return next;
        });
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedCardIndex(prev => {
          const next = prev > 0 ? prev - 1 : visibleCards - 1;
          if (cardRefs.current[next]) {
            cardRefs.current[next].scrollIntoView({ behavior: "smooth", block: "center" });
          }
          return next;
        });
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (focusedCardIndex >= 0 && focusedCardIndex < visibleCards) {
          const rect = cardRefs.current[focusedCardIndex]?.getBoundingClientRect();
          const fakeEvent = {
            currentTarget: cardRefs.current[focusedCardIndex]
          };
          handleCardFlip(focusedCardIndex, fakeEvent);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setFlippedIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, focusedCardIndex, params.length]);

  useEffect(() => {
    if (phase !== "revealed") return;
    // Stagger card reveal animations
    params.forEach((_, i) => {
      setTimeout(() => {
        setRevealedCards((prev) => [...prev, i]);
      }, 300 + i * 180);
    });
    setTimeout(() => setAllRevealed(true), 300 + params.length * 180 + 400);
  }, [phase]);

  const handleContinue = () => {
    setExitAnim(true);
    setTimeout(() => onComplete(), 600);
  };

  const playClick = () => {
    if (typeof window !== "undefined") {
      import("@/lib/soundUtils").then((m) => {
        if (m.default.audioContext?.state === "suspended") m.default.audioContext.resume();
        m.default.play("flip");
      });
    }
  };

  const unlockBadge = (badgeId) => {
    if (earnedBadges.includes(badgeId)) return;
    
    setCurrentBadge(badgeId);
    const newBadges = [...earnedBadges, badgeId];
    setEarnedBadges(newBadges);
    
    // Play badge unlock sound
    if (typeof window !== "undefined") {
      import("@/lib/soundUtils").then((m) => {
        if (m.default.audioContext?.state === "suspended") m.default.audioContext.resume();
        m.default.play("badge");
      });
    }
    
    if (typeof window !== "undefined") {
      localStorage.setItem("earnedBadges", JSON.stringify(newBadges));
    }
  };

  const handleCardFlip = (index, event) => {
    playClick();
    const newFlippedIndex = flippedIndex === index ? null : index;
    setFlippedIndex(newFlippedIndex);
    
    // Trigger particle effect
    if (newFlippedIndex !== null && event) {
      const rect = event.currentTarget.getBoundingClientRect();
      setParticlePosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });
      setParticleTrigger(prev => prev + 1);
    }
    
    // Track flipped cards for progress
    if (newFlippedIndex !== null && !flippedCards.includes(index)) {
      const newFlippedCards = [...flippedCards, index];
      setFlippedCards(newFlippedCards);
      
      // Check for badge unlocks
      if (newFlippedCards.length === 1) {
        unlockBadge("firstFlip");
      } else if (newFlippedCards.length === 4) {
        unlockBadge("explorer");
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 100);
      } else if (newFlippedCards.length === params.length) {
        const elapsedTime = (Date.now() - startTime) / 1000;
        
        // Play celebration sound
        if (typeof window !== "undefined") {
          import("@/lib/soundUtils").then((m) => {
            if (m.default.audioContext?.state === "suspended") m.default.audioContext.resume();
            m.default.play("celebrate");
          });
        }
        
        // Speed badge if under 30 seconds
        if (elapsedTime < 30) {
          setTimeout(() => unlockBadge("speedReader"), 800);
        }
        
        unlockBadge("botanist");
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 100);
      }
    }
    
    // Hide gesture hint after first flip
    if (showGestureHint) {
      setShowGestureHint(false);
    }
    
    // Auto-scroll to card
    if (newFlippedIndex !== null && cardRefs.current[index]) {
      setTimeout(() => {
        const cardElement = cardRefs.current[index];
        if (cardElement) {
          const rect = cardElement.getBoundingClientRect();
          const isPartiallyVisible = rect.top < 100 || rect.bottom > window.innerHeight - 100;
          
          if (isPartiallyVisible) {
            cardElement.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }, 100);
    }
  };

  const toggleFavorite = () => {
    if (typeof window !== "undefined" && detail?.flowerName) {
      const favorites = JSON.parse(localStorage.getItem("favoriteFlowers") || "[]");
      const newFavorites = isFavorited 
        ? favorites.filter(f => f !== detail.flowerName)
        : [...favorites, detail.flowerName];
      
      localStorage.setItem("favoriteFlowers", JSON.stringify(newFavorites));
      setIsFavorited(!isFavorited);
    }
  };

  if (!detail) {
    // Fallback if no detail data
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
        <div className="text-center text-white">
          <p className="text-xl mb-6">🌸 {country.flowerName}</p>
          <button onClick={onComplete} className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold">
            Continue to Quiz →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{
        background: "linear-gradient(135deg, #fdfcf8 0%, #fff9f0 30%, #fffbf5 70%, #fdfcf8 100%)",
        opacity: exitAnim ? 0 : 1,
        transition: "opacity 0.6s ease",
      }}
    >
      {/* Animated starfield background - golden sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {SPARKLES.map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full parallax-star"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              left: `${(i * 6.25) % 100}%`,
              top: `${(i * 7.3) % 100}%`,
              background: i % 3 === 0 ? "#f59e0b" : i % 3 === 1 ? "#d97706" : "#fbbf24",
              opacity: 0.15,
              animation: `twinkle-star ${2 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              boxShadow: `0 0 4px currentColor`,
              willChange: "transform",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div
        ref={scrollRef}
        className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-8 pb-24"
        style={{
          opacity: phase === "bloom" ? 0 : 1,
          transform: phase === "bloom" ? "translateY(20px)" : "translateY(0)",
          transition: "all 0.8s ease-out",
        }}
      >
        {/* Header: Title + Actions */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-amber-300 bg-amber-50">
              <Sprout className="w-4 h-4 text-amber-700" />
              <span className="text-amber-800 text-sm font-bold tracking-widest uppercase">Flower Revealed</span>
            </div>
            
            {/* Favorite button */}
            <button
              onClick={toggleFavorite}
              className="p-2 rounded-full border-2 border-pink-300 bg-pink-50 hover:bg-pink-100 transition-all duration-300 hover:scale-110"
              style={{
                animation: isFavorited ? "heart-beat 0.5s ease-out" : "none"
              }}
              title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                className={`w-5 h-5 transition-all duration-300 ${isFavorited ? 'text-pink-600 fill-pink-600' : 'text-pink-400'}`}
                strokeWidth={2}
              />
            </button>
            
            {/* Share button */}
            <button
              onClick={() => {
                const shareText = `🌸 ${detail.flowerName} (${detail.scientificName}) - National flower of ${detail.country}!\n\nDiscover more at AquaMundi.`;
                
                if (navigator.share) {
                  navigator.share({
                    title: `${detail.flowerName} - AquaMundi`,
                    text: shareText,
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(shareText);
                  const toast = document.createElement("div");
                  toast.textContent = "✓ Copied to clipboard!";
                  toast.style.cssText = "position:fixed;top:20px;right:20px;background:#f59e0b;color:white;padding:12px 24px;border-radius:12px;z-index:999;font-weight:bold;animation:fade-in-out 2s ease-out;box-shadow:0 4px 20px rgba(245,158,11,0.4);";
                  document.body.appendChild(toast);
                  setTimeout(() => toast.remove(), 2000);
                }
              }}
              className="p-2 rounded-full border-2 border-blue-300 bg-blue-50 hover:bg-blue-100 transition-all duration-300 hover:scale-110"
              title="Share this flower"
            >
              <Share2 
                className="w-5 h-5 text-blue-600"
                strokeWidth={2}
              />
            </button>
          </div>
          
          <h1
            className="font-black leading-none mb-3"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              background: "linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
              fontFamily: '"Cormorant Garamond", Georgia, serif',
            }}
          >
            {detail.flowerName}
          </h1>
          <p className="text-amber-700 text-xl md:text-2xl font-medium italic mb-2">{detail.scientificName}</p>
          <p className="text-gray-700 text-base md:text-lg">
            <span className="text-amber-600 font-semibold">{detail.country}</span> · {detail.botanicalFamily}
          </p>
        </div>

        {/* Flower image - CENTERED */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div
            className="relative flex-shrink-0"
            style={{
              width: "min(80vw, 500px)",
              height: "min(80vw, 500px)",
            }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)",
                animation: "pulse-glow 3s ease-in-out infinite",
                filter: "blur(30px)",
                transform: "scale(1.3)",
              }}
            />
            <img
              src={getCompleteFlowerPath(country.folder, "svg")}
              alt={country.flowerName}
              className="relative z-10 w-full h-full object-contain"
              style={{
                filter: "drop-shadow(0 0 20px rgba(251,191,36,0.3))",
                animation: "flower-float 5s ease-in-out infinite",
              }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>
        </div>

        {/* Common Names */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {detail.commonNames.split(", ").map((name, i) => (
            <span key={i} className="text-sm px-4 py-2 rounded-full bg-white border-2 border-amber-200 text-amber-900 font-medium shadow-sm">
              {name}
            </span>
          ))}
        </div>

        {/* Section title + Progress Counter */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-amber-800 text-sm md:text-base font-bold tracking-[0.3em] uppercase">Botanical Intelligence</h2>
            
            {/* Progress Counter */}
            <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-amber-300 bg-amber-50">
              <Eye className="w-4 h-4 text-amber-700" strokeWidth={2} />
              <span className="text-amber-800 font-bold text-sm">
                <span className="text-lg" style={{ 
                  transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  display: "inline-block",
                  transform: flippedCards.length > 0 ? "scale(1.2)" : "scale(1)"
                }}>
                  {flippedCards.length}
                </span>
                <span className="text-amber-600">/{params.length}</span> Explored
              </span>
              
              {/* Circular progress ring */}
              <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="rgba(251,191,36,0.3)"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 10}`}
                  strokeDashoffset={`${2 * Math.PI * 10 * (1 - flippedCards.length / params.length)}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
                />
              </svg>
            </div>
          </div>
          
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Tap each card to reveal the secrets of this flower. {params.length} parameters, {params.length} stories.
          </p>
        </div>

        {/* Flip Cards Grid - MUCH BIGGER CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-8 max-w-7xl mx-auto">
          {params.map((param, i) => {
            const isVisible = revealedCards.includes(i);
            const isFlipped = flippedIndex === i;
            const IconComponent = iconMap[param.key];

            return (
              <div
                key={param.key}
                ref={el => cardRefs.current[i] = el}
                className="cursor-pointer select-none relative"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)",
                  transition: "all 0.5s cubic-bezier(0.34,1.4,0.64,1)",
                  perspective: "1000px",
                  outline: focusedCardIndex === i ? "3px solid rgba(251,191,36,0.6)" : "none",
                  outlineOffset: "4px",
                  borderRadius: "1rem",
                }}
                onClick={(e) => handleCardFlip(i, e)}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                tabIndex={0}
              >
                {/* Gesture Hint - Only on first card, first visit */}
                {showGestureHint && i === 0 && (
                  <div 
                    className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400 text-white font-bold text-sm whitespace-nowrap shadow-lg"
                    style={{
                      animation: "bounce-hint 1.5s ease-in-out infinite",
                    }}
                  >
                    <Hand className="w-4 h-4" strokeWidth={2.5} />
                    Tap to flip!
                  </div>
                )}
              
                <div
                  className="relative w-full"
                  style={{
                    height: "min(60vw, 280px)",
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    transition: "transform 0.6s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                >
                  {/* Front - icon + label */}
                  <div
                    className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-4 md:gap-5 border-2 transition-all duration-300"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      background: isFlipped
                        ? "linear-gradient(135deg, #fff 0%, #fffbf5 100%)"
                        : "linear-gradient(135deg, #ffffff 0%, #fffef9 100%)",
                      borderColor: "rgba(245,158,11,0.3)",
                      boxShadow: "0 4px 20px rgba(245,158,11,0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
                      transform: hoveredCard === i && !isFlipped 
                        ? "translateY(-8px) rotateX(5deg)" 
                        : "translateY(0) rotateX(0deg)",
                    }}
                  >
                    <div
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
                      style={{ 
                        background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                        border: "2px solid #f59e0b",
                        boxShadow: "0 4px 12px rgba(245,158,11,0.2)"
                      }}
                    >
                      {IconComponent && <IconComponent className="w-10 h-10 md:w-12 md:h-12 text-amber-700" strokeWidth={1.5} />}
                    </div>
                    <span className="text-amber-900 text-base md:text-lg font-bold text-center px-4 leading-tight">
                      {param.label}
                    </span>
                    <span className="text-amber-600 text-xs md:text-sm mt-1">Tap to reveal</span>

                    {/* Shimmer on hover */}
                    <div
                      className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(217,119,6,0.05))" }}
                    />
                  </div>

                  {/* Back - content */}
                  <div
                    className="absolute inset-0 rounded-3xl p-5 md:p-6 flex flex-col overflow-hidden border-2"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      background: "linear-gradient(135deg, #fffbf5 0%, #fff9f0 100%)",
                      borderColor: "#f59e0b",
                      boxShadow: "0 8px 32px rgba(245,158,11,0.2), inset 0 1px 0 rgba(255,255,255,0.8)",
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                      {IconComponent && <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-amber-700" strokeWidth={2} />}
                      <span className="text-amber-800 text-sm md:text-base font-bold uppercase tracking-wider">{param.label}</span>
                    </div>
                    {/* Scrollable text with progress indicator */}
                    <div 
                      className="overflow-y-auto flex-1 relative" 
                      style={{ scrollbarWidth: "thin" }}
                      onScroll={(e) => {
                        const { scrollTop, scrollHeight, clientHeight } = e.target;
                        const progress = scrollHeight > clientHeight 
                          ? (scrollTop / (scrollHeight - clientHeight)) 
                          : 1;
                        setScrollProgress(prev => ({ ...prev, [i]: progress }));
                      }}
                    >
                      <p className="text-gray-800 text-sm md:text-base leading-relaxed font-medium">
                        {param.value}
                      </p>
                      
                      {/* Scroll indicator - show only if content is scrollable */}
                      {param.value.length > 200 && (!scrollProgress[i] || scrollProgress[i] < 0.95) && (
                        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-2 pointer-events-none">
                          <div className="bg-gradient-to-t from-[#fffbf5] via-[#fffbf5]/80 to-transparent w-full h-12 absolute bottom-0" />
                          <div className="relative z-10 flex items-center gap-1 text-amber-600 text-[10px] animate-pulse">
                            <ChevronsDown className="w-3 h-3" strokeWidth={2.5} />
                            scroll
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Close hint */}
                    <div className="text-amber-600 text-xs md:text-sm text-center mt-3 flex-shrink-0 font-medium">tap to close</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expanded detail panel when a card is flipped */}
        {flippedIndex !== null && (
          <div
            className="mb-6 md:mb-8 rounded-3xl p-5 md:p-6 border-2 max-w-4xl mx-auto"
            style={{
              background: "linear-gradient(135deg, #fffbf5, #fff9f0)",
              borderColor: "#f59e0b",
              animation: "fade-slide-in 0.4s ease-out",
              boxShadow: "0 8px 24px rgba(245,158,11,0.15)"
            }}
          >
            <div className="flex items-start gap-4">
              {(() => {
                const Icon = iconMap[params[flippedIndex]?.key];
                return Icon ? (
                  <Icon 
                    className="w-10 h-10 md:w-12 md:h-12 text-amber-700 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                ) : null;
              })()}
              <div>
                <h3 className="text-amber-800 font-bold text-base md:text-lg mb-2 md:mb-3 uppercase tracking-wide">
                  {params[flippedIndex]?.label}
                </h3>
                <p className="text-gray-800 text-sm md:text-base leading-relaxed">{params[flippedIndex]?.value}</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        {allRevealed && (
          <div
            className="text-center mb-6"
            style={{ animation: "fade-slide-in 0.5s ease-out" }}
          >
            <div className="flex justify-center gap-1 mb-3">
              {params.map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{ background: "#f59e0b" }}
                />
              ))}
            </div>
            <p className="text-amber-700 text-xs tracking-widest uppercase font-bold">
              {params.length} Parameters Revealed · Knowledge Unlocked
            </p>
          </div>
        )}

        {/* AquaMundi Profile box */}
        <div
          className="rounded-3xl p-5 md:p-6 border-2 mb-8 max-w-4xl mx-auto"
          style={{
            background: "linear-gradient(135deg, #fef3c7, #fde68a)",
            borderColor: "#f59e0b",
            opacity: allRevealed ? 1 : 0,
            transform: allRevealed ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.7s ease-out 0.3s",
            boxShadow: "0 8px 24px rgba(245,158,11,0.2)"
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 md:w-7 md:h-7 text-amber-800" strokeWidth={2} />
            <span className="text-amber-900 font-bold text-base md:text-lg uppercase tracking-wider">AquaMundi Profile</span>
          </div>
          <p className="text-gray-800 text-sm md:text-base leading-relaxed">
            <span className="text-amber-800 font-bold">{detail.flowerName}</span> ({detail.scientificName}) is the national flower of{" "}
            <span className="text-amber-700 font-bold">{detail.country}</span>. Its primary pollinator is the{" "}
            <span className="text-amber-700 font-semibold">{(detail.parameters.find(p => p.key === "relevantPollinator")?.value || "").split("—")[0].trim().replace(/^\w+\s\(/, "").replace(/\).*$/, "") || "local pollinators"}</span>.
            {" "}Ready to test your knowledge?
          </p>
        </div>

        {/* CTA to quiz */}
        <div
          className="flex justify-center"
          style={{
            opacity: allRevealed ? 1 : 0,
            transform: allRevealed ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.7s ease-out 0.6s",
          }}
        >
          <button
            onClick={handleContinue}
            className="group relative px-8 md:px-12 py-4 md:py-5 font-bold text-lg md:text-xl rounded-3xl overflow-hidden transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              boxShadow: "0 8px 32px rgba(245,158,11,0.4)",
              color: "white",
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0))" }}
            />
            <span className="relative z-10 flex items-center gap-3 md:gap-4">
              <Bug className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
              Ready? Take the Quiz!
              <span className="text-amber-100 text-sm md:text-base">(5 questions)</span>
              <span className="text-xl">→</span>
            </span>
          </button>
        </div>
      </div>

      {/* Full-screen bloom animation overlay */}
      {phase === "bloom" && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          style={{ animation: "bloom-fade 1.2s ease-out forwards" }}
        >
          <div
            className="text-center"
            style={{ animation: "scale-bloom 1.2s ease-out forwards" }}
          >
            <div className="text-8xl mb-4" style={{ filter: "drop-shadow(0 0 30px rgba(245,158,11,0.5))" }}>
              {detail.emoji || "🌸"}
            </div>
            <h2 
              className="font-black text-4xl mb-2"
              style={{ 
                background: "linear-gradient(135deg, #d97706, #f59e0b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              {detail.flowerName}
            </h2>
            <p className="text-amber-700 text-lg mt-1 font-medium">{detail.country}</p>
          </div>
        </div>
      )}
      
      {/* Badge Unlock Modal */}
      <BadgeUnlock 
        badge={currentBadge} 
        onClose={() => setCurrentBadge(null)} 
      />
      
      {/* Confetti Effect */}
      <ConfettiCanvas 
        trigger={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
      
      {/* Card Flip Particles */}
      <CardParticles
        trigger={particleTrigger}
        position={particlePosition}
      />

      <style jsx>{`
        @keyframes twinkle-star {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1.3); opacity: 0.6; }
          50% { transform: scale(1.5); opacity: 1; }
        }
        @keyframes flower-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bloom-fade {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; pointer-events: none; }
        }
        @keyframes scale-bloom {
          0% { transform: scale(0.5); opacity: 0; }
          30% { transform: scale(1.1); opacity: 1; }
          70% { transform: scale(1.0); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes fade-slide-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-hint {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -8px); }
        }
        @keyframes heart-beat {
          0% { transform: scale(1); }
          25% { transform: scale(1.3); }
          50% { transform: scale(1.1); }
          75% { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { getCompleteFlowerPath } from "@/lib/gameData";
import { getFlowerDetail } from "@/lib/flowerDetailsData";

const SPARKLES = Array.from({ length: 16 });

export default function FlowerDetailsReveal({ country, onComplete }) {
  const detail = getFlowerDetail(country.id);

  const [phase, setPhase] = useState("bloom"); // bloom → revealed → reading
  const [revealedCards, setRevealedCards] = useState([]);
  const [flippedIndex, setFlippedIndex] = useState(null);
  const [allRevealed, setAllRevealed] = useState(false);
  const [exitAnim, setExitAnim] = useState(false);
  const scrollRef = useRef(null);

  const params = detail?.parameters || [];

  useEffect(() => {
    // Bloom phase: show flower first
    const t1 = setTimeout(() => setPhase("revealed"), 1200);
    return () => clearTimeout(t1);
  }, []);

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
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{
        background: "linear-gradient(135deg, #0d0d1a 0%, #0a1628 30%, #0d1f0d 70%, #0d0d1a 100%)",
        opacity: exitAnim ? 0 : 1,
        transition: "opacity 0.6s ease",
      }}
    >
      {/* Animated starfield background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {SPARKLES.map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              left: `${(i * 6.25) % 100}%`,
              top: `${(i * 7.3) % 100}%`,
              background: i % 3 === 0 ? "#fbbf24" : i % 3 === 1 ? "#34d399" : "#a78bfa",
              opacity: 0.4,
              animation: `twinkle-star ${2 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              boxShadow: `0 0 4px currentColor`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div
        ref={scrollRef}
        className="relative z-10 max-w-4xl mx-auto px-4 py-8 pb-24"
        style={{
          opacity: phase === "bloom" ? 0 : 1,
          transform: phase === "bloom" ? "translateY(20px)" : "translateY(0)",
          transition: "all 0.8s ease-out",
        }}
      >
        {/* Header: flower image + name */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-10 mt-4">
          {/* Flower image */}
          <div
            className="relative flex-shrink-0"
            style={{
              width: "min(40vw, 200px)",
              height: "min(40vw, 200px)",
            }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)",
                animation: "pulse-glow 3s ease-in-out infinite",
                filter: "blur(20px)",
                transform: "scale(1.3)",
              }}
            />
            <img
              src={getCompleteFlowerPath(country.folder, "svg")}
              alt={country.flowerName}
              className="relative z-10 w-full h-full object-contain"
              style={{
                filter: "drop-shadow(0 0 20px rgba(251,191,36,0.5))",
                mixBlendMode: "screen",
                animation: "flower-float 5s ease-in-out infinite",
              }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>

          {/* Name block */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full border border-emerald-400/40 bg-emerald-400/10">
              <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">🌿 Flower Revealed</span>
            </div>
            <h1
              className="font-black text-white leading-none mb-2"
              style={{
                fontSize: "clamp(2rem, 6vw, 4rem)",
                textShadow: "0 0 40px rgba(251,191,36,0.4)",
                fontFamily: '"Cormorant Garamond", Georgia, serif',
              }}
            >
              {detail.flowerName}
            </h1>
            <p className="text-emerald-300 text-lg font-medium italic mb-1">{detail.scientificName}</p>
            <p className="text-gray-400 text-sm">
              <span className="text-yellow-400 font-semibold">{detail.country}</span> · {detail.botanicalFamily}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 md:justify-start justify-center">
              {detail.commonNames.split(", ").map((name, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70 border border-white/10">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section title */}
        <div className="text-center mb-8">
          <h2 className="text-white/40 text-xs font-bold tracking-[0.4em] uppercase mb-2">✦ Botanical Intelligence ✦</h2>
          <p className="text-white/60 text-sm max-w-xl mx-auto">
            Tap each card to reveal the secrets of this flower. 8 parameters — 8 stories.
          </p>
        </div>

        {/* Flip Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {params.map((param, i) => {
            const isVisible = revealedCards.includes(i);
            const isFlipped = flippedIndex === i;

            return (
              <div
                key={param.key}
                className="cursor-pointer select-none"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)",
                  transition: "all 0.5s cubic-bezier(0.34,1.4,0.64,1)",
                  perspective: "800px",
                }}
                onClick={() => {
                  playClick();
                  setFlippedIndex(flippedIndex === i ? null : i);
                }}
              >
                <div
                  className="relative w-full"
                  style={{
                    height: "160px",
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    transition: "transform 0.6s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                >
                  {/* Front — icon + label */}
                  <div
                    className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-2 border"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      background: isFlipped
                        ? "linear-gradient(135deg, #1a2540, #0d1f2d)"
                        : "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                      borderColor: "rgba(255,255,255,0.12)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ background: "rgba(255,255,255,0.08)" }}
                    >
                      {param.icon}
                    </div>
                    <span className="text-white/80 text-xs font-bold text-center px-2 leading-tight">
                      {param.label}
                    </span>
                    <span className="text-white/30 text-[10px] mt-1">Tap to reveal</span>

                    {/* Shimmer on hover */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.05), rgba(52,211,153,0.05))" }}
                    />
                  </div>

                  {/* Back — content */}
                  <div
                    className="absolute inset-0 rounded-2xl p-3 flex flex-col overflow-hidden border"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      background: "linear-gradient(135deg, #0f2027, #203a43, #1a1a2e)",
                      borderColor: "rgba(52,211,153,0.3)",
                      boxShadow: "0 4px 20px rgba(52,211,153,0.15), inset 0 1px 0 rgba(52,211,153,0.1)",
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-center gap-1.5 mb-2 flex-shrink-0">
                      <span className="text-base">{param.icon}</span>
                      <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">{param.label}</span>
                    </div>
                    {/* Scrollable text */}
                    <div className="overflow-y-auto flex-1" style={{ scrollbarWidth: "none" }}>
                      <p className="text-white/85 text-[10px] leading-relaxed">
                        {param.value}
                      </p>
                    </div>
                    {/* Close hint */}
                    <div className="text-white/30 text-[9px] text-center mt-1 flex-shrink-0">tap to close</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expanded detail panel when a card is flipped */}
        {flippedIndex !== null && (
          <div
            className="mb-6 rounded-2xl p-5 border"
            style={{
              background: "linear-gradient(135deg, rgba(52,211,153,0.08), rgba(16,185,129,0.04))",
              borderColor: "rgba(52,211,153,0.25)",
              animation: "fade-slide-in 0.4s ease-out",
            }}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl flex-shrink-0">{params[flippedIndex]?.icon}</span>
              <div>
                <h3 className="text-emerald-400 font-bold text-sm mb-2 uppercase tracking-wide">
                  {params[flippedIndex]?.label}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">{params[flippedIndex]?.value}</p>
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
                  style={{ background: "rgba(52,211,153,0.6)" }}
                />
              ))}
            </div>
            <p className="text-emerald-400/80 text-xs tracking-widest uppercase">
              {params.length} Parameters Revealed · Knowledge Unlocked
            </p>
          </div>
        )}

        {/* Nahiara Synthesis box (full-width) */}
        <div
          className="rounded-2xl p-5 border mb-8"
          style={{
            background: "linear-gradient(135deg, rgba(167,139,250,0.08), rgba(139,92,246,0.04))",
            borderColor: "rgba(167,139,250,0.25)",
            opacity: allRevealed ? 1 : 0,
            transform: allRevealed ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.7s ease-out 0.3s",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-purple-400 text-xl">🔮</span>
            <span className="text-purple-400 font-bold text-sm uppercase tracking-wider">AquaMundi Profile</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            <span className="text-yellow-400 font-bold">{detail.flowerName}</span> — {detail.scientificName} — is the national flower of{" "}
            <span className="text-emerald-400 font-bold">{detail.country}</span>. Its primary pollinator is the{" "}
            <span className="text-blue-400 font-semibold">{(detail.parameters.find(p => p.key === "relevantPollinator")?.value || "").split("—")[0].trim().replace(/^\w+\s\(/, "").replace(/\).*$/, "") || "local pollinators"}</span>.
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
            className="group relative px-10 py-4 font-bold text-base md:text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              boxShadow: "0 0 40px rgba(16,185,129,0.4), 0 8px 32px rgba(0,0,0,0.4)",
              color: "white",
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))" }}
            />
            <span className="relative z-10 flex items-center gap-3">
              🎯 Ready? Take the Quiz!
              <span className="text-emerald-200 text-sm">(5 questions)</span>
              →
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
            <div className="text-8xl mb-4" style={{ filter: "drop-shadow(0 0 40px rgba(251,191,36,0.8))" }}>
              {detail.emoji || "🌸"}
            </div>
            <h2 className="text-white font-black text-3xl" style={{ textShadow: "0 0 30px rgba(251,191,36,0.6)" }}>
              {detail.flowerName}
            </h2>
            <p className="text-emerald-400 text-lg mt-1">{detail.country}</p>
          </div>
        </div>
      )}

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
      `}</style>
    </div>
  );
}

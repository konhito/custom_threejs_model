"use client";

import { useState, useEffect, useRef } from "react";
import { getCompleteFlowerPath, getCompleteFlowerPathFallbacks } from "@/lib/gameData";
import { useTranslation } from "@/lib/useTranslation";

const PETALS = Array.from({ length: 18 });
const SPARKLES = Array.from({ length: 24 });

// Extract dominant vivid color from an image via canvas pixel sampling
function extractDominantColor(imgEl) {
  try {
    const canvas = document.createElement("canvas");
    const SIZE = 80; // downsample for speed
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imgEl, 0, 0, SIZE, SIZE);
    const data = ctx.getImageData(0, 0, SIZE, SIZE).data;

    // Bucket pixels by hue, skip near-white/black/grey
    const buckets = {};
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
      if (a < 100) continue; // skip transparent
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : (max - min) / max;
      const lightness = (max + min) / 510;
      if (saturation < 0.25 || lightness < 0.08 || lightness > 0.92) continue; // skip grey/white/black
      // quantize hue to 36 buckets (10° each)
      const h = Math.round(getHue(r, g, b) / 10) * 10;
      buckets[h] = (buckets[h] || 0) + 1;
    }

    const topHue = Object.entries(buckets).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (topHue == null) return null;

    const h = parseInt(topHue);
    return { h, rgb: hslToRgb(h, 0.75, 0.6) };
  } catch {
    return null;
  }
}

function getHue(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  if (d === 0) return 0;
  let h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) / 6
        : max === g ? ((b - r) / d + 2) / 6
        : ((r - g) / d + 4) / 6;
  return Math.round(h * 360);
}

function hslToRgb(h, s, l) {
  const a = s * Math.min(l, 1 - l);
  const f = (n) => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

export default function FlowerFormation({ country, onComplete }) {
  const [showFlower, setShowFlower] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [accentColor, setAccentColor] = useState({ h: 150, rgb: [52, 211, 153] }); // default emerald
  const imgRef = useRef(null);
  const { t } = useTranslation();

  const playSound = (type) => {
    if (typeof window !== "undefined") {
      import("@/lib/soundUtils").then((m) => {
        if (m.default.audioContext?.state === "suspended") m.default.audioContext.resume();
        m.default.play(type);
      });
    }
  };

  useEffect(() => {
    const loadImage = async () => {
      const svgFallbacks = getCompleteFlowerPathFallbacks(country.folder, "svg");
      const pngFallbacks = getCompleteFlowerPathFallbacks(country.folder, "png");

      const tryLoad = (paths) =>
        new Promise((resolve) => {
          let i = 0;
          const next = () => {
            if (i >= paths.length) { resolve(false); return; }
            const img = new window.Image();
            const t = setTimeout(() => { i++; next(); }, 3000);
            img.onload = () => { clearTimeout(t); resolve(true); };
            img.onerror = () => { clearTimeout(t); i++; next(); };
            img.src = paths[i];
          };
          next();
        });

      const loaded = (await tryLoad(svgFallbacks)) || (await tryLoad(pngFallbacks));
      if (loaded) playSound("flower-complete");

      setTimeout(() => { setShowFlower(true); if (loaded) playSound("flower-appear"); }, 300);
      setTimeout(() => setShowContent(true), 1000);
    };

    loadImage();
  }, [country]);

  const handleImageLoad = (e) => {
    const color = extractDominantColor(e.target);
    if (color) setAccentColor(color);
  };

  const handleContinue = () => {
    playSound("button-click");
    onComplete();
  };

  const [r, g, b] = accentColor.rgb;
  const rgb = `${r},${g},${b}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Deep dark background */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, rgba(${rgb},0.12) 0%, #0a0a0a 50%, #050505 100%)`,
        }}
      />

      {/* Ambient glow behind flower — uses accent color */}
      <div
        className="absolute"
        style={{
          width: "70vw",
          height: "70vw",
          maxWidth: "600px",
          maxHeight: "600px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -55%)",
          background: `radial-gradient(circle, rgba(${rgb},0.1) 0%, rgba(${rgb},0.04) 40%, transparent 70%)`,
          filter: "blur(50px)",
          animation: "ambient-pulse 4s ease-in-out infinite",
          opacity: showFlower ? 1 : 0,
          transition: "opacity 1.5s ease, background 1s ease",
        }}
      />

      {/* Falling petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PETALS.map((_, i) => (
          <div
            key={`petal-${i}`}
            className="absolute"
            style={{
              left: `${5 + (i * 5.5) % 90}%`,
              top: `-20px`,
              animation: `fall-petal ${6 + (i % 5)}s linear infinite`,
              animationDelay: `${(i * 0.4) % 8}s`,
              opacity: 0.5 + (i % 3) * 0.15,
              fontSize: `${10 + (i % 3) * 6}px`,
            }}
          >
            🌸
          </div>
        ))}
      </div>

      {/* Sparkle ring — uses accent color */}
      <div className="absolute inset-0 pointer-events-none">
        {SPARKLES.map((_, i) => {
          const angle = (i / SPARKLES.length) * Math.PI * 2;
          const dist = 150 + (i % 3) * 80;
          return (
            <div
              key={`sp-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left: `calc(50% + ${Math.cos(angle) * dist}px)`,
                top: `calc(45% + ${Math.sin(angle) * dist}px)`,
                background: `rgb(${rgb})`,
                opacity: showFlower ? 1 : 0,
                animation: `sparkle-drift ${2 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.12}s`,
                boxShadow: `0 0 4px rgba(${rgb},0.6)`,
                transition: "opacity 1s ease",
              }}
            />
          );
        })}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 gap-6" style={{ marginTop: "-2rem" }}>

        {/* Flower name */}
        <div
          className="text-center"
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.8s ease-out 0.1s",
          }}
        >
          <h2
            className="font-black leading-none mb-2"
            style={{
              fontSize: "clamp(1.8rem, 5vw, 3rem)",
              color: "#ffffff",
              textShadow: `0 0 20px rgba(${rgb},0.6), 0 2px 4px rgba(0,0,0,0.5)`,
            }}
          >
            {country.flowerName}
          </h2>
          <p
            className="text-lg font-medium"
            style={{ color: "#ffffff", letterSpacing: "0.15em" }}
          >
            {country.country}
          </p>
        </div>

        {/* Flower image — no box, just floating */}
        <div
          className="relative flex items-center justify-center"
          style={{
            width: "min(80vw, 440px)",
            height: "min(80vw, 440px)",
            opacity: showFlower ? 1 : 0,
            transform: showFlower ? "scale(1) translateY(0)" : "scale(0.7) translateY(30px)",
            transition: "all 1.2s cubic-bezier(0.34, 1.4, 0.64, 1)",
          }}
        >
          {/* Halo glow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(${rgb},0.12) 0%, rgba(${rgb},0.04) 50%, transparent 75%)`,
              animation: "halo-spin 8s linear infinite",
            }}
          />

          <img
            src={getCompleteFlowerPath(country.folder, "svg")}
            alt={`${country.flowerName} - ${country.country}`}
            className="relative z-10 w-full h-full"
            draggable={false}
            style={{
              objectFit: "contain",
              mixBlendMode: "screen",
              filter: `drop-shadow(0 0 20px rgba(${rgb},0.4))`,
              animation: showFlower ? "flower-float 5s ease-in-out infinite" : "none",
            }}
            onLoad={handleImageLoad}
            onError={(e) => {
              if (!e.target.dataset.errorCount) e.target.dataset.errorCount = "0";
              const count = parseInt(e.target.dataset.errorCount) + 1;
              e.target.dataset.errorCount = count.toString();
              if (count > 3) { e.target.style.display = "none"; return; }
              const fallbacks = getCompleteFlowerPathFallbacks(country.folder, e.target.src.includes(".png") ? "png" : "svg");
              const idx = fallbacks.findIndex((p) => e.target.src.includes(p.split("/").pop()));
              if (idx + 1 < fallbacks.length) {
                e.target.src = fallbacks[idx + 1];
              } else if (!e.target.src.includes(".png")) {
                e.target.src = getCompleteFlowerPathFallbacks(country.folder, "png")[0];
              } else {
                e.target.style.display = "none";
              }
            }}
          />
        </div>

        {/* Continue button */}
        <div
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease-out 0.3s",
          }}
        >
          <button
            onClick={handleContinue}
            className="group relative px-10 py-4 font-bold text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-105 focus:outline-none"
            style={{
              background: `linear-gradient(135deg, rgba(${rgb},0.12) 0%, rgba(${rgb},0.22) 100%)`,
              border: `1px solid rgba(${rgb},0.4)`,
              color: `rgb(${rgb})`,
              boxShadow: `0 0 30px rgba(${rgb},0.15), inset 0 1px 0 rgba(255,255,255,0.05)`,
              letterSpacing: "0.05em",
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `linear-gradient(135deg, rgba(${rgb},0.1), rgba(${rgb},0.2))` }}
            />
            <span className="relative z-10">{t("game.continueToNext")} →</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes ambient-pulse {
          0%, 100% { transform: translate(-50%, -55%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%, -55%) scale(1.1); opacity: 1; }
        }
        @keyframes halo-spin {
          from { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.05); }
          to { transform: rotate(360deg) scale(1); }
        }
        @keyframes flower-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes fall-petal {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.3; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes sparkle-drift {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { countriesData, getCompleteFlowerPath } from "@/lib/gameData";

const COORDS = {
  SCOTLAND:  { sx:  857, sy: 137 },
  GERMANY:   { sx:  942, sy: 158 },
  SPAIN:     { sx:  876, sy: 218 },
  PAKISTAN:  { sx: 1055, sy: 240 },
  TANZANIA:  { sx:  968, sy: 495 },
  NICARAGUA: { sx:  194, sy: 413 },
  JAMAICA:   { sx:  250, sy: 425 },
  PERU:      { sx:  217, sy: 572 },
};

const FLAGS = {
  PK: "🇵🇰", PE: "🇵🇪", TZ: "🇹🇿", NI: "🇳🇮",
  JM: "🇯🇲", ES: "🇪🇸", DE: "🇩🇪",
};

const toPercent = (sx, sy) => ({ x: sx / 20, y: sy / 10 });

export default function WorldMapGarden({ completedFlowers = [], currentFlower }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const allCompleted = [...new Set([...completedFlowers, currentFlower?.id])].filter(Boolean);

  const handleFlowerClick = (countryId) => {
    router.push(`/game?country=${countryId}`);
  };

  const journeyIds = allCompleted.filter(id => COORDS[id]);
  const lines = journeyIds.slice(1).map((id, i) => ({
    x1: COORDS[journeyIds[i]].sx, y1: COORDS[journeyIds[i]].sy,
    x2: COORDS[id].sx,            y2: COORDS[id].sy,
  }));

  return (
    <div className="relative w-full rounded-2xl select-none" style={{ aspectRatio: "2/1" }}>

      <iframe
        src="/cartoon-world-map.html"
        className="absolute inset-0 w-full h-full border-0 rounded-2xl"
        title="World Map"
        scrolling="no"
      />

      <svg className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 2000 1000" preserveAspectRatio="xMidYMid meet">
        {lines.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="rgba(251,191,36,0.7)" strokeWidth="3" strokeDasharray="10 7"
            strokeLinecap="round"/>
        ))}
        {allCompleted.filter(id => COORDS[id]).map(id => {
          const c = COORDS[id];
          const isCurrent = currentFlower?.id === id;
          return (
            <circle key={id} cx={c.sx} cy={c.sy}
              r={isCurrent ? 22 : 16} fill="none"
              stroke={isCurrent ? "rgba(251,191,36,0.4)" : "rgba(134,239,172,0.3)"}
              strokeWidth="3">
              <animate attributeName="r"
                values={isCurrent ? "12;24;12" : "8;18;8"}
                dur={isCurrent ? "1.4s" : "2.2s"} repeatCount="indefinite"/>
              <animate attributeName="opacity"
                values="0.9;0;0.9"
                dur={isCurrent ? "1.4s" : "2.2s"} repeatCount="indefinite"/>
            </circle>
          );
        })}
      </svg>

      {mounted && countriesData.map((country) => {
        const c = COORDS[country.id];
        if (!c) return null;
        const pct = toPercent(c.sx, c.sy);
        const isCompleted = allCompleted.includes(country.id);
        const isCurrent = currentFlower?.id === country.id;
        const isHovered = hovered === country.id;

        return (
          <div key={`pin-${country.id}`}
            className="absolute"
            style={{
              left: `${pct.x}%`, top: `${pct.y}%`,
              transform: "translate(-50%, -100%)",
              zIndex: isHovered ? 50 : isCurrent ? 40 : isCompleted ? 30 : 10,
            }}
            onMouseEnter={() => setHovered(country.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div 
              className="relative transition-all duration-200"
              style={{ 
                transform: isHovered ? "scale(1.3) translateY(-4px)" : "scale(1)",
                cursor: isCompleted ? "pointer" : "not-allowed"
              }}
              onClick={() => isCompleted && handleFlowerClick(country.id)}
            >

              {isCompleted && (
                <div className="absolute rounded-full animate-ping"
                  style={{
                    inset: isCurrent ? "-10px" : "-6px",
                    background: isCurrent ? "rgba(251,191,36,0.22)" : "rgba(134,239,172,0.18)",
                    animationDuration: isCurrent ? "1.3s" : "2s",
                  }}/>
              )}

              <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-1.5 rounded-full"
                style={{ background: "rgba(0,0,0,0.6)", filter: "blur(3px)" }}/>

              <div className="relative w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: isCompleted
                    ? isCurrent ? "linear-gradient(135deg,#fde68a,#f59e0b)"
                               : "linear-gradient(135deg,#86efac,#22c55e)"
                    : "linear-gradient(135deg,#1f2937,#111827)",
                  boxShadow: isCompleted
                    ? isCurrent ? "0 0 20px rgba(251,191,36,0.9),0 4px 10px rgba(0,0,0,0.6)"
                               : "0 0 14px rgba(134,239,172,0.7),0 4px 10px rgba(0,0,0,0.6)"
                    : "inset 0 1px 2px rgba(255,255,255,0.05),0 4px 10px rgba(0,0,0,0.6)",
                  border: isCompleted
                    ? isCurrent ? "2px solid rgba(253,230,138,0.9)"
                               : "2px solid rgba(134,239,172,0.8)"
                    : "2px solid rgba(55,65,81,0.7)",
                }}>
                <span className="text-xl leading-none select-none">
                  {isCompleted ? "🌸" : "🔒"}
                </span>
              </div>

              <div className="absolute left-1/2"
                style={{
                  top: "100%", marginLeft: -1.5,
                  width: 3, height: 10,
                  background: isCompleted ? (isCurrent ? "#f59e0b" : "#22c55e") : "#374151",
                  clipPath: "polygon(30% 0%,70% 0%,100% 100%,0% 100%)",
                }}/>
            </div>

            {isHovered && (
              <div className="absolute left-1/2 bottom-full w-52 rounded-2xl overflow-hidden pointer-events-none"
                style={{
                  marginBottom: 54,
                  transform: "translateX(-50%)",
                  background: "rgba(3,8,18,0.98)",
                  border: `1px solid ${isCompleted ? "rgba(134,239,172,0.14)" : "rgba(55,65,81,0.4)"}`,
                  boxShadow: "0 24px 60px rgba(0,0,0,0.95)",
                  backdropFilter: "blur(20px)",
                  animation: "wm-tip 0.12s ease-out",
                  zIndex: 60,
                }}>
                <div className="h-px w-full"
                  style={{ background: isCompleted
                    ? "linear-gradient(90deg,transparent,#22c55e 50%,transparent)"
                    : "linear-gradient(90deg,transparent,#374151 50%,transparent)" }}/>
                <div className="p-4 space-y-2 text-center">
                  <div className="text-3xl">{FLAGS[country.countryCode] || "🌍"}</div>
                  <p className="font-bold text-white leading-tight"
                    style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: "1.15rem" }}>
                    {country.country}
                  </p>
                  <p className="text-sm font-semibold"
                    style={{ color: isCompleted ? "#86efac" : "#6b7280" }}>
                    {country.flowerName}
                  </p>
                  <p className="text-xs italic" style={{ color: "#4b5563" }}>
                    {country.flowerScientificName}
                  </p>
                  {isCompleted && (
                    <div className="relative w-full rounded-xl overflow-hidden"
                      style={{ background: "rgba(16,32,20,0.7)", height: 72 }}>
                      <img
                        src={getCompleteFlowerPath(country.folder, "svg")}
                        alt={country.flowerName}
                        className="w-full h-full object-contain p-2"
                        style={{ mixBlendMode: "screen" }}
                        onError={e => { e.target.src = getCompleteFlowerPath(country.folder, "png"); e.target.onerror = null; }}
                      />
                    </div>
                  )}
                  <div className="pt-2 border-t border-white/5">
                    {isCompleted
                      ? <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#34d399" }}>Restored</span>
                      : <span className="text-xs tracking-widest uppercase" style={{ color: "#4b5563" }}>Not yet restored</span>
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="absolute top-3 right-3 text-right pointer-events-none rounded-xl px-3 py-2"
        style={{ zIndex: 20, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}>
        <p className="text-[7px] font-bold tracking-[0.28em] uppercase mb-0.5"
          style={{ color: "rgba(134,239,172,0.7)" }}>Garden Progress</p>
        <p className="font-bold text-white leading-none"
          style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: "1.9rem" }}>
          {allCompleted.length}
          <span className="text-gray-500 text-base ml-0.5">/{countriesData.length}</span>
        </p>
        <div className="flex items-center justify-end gap-3 mt-1.5">
          {[
            ["linear-gradient(135deg,#86efac,#22c55e)", "Restored"],
            ["linear-gradient(135deg,#1f2937,#111827)", "Locked"],
          ].map(([bg, label]) => (
            <div key={label} className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: bg }}/>
              <span className="text-[8px]" style={{ color: "#9ca3af" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes wm-tip {
          from { opacity: 0; transform: translateX(-50%) translateY(6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}

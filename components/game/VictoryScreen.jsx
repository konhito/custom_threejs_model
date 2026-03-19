"use client";
import WorldMapGarden from "@/components/game/WorldMapGarden";
import { useTranslation } from "@/lib/useTranslation";

const PARTICLES = Array.from({ length: 12 });

export default function VictoryScreen({ selectedCountry, completedFlowers, onRestart, onShare, isSharing }) {
  const { t } = useTranslation();

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: "linear-gradient(180deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)" }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <g opacity="0.15" stroke="#a5d6a7" strokeWidth="1" fill="none">
            {[
              "translate(8, 10) scale(0.6)", "translate(45, 8) scale(0.5) rotate(25)", "translate(82, 12) scale(0.55) rotate(-15)",
              "translate(12, 35) scale(0.45) rotate(-30)", "translate(50, 40) scale(0.5) rotate(40)", "translate(85, 38) scale(0.48) rotate(-25)",
              "translate(10, 65) scale(0.52) rotate(20)", "translate(48, 68) scale(0.46) rotate(-35)", "translate(88, 70) scale(0.5) rotate(30)",
              "translate(25, 20) scale(0.35) rotate(15)", "translate(70, 25) scale(0.38) rotate(-20)", "translate(30, 55) scale(0.32) rotate(45)",
              "translate(65, 58) scale(0.36) rotate(-40)",
            ].map((t, i) => (
              <path key={i} d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform={t} />
            ))}
          </g>
          <g opacity="0.12" stroke="#a5d6a7" strokeWidth="1.5" fill="none">
            <path d="M0 85 Q15 80 30 85 T60 85 T90 85" />
            <path d="M5 90 Q20 85 35 90 T65 90 T95 90" />
            <path d="M10 92 Q25 87 40 92 T70 92" />
          </g>
          <g opacity="0.2" fill="#f8bbd0">
            {[["15%","25%"],["35%","15%"],["75%","20%"],["20%","50%"],["60%","45%"],["85%","55%"],["25%","75%"],["55%","80%"],["80%","75%"]].map(([cx,cy],i) => (
              <circle key={i} cx={cx} cy={cy} r={i % 2 === 0 ? 2 : 1.5} />
            ))}
          </g>
        </svg>

        {PARTICLES.map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${4 + Math.random() * 6}px`,
              height: `${4 + Math.random() * 6}px`,
              background: "radial-gradient(circle, #fbbf24 0%, #f59e0b 50%, transparent 70%)",
              opacity: 0.6,
              animation: `float-up ${6 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
              boxShadow: "0 0 15px rgba(251, 191, 36, 0.5)",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">

        {/* Title */}
        <div className="text-center mb-6 md:mb-10" style={{ animation: "fade-in-down 0.8s ease-out" }}>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-emerald-600 mb-4">
            ✦ {t("game.restoredFlower")} ✦
          </p>
          <h1
            className="font-bold leading-[0.9] tracking-tight text-gray-900 mb-3"
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: "clamp(3rem, 10vw, 7rem)",
            }}
          >
            {selectedCountry.flowerName}
            <br />
            <span className="italic font-normal" style={{ fontSize: "0.65em", color: "#059669" }}>
              {t("game.of")} {selectedCountry.country}
            </span>
          </h1>
        </div>

        {/* World Map */}
        <div className="relative mb-8 md:mb-12" style={{ animation: "scale-in 0.8s ease-out 0.3s both" }}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-full h-full rounded-full"
              style={{ background: "radial-gradient(circle, rgba(251, 191, 36, 0.12) 0%, transparent 60%)", animation: "pulse-glow 3s ease-in-out infinite" }}
            />
          </div>
          <div
            className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-4 md:p-6 lg:p-8 border border-emerald-500/30"
            style={{ boxShadow: "0 0 80px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)" }}
          >
            <WorldMapGarden completedFlowers={completedFlowers} currentFlower={selectedCountry} />
            <div className="text-center mt-6 pt-6 border-t border-emerald-200/50">
              <div className="inline-block bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl px-6 py-4 border border-emerald-300/30">
                <h3 className="text-xl md:text-2xl font-bold text-emerald-800 mb-1">✨ {selectedCountry.flowerName} ✨</h3>
                <p className="text-sm md:text-base text-emerald-700/80 italic mb-2">{selectedCountry.flowerScientificName}</p>
                <p className="text-xs md:text-sm text-gray-600 max-w-2xl mx-auto">{selectedCountry.flowerDescription}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-3 md:gap-6 lg:gap-8 mb-8 md:mb-10" style={{ animation: "fade-in-up 0.8s ease-out 0.5s both" }}>
          {[
            { value: "6/6", labelKey: "game.petals", icon: "🌸" },
            { value: "100%", labelKey: "game.complete", icon: "✨" },
            { value: "⭐", labelKey: "game.perfect", icon: "" },
          ].map((stat, i) => (
            <div
              key={stat.labelKey}
              className="text-center px-5 py-4 md:px-7 md:py-5 rounded-2xl bg-gradient-to-b from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30"
              style={{ animation: `stat-pop 0.5s ease-out ${0.7 + i * 0.1}s both`, boxShadow: "0 8px 30px rgba(16, 185, 129, 0.2)" }}
            >
              <div className="text-2xl md:text-3xl font-black text-emerald-700 mb-1">{stat.icon || stat.value}</div>
              <div className="text-xs md:text-sm font-semibold text-emerald-600/80">{t(stat.labelKey)}</div>
            </div>
          ))}
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-8 md:mb-10" style={{ animation: "fade-in-up 0.8s ease-out 0.7s both" }}>
          <div
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-emerald-500/20 rounded-full px-6 py-3 border border-emerald-400/40"
            style={{ boxShadow: "0 0 30px rgba(16, 185, 129, 0.25)", animation: "badge-glow 2s ease-in-out infinite" }}
          >
            <span className="text-2xl">🏆</span>
            <span className="text-base md:text-lg font-bold text-emerald-700">{t("game.guardianOfNature")}</span>
            <span className="text-2xl">🏆</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-8" style={{ animation: "fade-in-up 0.8s ease-out 0.9s both" }}>
          <button
            onClick={onRestart}
            className="group relative w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 rounded-xl font-bold text-base md:text-lg transition-all duration-300 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", boxShadow: "0 10px 40px rgba(16, 185, 129, 0.3)" }}
          >
            <span className="flex items-center justify-center gap-3 text-white">
              <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-180 transition-transform duration-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              {t("game.playAgain")}
            </span>
          </button>

          <button
            onClick={onShare}
            className="group relative w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 rounded-xl font-bold text-base md:text-lg transition-all duration-300 hover:scale-105 border-2 border-emerald-500/50 bg-transparent hover:bg-emerald-500/10"
          >
            <span className="flex items-center justify-center gap-3 text-emerald-700">
              {isSharing ? (
                <>
                  <svg className="w-5 h-5 md:w-6 md:h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t("game.creating")}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  {t("game.shareVictory")}
                </>
              )}
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center" style={{ animation: "fade-in-up 0.8s ease-out 1.1s both" }}>
          <p className="text-base md:text-lg text-gray-600 italic mb-4">"{t("game.inspirationalQuote")}" 🌍</p>
          <div className="inline-flex items-center gap-2 text-gray-600 text-sm">
            <span>🔗</span>
            <span className="notranslate" translate="no">aquamundi.org/game</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-up { 0%, 100% { transform: translateY(0); opacity: 0.6; } 50% { transform: translateY(-30px) translateX(10px); opacity: 0.9; } }
        @keyframes golden-shimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes fade-in-down { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fade-in-up { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes scale-in { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes pulse-glow { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } }
        @keyframes stat-pop { from { transform: scale(0.5) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        @keyframes badge-glow { 0%, 100% { box-shadow: 0 0 30px rgba(251, 191, 36, 0.2); } 50% { box-shadow: 0 0 50px rgba(251, 191, 36, 0.4); } }
      `}</style>
    </div>
  );
}

"use client";

const SPARKLES = Array.from({ length: 60 });
const PETALS = Array.from({ length: 12 });
const RAYS = Array.from({ length: 24 });
const ORBIT_OUTER = Array.from({ length: 16 });
const ORBIT_INNER = Array.from({ length: 8 });
const SPARKLE_POINTS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

export default function GlobeAnimation() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(253, 224, 71, 0.4) 0%, rgba(255, 255, 255, 1) 50%, rgba(249, 250, 251, 1) 100%)",
          animation: "background-pulse 4s ease-in-out infinite",
        }}
      />

      {/* Light rays */}
      <div className="absolute inset-0 pointer-events-none">
        {RAYS.map((_, i) => (
          <div
            key={`ray-${i}`}
            className="absolute left-1/2 top-1/2 origin-bottom"
            style={{
              width: "3px",
              height: "200%",
              background: "linear-gradient(to top, rgba(251, 191, 36, 0.4) 0%, rgba(251, 191, 36, 0.2) 40%, transparent 80%)",
              transform: `translate(-50%, -100%) rotate(${i * 15}deg)`,
              animation: "ray-expand 3s ease-in-out infinite",
              animationDelay: `${i * 0.1}s`,
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>

      {/* Sparkles */}
      {SPARKLES.map((_, i) => {
        const angle = (i / 60) * Math.PI * 2;
        const distance = 100 + Math.random() * 300;
        const size = 2 + Math.random() * 6;
        return (
          <div
            key={`sparkle-${i}`}
            className="absolute"
            style={{
              left: `calc(50% + ${Math.cos(angle) * distance}px)`,
              top: `calc(50% + ${Math.sin(angle) * distance}px)`,
              width: `${size}px`,
              height: `${size}px`,
              animation: `sparkle-twinkle ${1.5 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            <div
              className="w-full h-full bg-yellow-400 rounded-full"
              style={{ boxShadow: `0 0 ${8 + Math.random() * 12}px rgba(250, 204, 21, ${0.6 + Math.random() * 0.4})`, filter: "blur(0.5px)" }}
            />
          </div>
        );
      })}

      {/* Floating petals */}
      {PETALS.map((_, i) => (
        <div
          key={`petal-float-${i}`}
          className="absolute text-2xl md:text-3xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float-petal ${8 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.3,
          }}
        >
          🌸
        </div>
      ))}

      {/* Globe */}
      <div
        className="relative z-10"
        style={{ animation: "scaleInBounce 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), float 3s ease-in-out infinite 1.2s" }}
      >
        {/* Ping rings */}
        {["-m-24 bg-yellow-400/30 2s", "-m-20 bg-yellow-300/25 2.3s", "-m-16 bg-yellow-200/20 2.6s"].map((cls, i) => {
          const [margin, bg, dur] = cls.split(" ");
          return (
            <div key={i} className={`absolute inset-0 ${margin}`}>
              <div className={`w-full h-full rounded-full ${bg} animate-ping`} style={{ animationDuration: dur, animationDelay: `${i * 0.2}s` }} />
            </div>
          );
        })}

        {/* Energy waves */}
        {["-m-12 border-yellow-400/40 0.5s", "-m-8 border-yellow-300/30 0.7s"].map((cls, i) => {
          const [margin, border, delay] = cls.split(" ");
          return (
            <div key={i} className={`absolute inset-0 ${margin}`}>
              <div className={`w-full h-full rounded-full border-4 ${border}`} style={{ animation: "energy-wave 2s ease-out infinite", animationDelay: delay }} />
            </div>
          );
        })}

        {/* Globe container */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80">
          <div className="absolute inset-0 rounded-full border-4 border-yellow-400/60 animate-spin" style={{ animationDuration: "10s", filter: "blur(1px)" }} />
          <div className="absolute inset-1 rounded-full border-3 border-yellow-300/40 animate-spin" style={{ animationDuration: "8s", animationDirection: "reverse", filter: "blur(0.5px)" }} />
          <div className="absolute inset-2 rounded-full border-2 border-yellow-200/30 animate-spin" style={{ animationDuration: "6s", filter: "blur(0.5px)" }} />

          <div
            className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-200 via-white via-yellow-50 to-yellow-100 shadow-2xl"
            style={{
              boxShadow: "0 0 80px rgba(250, 204, 21, 0.8), 0 0 120px rgba(251, 191, 36, 0.4), inset 0 0 80px rgba(255, 255, 255, 0.9)",
              animation: "globe-pulse 2.5s ease-in-out infinite, globe-glow 3s ease-in-out infinite",
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/60 to-transparent" style={{ animation: "rotate 5s linear infinite" }} />
            <div className="absolute top-1/4 left-1/4 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 blur-xl" />
            <div className="absolute bottom-1/3 right-1/3 w-12 h-12 md:w-16 md:h-16 rounded-full bg-yellow-100/60 blur-lg" />

            {SPARKLE_POINTS.map((angle, i) => (
              <div
                key={`sp-${i}`}
                className="absolute w-2.5 h-2.5 bg-yellow-300 rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `rotate(${angle}deg) translateY(-${45 + (i % 3) * 8}px)`,
                  animation: `sparkle-pulse ${1.2 + (i % 4) * 0.3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.15}s`,
                  boxShadow: "0 0 12px rgba(250, 204, 21, 1), 0 0 20px rgba(251, 191, 36, 0.6)",
                }}
              />
            ))}
          </div>

          {ORBIT_OUTER.map((_, i) => (
            <div
              key={`orbit-${i}`}
              className="absolute w-3 h-3 bg-yellow-400 rounded-full"
              style={{
                left: "50%",
                top: "50%",
                transformOrigin: "0 0",
                animation: `orbit ${5 + (i % 4)}s linear infinite`,
                animationDelay: `${-i * 0.25}s`,
                boxShadow: "0 0 12px rgba(250, 204, 21, 0.8), 0 0 20px rgba(251, 191, 36, 0.4)",
                filter: "blur(0.5px)",
              }}
            />
          ))}

          {ORBIT_INNER.map((_, i) => (
            <div
              key={`inner-orbit-${i}`}
              className="absolute w-2 h-2 bg-yellow-300 rounded-full"
              style={{
                left: "50%",
                top: "50%",
                transformOrigin: "0 0",
                animation: `orbit-inner ${3 + (i % 2)}s linear infinite`,
                animationDelay: `${-i * 0.2}s`,
                animationDirection: "reverse",
                boxShadow: "0 0 8px rgba(250, 204, 21, 0.6)",
              }}
            />
          ))}
        </div>

        {/* Label */}
        <div className="absolute -bottom-20 md:-bottom-24 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div style={{ animation: "text-appear 1s ease-out 0.8s both" }}>
            <p
              className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-yellow-600 via-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent"
              style={{ backgroundSize: "200% 100%", animation: "text-shimmer 3s ease-in-out infinite, text-glow 2s ease-in-out infinite" }}
            >
              ✨ Flower Restored! ✨
            </p>
            <p className="text-sm md:text-base text-yellow-600 mt-2 font-semibold opacity-80" style={{ animation: "fade-in-up 1s ease-out 1.2s both" }}>
              Added to your garden collection
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleInBounce { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.15); } 80% { transform: scale(0.95); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-25px); } }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbit { from { transform: rotate(0deg) translateX(120px) rotate(0deg); } to { transform: rotate(360deg) translateX(120px) rotate(-360deg); } }
        @keyframes orbit-inner { from { transform: rotate(0deg) translateX(80px) rotate(0deg); } to { transform: rotate(360deg) translateX(80px) rotate(-360deg); } }
        @keyframes globe-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes globe-glow { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.2); } }
        @keyframes sparkle-pulse { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.3); } }
        @keyframes sparkle-twinkle { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes ray-expand { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes energy-wave { 0% { opacity: 0.8; transform: scale(0.8); } 100% { opacity: 0; transform: scale(1.5); } }
        @keyframes background-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.95; } }
        @keyframes float-petal { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-30px) rotate(180deg); } }
        @keyframes text-appear { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes text-shimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes text-glow { 0%, 100% { filter: drop-shadow(0 2px 4px rgba(250, 204, 21, 0.3)); } 50% { filter: drop-shadow(0 4px 12px rgba(250, 204, 21, 0.6)); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 0.8; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

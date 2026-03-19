"use client";

import { useState, useEffect, useRef } from "react";
import { getFlowerDetail, getFlowerQuiz } from "@/lib/flowerDetailsData";
import { getCompleteFlowerPath } from "@/lib/gameData";

// Visual themes per question index
const QUESTION_THEMES = [
  { bg: "135deg, #0f2027 0%, #203a43 50%, #1a1a2e 100%", accent: "#fbbf24", ring: "rgba(251,191,36,0.3)" },
  { bg: "135deg, #1a0533 0%, #2d0a4e 50%, #0d1f3d 100%", accent: "#a78bfa", ring: "rgba(167,139,250,0.3)" },
  { bg: "135deg, #002b1a 0%, #003d28 50%, #001a0f 100%", accent: "#34d399", ring: "rgba(52,211,153,0.3)" },
  { bg: "135deg, #1f0011 0%, #3d0022 50%, #1a000f 100%", accent: "#f472b6", ring: "rgba(244,114,182,0.3)" },
  { bg: "135deg, #0d1f3d 0%, #1a3a5c 50%, #0d2b47 100%", accent: "#60a5fa", ring: "rgba(96,165,250,0.3)" },
];

// Particle emojis for confetti
const CONFETTI_EMOJIS = ["🌸", "✨", "🎉", "🌺", "⭐", "🌿", "🦋", "🌼"];

function ConfettiParticle({ style, emoji }) {
  return (
    <div className="absolute pointer-events-none select-none" style={{ ...style, animation: `confetti-fall 1.5s ease-out forwards` }}>
      {emoji}
    </div>
  );
}

export default function PollinatorQuiz({ country, onComplete }) {
  const detail = getFlowerDetail(country.id);
  const questions = getFlowerQuiz(country.id);
  const theme = QUESTION_THEMES;

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [phase, setPhase] = useState("intro"); // intro → question → result
  const [transitionOut, setTransitionOut] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [exitAnim, setExitAnim] = useState(false);
  const [selectedAnimation, setSelectedAnimation] = useState(null); // "correct" | "wrong"
  const confettiTimeout = useRef(null);

  const q = questions[currentQ];
  const currentTheme = theme[currentQ % theme.length];
  const totalQ = questions.length;
  const isLastQ = currentQ === totalQ - 1;

  const playSound = (type) => {
    if (typeof window !== "undefined") {
      import("@/lib/soundUtils").then((m) => {
        if (m.default.audioContext?.state === "suspended") m.default.audioContext.resume();
        m.default.play(type);
      });
    }
  };

  const spawnConfetti = () => {
    const particles = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
      style: {
        left: `${10 + Math.random() * 80}%`,
        top: `${10 + Math.random() * 30}%`,
        fontSize: `${14 + Math.random() * 12}px`,
        animationDelay: `${Math.random() * 0.4}s`,
        zIndex: 100,
      },
    }));
    setConfetti(particles);
    clearTimeout(confettiTimeout.current);
    confettiTimeout.current = setTimeout(() => setConfetti([]), 2000);
  };

  const handleSelect = (optionIndex) => {
    if (revealed) return;
    const isCorrect = optionIndex === q.answer;
    setSelectedOption(optionIndex);
    setRevealed(true);
    setSelectedAnimation(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      playSound("petal");
      spawnConfetti();
      setScore((s) => s + 1);
    } else {
      playSound("minion");
    }

    setAnswers((prev) => [...prev, { question: q.q, selected: optionIndex, correct: q.answer, isCorrect }]);
  };

  const handleNext = () => {
    setTransitionOut(true);
    setTimeout(() => {
      setSelectedOption(null);
      setRevealed(false);
      setSelectedAnimation(null);
      setTransitionOut(false);
      if (isLastQ) {
        setPhase("result");
      } else {
        setCurrentQ((c) => c + 1);
      }
    }, 400);
  };

  const handleFinish = () => {
    setExitAnim(true);
    playSound("flower-complete");
    setTimeout(() => onComplete(score, totalQ), 700);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
        <div className="text-center text-white">
          <p className="text-xl mb-6">No quiz available for this flower yet!</p>
          <button onClick={() => onComplete(0, 0)} className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold">
            Continue →
          </button>
        </div>
      </div>
    );
  }

  // ─── RESULT SCREEN ───────────────────────────────────────────────────────────
  if (phase === "result") {
    const pct = Math.round((score / totalQ) * 100);
    const perfect = score === totalQ;
    const great = score >= Math.ceil(totalQ * 0.6);

    return (
      <div
        className="fixed inset-0 z-50 overflow-y-auto flex flex-col items-center justify-center px-4 py-8"
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #0d2b1a 50%, #0a1628 100%)",
          opacity: exitAnim ? 0 : 1,
          transition: "opacity 0.7s ease",
        }}
      >
        {/* Score circle */}
        <div className="relative mb-8" style={{ animation: "pop-in 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
          <div
            className="w-36 h-36 rounded-full flex flex-col items-center justify-center relative"
            style={{
              background: perfect ? "linear-gradient(135deg, #fbbf24, #f59e0b)" : great ? "linear-gradient(135deg, #34d399, #10b981)" : "linear-gradient(135deg, #60a5fa, #3b82f6)",
              boxShadow: `0 0 60px ${perfect ? "rgba(251,191,36,0.5)" : great ? "rgba(52,211,153,0.5)" : "rgba(96,165,250,0.5)"}`,
            }}
          >
            <span className="text-4xl font-black text-white">{score}/{totalQ}</span>
            <span className="text-white/80 text-sm font-bold">{pct}%</span>
          </div>
          {perfect && (
            <div className="absolute -top-4 -right-4 text-3xl" style={{ animation: "bounce-spin 1s ease-in-out infinite" }}>🏆</div>
          )}
        </div>

        {/* Title */}
        <h2
          className="text-white font-black text-center mb-2"
          style={{
            fontSize: "clamp(1.8rem, 5vw, 3rem)",
            textShadow: "0 0 30px rgba(255,255,255,0.3)",
            animation: "fade-up 0.5s ease-out 0.3s both",
          }}
        >
          {perfect ? "🌟 Perfect Champion!" : great ? "🌸 Flower Guardian!" : "🌱 Keep Learning!"}
        </h2>
        <p className="text-gray-400 text-sm text-center mb-8" style={{ animation: "fade-up 0.5s ease-out 0.4s both" }}>
          {perfect
            ? "You know everything about this amazing flower!"
            : great
              ? `You scored ${score} out of ${totalQ} — great knowledge!`
              : `You got ${score} out of ${totalQ}. Explore the flower details to learn more!`}
        </p>

        {/* Answer review */}
        <div className="w-full max-w-lg mb-8 space-y-3" style={{ animation: "fade-up 0.5s ease-out 0.5s both" }}>
          {answers.map((a, i) => (
            <div
              key={i}
              className="rounded-xl p-3 border flex items-start gap-3"
              style={{
                background: a.isCorrect ? "rgba(52,211,153,0.08)" : "rgba(239,68,68,0.08)",
                borderColor: a.isCorrect ? "rgba(52,211,153,0.3)" : "rgba(239,68,68,0.3)",
              }}
            >
              <span className="text-lg flex-shrink-0">{a.isCorrect ? "✅" : "❌"}</span>
              <div className="min-w-0">
                <p className="text-white/80 text-xs leading-snug line-clamp-2">{a.question}</p>
                <p className="text-xs mt-1" style={{ color: a.isCorrect ? "#34d399" : "#f87171" }}>
                  {questions[i]?.options[a.correct]}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleFinish}
          className="group relative px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 text-white"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            boxShadow: "0 0 40px rgba(16,185,129,0.4)",
            animation: "fade-up 0.5s ease-out 0.8s both",
          }}
        >
          <span className="flex items-center gap-3">
            🌍 See Your Victory Garden
            →
          </span>
        </button>

        <style jsx>{`
          @keyframes pop-in { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          @keyframes bounce-spin { 0%, 100% { transform: rotate(-10deg) scale(1); } 50% { transform: rotate(10deg) scale(1.1); } }
          @keyframes fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    );
  }

  // ─── INTRO SCREEN ────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
        style={{ background: "linear-gradient(135deg, #0f2027 0%, #1a1a2e 100%)" }}
      >
        <div className="text-center max-w-sm" style={{ animation: "pop-in 0.6s cubic-bezier(0.34,1.56,0.64,1) both" }}>
          <div className="text-7xl mb-6" style={{ animation: "flower-float 3s ease-in-out infinite" }}>
            {detail?.emoji || "🌸"}
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 mb-4">
            <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">Knowledge Quiz</span>
          </div>
          <h1 className="text-white font-black text-3xl mb-3" style={{ textShadow: "0 0 30px rgba(251,191,36,0.3)" }}>
            {detail?.flowerName || country.flowerName} Quiz
          </h1>
          <p className="text-gray-400 text-sm mb-2">
            {totalQ} questions about your flower's secrets!
          </p>
          <p className="text-white/40 text-xs mb-8">
            Pollinators · Country · Conservation · Culture
          </p>

          {/* Question count badges */}
          <div className="flex justify-center gap-2 mb-8">
            {questions.map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 text-xs font-bold"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          <button
            onClick={() => setPhase("question")}
            className="group px-10 py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              boxShadow: "0 0 40px rgba(251,191,36,0.4)",
            }}
          >
            <span className="flex items-center gap-2"> Start Quiz →</span>
          </button>
        </div>

        <style jsx>{`
          @keyframes pop-in { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          @keyframes flower-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        `}</style>
      </div>
    );
  }

  // ─── QUESTION SCREEN ──────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      style={{
        background: `linear-gradient(${currentTheme.bg})`,
        transition: "background 0.8s ease",
        opacity: exitAnim ? 0 : 1,
      }}
    >
      {/* Confetti layer */}
      {confetti.map((p) => (
        <ConfettiParticle key={p.id} emoji={p.emoji} style={p.style} />
      ))}

      {/* Background decorative rings */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {[1, 2, 3].map((ring) => (
          <div
            key={ring}
            className="absolute rounded-full border"
            style={{
              width: `${ring * 30}vw`,
              height: `${ring * 30}vw`,
              borderColor: currentTheme.ring,
              opacity: 0.15 / ring,
              animation: `ring-pulse ${3 + ring}s ease-in-out infinite`,
              animationDelay: `${ring * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div
        className="relative z-10 flex flex-col h-full max-w-xl mx-auto px-4 py-6"
        style={{
          opacity: transitionOut ? 0 : 1,
          transform: transitionOut ? "translateX(40px)" : "translateX(0)",
          transition: "all 0.4s ease",
        }}
      >
        {/* Top bar: progress + score */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          {/* Progress bar */}
          <div className="flex-1 mr-4">
            <div className="flex gap-1.5 mb-1.5">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    background: i < currentQ ? currentTheme.accent : i === currentQ ? `${currentTheme.accent}80` : "rgba(255,255,255,0.15)",
                  }}
                />
              ))}
            </div>
            <p className="text-white/40 text-xs">
              Question {currentQ + 1} of {totalQ}
            </p>
          </div>

          {/* Score badge */}
          <div
            className="flex-shrink-0 px-3 py-1.5 rounded-full border font-bold text-sm"
            style={{ borderColor: currentTheme.ring, color: currentTheme.accent, background: "rgba(255,255,255,0.05)" }}
          >
            ⭐ {score}
          </div>
        </div>

        {/* Question card */}
        <div
          className="flex-shrink-0 rounded-3xl p-5 md:p-6 mb-5 border"
          style={{
            background: "rgba(255,255,255,0.05)",
            borderColor: `${currentTheme.accent}30`,
            boxShadow: `0 0 40px ${currentTheme.ring}, inset 0 1px 0 rgba(255,255,255,0.05)`,
            animation: "card-appear 0.5s cubic-bezier(0.34,1.2,0.64,1) both",
          }}
        >
          {/* Q number badge */}
          <div
            className="inline-flex items-center gap-1.5 mb-3 px-2 py-1 rounded-full text-xs font-bold"
            style={{ background: `${currentTheme.accent}20`, color: currentTheme.accent }}
          >
            <span>Q{currentQ + 1}</span>
            <span>·</span>
            <span>{detail?.emoji || "🌸"}</span>
            <span>{detail?.flowerName}</span>
          </div>

          <h2
            className="text-white font-bold leading-snug"
            style={{ fontSize: "clamp(1rem, 3vw, 1.3rem)" }}
          >
            {q.q}
          </h2>
        </div>

        {/* Options */}
        <div className="flex-1 flex flex-col justify-center gap-3">
          {q.options.map((option, i) => {
            const isSelected = selectedOption === i;
            const isCorrect = i === q.answer;
            const isWrong = isSelected && !isCorrect;

            let bgStyle = "rgba(255,255,255,0.05)";
            let borderStyle = "rgba(255,255,255,0.12)";
            let textStyle = "rgba(255,255,255,0.85)";
            let iconEl = null;

            if (revealed) {
              if (isCorrect) {
                bgStyle = "rgba(52,211,153,0.15)";
                borderStyle = "rgba(52,211,153,0.5)";
                textStyle = "#34d399";
                iconEl = "✅";
              } else if (isWrong) {
                bgStyle = "rgba(239,68,68,0.15)";
                borderStyle = "rgba(239,68,68,0.5)";
                textStyle = "#f87171";
                iconEl = "❌";
              } else {
                bgStyle = "rgba(255,255,255,0.02)";
                borderStyle = "rgba(255,255,255,0.06)";
                textStyle = "rgba(255,255,255,0.35)";
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={revealed}
                className="w-full text-left rounded-2xl px-4 py-3.5 border transition-all duration-300 flex items-center gap-3 group"
                style={{
                  background: bgStyle,
                  borderColor: borderStyle,
                  color: textStyle,
                  transform: isSelected && selectedAnimation === "correct" && isCorrect ? "scale(1.02)" : "scale(1)",
                  boxShadow: isCorrect && revealed
                    ? "0 0 20px rgba(52,211,153,0.3)"
                    : isWrong && revealed
                      ? "0 0 20px rgba(239,68,68,0.2)"
                      : "none",
                  animation: isSelected && revealed ? `${isCorrect ? "correct-bounce" : "wrong-shake"} 0.5s ease-out` : "none",
                  cursor: revealed ? "default" : "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Option letter */}
                <span
                  className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black"
                  style={{
                    background: revealed && isCorrect ? "rgba(52,211,153,0.3)" : revealed && isWrong ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)",
                  }}
                >
                  {iconEl || String.fromCharCode(65 + i)}
                </span>

                <span className="flex-1 text-sm md:text-base font-medium leading-snug">{option}</span>

                {/* Hover arrow */}
                {!revealed && (
                  <span className="text-white/0 group-hover:text-white/40 transition-colors duration-200 text-sm flex-shrink-0">→</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation panel (after answer) */}
        {revealed && (
          <div
            className="flex-shrink-0 mt-4 rounded-2xl p-4 border"
            style={{
              background: selectedOption === q.answer ? "rgba(52,211,153,0.08)" : "rgba(239,68,68,0.08)",
              borderColor: selectedOption === q.answer ? "rgba(52,211,153,0.3)" : "rgba(239,68,68,0.3)",
              animation: "slide-up 0.4s ease-out both",
            }}
          >
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: selectedOption === q.answer ? "#34d399" : "#f87171" }}>
              {selectedOption === q.answer ? "🌟 Correct!" : "💡 Did you know?"}
            </p>
            <p className="text-white/75 text-sm leading-relaxed">{q.explanation}</p>
          </div>
        )}

        {/* Next button */}
        {revealed && (
          <button
            onClick={handleNext}
            className="flex-shrink-0 mt-4 w-full py-3.5 rounded-2xl font-bold text-white text-base transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.accent} 0%, ${currentTheme.accent}cc 100%)`,
              boxShadow: `0 0 30px ${currentTheme.ring}`,
              animation: "slide-up 0.4s ease-out 0.1s both",
              color: "#0a0a0a",
            }}
          >
            {isLastQ ? " See My Score →" : `Next Question (${currentQ + 2}/${totalQ}) →`}
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes card-appear {
          from { transform: translateY(-20px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes correct-bounce {
          0%, 100% { transform: scale(1); }
          30% { transform: scale(1.04); }
          60% { transform: scale(1.01); }
        }
        @keyframes wrong-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes ring-pulse {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.05); opacity: 0.25; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg) scale(0.5); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(120px) rotate(${Math.random() > 0.5 ? "" : "-"}360deg) scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

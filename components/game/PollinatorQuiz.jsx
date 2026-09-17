"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getFlowerDetail, getFlowerQuiz } from "@/lib/flowerDetailsData";
import { getCompleteFlowerPath } from "@/lib/gameData";

const QUESTION_THEMES = Array.from({ length: 5 }, () => ({ bg: "#fff8e8", accent: "#194638", ring: "rgba(25,70,56,0.12)", border: "#bfd9bd" }));

// Particle emojis for confetti
const CONFETTI_EMOJIS = ["🌸", "✨", "🎉", "🌺", "⭐", "🌿", "🦋", "🌼"];
const QUESTIONS_PER_DECK = 5;
const TOTAL_DECKS = 3;

const ConfettiParticle = memo(function ConfettiParticle({ style, emoji }) {
  return (
    <div className="absolute pointer-events-none select-none" style={{ ...style, animation: `confetti-fall 1.5s ease-out forwards` }}>
      {emoji}
    </div>
  );
});

export default function PollinatorQuiz({ country, onComplete }) {
  const detail = useMemo(() => getFlowerDetail(country.id), [country.id]);
  const allQuestions = useMemo(() => getFlowerQuiz(country.id), [country.id]);
  const theme = QUESTION_THEMES;

  const [currentDeck, setCurrentDeck] = useState(0); // 0, 1, or 2
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
  const soundUtilsRef = useRef(null);
  const soundImportRef = useRef(null);

  // Get questions for current deck (5 questions)
  const startIdx = currentDeck * QUESTIONS_PER_DECK;
  const endIdx = startIdx + QUESTIONS_PER_DECK;
  const questions = useMemo(() => allQuestions.slice(startIdx, endIdx), [allQuestions, startIdx, endIdx]);

  const q = questions[currentQ];
  const currentTheme = theme[currentQ % theme.length];
  const totalQ = questions.length;
  const isLastQ = currentQ === totalQ - 1;

  const ensureSoundUtils = useCallback(async () => {
    if (soundUtilsRef.current) return soundUtilsRef.current;
    if (!soundImportRef.current) {
      soundImportRef.current = import("@/lib/soundUtils").then((m) => {
        soundUtilsRef.current = m.default;
        return m.default;
      });
    }
    return soundImportRef.current;
  }, []);

  useEffect(() => {
    ensureSoundUtils();
    return () => {
      clearTimeout(confettiTimeout.current);
    };
  }, [ensureSoundUtils]);

  const playSound = useCallback((type) => {
    ensureSoundUtils().then((soundUtils) => {
      if (soundUtils.audioContext?.state === "suspended") soundUtils.audioContext.resume();
      soundUtils.play(type);
    });
  }, [ensureSoundUtils]);

  const spawnConfetti = useCallback(() => {
    const particles = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
      style: {
        left: `${10 + Math.random() * 80}%`,
        top: `${10 + Math.random() * 30}%`,
        fontSize: `${14 + Math.random() * 12}px`,
        animationDelay: `${Math.random() * 0.4}s`,
        "--confetti-rotation": `${Math.random() > 0.5 ? "" : "-"}360deg`,
        zIndex: 100,
      },
    }));
    setConfetti(particles);
    clearTimeout(confettiTimeout.current);
    confettiTimeout.current = setTimeout(() => setConfetti([]), 2000);
  }, []);

  const handleSelect = useCallback((optionIndex) => {
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
  }, [playSound, q.answer, q.q, revealed, spawnConfetti]);

  const handleNext = useCallback(() => {
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
  }, [isLastQ]);

  const handleFinish = useCallback(() => {
    const isPerfect = score === totalQ;
    setExitAnim(true);
    playSound("flower-complete");
    setTimeout(() => onComplete(score, totalQ, isPerfect), 700);
  }, [onComplete, playSound, score, totalQ]);

  const handleRetry = useCallback(() => {
    // Move to next deck (cycle through 0 → 1 → 2 → 0)
    const nextDeck = (currentDeck + 1) % TOTAL_DECKS;
    setCurrentDeck(nextDeck);

    // Reset quiz state for retry
    setCurrentQ(0);
    setSelectedOption(null);
    setRevealed(false);
    setScore(0);
    setAnswers([]);
    setPhase("intro");
    setTransitionOut(false);
    setExitAnim(false);
    playSound("flip");
  }, [currentDeck, playSound]);

  if (!questions || questions.length === 0 || !allQuestions || allQuestions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
        <div className="text-center text-white">
          <p className="text-xl mb-6">No quiz available for this flower yet!</p>
          <button onClick={() => onComplete(0, 0, false)} className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold">
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
        data-lenis-prevent
        className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
        style={{
          background: "#fff8e8",
          opacity: exitAnim ? 0 : 1,
          transition: "opacity 0.7s ease",
        }}
      >
        <div className="w-full max-w-5xl">
          {/* Compact Header Card */}
          <div 
            className="relative bg-white rounded-2xl p-4 md:p-6 mb-4 border-2"
            style={{ 
              borderColor: "#bfd9bd",
              boxShadow: "0 5px 0 #d7e5c5",
              animation: "slide-down 0.6s cubic-bezier(0.34,1.56,0.64,1) both"
            }}
          >
            {/* Golden accent line for perfect score */}
            {perfect && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#194638] rounded-t-2xl" />
            )}
            
            <div className="flex items-center gap-4 md:gap-6">
              {/* Compact Score Circle */}
              <div className="relative flex-shrink-0">
                <svg className="w-20 h-20 md:w-24 md:h-24 transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="none"
                    stroke="#f5f5f4"
                    strokeWidth="5"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="none"
                    stroke="#194638"
                    strokeWidth="5"
                    strokeDasharray={`${(pct / 100) * 264} 264`}
                    strokeLinecap="round"
                    style={{
                      transition: "stroke-dasharray 1.5s ease-out",
                    }}
                  />
                </svg>
                {/* Score text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl md:text-2xl font-black" style={{ 
                    color: "#194638",
                  }}>
                    {pct}%
                  </span>
                  <span className="text-[10px] text-gray-400 font-semibold">{score}/{totalQ}</span>
                </div>
                {/* Trophy for perfect score */}
                {perfect && (
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-[#d4af37] shadow-md">
                    <span className="text-sm">🏆</span>
                  </div>
                )}
              </div>

              {/* Title Section */}
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2 border-2" style={{
                  borderColor: "#bfd9bd",
                  background: "#dcecc8",
                }}>
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{
                    color: "#194638",
                  }}>
                    {perfect ? "Perfect" : great ? "Well Done" : "Keep Practicing"}
                  </span>
                </div>
                <h2
                  className="font-['Fredoka_One'] mb-1.5 leading-tight"
                  style={{
                    fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                    color: "#194638",
                  }}
                >
                  {perfect ? "Outstanding! 🌟" : great ? "Excellent! 🌸" : "Keep Learning! 🌱"}
                </h2>
                <p className="text-gray-600 text-xs md:text-sm leading-tight">
                  {perfect
                    ? "Complete mastery of this flower's knowledge."
                    : great
                      ? `${score} of ${totalQ} correct. Impressive!`
                      : `${score} correct. Review details to improve.`}
                </p>
              </div>
            </div>
          </div>

          {/* Compact Answer Grid */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-4" 
            style={{ animation: "fade-up 0.5s ease-out 0.2s both" }}
          >
            {answers.map((a, i) => (
              <div
                key={i}
                className="relative bg-white rounded-xl p-3 transition-all duration-300 hover:shadow-md border-2"
                style={{
                  borderColor: a.isCorrect ? "#a9cbac" : "#e5e7eb",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                }}
              >
                <div className="flex items-start gap-2.5">
                  {/* Compact Icon */}
                  <div 
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm border-2"
                    style={{
                      background: a.isCorrect ? "#fef3c7" : "#fef2f2",
                      borderColor: a.isCorrect ? "#d4af37" : "#fca5a5",
                      color: a.isCorrect ? "#92400e" : "#991b1b",
                    }}
                  >
                    {a.isCorrect ? "✓" : "✗"}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-xs font-semibold leading-tight mb-1.5">
                      {a.question}
                    </p>
                    <div 
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold border"
                      style={{
                        background: a.isCorrect ? "#fef3c7" : "#fef2f2",
                        borderColor: a.isCorrect ? "#f59e0b" : "#fca5a5",
                        color: a.isCorrect ? "#92400e" : "#991b1b",
                      }}
                    >
                      <span>{questions[i]?.options[a.correct]}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Compact CTA Button */}
          <div className="space-y-3">
            <button
              onClick={handleFinish}
              className="group relative w-full overflow-hidden rounded-xl px-6 py-3.5 transition-all duration-300 hover:shadow-lg border-2"
              style={{
                  background: "#194638",
                borderColor: "#194638",
                boxShadow: "0 5px 0 #0c3027",
                animation: "fade-up 0.5s ease-out 0.4s both"
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl">🌍</span>
                <span className="text-white font-black text-sm md:text-base tracking-wide">Unlock Flower in Garden</span>
                <span className="text-white text-lg transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            </button>
            {!perfect && (
              <button
                onClick={handleRetry}
                className="group relative w-full overflow-hidden rounded-xl px-6 py-3.5 transition-all duration-300 border-2"
                style={{
                  background: "#fff8e8",
                  borderColor: "#194638",
                  animation: "fade-up 0.5s ease-out 0.4s both"
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[#194638] font-bold text-sm md:text-base tracking-wide">Try again for a higher score</span>
                </div>
              </button>
            )}
          </div>
        </div>

        <style jsx>{`
          @keyframes slide-down { 
            from { transform: translateY(-30px); opacity: 0; } 
            to { transform: translateY(0); opacity: 1; } 
          }
          @keyframes fade-up { 
            from { opacity: 0; transform: translateY(20px); } 
            to { opacity: 1; transform: translateY(0); } 
          }
        `}</style>
      </div>
    );
  }

  // ─── INTRO SCREEN ────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div
        data-lenis-prevent
        className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
        style={{ background: "#fff8e8" }}
      >
        <div className="text-center max-w-md" style={{ animation: "pop-in 0.6s cubic-bezier(0.34,1.56,0.64,1) both" }}>
          <div className="mx-auto mb-6 flex h-40 w-40 items-center justify-center rounded-full bg-[#dcecc8] shadow-[0_8px_0_#c4d8af]">
            <img src={getCompleteFlowerPath(country.folder, "svg")} alt="" className="h-32 w-32 object-contain" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#dcecc8] mb-4">
            <span className="text-[#194638] text-xs font-bold tracking-widest uppercase">Knowledge Quiz</span>
          </div>
          <h1 className="font-['Fredoka_One'] text-4xl mb-3" style={{ color: "#194638" }}>
            {detail?.flowerName || country.flowerName} Quiz
          </h1>
          <p className="text-gray-600 text-sm mb-2">
            {totalQ} questions about your flower's secrets!
          </p>
          <p className="text-gray-500 text-xs mb-8">
            Pollinators · Country · Conservation · Culture
          </p>

          {/* Question count badges */}
          <div className="flex justify-center gap-2 mb-8">
            {questions.map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-[#bfd9bd] flex items-center justify-center text-[#194638] text-xs font-bold"
                style={{ background: "#fff" }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          <button
            onClick={() => setPhase("question")}
            className="group px-10 py-4 rounded-full font-bold text-white text-lg transition-all duration-300 hover:scale-105"
            style={{
              background: "#194638",
              boxShadow: "0 5px 0 #0c3027",
            }}
          >
            <span className="flex items-center gap-2">Start Quiz →</span>
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
      data-lenis-prevent
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{
        background: currentTheme.bg,
        transition: "background 0.8s ease",
        opacity: exitAnim ? 0 : 1,
      }}
    >
      {/* Confetti layer */}
      {confetti.map((p) => (
        <ConfettiParticle key={p.id} emoji={p.emoji} style={p.style} />
      ))}

      {/* Main content */}
      <div
        className="relative z-10 flex min-h-full flex-col justify-center max-w-3xl mx-auto px-4 py-8 md:py-12"
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
                    background: i < currentQ ? currentTheme.accent : i === currentQ ? `${currentTheme.accent}80` : "rgba(217,119,6,0.2)",
                  }}
                />
              ))}
            </div>
            <p className="text-gray-600 text-xs font-medium">
              Question {currentQ + 1} of {totalQ}
            </p>
          </div>

          {/* Score badge */}
          <div
            className="flex-shrink-0 px-3 py-1.5 rounded-full border-2 font-bold text-sm"
            style={{ borderColor: currentTheme.border, color: currentTheme.accent, background: "#fff" }}
          >
            ⭐ {score}
          </div>
        </div>

        {/* Question card */}
        <div
          className="flex-shrink-0 rounded-3xl p-5 md:p-6 mb-5 border-2"
          style={{
            background: "#fff",
            borderColor: currentTheme.border,
            boxShadow: `0 8px 24px ${currentTheme.ring}`,
            animation: "card-appear 0.5s cubic-bezier(0.34,1.2,0.64,1) both",
          }}
        >
          {/* Q number badge */}
          <div
            className="inline-flex items-center gap-1.5 mb-3 px-2 py-1 rounded-full text-xs font-bold border"
            style={{ background: "#fef3c7", color: currentTheme.accent, borderColor: currentTheme.border }}
          >
            <span>Q{currentQ + 1}</span>
            <span>·</span>
            <span>{detail?.emoji || "🌸"}</span>
            <span>{detail?.flowerName}</span>
          </div>

          <h2
            className="font-bold leading-snug text-gray-900"
            style={{ fontSize: "clamp(1.35rem, 3vw, 1.9rem)" }}
          >
            {q.q}
          </h2>
        </div>

        {/* Options - 2x2 Grid Layout */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {q.options.map((option, i) => {
            const isSelected = selectedOption === i;
            const isCorrect = i === q.answer;
            const isWrong = isSelected && !isCorrect;

            let bgStyle = "#fff";
            let borderStyle = "rgba(217,119,6,0.2)";
            let textStyle = "#374151";
            let iconEl = null;

            if (revealed) {
              if (isCorrect) {
                bgStyle = "#d1fae5";
                borderStyle = "#10b981";
                textStyle = "#065f46";
                iconEl = "✅";
              } else if (isWrong) {
                bgStyle = "#fee2e2";
                borderStyle = "#ef4444";
                textStyle = "#991b1b";
                iconEl = "❌";
              } else {
                bgStyle = "#fafaf9";
                borderStyle = "rgba(217,119,6,0.15)";
                textStyle = "#9ca3af";
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={revealed}
                className="w-full min-h-16 text-left rounded-2xl px-4 py-3.5 border-2 transition-all duration-300 flex items-center gap-3 group"
                style={{
                  background: bgStyle,
                  borderColor: borderStyle,
                  color: textStyle,
                  transform: isSelected && selectedAnimation === "correct" && isCorrect ? "scale(1.02)" : "scale(1)",
                  boxShadow: isCorrect && revealed
                    ? "0 8px 20px rgba(16,185,129,0.3)"
                    : isWrong && revealed
                      ? "0 8px 20px rgba(239,68,68,0.2)"
                      : "0 2px 8px rgba(0,0,0,0.05)",
                  animation: isSelected && revealed ? `${isCorrect ? "correct-bounce" : "wrong-shake"} 0.5s ease-out` : "none",
                  cursor: revealed ? "default" : "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Option letter */}
                <span
                  className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black"
                  style={{
                    background: revealed && isCorrect ? "#10b981" : revealed && isWrong ? "#ef4444" : "#fef3c7",
                    color: revealed && (isCorrect || isWrong) ? "#fff" : currentTheme.accent,
                    border: `2px solid ${revealed && isCorrect ? "#10b981" : revealed && isWrong ? "#ef4444" : currentTheme.border}`,
                  }}
                >
                  {iconEl || String.fromCharCode(65 + i)}
                </span>

                <span className="flex-1 text-sm md:text-base font-medium leading-snug">{option}</span>

                {/* Hover arrow */}
                {!revealed && (
                  <span className="text-gray-300 group-hover:text-amber-600 transition-colors duration-200 text-sm flex-shrink-0">→</span>
                )}
              </button>
            );
          })}
          </div>
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
            <p className="text-gray-800 text-sm leading-relaxed">{q.explanation}</p>
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
            {isLastQ ? " See My Score →" : `Next Question →`}
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
          100% { transform: translateY(120px) rotate(var(--confetti-rotation, 360deg)) scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

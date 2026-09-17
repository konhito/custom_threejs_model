"use client";

const StartButton = ({ onClick }) => {
  const handleClick = () => {
    // Play button click sound
    if (typeof window !== "undefined") {
      import("@/lib/soundUtils").then((module) => {
        module.default.play("button-click");
      }).catch(() => { });
    }
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="mt-2 rounded-[14px] bg-[#f3cb79] px-9 py-3.5 text-[#1b4438] shadow-[0_5px_0_#b88347] transition-transform duration-200 hover:-translate-y-1 active:translate-y-0 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#fff4c7] motion-reduce:transition-none"
      aria-label="Play Game"
    >
      <span className="text-lg" style={{ fontFamily: '"Fredoka One", "Trebuchet MS", sans-serif' }}>Let&apos;s play</span>
    </button>
  );
};

export default StartButton;

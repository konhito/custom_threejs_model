"use client";
import StartButton from "@/components/game/StartButton";

export default function GameIntroScreen({ onStart }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-30 gap-10 md:gap-12">
      <div className="flex flex-col items-center gap-3 relative w-full max-w-4xl px-4">
        <div className="relative inline-block">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-[0_0_10px_rgba(177,158,239,0.5)]"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            <span>Card </span>
            <span className="relative inline-block">
              game
              <p
                className="text-[8px] md:text-[10px] lg:text-xs text-purple-200 absolute top-full mt-1 left-0 whitespace-nowrap"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                by Proveneya &amp; Nahiara
              </p>
            </span>
          </h2>
        </div>
      </div>
      <StartButton onClick={onStart} />
    </div>
  );
}

"use client";
import Image from "next/image";
import StartButton from "@/components/game/StartButton";
import { getCardBackPath } from "@/lib/gameData";

export default function GameIntroScreen({ onStart }) {
  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-5 px-5 text-center text-[#fff5d3]">
      <div className="relative mb-2 h-[190px] w-[280px]" aria-hidden="true">
        {[-15, 0, 15].map((angle, index) => (
          <div
            key={angle}
            className="absolute left-1/2 top-3 h-[170px] w-[124px] overflow-hidden rounded-[9px] shadow-[0_8px_12px_rgba(4,35,25,0.35)]"
            style={{ transform: `translateX(calc(-50% + ${(index - 1) * 68}px)) rotate(${angle}deg)`, zIndex: index === 1 ? 2 : 1 }}
          >
            <Image src={getCardBackPath()} alt="" fill sizes="124px" className="object-contain" priority />
          </div>
        ))}
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f9dda0]">Proveneya &amp; Nahiara</p>
      <h1 className="max-w-xl text-[clamp(2.5rem,8vw,4.5rem)] leading-[1.05] text-[#fff4c7]" style={{ fontFamily: '"Fredoka One", "Trebuchet MS", sans-serif' }}>
        Guardians of Flowers
      </h1>
      <p className="max-w-sm text-base leading-relaxed text-[#e6f2d9]">Turn the cards. Find six petals. Help a flower bloom.</p>
      <StartButton onClick={onStart} />
    </div>
  );
}

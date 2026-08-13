"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_SRC = "/Matias - Aquamundi (Loopeable Version).mp3";

export function MusicToggleButton({ autoPlay = false, onLoadComplete, src = DEFAULT_SRC, volume = 0.4, fadeDuration = 800 }) {
  const audioRef = useRef(null);
  const fadeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundError, setSoundError] = useState(false);
  const clearFade = useCallback(() => { if (fadeRef.current) window.clearInterval(fadeRef.current); }, []);
  const fadeTo = useCallback((target, complete) => {
    clearFade();
    const audio = audioRef.current;
    if (!audio) return;
    const step = Math.max(volume / Math.max(1, fadeDuration / 30), 0.01);
    fadeRef.current = window.setInterval(() => {
      audio.volume = Math.max(0, Math.min(target, audio.volume + (target > audio.volume ? step : -step)));
      if (audio.volume === target) { clearFade(); complete?.(); }
    }, 30);
  }, [clearFade, fadeDuration, volume]);
  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    clearFade();
    audio.volume = 0;
    try { await audio.play(); fadeTo(volume); } catch { setIsPlaying(false); }
  }, [clearFade, fadeTo, volume]);
  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) play(); else fadeTo(0, () => audio.pause());
  };

  useEffect(() => { if (autoPlay) play(); return () => { clearFade(); audioRef.current?.pause(); }; }, [autoPlay, clearFade, play, src]);

  return <motion.button type="button" onClick={toggle} key="audio" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="relative grid h-11 w-11 place-items-center rounded-full border border-gray-200 bg-white/90 text-emerald-700 shadow-[0_4px_8px_rgba(0,0,0,0.14)] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700" aria-label={isPlaying ? "Pause music" : "Play music"}>
    <audio ref={audioRef} src={src} loop preload="auto" onCanPlay={() => { setSoundError(false); onLoadComplete?.(); }} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onError={() => setSoundError(true)} />
    <span className="flex h-[18px] items-center gap-1" aria-hidden="true">{[7, 14, 10, 16, 8].map((height, index) => <motion.span key={index} className="w-px rounded-full bg-current" animate={{ height: isPlaying ? [4, height, 5] : 4 }} transition={{ duration: 0.55, delay: index * 0.07, repeat: isPlaying ? Infinity : 0, repeatType: "mirror" }} />)}</span>
    {soundError && <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-red-600 px-2 py-1 text-[10px] text-white">Audio unavailable</span>}
  </motion.button>;
}

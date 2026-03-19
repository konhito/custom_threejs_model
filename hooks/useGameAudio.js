"use client";
import { useState } from "react";

export function useGameAudio() {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    if (typeof window === "undefined") return;
    import("@/lib/soundUtils").then((m) => {
      if (m.default.audioContext?.state === "suspended") m.default.audioContext.resume();
      const newMuted = m.default.toggleMute();
      setIsMuted(newMuted);
      if (!newMuted) setTimeout(() => m.default.play("button-click"), 100);
    });
  };

  return { isMuted, toggleMute };
}

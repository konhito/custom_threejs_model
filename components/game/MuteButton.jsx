"use client";
import { Volume2, VolumeX } from "lucide-react";
import { useTranslation } from "@/lib/useTranslation";

export default function MuteButton({ isMuted, onToggle, gameState, isLoadingAssets }) {
  const { locale } = useTranslation();
  const isLight = gameState === "completed";
  return (
    <button
      onClick={onToggle}
      className={`${gameState === "playing" ? "relative" : "fixed bottom-4 right-4 md:bottom-6 md:right-6"} w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-200 backdrop-blur-md z-[9996] touch-manipulation border ${
        isLight ? "bg-white/80 hover:bg-white border-amber-200/50 shadow-md" : "bg-[#1e4238] hover:bg-[#315f4e] border-white/30"
      }`}
      aria-label={locale === "es" ? isMuted ? "Activar sonido" : "Silenciar" : isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? (
        <VolumeX className={`w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 ${isLight ? "text-amber-800" : "text-white"}`} />
      ) : (
        <Volume2 className={`w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 ${isLight ? "text-amber-800" : "text-white"}`} />
      )}
    </button>
  );
}

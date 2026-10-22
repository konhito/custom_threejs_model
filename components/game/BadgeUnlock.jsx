"use client";

import React, { useEffect, useState } from "react";
import { Award, Trophy, Crown, Star, Zap, Target, X } from "lucide-react";
import { useTranslation } from "@/lib/useTranslation";

const BADGE_TYPES = {
  firstFlip: {
    id: "firstFlip",
    name: "First Discovery",
    icon: Star,
    color: "#3b82f6",
    description: "Flipped your first card"
  },
  explorer: {
    id: "explorer",
    name: "Explorer",
    icon: Target,
    color: "#8b5cf6",
    description: "Revealed 4 parameters"
  },
  botanist: {
    id: "botanist",
    name: "Master Botanist",
    icon: Trophy,
    color: "#fbbf24",
    description: "Unlocked all 8 parameters"
  },
  speedReader: {
    id: "speedReader",
    name: "Speed Reader",
    icon: Zap,
    color: "#10b981",
    description: "Revealed all cards in under 30 seconds"
  }
};

export default function BadgeUnlock({ badge, onClose }) {
  const { locale, t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (badge) {
      // Trigger entrance animation
      setTimeout(() => setIsVisible(true), 50);
      
      // Generate particles
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        angle: (i / 20) * 360,
        delay: i * 0.05,
        color: i % 3 === 0 ? "#fbbf24" : i % 3 === 1 ? "#34d399" : "#a78bfa"
      }));
      setParticles(newParticles);

      // Remove auto-close - user must manually close
    }
  }, [badge, onClose]);

  if (!badge || !BADGE_TYPES[badge]) return null;

  const badgeData = BADGE_TYPES[badge];
  const IconComponent = badgeData.icon;
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 500);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.5s ease-out"
      }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
        onClick={handleClose}
      />
      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: "8px",
            height: "8px",
            background: particle.color,
            left: "50%",
            top: "50%",
            transform: isVisible 
              ? `translate(-50%, -50%) rotate(${particle.angle}deg) translateY(-150px) scale(0)`
              : "translate(-50%, -50%) scale(0)",
            opacity: isVisible ? 0 : 1,
            transition: `all 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${particle.delay}s`,
            boxShadow: `0 0 10px ${particle.color}`
          }}
        />
      ))}

      {/* Badge Card */}
      <div
        className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border-2 shadow-2xl pointer-events-auto"
        style={{
          borderColor: badgeData.color,
          boxShadow: `0 0 60px ${badgeData.color}40, 0 20px 40px rgba(0,0,0,0.5)`,
          transform: isVisible ? "scale(1) rotateY(0deg)" : "scale(0.5) rotateY(-180deg)",
          transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          minWidth: "320px"
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 z-20"
        >
          <X className="w-5 h-5 text-white/80" strokeWidth={2.5} />
        </button>
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-3xl -z-10"
          style={{
            background: `radial-gradient(circle at center, ${badgeData.color}40, transparent 70%)`,
            filter: "blur(30px)",
            animation: "pulse-badge 2s ease-in-out infinite"
          }}
        />

        {/* Content */}
        <div className="text-center">
          {/* Badge icon */}
          <div className="mb-4 relative inline-block">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${badgeData.color}30, ${badgeData.color}10)`,
                border: `3px solid ${badgeData.color}`,
                boxShadow: `0 0 30px ${badgeData.color}60, inset 0 0 20px ${badgeData.color}20`,
                animation: "float-badge 3s ease-in-out infinite"
              }}
            >
              <IconComponent 
                className="w-12 h-12" 
                style={{ color: badgeData.color }}
                strokeWidth={2}
              />
            </div>
            
            {/* Sparkle effects */}
            <div className="absolute -top-2 -right-2">
              <Star className="w-6 h-6 text-yellow-400" fill="#fbbf24" strokeWidth={0} style={{ animation: "sparkle-1 1.5s ease-in-out infinite" }} />
            </div>
            <div className="absolute -bottom-2 -left-2">
              <Star className="w-4 h-4 text-yellow-400" fill="#fbbf24" strokeWidth={0} style={{ animation: "sparkle-2 1.5s ease-in-out infinite 0.5s" }} />
            </div>
          </div>

          {/* Text */}
          <div className="mb-2">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">{t("gamePilot.ui.badgeUnlocked")}</span>
          </div>
          <h3 
            className="font-black text-2xl mb-2"
            style={{ 
              color: badgeData.color,
              textShadow: `0 0 20px ${badgeData.color}80`
            }}
          >
            {locale === "es" ? t(`gamePilot.badges.${badge}`)[0] : badgeData.name}
          </h3>
          <p className="text-white/70 text-sm">
            {locale === "es" ? t(`gamePilot.badges.${badge}`)[1] : badgeData.description}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-badge {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes float-badge {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes sparkle-1 {
          0%, 100% { opacity: 0.5; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }
        @keyframes sparkle-2 {
          0%, 100% { opacity: 0.5; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(-180deg); }
        }
      `}</style>
    </div>
  );
}

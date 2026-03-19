"use client";

import React, { useEffect, useState } from "react";

export default function CardParticles({ trigger, position, onComplete }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!trigger || !position) return;

    // Generate petal particles
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: `particle-${Date.now()}-${i}`,
      angle: (i / 12) * 360,
      distance: 40 + Math.random() * 30,
      size: 6 + Math.random() * 6,
      color: ["#fbbf24", "#34d399", "#a78bfa"][i % 3],
      delay: i * 0.03,
      duration: 0.8 + Math.random() * 0.4
    }));

    setParticles(newParticles);

    // Auto-cleanup
    const timer = setTimeout(() => {
      setParticles([]);
      if (onComplete) onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [trigger, position, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const targetX = position.x + Math.cos(rad) * p.distance;
        const targetY = position.y + Math.sin(rad) * p.distance;

        return (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: `${p.size}px`,
              height: `${p.size * 1.5}px`,
              background: p.color,
              boxShadow: `0 0 8px ${p.color}`,
              transform: "translate(-50%, -50%)",
              opacity: 1,
              animation: `particle-burst ${p.duration}s ease-out ${p.delay}s forwards`,
              "--target-x": `${targetX - position.x}px`,
              "--target-y": `${targetY - position.y}px`,
            }}
          />
        );
      })}

      <style jsx>{`
        @keyframes particle-burst {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--target-x), var(--target-y)) scale(1) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

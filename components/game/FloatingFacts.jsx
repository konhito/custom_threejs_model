"use client";

import React, { useState, useEffect } from "react";
import { Lightbulb, X } from "lucide-react";

// Extract fun facts from flower details
const generateFunFacts = (detail) => {
  if (!detail) return [];
  
  const facts = [];
  
  // Extract pollinator info
  const pollinatorParam = detail.parameters.find(p => p.key === "relevantPollinator");
  if (pollinatorParam) {
    const pollinatorName = pollinatorParam.value.split("—")[0].trim();
    facts.push(`Pollinated by ${pollinatorName}`);
  }
  
  // Extract habitat info
  const habitatParam = detail.parameters.find(p => p.key === "habitat");
  if (habitatParam) {
    const habitatShort = habitatParam.value.split(".")[0];
    facts.push(habitatShort);
  }
  
  // Extract cultural significance
  const culturalParam = detail.parameters.find(p => p.key === "culturalSignificance");
  if (culturalParam) {
    const culturalShort = culturalParam.value.split(".")[0];
    facts.push(culturalShort);
  }
  
  // National status
  facts.push(`National flower of ${detail.country}`);
  
  return facts.slice(0, 3); // Max 3 facts
};

export default function FloatingFacts({ detail }) {
  const [facts, setFacts] = useState([]);
  const [dismissedFacts, setDismissedFacts] = useState([]);

  useEffect(() => {
    if (detail) {
      const allFacts = generateFunFacts(detail);
      setFacts(allFacts);
      setDismissedFacts([]);
    }
  }, [detail]);

  const handleDismiss = (index) => {
    setDismissedFacts(prev => [...prev, index]);
  };

  const visibleFacts = facts.filter((_, i) => !dismissedFacts.includes(i));

  if (visibleFacts.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {visibleFacts.map((fact, displayIndex) => {
        const actualIndex = facts.indexOf(fact);
        const positions = [
          { top: "20%", left: "10%", delay: 0 },
          { top: "50%", right: "12%", delay: 1 },
          { bottom: "30%", left: "15%", delay: 2 }
        ];
        const pos = positions[displayIndex % 3];

        return (
          <div
            key={actualIndex}
            className="absolute pointer-events-auto"
            style={{
              ...pos,
              animation: `float-fact 6s ease-in-out infinite ${pos.delay}s`,
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            <div className="relative max-w-xs group">
              {/* Bubble */}
              <div
                className="rounded-2xl p-4 pr-10 border backdrop-blur-sm"
                style={{
                  background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,191,36,0.05))",
                  borderColor: "rgba(251,191,36,0.4)",
                  boxShadow: "0 8px 32px rgba(251,191,36,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <p className="text-white/90 text-sm leading-relaxed">{fact}</p>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => handleDismiss(actualIndex)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <X className="w-3 h-3 text-white/60" strokeWidth={2.5} />
              </button>

              {/* Pointer tail */}
              <div
                className="absolute w-4 h-4 rotate-45"
                style={{
                  bottom: "-6px",
                  left: "30%",
                  background: "rgba(251,191,36,0.15)",
                  borderRight: "1px solid rgba(251,191,36,0.4)",
                  borderBottom: "1px solid rgba(251,191,36,0.4)",
                }}
              />
            </div>
          </div>
        );
      })}

      <style jsx>{`
        @keyframes float-fact {
          0% { 
            opacity: 0; 
            transform: translateY(20px) scale(0.9); 
          }
          10% { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
          90% { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
          100% { 
            opacity: 0; 
            transform: translateY(-10px) scale(0.95); 
          }
        }
      `}</style>
    </div>
  );
}

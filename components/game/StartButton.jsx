"use client";

import React from 'react';

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
      className="group relative px-6 py-2 border-2 border-white text-white transition-all duration-300 ease-in-out hover:bg-white hover:text-black hover:scale-105 active:scale-95 box-border"
      aria-label="Play Game"
    >
      <span
        className="text-lg md:text-xl block"
        style={{
          fontFamily: '"Press Start 2P", monospace',
          textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
        }}
      >
        PLAY
      </span>

      {/* Decorative corners for extra retro feel - inner squares */}
      <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white transition-all duration-300 group-hover:bg-black" />
      <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white transition-all duration-300 group-hover:bg-black" />
      <div className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-white transition-all duration-300 group-hover:bg-black" />
      <div className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-white transition-all duration-300 group-hover:bg-black" />
    </button>
  );
};

export default StartButton;

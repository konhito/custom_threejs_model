"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import useSound from "use-sound";

export const MusicToggleButton = ({ autoPlay = false, onLoadComplete }) => {
  const bars = 5;

  const getRandomHeights = () => {
    return Array.from({ length: bars }, () => Math.random() * 0.8 + 0.2);
  };

  const [heights, setHeights] = useState(getRandomHeights());
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const [soundError, setSoundError] = useState(null);

  const [play, { pause, sound }] = useSound("/Matias - Aquamundi (Loopeable Version).mp3", {
    loop: true,
    onplay: () => {
      setIsPlaying(true);
      setSoundError(null);
    },
    onend: () => setIsPlaying(false),
    onpause: () => setIsPlaying(false),
    onstop: () => setIsPlaying(false),
    onload: () => {
      setSoundError(null);
    },
    onloaderror: (error) => {
      console.error("Sound loading error:", error);
      setSoundError("Failed to load audio file");
    },
    soundEnabled: true,
    volume: 0.5,
    html5: true, // Use HTML5 audio for better compatibility
    preload: true, // Preload the audio
  });

  // Auto-play when loader completes
  useEffect(() => {
    if (autoPlay && !hasAutoPlayed && onLoadComplete) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        try {
          // Attempt to play - browser may block autoplay, which is fine
          // User can click the button if autoplay is blocked
          play();
          setHasAutoPlayed(true);
        } catch (error) {
          // Silently fail - user can manually start playback
          console.log("Autoplay blocked by browser - user can click to play");
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, hasAutoPlayed, onLoadComplete, play]);

  useEffect(() => {
    if (isPlaying) {
      const waveformIntervalId = setInterval(() => {
        setHeights(getRandomHeights());
      }, 100);

      return () => {
        clearInterval(waveformIntervalId);
      };
    } else {
      setHeights(Array(bars).fill(0.1));
    }
  }, [isPlaying, bars]);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isPlaying) {
        pause();
        setIsPlaying(false);
        return;
      }
      
      // For mobile: Resume audio context on user interaction
      if (typeof window !== 'undefined') {
        // Create or resume audio context
        if (window.AudioContext || window.webkitAudioContext) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          try {
            // Create a temporary context to unlock audio on mobile
            const tempContext = new AudioContext();
            if (tempContext.state === 'suspended') {
              await tempContext.resume();
            }
            // Create a silent buffer to unlock audio on iOS
            const buffer = tempContext.createBuffer(1, 1, 22050);
            const source = tempContext.createBufferSource();
            source.buffer = buffer;
            source.connect(tempContext.destination);
            source.start(0);
            // Close after a brief moment
            setTimeout(() => tempContext.close(), 100);
          } catch (e) {
            // Ignore context errors
          }
        }
      }
      
      // Small delay to ensure audio context is ready on mobile
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Play the sound
      play();
      
    } catch (error) {
      console.error("Error playing sound:", error);
      setSoundError("Could not play audio. Please check your browser settings.");
      setIsPlaying(false);
    }
  };
  
  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleClick(e);
  };

  return (
    <motion.div
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      key="audio"
      initial={{ padding: "14px 14px" }}
      whileHover={{ padding: "18px 22px", scale: 1.05 }}
      whileTap={{ padding: "18px 22px", scale: 0.98 }}
      animate={{
        scale: isPlaying ? 1 : [1, 1.02, 1],
        boxShadow: isPlaying 
          ? "0 4px 6px rgba(0,0,0,0.1)"
          : ["0 4px 6px rgba(0,0,0,0.1)", "0 6px 12px rgba(16, 185, 129, 0.2)", "0 4px 6px rgba(0,0,0,0.1)"],
      }}
      transition={{
        scale: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
        boxShadow: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
        padding: { duration: 0.3, type: "spring", stiffness: 300 },
      }}
      className="bg-white/90 backdrop-blur-sm cursor-pointer rounded-full p-2 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow relative touch-manipulation"
      style={{ zIndex: 50, WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Subtle pulsing ring animation when not playing */}
      {!isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-full border border-emerald-400/30"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      <motion.div
        initial={{ opacity: 0, filter: "blur(4px)" }}
        animate={{
          opacity: 1,
          filter: "blur(0px)",
        }}
        exit={{ opacity: 0, filter: "blur(4px)" }}
        transition={{ type: "spring", bounce: 0.35 }}
        className="flex h-[18px] w-full items-center gap-1 rounded-full relative"
      >
        {/* Waveform visualization */}
        {heights.map((height, index) => (
          <motion.div
            key={index}
            className="bg-emerald-600 w-[1px] rounded-full"
            initial={{ height: 1 }}
            animate={{
              height: Math.max(4, height * 14),
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 10,
            }}
          />
        ))}
        
        {/* Error indicator */}
        {soundError && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
            Audio file not found
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};


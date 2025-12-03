"use client";
import { motion } from "motion/react";
import React from "react";
import { AuroraBackground } from "./ui/aurora-background";
import { ChevronDown } from "lucide-react";
import { TypewriterEffect } from "./ui/typewriter-effect";

export function HeroSection() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* AquaMundi Branding - Top Left */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-30">
        <motion.a
          href="/"
          className="relative inline-block group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            delay: 1.2, 
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{ willChange: 'opacity, transform' }}
        >
          <span 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-900 font-normal relative inline-block"
            style={{ fontFamily: '"Agustina Signature", "Great Vibes", "Dancing Script", cursive' }}
          >
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">A</span>quaMundi
          </span>
        </motion.a>
      </div>

      {/* Hero Content with Aurora Background - Hardcoded White BG */}
      <AuroraBackground 
        className="bg-white"
        style={{ 
          backgroundColor: '#ffffff',
          background: '#ffffff'
        }}
      >
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.25,
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="relative flex flex-col items-center justify-center w-full h-full px-4 sm:px-6 md:px-8 z-10"
          style={{ willChange: 'opacity, transform' }}
        >
          <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
            <h1 className="text-gray-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center uppercase tracking-tight mb-3 md:mb-4" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Explore the World Through
              <br />
              Blooming Stories
            </h1>
            
            {/* Separator Line */}
            <div className="w-12 sm:w-16 h-px bg-gray-900 mb-4 md:mb-6 mx-auto"></div>
            
            {/* Subtitle with cursive serif font and typewriter effect */}
            <div className="text-center w-full" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
              <TypewriterEffect
                words={[
                  {
                    text: "Where",
                    className: "text-gray-700 text-base md:text-xl lg:text-2xl italic font-light",
                  },
                  {
                    text: "nations",
                    className: "text-gray-700 text-base md:text-xl lg:text-2xl italic font-light",
                  },
                  {
                    text: "bloom",
                    className: "text-gray-700 text-base md:text-xl lg:text-2xl italic font-light",
                  },
                  {
                    text: "and",
                    className: "text-gray-700 text-base md:text-xl lg:text-2xl italic font-light",
                  },
                  {
                    text: "stories",
                    className: "text-gray-700 text-base md:text-xl lg:text-2xl italic font-light",
                  },
                  {
                    text: "unfold",
                    className: "text-gray-700 text-base md:text-xl lg:text-2xl italic font-light",
                  },
                ]}
                className="text-center"
                cursorClassName="bg-gray-700"
              />
            </div>
          </div>
        </motion.div>
      </AuroraBackground>
      
      {/* Bouncing Scroll Indicator */}
      <motion.div 
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 1.7,
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <button
          onClick={() => {
            const globeSection = document.getElementById('globe-section');
            if (globeSection) {
              globeSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="flex flex-col items-center justify-center text-gray-700 hover:text-gray-900 transition-colors duration-200 group animate-bounce-slow"
          aria-label="Scroll down to see the globe"
        >
          <span className="text-xs md:text-sm mb-2 font-medium opacity-70 group-hover:opacity-100 transition-opacity">
            Scroll to explore
          </span>
          <ChevronDown className="w-6 h-6 md:w-8 md:h-8 animate-bounce" />
        </button>
      </motion.div>

    </div>
  );
}


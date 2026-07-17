"use client";
import { motion } from "motion/react";
import React from "react";
import { AuroraBackground } from "./ui/aurora-background";
import { ChevronDown } from "lucide-react";
import { TypewriterEffect } from "./ui/typewriter-effect";
import { useTranslation } from "../lib/useTranslation";

export function HeroSection() {
  const { t, isLoading, locale } = useTranslation();

  // Define line breaks for each language on mobile
  // Line 1: before "and", Line 2: "and" onwards
  const mobileLineBreaks = {
    en: { line1: "Where nations flourish", line2: "and stories come to life" },
    es: { line1: "Donde las naciones florecen", line2: "y las historias cobran vida" },
    fr: { line1: "Où les nations s'épanouissent", line2: "et les histoires prennent vie" },
    zh: { line1: "国家繁荣", line2: "故事鲜活" },
    de: { line1: "Wo Nationen blühen", line2: "und Geschichten zum Leben erwachen" },
  };

  // Get translated subtitle words for desktop (single line)
  const getSubtitleWords = () => {
    const subtitle = t('home.heroSubtitle');
    if (subtitle === 'home.heroSubtitle' || !subtitle) {
      // Fallback if translation not loaded
      return [
        { text: "Where", className: "text-gray-700 text-base md:text-xl lg:text-2xl italic font-light" },
        { text: "nations", className: "text-gray-700 text-base md:text-xl lg:text-2xl italic font-light" },
        { text: "flourish", className: "text-gray-700 text-base md:text-xl lg:text-2xl italic font-light" },
        { text: "and", className: "text-gray-700 text-base md:text-xl lg:text-2xl italic font-light" },
        { text: "stories", className: "text-gray-700 text-base md:text-xl lg:text-2xl italic font-light" },
        { text: "come", className: "text-gray-700 text-base md:text-xl lg:text-2xl italic font-light" },
        { text: "to", className: "text-gray-700 text-base md:text-xl lg:text-2xl italic font-light" },
        { text: "life", className: "text-gray-700 text-base md:text-xl lg:text-2xl italic font-light" },
      ];
    }

    // Split translated subtitle into words
    return subtitle.split(' ').map(word => ({
      text: word,
      className: "text-gray-700 text-base md:text-xl lg:text-2xl italic font-light",
    }));
  };

  // Get mobile subtitle lines (two lines for small screens)
  const getMobileSubtitleLines = () => {
    const lines = mobileLineBreaks[locale] || mobileLineBreaks.en;
    return {
      line1: lines.line1.split(' ').map(word => ({
        text: word,
        className: "text-gray-700 text-sm italic font-light",
      })),
      line2: lines.line2.split(' ').map(word => ({
        text: word,
        className: "text-gray-700 text-sm italic font-light",
      })),
    };
  };

  // Get subtitle words
  const subtitleWords = getSubtitleWords();
  const mobileSubtitle = getMobileSubtitleLines();

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
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-900 font-normal relative inline-block notranslate"
            style={{ fontFamily: '"Agustina Signature", "Great Vibes", "Dancing Script", cursive' }}
            translate="no"
          >
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">A</span>quaMundi
          </span>
        </motion.a>
      </div>

      {/* Hero Content with Aurora Background - Transparent for Ghost Cursor */}
      <AuroraBackground
        className="bg-transparent"
        style={{
          backgroundColor: 'transparent',
          background: 'transparent'
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
              {t('home.heroTitle')}
              <br />
              {t('home.heroTitleLine2')}
            </h1>

            {/* Separator Line */}
            <div className="w-12 sm:w-16 h-px bg-gray-900 mb-4 md:mb-6 mx-auto"></div>

            {/* Subtitle with cursive serif font and typewriter effect */}
            {/* Desktop: Single line */}
            <div className="hidden sm:block text-center w-full" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
              <TypewriterEffect
                key={`typewriter-desktop-${locale}`}
                words={subtitleWords}
                className="text-center"
                cursorClassName="bg-gray-700"
              />
            </div>

            {/* Mobile: Two lines for better readability */}
            <div className="sm:hidden text-center w-full px-4" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
              <div className="mb-1">
                <TypewriterEffect
                  key={`typewriter-mobile-line1-${locale}`}
                  words={mobileSubtitle.line1}
                  className="text-center"
                  cursorClassName="hidden"
                />
              </div>
              <TypewriterEffect
                key={`typewriter-mobile-line2-${locale}`}
                words={mobileSubtitle.line2}
                className="text-center"
                cursorClassName="bg-gray-700"
              />
            </div>

          </div>
        </motion.div>
      </AuroraBackground>

      {/* Bouncing Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-[5]"
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
          aria-label={t('home.scrollToExplore')}
        >
          <span className="text-xs md:text-sm mb-2 font-medium opacity-70 group-hover:opacity-100 transition-opacity">
            {t('home.scrollToExplore')}
          </span>
          <ChevronDown className="w-6 h-6 md:w-8 md:h-8 animate-bounce" />
        </button>
      </motion.div>

    </div>
  );
}

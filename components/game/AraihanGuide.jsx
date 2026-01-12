"use client";

import { useState, useEffect } from "react";

export default function AraihanGuide({ message, onAction, actionText, showAction, cardType, country, guardianData, isIntro, petalData }) {
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Generate context-aware message - 2-3 WORDS for intro, FULL for gameplay
  const getContextMessage = () => {
    if (!cardType) return message;
    
    if (cardType === "petal") {
      if (showAction) {
        // 2-3 words only for intro dialog
        return "Petal collected";
      } else {
        // Educational phrases for each petal
        const petalNumber = petalData?.petalNumber || 1;
        const countryName = typeof country === 'string' ? country : (country?.country || country?.name || "this flower");
        
        const educationalPhrases = {
          1: `Petal 1 collected! Each petal represents a part of ${countryName}'s natural heritage. Flowers are essential for biodiversity and ecosystem health.`,
          2: `Petal 2 collected! Did you know that flowers help maintain the balance of nature? They provide food and shelter for many creatures.`,
          3: `Petal 3 collected! Flowers are not just beautiful—they play a crucial role in pollination, helping plants reproduce and thrive.`,
          4: `Petal 4 collected! National flowers like ${countryName}'s represent cultural identity and connection to the land. They tell stories of history and tradition.`,
          5: `Petal 5 collected! Conservation of flowers protects entire ecosystems. When we protect flowers, we protect the pollinators and wildlife that depend on them.`,
          6: `Petal 6 collected! You've collected all petals! Each petal you found teaches us about the importance of preserving our natural world for future generations.`
        };
        
        return educationalPhrases[petalNumber] || `You found petal ${petalNumber} of the flower of ${countryName}. Well done, guardian!`;
      }
    } else if (cardType === "minion") {
      const minionName = guardianData?.name || "minion";
      if (showAction) {
        // 2-3 words only for intro dialog
        return "Minion revealed";
      } else {
        // Full version for gameplay notification
        return `You revealed the ${minionName} minion. The ecosystem falls back. We must start again…`;
      }
    } else if (cardType === "guardian") {
      if (showAction) {
        // 2-3 words only for intro dialog
        return "Guardian activated";
      } else {
        // Full version for gameplay notification
        return "You activated a Guardian. Hope is with you — continue!";
      }
    } else if (cardType === "guardian-protect") {
      if (showAction) {
        // 2-3 words only for intro dialog
        return "Guardian protected";
      } else {
        // Full version for gameplay notification
        return "The Guardian protected you from the minion! Continue your quest.";
      }
    }
    return message;
  };

  const finalMessage = getContextMessage();

  useEffect(() => {
    if (!finalMessage) {
      setDisplayedMessage("");
      return;
    }

    setIsTyping(true);
    setDisplayedMessage("");
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex < finalMessage.length) {
        setDisplayedMessage(finalMessage.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, isIntro ? 25 : (showAction ? 30 : 20)); // Original typing speed - fast but readable

    return () => clearInterval(typeInterval);
  }, [finalMessage, showAction]);

  // Auto-dismiss gameplay messages after longer duration (but not intro messages)
  // Calculate duration based on message length to ensure users can read it
  useEffect(() => {
    if (!showAction && !isIntro && finalMessage && !isTyping) {
      // Show message for at least 10 seconds, plus 200ms per character for longer messages
      // This gives plenty of time to read after fast typing
      const minDisplayTime = 10000; // 10 seconds minimum
      const charBasedTime = finalMessage.length * 200; // 200ms per character
      const displayDuration = Math.max(minDisplayTime, charBasedTime);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, displayDuration);
      return () => clearTimeout(timer);
    }
  }, [showAction, isIntro, finalMessage, isTyping]);

  // Reset visibility when message changes
  useEffect(() => {
    if (finalMessage) {
      setIsVisible(true);
    }
  }, [finalMessage]);

  // For intro message at bottom left, show larger notification. For gameplay messages, show subtle notification
  if (isIntro) {
    // Intro message - bottom left notification style - Mobile optimized
    return (
      <div className="fixed bottom-4 left-2 sm:left-4 right-2 sm:right-4 md:right-auto md:left-4 md:bottom-6 z-[9999] max-w-lg animate-fade-in">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-purple-200/50 p-3 sm:p-4 md:p-5 flex items-start gap-2 sm:gap-3 md:gap-4">
          {/* Araihan Character Image - Red Blob - Mobile optimized */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0">
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              {/* Creature Body - Organic blob shape */}
              <path d="M28 40 Q20 38 18 32 Q16 26 20 24 Q18 22 22 20 Q26 18 28 22 Q30 18 34 20 Q38 22 36 24 Q40 26 38 32 Q36 38 28 40 Z" fill="#DC2626" />
              
              {/* Creature Head - Round but organic */}
              <ellipse cx="28" cy="18" rx="10" ry="11" fill="#DC2626" />
              
              {/* Black Pattern/Spots on body */}
              <circle cx="24" cy="30" r="2.5" fill="#1F2937" opacity="0.7" />
              <circle cx="32" cy="28" r="2" fill="#1F2937" opacity="0.7" />
              <circle cx="26" cy="34" r="1.5" fill="#1F2937" opacity="0.6" />
              
              {/* Eyes - Active */}
              <circle cx="24" cy="18" r="3" fill="#1F2937" />
              <circle cx="32" cy="18" r="3" fill="#1F2937" />
              <circle cx="24" cy="18" r="1.5" fill="#DC2626" />
              <circle cx="32" cy="18" r="1.5" fill="#DC2626" />
              
              {/* Simple mouth/opening - Active */}
              <ellipse cx="28" cy="22" rx="3" ry="2" fill="#1F2937" opacity="0.6" />
              
              {/* Small appendages/tentacles */}
              <ellipse cx="16" cy="26" rx="2" ry="5" fill="#DC2626" transform="rotate(-30 16 26)" />
              <ellipse cx="40" cy="26" rx="2" ry="5" fill="#DC2626" transform="rotate(30 40 26)" />
              <ellipse cx="20" cy="36" rx="2" ry="4" fill="#DC2626" transform="rotate(-20 20 36)" />
              <ellipse cx="36" cy="36" rx="2" ry="4" fill="#DC2626" transform="rotate(20 36 36)" />
            </svg>
          </div>
          
          {/* Message and Action Button - Mobile optimized */}
          <div className="flex-1 min-w-0 flex flex-col gap-2 sm:gap-3">
            <p className="text-gray-800 text-xs sm:text-sm md:text-base leading-relaxed break-words" style={{ 
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              lineHeight: '1.5'
            }}>
              {displayedMessage}
              {isTyping && (
                <span className="inline-block w-1 h-3 bg-gray-800 ml-1 animate-pulse">|</span>
              )}
            </p>
            
            {/* Action Button - Nature-themed */}
            {onAction && actionText && !isTyping && (
              <button
                onClick={onAction}
                className="group relative self-start px-4 sm:px-6 py-2 sm:py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </div>
                
                {/* Button content with nature emojis */}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span className="text-sm">🌸</span>
                  <span>{actionText}</span>
                  <span className="text-sm">🌿</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // For intro message, show full dialog. For gameplay messages, show subtle notification
  if (showAction) {
    // Intro message - full dialog
    return (
      <div className="fixed inset-4 md:inset-8 z-[9999] flex items-center justify-center">
        <div className="bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 shadow-2xl border-2 border-purple-400/30 w-full h-full max-w-4xl max-h-[90vh] flex flex-col overflow-y-auto">
          {/* Araihan Avatar/Icon */}
          <div className="flex items-start gap-4 md:gap-6 mb-4 md:mb-6 flex-shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl md:text-4xl lg:text-5xl flex-shrink-0">
              👑
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-xl md:text-2xl lg:text-3xl mb-2">Araihan</h3>
              <p className="text-purple-200 text-sm md:text-base lg:text-lg">Loyal Squire of Nahiara</p>
            </div>
          </div>

          {/* Message */}
          <div className="mb-4 md:mb-6 flex-1 overflow-y-auto">
            <p className="text-white text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap word-break-break-word hyphens-auto" style={{ 
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              maxWidth: '100%',
              lineHeight: '1.6'
            }}>
              {displayedMessage}
              {isTyping && (
                <span className="inline-block w-2 h-5 md:h-6 bg-white ml-1 animate-pulse">|</span>
              )}
            </p>
          </div>

          {/* Action Button - Nature-themed */}
          {showAction && onAction && actionText && (
            <button
              onClick={onAction}
              className="group relative w-full px-8 py-4 md:py-5 bg-green-600 hover:bg-green-700 text-white font-bold text-lg md:text-xl rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex-shrink-0 overflow-hidden"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
              
              {/* Button content with nature emojis */}
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-xl">🌸</span>
                <span>{actionText}</span>
                <span className="text-xl">🌿</span>
              </span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Gameplay messages - subtle notification style - Mobile optimized
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-4 left-2 sm:left-4 right-2 sm:right-4 md:right-auto md:left-4 md:bottom-6 z-[9999] max-w-sm animate-fade-in">
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-purple-200/50 p-2.5 sm:p-3 md:p-4 flex items-start gap-2 sm:gap-3">
        {/* Araihan Character Image - Red Blob - Mobile optimized */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0">
          <svg
            width="48"
            height="48"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Creature Body - Organic blob shape */}
            <path d="M28 40 Q20 38 18 32 Q16 26 20 24 Q18 22 22 20 Q26 18 28 22 Q30 18 34 20 Q38 22 36 24 Q40 26 38 32 Q36 38 28 40 Z" fill="#DC2626" />
            
            {/* Creature Head - Round but organic */}
            <ellipse cx="28" cy="18" rx="10" ry="11" fill="#DC2626" />
            
            {/* Black Pattern/Spots on body */}
            <circle cx="24" cy="30" r="2.5" fill="#1F2937" opacity="0.7" />
            <circle cx="32" cy="28" r="2" fill="#1F2937" opacity="0.7" />
            <circle cx="26" cy="34" r="1.5" fill="#1F2937" opacity="0.6" />
            
            {/* Eyes - Active */}
            <circle cx="24" cy="18" r="3" fill="#1F2937" />
            <circle cx="32" cy="18" r="3" fill="#1F2937" />
            <circle cx="24" cy="18" r="1.5" fill="#DC2626" />
            <circle cx="32" cy="18" r="1.5" fill="#DC2626" />
            
            {/* Simple mouth/opening - Active */}
            <ellipse cx="28" cy="22" rx="3" ry="2" fill="#1F2937" opacity="0.6" />
            
            {/* Small appendages/tentacles */}
            <ellipse cx="16" cy="26" rx="2" ry="5" fill="#DC2626" transform="rotate(-30 16 26)" />
            <ellipse cx="40" cy="26" rx="2" ry="5" fill="#DC2626" transform="rotate(30 40 26)" />
            <ellipse cx="20" cy="36" rx="2" ry="4" fill="#DC2626" transform="rotate(-20 20 36)" />
            <ellipse cx="36" cy="36" rx="2" ry="4" fill="#DC2626" transform="rotate(20 36 36)" />
          </svg>
        </div>
        
        {/* Message - Mobile optimized */}
        <div className="flex-1 min-w-0">
          <p className="text-gray-800 text-xs sm:text-sm md:text-base leading-relaxed break-words" style={{ 
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            lineHeight: '1.5'
          }}>
            {displayedMessage}
            {isTyping && (
              <span className="inline-block w-1 h-3 bg-gray-800 ml-1 animate-pulse">|</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}


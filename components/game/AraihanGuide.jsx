"use client";

import { useState, useEffect } from "react";

export default function AraihanGuide({ message, onAction, actionText, showAction, cardType, country, guardianData, isIntro }) {
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
        // Full version for gameplay notification
        const countryName = typeof country === 'string' ? country : (country?.country || country?.name || "flower");
        return `You found a petal of the flower of ${countryName}. Well done, guardian!`;
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
    }, isIntro ? 25 : (showAction ? 30 : 20)); // Adjust typing speed based on message type

    return () => clearInterval(typeInterval);
  }, [finalMessage, showAction]);

  // Auto-dismiss gameplay messages after 4 seconds (but not intro messages)
  useEffect(() => {
    if (!showAction && !isIntro && finalMessage && !isTyping) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 4000);
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
    // Intro message - bottom left notification style
    return (
      <div className="fixed bottom-4 left-4 right-4 md:right-auto md:left-4 md:bottom-6 z-[9999] max-w-lg animate-fade-in">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-purple-200/50 p-4 md:p-5 flex items-start gap-3 md:gap-4">
          {/* Araihan Character Image - Red Blob */}
          <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0">
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
          
          {/* Message and Action Button */}
          <div className="flex-1 min-w-0 flex flex-col gap-3">
            <p className="text-gray-800 text-sm md:text-base leading-relaxed break-words" style={{ 
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              lineHeight: '1.6'
            }}>
              {displayedMessage}
              {isTyping && (
                <span className="inline-block w-1 h-3 bg-gray-800 ml-1 animate-pulse">|</span>
              )}
            </p>
            
            {/* Action Button */}
            {onAction && actionText && !isTyping && (
              <button
                onClick={onAction}
                className="self-start px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-sm rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                {actionText}
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

          {/* Action Button */}
          {showAction && onAction && actionText && (
            <button
              onClick={onAction}
              className="w-full px-8 py-4 md:py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg md:text-xl rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex-shrink-0"
            >
              {actionText}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Gameplay messages - subtle notification style
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-auto md:left-4 md:bottom-6 z-[9999] max-w-sm animate-fade-in">
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-purple-200/50 p-3 md:p-4 flex items-start gap-3">
        {/* Araihan Character Image - Red Blob */}
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0">
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
        
        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-gray-800 text-sm md:text-base leading-relaxed break-words" style={{ 
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            lineHeight: '1.6'
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


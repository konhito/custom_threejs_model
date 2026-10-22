"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "@/lib/useTranslation";
import { spanishCardNames } from "@/lib/spanishGamePilot";

export default function AraihanGuide({ message, onAction, actionText, showAction, cardType, country, guardianData, isIntro, petalData }) {
  const { t, locale } = useTranslation();
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isManuallyDismissed, setIsManuallyDismissed] = useState(false);

  // Generate context-aware message - 2-3 WORDS for intro, FULL for gameplay
  const getContextMessage = () => {
    if (!cardType) return message;
    
    if (cardType === "petal") {
      if (showAction) {
        // 2-3 words only for intro dialog
        return t("gameMessages.petalCollected");
      } else {
        // Educational phrases for each petal
        const petalNumber = petalData?.petalNumber || 1;
        const countryName = locale === "es" && country?.id ? t(`countries.${country.id.toLowerCase()}.name`) : typeof country === 'string' ? country : (country?.country || country?.name || "this flower");
        if (locale === "es") return t(`gameMessages.petal${petalNumber}`, { country: countryName });
        
        const educationalPhrases = {
          1: `Petal 1 collected! Each petal represents a part of ${countryName}'s natural heritage. Flowers are essential for biodiversity and ecosystem health.`,
          2: `Petal 2 collected! Did you know that flowers help maintain the balance of nature? They provide food and shelter for many creatures.`,
          3: `Petal 3 collected! Flowers are not just beautiful. They play a crucial role in pollination, helping plants reproduce and thrive.`,
          4: `Petal 4 collected! National flowers like ${countryName}'s represent cultural identity and connection to the land. They tell stories of history and tradition.`,
          5: `Petal 5 collected! Conservation of flowers protects entire ecosystems. When we protect flowers, we protect the pollinators and wildlife that depend on them.`,
          6: `Petal 6 collected! You've collected all petals! Each petal you found teaches us about the importance of preserving our natural world for future generations.`
        };
        
        return educationalPhrases[petalNumber] || `You found petal ${petalNumber} of the flower of ${countryName}. Well done, guardian!`;
      }
    } else if (cardType === "minion") {
      const minionName = locale === "es" ? spanishCardNames[guardianData?.id] || "súbdito" : guardianData?.name || "minion";
      if (showAction) {
        // 2-3 words only for intro dialog
        return t("gameMessages.minionRevealed");
      } else {
        // Full version for gameplay notification
        return t("gameMessages.minionReset", { minionName });
      }
    } else if (cardType === "guardian") {
      if (showAction) {
        // 2-3 words only for intro dialog
        return t("gameMessages.guardianActivated");
      } else {
        // Full version for gameplay notification
        return t("gameMessages.guardianContinue");
      }
    } else if (cardType === "guardian-protect") {
      if (showAction) {
        // 2-3 words only for intro dialog
        return t("gameMessages.guardianProtected");
      } else {
        // Full version for gameplay notification
        return t("gameMessages.guardianSavedFull");
      }
    }
    return message;
  };

  const finalMessage = getContextMessage();
  const dismissMessage = () => {
    setIsManuallyDismissed(true);
    setIsVisible(false);
    if (isIntro && onAction) onAction();
  };

  useEffect(() => {
    if (!finalMessage) {
      setDisplayedMessage("");
      return;
    }

    if (isIntro) {
      // Show full intro instantly to avoid lag on long first-time message
      setDisplayedMessage(finalMessage);
      setIsTyping(false);
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
    }, showAction ? 45 : 35); // Slower typing speed for better readability

    return () => clearInterval(typeInterval);
  }, [finalMessage, showAction, isIntro]);

  // Auto-dismiss gameplay messages after longer duration (but not intro messages)
  // Calculate duration based on message length to ensure users can read it
  // Increased display time significantly for better readability
  // Users can also manually dismiss with close button
  useEffect(() => {
    if (!showAction && !isIntro && finalMessage && !isTyping && !isManuallyDismissed) {
      // Show message for at least 15 seconds, plus 300ms per character for longer messages
      // This gives plenty of time to read after fast typing
      const minDisplayTime = 15000; // 15 seconds minimum (increased from 10)
      const charBasedTime = finalMessage.length * 300; // 300ms per character (increased from 200)
      const displayDuration = Math.max(minDisplayTime, charBasedTime);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, displayDuration);
      return () => clearTimeout(timer);
    }
  }, [showAction, isIntro, finalMessage, isTyping, isManuallyDismissed]);

  // Reset visibility when message changes
  useEffect(() => {
    if (finalMessage) {
      setIsVisible(true);
      setIsManuallyDismissed(false);
    }
  }, [finalMessage]);

  if (!isVisible) return null;

  // First-time intro message from localStorage gate
  if (isIntro) {
    return (
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-1rem)] max-w-3xl animate-fade-in">
        <div className="bg-[#fff8e8] rounded-2xl border-2 border-[#bfd9bd] shadow-[0_5px_0_#d7e5c5] p-3.5 sm:p-4 md:p-5">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#dcecc8] text-[#194638] font-bold text-sm">
              A
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.16em] text-[#194638] font-bold mb-1">
                    Araihan
                  </p>
                  <p className="text-gray-800 text-sm sm:text-base leading-relaxed break-words" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
                    {displayedMessage}
                    {isTyping && <span className="inline-block w-0.5 h-4 bg-gray-700 ml-1 animate-pulse align-middle">|</span>}
                  </p>
                </div>

                {!showAction && (
                  <button
                    onClick={dismissMessage}
                    className="flex-shrink-0 w-7 h-7 rounded-full hover:bg-amber-50 border border-transparent hover:border-amber-200 flex items-center justify-center transition-all"
                    aria-label={t("game.close")}
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
            </div>
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
        <div className="bg-[#194638] rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-[#a9cbac] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-y-auto">
          {/* Araihan Avatar/Icon */}
          <div className="flex items-start gap-4 md:gap-6 mb-4 md:mb-6 flex-shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#f4cf75] flex items-center justify-center text-3xl md:text-4xl flex-shrink-0">
              👑
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-xl md:text-2xl lg:text-3xl mb-2">Araihan</h3>
              <p className="text-[#d6eeb9] text-sm md:text-base lg:text-lg">{t("araihan.subtitle")}</p>
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
              className="group relative w-full px-8 py-4 md:py-5 bg-[#f4cf75] text-[#194638] font-bold text-lg md:text-xl rounded-full transition-all duration-300 hover:-translate-y-1 flex-shrink-0 overflow-hidden"
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

  // Gameplay messages - elegant notification style - Mobile optimized
  // Badge style based on card type
  const getBadgeStyle = () => {
    if (cardType === "minion") {
      return "bg-gradient-to-br from-red-50 to-orange-50 text-red-700 border-red-200/50";
    } else if (cardType === "guardian" || cardType === "guardian-protect") {
      return "bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-700 border-emerald-200/50";
    } else if (cardType === "petal") {
      return "bg-gradient-to-br from-amber-50 to-yellow-50 text-amber-700 border-amber-200/50";
    }
    return "bg-gradient-to-br from-gray-50 to-slate-50 text-gray-700 border-gray-200/50";
  };
  
  const getBadgeIcon = () => {
    if (cardType === "minion") return "⚠️";
    if (cardType === "guardian" || cardType === "guardian-protect") return "🛡️";
    if (cardType === "petal") return "🌸";
    return "ℹ️";
  };
  
  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[9999] max-w-md w-[calc(100%-2rem)] sm:max-w-lg animate-fade-in">
      <div className={`relative ${getBadgeStyle()} backdrop-blur-md rounded-2xl shadow-2xl border-2 p-4 sm:p-5 transition-all duration-300 hover:shadow-3xl`}>
        {/* Golden accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-t-2xl" />
        
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Icon Badge */}
          <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg border-2 border-white/50">
            <span className="text-2xl sm:text-3xl">{getBadgeIcon()}</span>
          </div>
          
          {/* Message Content */}
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-sm sm:text-base leading-relaxed break-words font-medium" style={{ 
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              lineHeight: '1.6',
              letterSpacing: '0.01em'
            }}>
              {displayedMessage}
              {isTyping && (
                <span className="inline-block w-0.5 h-4 bg-current ml-1 animate-pulse">|</span>
              )}
            </p>
          </div>
          
          {/* Close Button */}
          {!isTyping && (
            <button
              onClick={() => {
                setIsManuallyDismissed(true);
                setIsVisible(false);
              }}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-white/50 hover:bg-white/80 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
              aria-label={t("game.close")}
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
        
        {/* Decorative shimmer effect */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />
        </div>
      </div>
    </div>
  );
}


"use client";

import { useState, useEffect, useCallback } from "react";
import Card from "./Card";
import { minionTypes, guardianTypes, getPetalPath } from "@/lib/gameData";

// Grid layout: exactly 8 cards (6 petals, 1 minion, 1 guardian)
const CARD_COUNT = 8; // Total cards in deck
const PETAL_COUNT = 6; // Number of petal cards needed

// CARD PATTERNS - Simplified and balanced
// Each pattern is an array of 8 positions: 'P' = Petal, 'G' = Guardian, 'M' = Minion
// Logic: Guardian appears before Minion to allow protection. Early petals hook players.
const CARD_PATTERNS = [
  // Pattern 1: Early petals, guardian early, minion late
  ['P', 'P', 'P', 'G', 'P', 'P', 'M', 'P'],
  
  // Pattern 2: Strong start, guardian mid, minion before last petal
  ['P', 'P', 'G', 'P', 'P', 'M', 'P', 'P'],
  
  // Pattern 3: Guardian very early, minion late
  ['P', 'G', 'P', 'P', 'P', 'M', 'P', 'P'],
  
  // Pattern 4: Four petals first, then guardian, then minion
  ['P', 'P', 'P', 'P', 'G', 'P', 'M', 'P'],
  
  // Pattern 5: Five petals, guardian late, minion very late
  ['P', 'P', 'P', 'P', 'P', 'G', 'M', 'P'],
  
  // Pattern 6: Balanced - petals, guardian, petals, minion, petals
  ['P', 'P', 'P', 'G', 'P', 'M', 'P', 'P'],
  
  // Pattern 7: Early guardian protection setup
  ['P', 'P', 'G', 'P', 'P', 'P', 'M', 'P'],
  
  // Pattern 8: Guardian in middle, minion near end
  ['P', 'P', 'P', 'P', 'G', 'M', 'P', 'P'],
  
  // Pattern 9: Fast start with early protection
  ['P', 'G', 'P', 'P', 'P', 'P', 'M', 'P'],
  
  // Pattern 10: Guardian early, minion mid-game
  ['P', 'P', 'G', 'P', 'M', 'P', 'P', 'P'],
  
  // Pattern 11: Three petals, guardian, two petals, minion, last petal
  ['P', 'P', 'P', 'G', 'P', 'P', 'M', 'P'],
  
  // Pattern 12: Guardian second, minion sixth
  ['P', 'G', 'P', 'P', 'P', 'M', 'P', 'P'],
  
  // Pattern 13: Four petals, guardian, minion, two petals
  ['P', 'P', 'P', 'P', 'G', 'M', 'P', 'P'],
  
  // Pattern 14: Early momentum with protection
  ['P', 'P', 'P', 'G', 'P', 'M', 'P', 'P'],
  
  // Pattern 15: Guardian first, then petals, minion late
  ['G', 'P', 'P', 'P', 'P', 'M', 'P', 'P'],
];

// Track used patterns to avoid repeats
let usedPatterns = new Set();
let availablePatterns = [...Array(15).keys()]; // [0, 1, 2, ..., 14]

export default function GameBoard({ country, petalsCollected, hasGuardian, onPetalCollected, onMinionRevealed, onGuardianActivated, onCardTypeChange, onPetalsCollectedUpdate }) {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCardType, setLastCardType] = useState(null);
  const [activeGuardian, setActiveGuardian] = useState(null);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [collectedPetals, setCollectedPetals] = useState([]); // Track which petal cards were collected
  const [lastRevealedCard, setLastRevealedCard] = useState(null); // Track last revealed card for display

  // Initialize deck
  useEffect(() => {
    initializeDeck();
  }, [country]);

  const initializeDeck = () => {
    // CASINO-STYLE DECK ARRANGEMENT
    // Selects from 20 pre-determined patterns that hook players with early wins
    
    // Reset if all patterns have been used
    if (availablePatterns.length === 0) {
      availablePatterns = [...Array(15).keys()];
      usedPatterns.clear();
    }
    
    // Randomly select a pattern from available ones
    const randomIndex = Math.floor(Math.random() * availablePatterns.length);
    const patternIndex = availablePatterns[randomIndex];
    const selectedPattern = CARD_PATTERNS[patternIndex];
    
    // Remove selected pattern from available list
    availablePatterns.splice(randomIndex, 1);
    usedPatterns.add(patternIndex);
    
    // Create all card objects first
    const petalCards = [];
    for (let i = 1; i <= PETAL_COUNT; i++) {
      petalCards.push({
        id: `petal-${i}`,
        type: "petal",
        image: getPetalPath(country.folder, i),
        petalNumber: i,
        country: country.country,
      });
    }

    // Only create 1 minion and 1 guardian (simplified game)
    const minionCards = [];
    const minion = minionTypes[Math.floor(Math.random() * minionTypes.length)];
    minionCards.push({
      id: `minion-0`,
      type: "minion",
      image: minion.image,
      minionData: minion,
    });

    const guardianCards = [];
    const guardian = guardianTypes[Math.floor(Math.random() * guardianTypes.length)];
    guardianCards.push({
      id: `guardian-0`,
      type: "guardian",
      image: guardian.image,
      guardianData: guardian,
    });

    // Build deck based on selected pattern
    const deck = [];
    const availablePetals = [...petalCards];
    const availableMinions = [...minionCards];
    const availableGuardians = [...guardianCards];
    
    // Shuffle each type's array to randomize which specific card is used
    const shuffle = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };
    
    const shuffledPetals = shuffle(availablePetals);
    const shuffledMinions = shuffle(availableMinions);
    const shuffledGuardians = shuffle(availableGuardians);
    
    let petalIndex = 0;
    let minionUsed = false;
    let guardianUsed = false;
    
    for (let i = 0; i < CARD_COUNT; i++) {
      const cardType = selectedPattern[i];
      
      if (cardType === 'P') {
        // Add petal card (cycle through all 6 petals)
        deck.push(shuffledPetals[petalIndex % PETAL_COUNT]);
        petalIndex++;
      } else if (cardType === 'G' && !guardianUsed) {
        // Add guardian card (only 1 guardian)
        deck.push(shuffledGuardians[0]);
        guardianUsed = true;
      } else if (cardType === 'M' && !minionUsed) {
        // Add minion card (only 1 minion)
        deck.push(shuffledMinions[0]);
        minionUsed = true;
      } else {
        // If guardian/minion already used but pattern calls for it, add a petal instead
        deck.push(shuffledPetals[petalIndex % PETAL_COUNT]);
        petalIndex++;
      }
    }

    // Verify we have exactly 8 cards
    if (deck.length !== CARD_COUNT) {
      console.warn("Deck size mismatch, filling with remaining cards");
      const allCards = [...petalCards, ...minionCards, ...guardianCards];
      const usedIds = new Set(deck.map(c => c.id));
      const remaining = allCards.filter(c => !usedIds.has(c.id));
      while (deck.length < CARD_COUNT && remaining.length > 0) {
        deck.push(remaining.shift());
      }
    }

    setCards(deck);
    setFlippedCards(new Set());
    setActiveGuardian(null);
    setCollectedPetals([]);
    setLastRevealedCard(null);
  };

  const handleCardFlip = useCallback(async (cardId) => {
    if (isProcessing || flippedCards.has(cardId)) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    setIsProcessing(true);
    setFlippedCards((prev) => new Set([...prev, cardId]));

    // Play card flip sound
    playSound("flip");

    // Wait for flip animation
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Handle different card types
    if (card.type === "petal") {
      playSound("petal");
      onPetalCollected();
      // Add to collected petals if not already collected
      setCollectedPetals((prev) => {
        if (!prev.find((p) => p.id === card.id)) {
          const updated = [...prev, card];
          if (onPetalsCollectedUpdate) {
            onPetalsCollectedUpdate(updated);
          }
          return updated;
        }
        return prev;
      });
      setLastRevealedCard(card);
      setLastCardType("petal");
      // Pass petal data for educational message
      if (onCardTypeChange) onCardTypeChange("petal", { petalNumber: card.petalNumber, country: country });
    } else if (card.type === "minion") {
      // Play minion sound immediately when revealed
      playSound("minion");
      
      const result = onMinionRevealed();
      setLastRevealedCard(card);
      setLastCardType("minion");
      // Pass minion data for the message - Official brief requires minion name
      if (onCardTypeChange) onCardTypeChange("minion", card.minionData);
      
      if (result === "reset") {
        // Calculate message typing duration + 2 seconds wait time
        // Message: "You revealed the [Minion Name] minion. The ecosystem falls back. We must start again…"
        const minionName = card.minionData?.name || "minion";
        const message = `You revealed the ${minionName} minion. The ecosystem falls back. We must start again…`;
        const typingSpeed = 20; // ms per character (from AraihanGuide)
        const typingDuration = message.length * typingSpeed;
        const waitAfterTyping = 2000; // 2 seconds after message finishes
        const totalWait = typingDuration + waitAfterTyping;
        
        // Wait for message to finish typing + 2 seconds
        await new Promise((resolve) => setTimeout(resolve, totalWait));
        initializeDeck();
        setLastCardType(null);
        setLastRevealedCard(null);
        if (onCardTypeChange) onCardTypeChange(null);
      } else {
        playSound("guardian-protect");
        setLastCardType("guardian-protect");
        if (onCardTypeChange) onCardTypeChange("guardian-protect");
        setTimeout(() => {
          setLastCardType(null);
          if (onCardTypeChange) onCardTypeChange(null);
        }, 2000);
      }
    } else if (card.type === "guardian") {
      playSound("guardian");
      onGuardianActivated();
      setActiveGuardian(card.guardianData);
      setLastRevealedCard(card);
      setLastCardType("guardian");
      if (onCardTypeChange) onCardTypeChange("guardian");
      setTimeout(() => {
        setLastCardType(null);
        if (onCardTypeChange) onCardTypeChange(null);
      }, 2000);
    }

    setIsProcessing(false);
  }, [cards, flippedCards, isProcessing, onPetalCollected, onMinionRevealed, onGuardianActivated]);

  const playSound = (type) => {
    // Import sound manager dynamically to avoid SSR issues
    if (typeof window !== "undefined") {
      import("@/lib/soundUtils").then((module) => {
        // Resume audio context if suspended (browser autoplay policy)
        if (module.default.audioContext && module.default.audioContext.state === 'suspended') {
          module.default.audioContext.resume();
        }
        module.default.play(type);
      });
    }
  };

  return (
    <div className="w-full relative flex-1 flex flex-col overflow-visible">
      {/* Game Status Bar - UNO Style - Mobile Optimized */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-2 mb-2 md:mb-3 px-2 sm:px-4 relative overflow-visible mt-14 md:mt-0">
        {/* Petal Counter Card */}
        <div className="bg-white border-2 border-purple-200 rounded-xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 shadow-lg flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 md:gap-3 w-full max-w-md overflow-hidden">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
              <div className="text-lg sm:text-xl md:text-2xl flex-shrink-0">🌸</div>
              <div className="flex flex-col min-w-0">
                <div className="text-gray-600 text-[8px] sm:text-[9px] md:text-[10px] font-medium whitespace-nowrap">Petals Collected</div>
                <div className="text-black text-sm sm:text-base md:text-lg font-bold whitespace-nowrap">
                  {petalsCollected} / {PETAL_COUNT}
                </div>
              </div>
            </div>
            <div className="flex gap-1 sm:gap-1 md:gap-1.5 flex-shrink-0">
              {Array.from({ length: PETAL_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center flex-shrink-0 ${
                  i < petalsCollected
                    ? "bg-gradient-to-br from-purple-500 to-pink-500 border-purple-300 scale-110 shadow-lg ring-2 ring-purple-200"
                    : "bg-gray-100 border-gray-300 scale-100"
                }`}
              >
                {i < petalsCollected && (
                  <span className="text-white text-[10px] sm:text-xs md:text-sm">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Araihan Character - Outside the box, next to it - Mobile optimized */}
        <div className="absolute right-2 sm:right-4 md:relative md:right-auto md:ml-4 top-1/2 md:top-auto transform md:transform-none -translate-y-1/2 md:translate-y-0 z-50 overflow-visible">
          {/* Improved hover effect - subtle glow */}
          <div className="absolute inset-0 rounded-full bg-red-500/0 group-hover:bg-red-500/10 transition-all duration-500 ease-out blur-lg -z-10 scale-125 pointer-events-none"
               style={{
                 animation: 'none',
               }}></div>
          
          <div className="relative group">
            {/* Animated SVG Creature Character - Red & Black, Non-Human */}
            <div 
              className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0 transition-all duration-500 cursor-pointer ${
                lastRevealedCard 
                  ? "animate-bounce scale-110" 
                  : "animate-pulse-slow scale-100 animate-float group-hover:scale-110 group-hover:brightness-110"
              }`}
              onClick={() => {
                // Click effect - trigger a bounce
                if (typeof window !== "undefined") {
                  import("@/lib/soundUtils").then((module) => {
                    // Resume audio context if suspended (browser autoplay policy)
                    if (module.default.audioContext && module.default.audioContext.state === 'suspended') {
                      module.default.audioContext.resume();
                    }
                    module.default.play("flip");
                  });
                }
              }}
            >
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
                
                {/* Eyes - Multiple simple dots */}
                {!lastRevealedCard ? (
                  // Sleeping - small dots
                  <>
                    <circle cx="24" cy="18" r="1.5" fill="#1F2937" opacity="0.5" />
                    <circle cx="32" cy="18" r="1.5" fill="#1F2937" opacity="0.5" />
                  </>
                ) : (
                  // Active - larger bright eyes
                  <>
                    <circle cx="24" cy="18" r="3" fill="#1F2937" />
                    <circle cx="32" cy="18" r="3" fill="#1F2937" />
                    <circle cx="24" cy="18" r="1.5" fill="#DC2626" />
                    <circle cx="32" cy="18" r="1.5" fill="#DC2626" />
                  </>
                )}
                
                {/* Simple mouth/opening */}
                {!lastRevealedCard ? (
                  // Sleeping - closed
                  <ellipse cx="28" cy="22" rx="2" ry="1" fill="#1F2937" opacity="0.4" />
                ) : (
                  // Active - open
                  <ellipse cx="28" cy="22" rx="3" ry="2" fill="#1F2937" opacity="0.6" />
                )}
                
                {/* Small appendages/tentacles */}
                <ellipse cx="16" cy="26" rx="2" ry="5" fill="#DC2626" transform="rotate(-30 16 26)" />
                <ellipse cx="40" cy="26" rx="2" ry="5" fill="#DC2626" transform="rotate(30 40 26)" />
                <ellipse cx="20" cy="36" rx="2" ry="4" fill="#DC2626" transform="rotate(-20 20 36)" />
                <ellipse cx="36" cy="36" rx="2" ry="4" fill="#DC2626" transform="rotate(20 36 36)" />
                
                {/* Improved glow effect when active - subtle pulse */}
                {lastRevealedCard && (
                  <>
                    <circle 
                      cx="28" 
                      cy="28" 
                      r="22" 
                      fill="#DC2626" 
                      opacity="0.1" 
                      style={{
                        animation: 'glow-pulse-smooth 2s ease-in-out infinite',
                      }}
                    />
                    <circle 
                      cx="28" 
                      cy="28" 
                      r="20" 
                      fill="#DC2626" 
                      opacity="0.08" 
                      style={{
                        animation: 'glow-pulse-smooth 2s ease-in-out infinite 0.3s',
                      }}
                    />
                  </>
                )}
              </svg>
            </div>
            
            {/* Sleeping state - Zzz when idle */}
            {!lastRevealedCard && (
              <div className="absolute -top-1 -right-1 text-yellow-200 text-[10px] animate-pulse font-bold">
                zzz
              </div>
            )}

            {/* Brief Message Bubble - Mobile optimized, positioned to avoid sidebar */}
            {(lastRevealedCard || hasGuardian) && (
              <div className="absolute top-1/2 -translate-y-1/2 left-full ml-2 sm:ml-3 md:ml-4 bg-purple-900/98 backdrop-blur-md rounded-lg sm:rounded-xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 animate-fade-in border-2 border-purple-400/60 shadow-2xl z-[100] max-w-[calc(100vw-140px)] sm:max-w-[calc(100vw-180px)] md:max-w-[400px]">
                <p className="text-white text-[10px] sm:text-xs md:text-sm font-medium break-words whitespace-normal leading-tight sm:leading-normal" style={{
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  lineHeight: '1.4'
                }}>
                  {lastCardType === "petal" && "Wow petal card!"}
                  {lastCardType === "minion" && !hasGuardian && "Oh no minion!"}
                  {lastCardType === "minion" && hasGuardian && "Guardian saved!"}
                  {lastCardType === "guardian" && activeGuardian && "Guardian active!"}
                  {hasGuardian && activeGuardian && !lastRevealedCard && "Guardian protecting!"}
                </p>
                {/* Speech bubble tail - pointing left, centered vertically */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-purple-900/98"></div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl bg-purple-400/20 blur-sm -z-10"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help Button - Top Left - Adjusted for mobile sidebar */}
      <button
        onClick={() => setShowHowToPlay(true)}
        className="fixed top-16 left-4 md:top-24 md:left-6 w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-[9997] text-xl md:text-3xl font-bold"
        aria-label="How to Play"
      >
        ?
      </button>

      {/* Cards Grid - Playing Area Panel - Mobile Optimized (8 cards: 2x4 mobile, 4x2 desktop) */}
      <div className="flex justify-center items-start px-2 sm:px-4 py-2 md:py-3 flex-1 overflow-visible pb-20 md:pb-4">
        {/* Playing Area Panel - Clear visual container */}
        <div className="w-full max-w-3xl bg-gradient-to-br from-green-50/50 to-emerald-50/50 rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 border-2 border-green-200/60 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3 w-full">
          {cards.map((card, index) => {
            const isFlipped = flippedCards.has(card.id);
            const totalCards = cards.length;
            const isGuardian = card.type === "guardian" && isFlipped;
            
            return (
              <div
                key={card.id}
                className="flex flex-col items-center justify-center animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Card
                  card={card}
                  isFlipped={isFlipped}
                  onFlip={handleCardFlip}
                  disabled={isProcessing}
                  index={index}
                  totalCards={totalCards}
                />
              </div>
            );
          })}
          </div>
        </div>
      </div>




      {/* How to Play Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowHowToPlay(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How to Play</h2>
              <button
                onClick={() => setShowHowToPlay(false)}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 text-xl font-bold transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              {/* Objective */}
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl"></span> Objective
                </h3>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  Collect all 6 petals to restore the national flower! Click on cards to reveal them and build your collection.
                </p>
              </div>

              {/* Card Types */}
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🃏</span> Card Types
                </h3>
                <div className="space-y-4">
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🌸</span>
                      <h4 className="font-bold text-purple-900 text-lg">Petal Cards</h4>
                    </div>
                    <p className="text-purple-800 text-sm md:text-base">
                      Collect these to progress! You need all 6 petals to complete the flower.
                    </p>
                  </div>

                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">👹</span>
                      <h4 className="font-bold text-red-900 text-lg">Minion Cards</h4>
                    </div>
                    <p className="text-red-800 text-sm md:text-base">
                      These are dangerous! If you reveal a minion without protection, you'll lose all collected petals and must start over.
                    </p>
                  </div>

                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🛡️</span>
                      <h4 className="font-bold text-green-900 text-lg">Guardian Cards (Power Cards)</h4>
                    </div>
                    <p className="text-green-800 text-sm md:text-base">
                      Activate protection! When you reveal a guardian, it protects you from the next minion. The guardian's name and power will appear under the card.
                    </p>
                  </div>
                </div>
              </div>

              {/* Gameplay */}
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎮</span> Gameplay
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 text-base md:text-lg">
                  <li>Click on any face-down card to reveal it</li>
                  <li>Collect petal cards to progress toward your goal</li>
                  <li>Use guardian cards to protect yourself from minions</li>
                  <li>If a minion appears without protection, you lose all progress</li>
                  <li>Collect all 6 petals to restore the flower!</li>
                </ol>
              </div>

              {/* Tips */}
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">💡</span> Tips
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-base md:text-lg">
                  <li>There's only 1 guardian and 1 minion in the deck - strategy matters!</li>
                  <li>The guardian protects you from the minion - find the guardian before the minion appears</li>
                  <li>Watch for the guardian status indicator at the top when protection is active</li>
                  <li>Plan your strategy carefully - with only 8 cards, every choice counts!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


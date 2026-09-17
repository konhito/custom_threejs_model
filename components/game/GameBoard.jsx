"use client";

import { useState, useEffect, useCallback } from "react";
import Card from "./Card";
import { minionTypes, guardianTypes, getPetalPath } from "@/lib/gameData";
import { useTranslation } from "@/lib/useTranslation";
import styles from "./GameBoard.module.css";
import MuteButton from "./MuteButton";

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

export default function GameBoard({ country, petalsCollected, hasGuardian, isMuted, onToggleMute, onPetalCollected, onMinionRevealed, onGuardianActivated, onCardTypeChange, onPetalsCollectedUpdate }) {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCardType, setLastCardType] = useState(null);
  const [activeGuardian, setActiveGuardian] = useState(null);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [collectedPetals, setCollectedPetals] = useState([]); // Track which petal cards were collected
  const [lastRevealedCard, setLastRevealedCard] = useState(null); // Track last revealed card for display
  const { t } = useTranslation();

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
        // Message: "You revealed the [Minion Name] minion. The ecosystem is set back. We must start again…"
        const minionName = card.minionData?.name || "minion";
        const message = `You revealed the ${minionName} minion. The ecosystem is set back. We must start again…`;
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
    <div className={styles.layout}>
      <div className={styles.toolbar}>
        <button onClick={() => setShowHowToPlay(true)} className={styles.help} aria-label="How to Play">
          ?
        </button>
        <MuteButton isMuted={isMuted} onToggle={onToggleMute} gameState="playing" />
      </div>
      <section className={styles.surface} aria-label={`${country.flowerName} card game`}>
        <div className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>{country.country} / Guardians of Flowers</p>
            <h1 className={styles.title}>Restore the {country.flowerName}</h1>
          </div>
          <div className={styles.progress} aria-label={`${petalsCollected} of 6 petals collected`}>
            <span className={styles.progressLabel}>Petals collected</span>
            <strong>{petalsCollected}<span> / 6</span></strong>
            <div className={styles.progressDots} aria-hidden="true">
              {Array.from({ length: 6 }, (_, index) => (
                <i key={index} className={index < petalsCollected ? styles.collected : ""} />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.cards}>
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              isFlipped={flippedCards.has(card.id)}
              onFlip={handleCardFlip}
              disabled={isProcessing}
            />
          ))}
        </div>
        <p className={styles.hint}>Choose a card to reveal what grows beneath.</p>
      </section>

      {/* How to Play Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowHowToPlay(false)}>
          <div
            className="relative max-w-lg w-full max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl border border-amber-300/40"
            style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 30%, #f5f0e1 60%, #d9f99d 100%)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between rounded-t-2xl border-b border-amber-300/30" style={{ background: 'linear-gradient(135deg, #92400e, #78350f)' }}>
              <h2 className="text-xl md:text-2xl font-bold text-amber-100 tracking-wide">{t('game.howToPlay')}</h2>
              <button
                onClick={() => setShowHowToPlay(false)}
                className="w-8 h-8 rounded-lg bg-amber-100/20 hover:bg-amber-100/40 flex items-center justify-center text-amber-100 text-lg font-bold transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-5 md:p-6 space-y-5">
              {/* Objective */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-200/40">
                <h3 className="text-base md:text-lg font-bold text-amber-900 mb-2">{t('game.objective')}</h3>
                <p className="text-amber-800 text-sm md:text-base leading-relaxed">
                  {t('game.collectAllPetals')}
                </p>
              </div>

              {/* Card Types */}
              <div className="space-y-3">
                <h3 className="text-base md:text-lg font-bold text-amber-900 px-1">{t('game.cards')}</h3>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-pink-200/50">
                  <h4 className="font-semibold text-pink-900 text-sm md:text-base mb-1">{t('game.petalCards')}</h4>
                  <p className="text-pink-800/80 text-xs md:text-sm">{t('game.petalCardsDesc')}</p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-red-200/50">
                  <h4 className="font-semibold text-red-900 text-sm md:text-base mb-1">{t('game.minionCards')}</h4>
                  <p className="text-red-800/80 text-xs md:text-sm">{t('game.minionCardsDesc')}</p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/50">
                  <h4 className="font-semibold text-emerald-900 text-sm md:text-base mb-1">{t('game.guardianCards')}</h4>
                  <p className="text-emerald-800/80 text-xs md:text-sm">{t('game.guardianCardsDesc')}</p>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-200/40">
                <h3 className="text-base md:text-lg font-bold text-amber-900 mb-2">{t('game.tips')}</h3>
                <ul className="space-y-2 text-amber-800/90 text-xs md:text-sm">
                  <li className="flex gap-2"><span className="text-amber-600 font-bold">•</span> {t('game.tip1')}</li>
                  <li className="flex gap-2"><span className="text-amber-600 font-bold">•</span> {t('game.tip2')}</li>
                  <li className="flex gap-2"><span className="text-amber-600 font-bold">•</span> {t('game.tip3')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


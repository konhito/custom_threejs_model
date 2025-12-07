"use client";

import { useState, useEffect, useCallback } from "react";
import GameBoard from "@/components/game/GameBoard";
import FlowerFormation from "@/components/game/FlowerFormation";
import GameLoader from "@/components/game/GameLoader";
import StartButton from "@/components/game/StartButton";
import AraihanGuide from "@/components/game/AraihanGuide";
import { countriesData, getPetalPath, getCardBackPath, minionTypes, guardianTypes } from "@/lib/gameData";
import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";
import GridScan from "../../components/GridScan";

export default function GamePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showStartButton, setShowStartButton] = useState(true);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [gameState, setGameState] = useState("intro"); // intro, playing, flowerFormation, completed
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [petalsCollected, setPetalsCollected] = useState(0);
  const [hasGuardian, setHasGuardian] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [lastCardType, setLastCardType] = useState(null);
  const [lastCardData, setLastCardData] = useState(null); // Store card data (minion/guardian info)
  const [isMuted, setIsMuted] = useState(false);
  const [collectedPetals, setCollectedPetals] = useState([]); // Store collected petal cards
  const [showIntro, setShowIntro] = useState(true); // Show Araihan intro message

  // Initialize with a random country or let user choose
  useEffect(() => {
    if (!selectedCountry && countriesData.length > 0) {
      // Default to first country or random
      const randomCountry = countriesData[Math.floor(Math.random() * countriesData.length)];
      setSelectedCountry(randomCountry);
    }
  }, []);


  const toggleMute = () => {
    if (typeof window !== "undefined") {
      import("@/lib/soundUtils").then((module) => {
        const newMuted = module.default.toggleMute();
        setIsMuted(newMuted);
      });
    }
  };

  const handlePetalCollected = useCallback(() => {
    setPetalsCollected((prev) => {
      const newCount = prev + 1;
      if (newCount >= 6) {
        // Play special sound when all petals collected
        if (typeof window !== "undefined") {
          import("@/lib/soundUtils").then((module) => {
            module.default.play("flower-complete");
          });
        }
        setTimeout(() => {
          setGameState("flowerFormation");
        }, 1000);
      }
      return newCount;
    });
  }, []);

  const handleMinionRevealed = useCallback(() => {
    if (hasGuardian) {
      setHasGuardian(false);
      return "protected";
    }
    // Reset game
    setPetalsCollected(0);
    return "reset";
  }, [hasGuardian]);

  const handleGuardianActivated = useCallback(() => {
    setHasGuardian(true);
  }, []);

  const handleFlowerComplete = () => {
    // Play victory celebration sound
    if (typeof window !== "undefined") {
      import("@/lib/soundUtils").then((module) => {
        module.default.play("victory");
      });
    }
    setGameState("completed");
  };

  const handleRestart = () => {
    setGameState("playing");
    setPetalsCollected(0);
    setHasGuardian(false);
  };

  const handleLoaderComplete = () => {
    setIsLoading(false);
  };

  // Load all flower assets
  const loadAllFlowerAssets = useCallback(async () => {
    setIsLoadingAssets(true);
    
    const imagePromises = [];
    
    // Load card back
    const backCard = new Image();
    backCard.src = getCardBackPath();
    imagePromises.push(new Promise((resolve) => {
      backCard.onload = resolve;
      backCard.onerror = resolve; // Continue even if image fails
    }));
    
    // Only load current country's petals (6 petals) - not all countries
    if (selectedCountry) {
      for (let i = 1; i <= 6; i++) {
        const img = new Image();
        img.src = getPetalPath(selectedCountry.folder, i);
        imagePromises.push(new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        }));
      }
    }
    
    // Load all minion images
    minionTypes.forEach((minion) => {
      const img = new Image();
      img.src = minion.image;
      imagePromises.push(new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      }));
    });
    
    // Load all guardian images
    guardianTypes.forEach((guardian) => {
      const img = new Image();
      img.src = guardian.image;
      imagePromises.push(new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      }));
    });
    
    // Wait for all images to load (or timeout after 5 seconds)
    try {
      await Promise.race([
        Promise.all(imagePromises),
        new Promise((resolve) => setTimeout(() => {
          console.log('Image loading timeout after 5 seconds');
          resolve();
        }, 5000))
      ]);
    } catch (error) {
      console.error('Error loading images:', error);
    }
    
    // Always stop loading after 5 seconds max
    setIsLoadingAssets(false);
    setShowStartButton(false);
    setGameState("playing");
    
    // Start ambient music
    if (typeof window !== "undefined") {
      import("@/lib/soundUtils").then((module) => {
        module.default.playAmbient();
      });
    }
  }, [selectedCountry]);

  const handleStartButtonClick = () => {
    setShowStartButton(false);
    setIsLoadingAssets(true);
    
    // Guaranteed timeout - always stop loading after 2 seconds
    const timeoutId = setTimeout(() => {
      setIsLoadingAssets(false);
      setShowStartButton(false);
      setGameState("playing");
      
      // Start ambient music
      if (typeof window !== "undefined") {
        import("@/lib/soundUtils").then((module) => {
          module.default.playAmbient();
        }).catch(() => {
          // Silently fail if sound utils not available
        });
      }
    }, 2000);
    
    // Load assets in background - don't wait for them
    loadAllFlowerAssets().catch(() => {
      // Silently handle errors
    }).finally(() => {
      // Assets loaded or failed - already handled by timeout
    });
  };

  // Show initial loader while loading
  if (isLoading) {
    return <GameLoader onComplete={handleLoaderComplete} />;
  }

  return (
    <div className={`min-h-screen relative overflow-x-hidden overflow-y-auto ${(gameState === "playing" && !isLoadingAssets) || gameState === "completed" ? "bg-white text-black" : "bg-black text-white"}`}>
      {/* GridScan background - Only show before card game loads */}
      {!gameState || (gameState !== "playing" && gameState !== "completed") || isLoadingAssets ? (
        <div className="fixed inset-0 z-0" style={{ width: '100%', height: '100%' }}>
          <GridScan
            sensitivity={0.55}
            lineThickness={1}
            linesColor="#392e4e"
            gridScale={0.1}
            scanColor="#FF9FFC"
            scanOpacity={0.4}
            enablePost
            bloomIntensity={0.6}
            chromaticAberration={0.002}
            noiseIntensity={0.01}
          />
        </div>
      ) : (
        /* Background with subtle leaf outlines like the image */
        <div 
          className="fixed inset-0 z-0"
          style={{
            background: 'linear-gradient(180deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)'
          }}
        >
          {/* Subtle leaf outlines scattered across background */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            {/* Faint leaf outlines - scattered throughout */}
            <g opacity="0.15" stroke="#a5d6a7" strokeWidth="1" fill="none">
              {/* Leaf 1 - top left */}
              <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(8%, 10%) scale(0.6)" />
              {/* Leaf 2 - top center */}
              <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(45%, 8%) scale(0.5) rotate(25)" />
              {/* Leaf 3 - top right */}
              <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(82%, 12%) scale(0.55) rotate(-15)" />
              {/* Leaf 4 - middle left */}
              <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(12%, 35%) scale(0.45) rotate(-30)" />
              {/* Leaf 5 - middle */}
              <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(50%, 40%) scale(0.5) rotate(40)" />
              {/* Leaf 6 - middle right */}
              <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(85%, 38%) scale(0.48) rotate(-25)" />
              {/* Leaf 7 - bottom left */}
              <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(10%, 65%) scale(0.52) rotate(20)" />
              {/* Leaf 8 - bottom center */}
              <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(48%, 68%) scale(0.46) rotate(-35)" />
              {/* Leaf 9 - bottom right */}
              <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(88%, 70%) scale(0.5) rotate(30)" />
              {/* Additional smaller leaves */}
              <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(25%, 20%) scale(0.35) rotate(15)" />
              <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(70%, 25%) scale(0.38) rotate(-20)" />
              <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(30%, 55%) scale(0.32) rotate(45)" />
              <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(65%, 58%) scale(0.36) rotate(-40)" />
            </g>

            {/* Subtle vine outlines */}
            <g opacity="0.12" stroke="#a5d6a7" strokeWidth="1.5" fill="none">
              <path d="M0 85 Q15 80 30 85 T60 85 T90 85" />
              <path d="M5 90 Q20 85 35 90 T65 90 T95 90" />
              <path d="M10 92 Q25 87 40 92 T70 92" />
            </g>

            {/* Tiny pink petal specks */}
            <g opacity="0.2" fill="#f8bbd0">
              <circle cx="15%" cy="25%" r="2" />
              <circle cx="35%" cy="15%" r="1.5" />
              <circle cx="75%" cy="20%" r="2" />
              <circle cx="20%" cy="50%" r="1.5" />
              <circle cx="60%" cy="45%" r="2" />
              <circle cx="85%" cy="55%" r="1.5" />
              <circle cx="25%" cy="75%" r="2" />
              <circle cx="55%" cy="80%" r="1.5" />
              <circle cx="80%" cy="75%" r="2" />
            </g>
          </svg>
        </div>
      )}

      {/* Start Button - Fixed in center of screen */}
      {showStartButton && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-30 gap-10 md:gap-12">
          <div className="flex flex-col items-center gap-3 relative w-full max-w-4xl px-4">
            <div className="relative inline-block">
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-[0_0_10px_rgba(177,158,239,0.5)]"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                <span>Card </span>
                <span className="relative inline-block">
                  game
                  <p 
                    className="text-[8px] md:text-[10px] lg:text-xs text-purple-200 absolute top-full mt-1 left-0 whitespace-nowrap"
                    style={{ 
                      fontFamily: '"Press Start 2P", monospace'
                    }}
                  >
                    by Proveneya & Nahiara
                  </p>
                </span>
              </h2>
            </div>
          </div>
          <StartButton onClick={handleStartButtonClick} />
        </div>
      )}

      {/* GIF Loader - Show while loading assets */}
      {isLoadingAssets && (
        <div className="fixed inset-0 flex items-center justify-center z-30 bg-black">
          <img 
            src="/37wQ.gif" 
            alt="Loading..." 
            className="max-w-full max-h-[60vh] object-contain"
          />
        </div>
      )}


      {/* Mute Button - Top Left */}
      <button
        onClick={toggleMute}
        className={`fixed top-4 left-4 md:top-6 md:left-6 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-50 ${
          gameState === "completed" || (gameState === "playing" && !isLoadingAssets)
            ? "bg-black/10 hover:bg-black/20"
            : "bg-white/10 hover:bg-white/20"
        }`}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className={`w-5 h-5 md:w-6 md:h-6 ${gameState === "completed" || (gameState === "playing" && !isLoadingAssets) ? "text-black" : "text-white"}`} />
        ) : (
          <Volume2 className={`w-5 h-5 md:w-6 md:h-6 ${gameState === "completed" || (gameState === "playing" && !isLoadingAssets) ? "text-black" : "text-white"}`} />
        )}
      </button>

      {/* Araihan Intro Message - Official Brief Requirement - Bottom Left */}
      {/* Show only after clicking "Play Now" button, when on card page */}
      {showIntro && !isLoading && !showStartButton && gameState === "playing" && (
        <AraihanGuide
          message="Hello, I am Araihan, loyal squire of Nahiara. Welcome to the Nahiara and the Guardians of the Flowers Game. I am a bit sleepy… and I love natural gummies: strawberries, raspberries, blackberries… But I don't like processed candies at all. Let's have fun together. Would you like to play with me?"
          onAction={() => {
            setShowIntro(false);
          }}
          actionText="Yes, let's play!"
          showAction={false}
          isIntro={true}
        />
      )}

      <div className="relative z-10 container mx-auto px-2 py-2 md:py-4 h-screen flex flex-col">

        {/* Araihan Messages During Gameplay - Subtle notification */}
        {gameState === "playing" && lastCardType && (
          <AraihanGuide
            message=""
            cardType={lastCardType}
            country={selectedCountry?.country || selectedCountry?.name}
            guardianData={lastCardData}
            showAction={false}
          />
        )}

        {/* Game Content */}
        {gameState === "playing" && selectedCountry && (
          <div className="w-full flex-1 flex flex-col overflow-visible">
            <GameBoard
              country={selectedCountry}
              petalsCollected={petalsCollected}
              hasGuardian={hasGuardian}
              onPetalCollected={handlePetalCollected}
              onMinionRevealed={handleMinionRevealed}
              onGuardianActivated={handleGuardianActivated}
              onCardTypeChange={(type, data) => {
                setLastCardType(type);
                setLastCardData(data);
              }}
              onPetalsCollectedUpdate={setCollectedPetals}
            />
          </div>
        )}

        {gameState === "flowerFormation" && selectedCountry && (
          <FlowerFormation
            country={selectedCountry}
            onComplete={handleFlowerComplete}
          />
        )}

        {gameState === "completed" && selectedCountry && (
          <div className="max-w-5xl mx-auto px-4 relative">
            {/* Party Poppers - Animated */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const distance = 200 + Math.random() * 100;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                return (
                  <div
                    key={i}
                    className="absolute text-4xl md:text-5xl animate-bounce"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)',
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '1.5s',
                    }}
                  >
                    🎉
                  </div>
                );
              })}
              {/* Additional floating poppers */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`popper-${i}`}
                  className="absolute text-3xl md:text-4xl animate-pulse"
                  style={{
                    left: `${10 + i * 12}%`,
                    top: `${15 + (i % 3) * 25}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '2s',
                  }}
                >
                  🎊
                </div>
              ))}
            </div>

            {/* Araihan Character - Same as in game */}
            <div className="flex justify-center mb-6 relative z-20">
              <div className="relative group">
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center flex-shrink-0 transition-all duration-500 animate-bounce">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 56 56"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    <path d="M28 40 Q20 38 18 32 Q16 26 20 24 Q18 22 22 20 Q26 18 28 22 Q30 18 34 20 Q38 22 36 24 Q40 26 38 32 Q36 38 28 40 Z" fill="#DC2626" />
                    <ellipse cx="28" cy="18" rx="10" ry="11" fill="#DC2626" />
                    <circle cx="24" cy="30" r="2.5" fill="#1F2937" opacity="0.7" />
                    <circle cx="32" cy="28" r="2" fill="#1F2937" opacity="0.7" />
                    <circle cx="26" cy="34" r="1.5" fill="#1F2937" opacity="0.6" />
                    <circle cx="24" cy="18" r="3" fill="#1F2937" />
                    <circle cx="32" cy="18" r="3" fill="#1F2937" />
                    <circle cx="24" cy="18" r="1.5" fill="#DC2626" />
                    <circle cx="32" cy="18" r="1.5" fill="#DC2626" />
                    <ellipse cx="28" cy="22" rx="3" ry="2" fill="#1F2937" opacity="0.6" />
                    <ellipse cx="16" cy="26" rx="2" ry="5" fill="#DC2626" transform="rotate(-30 16 26)" />
                    <ellipse cx="40" cy="26" rx="2" ry="5" fill="#DC2626" transform="rotate(30 40 26)" />
                    <ellipse cx="20" cy="36" rx="2" ry="4" fill="#DC2626" transform="rotate(-20 20 36)" />
                    <ellipse cx="36" cy="36" rx="2" ry="4" fill="#DC2626" transform="rotate(20 36 36)" />
                  </svg>
                </div>
                {/* Message Bubble */}
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-4 bg-purple-900/98 backdrop-blur-md rounded-xl px-4 py-3 animate-fade-in border-2 border-purple-400/60 shadow-2xl z-20 whitespace-nowrap max-w-[300px]">
                  <p className="text-white text-sm font-medium">
                    🎉 Congratulations! You restored the flower!
                  </p>
                  <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-purple-900/98"></div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 mb-8 shadow-lg relative z-20">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Congratulations!
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                You restored the flower of {selectedCountry.country}!
              </p>

              {/* 2x3 Grid - Petals 1-3 top, 4-6 bottom */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Collected Petals</h3>
                <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto">
                  {/* Row 1: Petals 1, 2, 3 */}
                  {[1, 2, 3].map((petalNum) => {
                    const petalPath = getPetalPath(selectedCountry.folder, petalNum);
                    return (
                      <div
                        key={petalNum}
                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-purple-200 shadow-lg bg-white transition-all duration-200 hover:scale-105 hover:shadow-xl hover:border-purple-400"
                      >
                        <div className="w-full h-full p-4">
                          <Image
                            src={petalPath}
                            alt={`Petal ${petalNum}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    );
                  })}
                  {/* Row 2: Petals 4, 5, 6 */}
                  {[4, 5, 6].map((petalNum) => {
                    const petalPath = getPetalPath(selectedCountry.folder, petalNum);
                    return (
                      <div
                        key={petalNum}
                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-purple-200 shadow-lg bg-white transition-all duration-200 hover:scale-105 hover:shadow-xl hover:border-purple-400"
                      >
                        <div className="w-full h-full p-4">
                          <Image
                            src={petalPath}
                            alt={`Petal ${petalNum}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 text-left bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedCountry.flowerName}
                </h3>
                <p className="text-lg text-gray-600 italic mb-4">
                  {selectedCountry.flowerScientificName}
                </p>
                <p className="text-base text-gray-700 leading-relaxed">
                  {selectedCountry.flowerDescription}
                </p>
              </div>
              <button
                onClick={handleRestart}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


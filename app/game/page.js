"use client";

// ... imports
import { useState, useEffect, useCallback, useRef } from "react";
import GameBoard from "@/components/game/GameBoard";
import FlowerFormation from "@/components/game/FlowerFormation";
import PageLoader from "@/components/PageLoader"; // Replaces GameLoader
import StartButton from "@/components/game/StartButton";
import AraihanGuide from "@/components/game/AraihanGuide";
import WorldMapGarden from "@/components/game/WorldMapGarden";
import { countriesData, getPetalPath, getCardBackPath, minionTypes, guardianTypes, verifyCompleteFlowerImages } from "@/lib/gameData";
import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";
import GridScan from "../../components/GridScan";
import { useTranslation } from "@/lib/useTranslation";

export default function GamePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showStartButton, setShowStartButton] = useState(true);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [gameState, setGameState] = useState("intro"); // intro, playing, flowerFormation, globeAnimation, completed
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [petalsCollected, setPetalsCollected] = useState(0);
  const [hasGuardian, setHasGuardian] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [lastCardType, setLastCardType] = useState(null);
  const [lastCardData, setLastCardData] = useState(null); // Store card data (minion/guardian info)
  const [isMuted, setIsMuted] = useState(false);
  const [collectedPetals, setCollectedPetals] = useState([]); // Store collected petal cards
  const [showIntro, setShowIntro] = useState(false); // Show Araihan intro message - default false, will be set based on localStorage
  const [isSharing, setIsSharing] = useState(false); // Share button loading state
  const [completedFlowers, setCompletedFlowers] = useState([]); // Track all completed flowers for world map
  const { t } = useTranslation();

  // Initial loader logic (formerly in GameLoader)
  useEffect(() => {
    // Minimum time to show the loader (to allow for smooth animation)
    const MIN_LOADER_TIME = 4000;
    const startTime = Date.now();

    // Play loading sound
    const playLoadingSound = () => {
      try {
        if (typeof window !== "undefined") {
          import("@/lib/soundUtils").then((module) => {
            module.default.play("loading");
          }).catch(() => { });
        }
      } catch (error) {
        console.log("Could not play loading sound");
      }
    };
    playLoadingSound();

    // Preload basic assets
    const preloadAssets = async () => {
      const assetsToLoad = [];
      const loadImage = (src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        });
      };

      // Load card back
      assetsToLoad.push(loadImage(getCardBackPath()));

      // Load first country's petals
      if (countriesData.length > 0) {
        const firstCountry = countriesData[0];
        for (let i = 1; i <= 6; i++) {
          assetsToLoad.push(loadImage(getPetalPath(firstCountry.folder, i)));
        }
      }

      // Load guardian & minion images
      guardianTypes.forEach((guardian) => {
        assetsToLoad.push(loadImage(guardian.image));
      });
      minionTypes.forEach((minion) => {
        assetsToLoad.push(loadImage(minion.image));
      });

      // Wait for assets or timeout
      await Promise.race([
        Promise.allSettled(assetsToLoad),
        new Promise(resolve => setTimeout(resolve, 3000))
      ]);
    };

    const runLoader = async () => {
      await preloadAssets();

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_LOADER_TIME - elapsed);

      setTimeout(() => {
        setIsLoading(false);
      }, remaining);
    };

    runLoader();
  }, []);

  // Check if user has seen intro before (localStorage) and load completed flowers
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSeenIntro = localStorage.getItem('araihanIntroSeen');
      if (!hasSeenIntro) {
        // First time player - show intro
        setShowIntro(true);
      }

      // Load completed flowers from localStorage
      const savedFlowers = localStorage.getItem('completedFlowers');
      if (savedFlowers) {
        try {
          setCompletedFlowers(JSON.parse(savedFlowers));
        } catch (e) {
          console.error('Failed to load completed flowers:', e);
        }
      }

      // Verify all countries have complete flower images mapped
      verifyCompleteFlowerImages();
    }
  }, []);

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
        // Resume audio context if suspended
        if (module.default.audioContext && module.default.audioContext.state === 'suspended') {
          module.default.audioContext.resume();
        }

        const newMuted = module.default.toggleMute();
        setIsMuted(newMuted);

        // Play a test sound when unmuting
        if (!newMuted) {
          setTimeout(() => {
            module.default.play("button-click");
          }, 100);
        }
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

    // Add current flower to completed collection
    if (selectedCountry && typeof window !== "undefined") {
      const updatedFlowers = [...new Set([...completedFlowers, selectedCountry.id])];
      setCompletedFlowers(updatedFlowers);
      localStorage.setItem('completedFlowers', JSON.stringify(updatedFlowers));
    }

    // First show the golden globe animation
    setGameState("globeAnimation");
    // Then show the congratulations page after animation
    setTimeout(() => {
      setGameState("completed");
    }, 4000); // 4 seconds for globe animation
  };

  const handleRestart = () => {
    // Select a different random country
    const getRandomDifferentCountry = () => {
      if (countriesData.length <= 1) {
        return countriesData[0]; // If only one country, return it
      }

      // Filter out the current country and select a random one from the rest
      const otherCountries = countriesData.filter(
        country => country.id !== selectedCountry?.id
      );
      const randomIndex = Math.floor(Math.random() * otherCountries.length);
      return otherCountries[randomIndex];
    };

    const newCountry = getRandomDifferentCountry();
    setSelectedCountry(newCountry);

    // Reset all game state
    setGameState("playing");
    setPetalsCollected(0);
    setHasGuardian(false);
    setCollectedPetals([]);
    setShowIntro(false); // Don't show intro on restart - user has already seen it
    setLastCardType(null);
    setLastCardData(null);
    setGameStarted(false);
  };

  const handleShare = async () => {
    if (isSharing) return; // Prevent multiple clicks
    setIsSharing(true);

    try {
      const shareText = `🌸 I just restored the ${selectedCountry.flowerName} in the Guardians of Flowers game!\n\n✨ Play now at aquamundi.org/game`;
      const shareUrl = 'https://aquamundi.org/game';

      // Create a canvas to draw the victory screenshot
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1200;
      canvas.height = 630; // Optimal for social media

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#faf5ff');
      gradient.addColorStop(0.5, '#fce7f3');
      gradient.addColorStop(1, '#f0fdf4');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add decorative elements
      ctx.fillStyle = 'rgba(147, 51, 234, 0.1)';
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 30 + 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // Title
      ctx.fillStyle = '#7c3aed';
      ctx.font = 'bold 72px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌟 VICTORY! 🌟', canvas.width / 2, 120);

      // Flower info
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 48px Arial, sans-serif';
      ctx.fillText(`${selectedCountry.flowerName}`, canvas.width / 2, 200);

      ctx.fillStyle = '#6b7280';
      ctx.font = 'italic 32px Arial, sans-serif';
      ctx.fillText(`${selectedCountry.flowerScientificName}`, canvas.width / 2, 250);

      // Country badge
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.fillText(`${selectedCountry.country}`, canvas.width / 2, 310);

      // Achievement
      ctx.fillStyle = '#7c3aed';
      ctx.font = 'bold 42px Arial, sans-serif';
      ctx.fillText('🏆 Guardian of Nature 🏆', canvas.width / 2, 390);

      // Stats
      ctx.fillStyle = '#ec4899';
      ctx.font = 'bold 38px Arial, sans-serif';
      ctx.fillText('6/6 Petals • 100% Complete • Perfect!', canvas.width / 2, 450);

      // Game link - highlighted
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.fillRect(250, 490, 700, 80);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 4;
      ctx.strokeRect(250, 490, 700, 80);

      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 44px monospace';
      ctx.fillText('🎮 aquamundi.org/game', canvas.width / 2, 545);

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        try {
          const file = new File([blob], 'flower-victory.png', { type: 'image/png' });

          // Try native share with image
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'Guardians of Flowers - Victory!',
              text: shareText,
              url: shareUrl,
              files: [file]
            });
          } else if (navigator.share) {
            // Share without image
            await navigator.share({
              title: 'Guardians of Flowers - Victory!',
              text: shareText,
              url: shareUrl
            });
          } else {
            // Fallback: Download image and copy text
            const link = document.createElement('a');
            link.download = 'flower-victory.png';
            link.href = URL.createObjectURL(blob);
            link.click();

            await navigator.clipboard.writeText(shareText + '\n' + shareUrl);
            alert('✅ Victory screenshot downloaded!\n📋 Message copied to clipboard!\n\n' + shareText);
          }
        } catch (error) {
          console.log('Share cancelled or failed', error);
        }
      }, 'image/png');

    } catch (error) {
      console.log('Share error:', error);
      // Simple fallback
      const fallbackText = `🌸 I restored the ${selectedCountry.flowerName}!\nPlay at aquamundi.org/game`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(fallbackText);
        alert('📋 Copied to clipboard!\n\n' + fallbackText);
      }
    } finally {
      setIsSharing(false);
    }
  };

  // Load all flower assets (for game start)
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

    // Initialize audio context on user interaction (required by browsers)
    if (typeof window !== "undefined") {
      import("@/lib/soundUtils").then((module) => {
        // Resume audio context if suspended
        if (module.default.audioContext && module.default.audioContext.state === 'suspended') {
          module.default.audioContext.resume();
        }
        // Play a test sound to ensure audio is working
        module.default.play("button-click");
      }).catch(() => {
        // Silently fail if sound utils not available
      });
    }

    // Guaranteed timeout - always stop loading after 2 seconds
    const timeoutId = setTimeout(() => {
      setIsLoadingAssets(false);
      setShowStartButton(false);
      setGameState("playing");

      // Start ambient music
      if (typeof window !== "undefined") {
        import("@/lib/soundUtils").then((module) => {
          // Resume audio context again if needed
          if (module.default.audioContext && module.default.audioContext.state === 'suspended') {
            module.default.audioContext.resume();
          }
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

  return (
    <div className={`min-h-screen relative overflow-x-hidden overflow-y-auto ${(gameState === "playing" && !isLoadingAssets) || gameState === "completed" ? "text-black" : "bg-black text-white"}`}>

      {/* Page Loader - visible while isLoading is true */}
      <PageLoader isLoading={isLoading} />

      {/* GridScan background - Only show on start screen before any loading */}
      {!isLoading && !isLoadingAssets && showStartButton ? (
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
        /* Game_bg.png - shown during asset loading and when playing/completed */
        <div
          className="fixed inset-0 z-0 min-h-screen min-h-[100dvh] min-w-full w-full overflow-hidden bg-black"
          style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.5s ease-out" }}
        >
          <img
            src="/Game_bg.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
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

      {/* Loader - Show while loading assets (Game_bg visible behind) */}
      {isLoadingAssets && (
        <div className="fixed inset-0 flex items-center justify-center z-30 bg-transparent">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="relative w-full h-full max-w-[90vw] max-h-[90vh] sm:max-w-[80vw] sm:max-h-[80vh] md:max-w-[70vw] md:max-h-[70vh] lg:max-w-[60vw] lg:max-h-[60vh]">
              <Image
                src="/X4SS63h7k5umY.webp"
                alt="Loading..."
                fill
                className="object-contain"
                unoptimized
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 60vw"
              />
            </div>
          </div>
        </div>
      )}


      {/* Mute Button - Top Left - Adjusted for mobile - Scaled up */}
      <button
        onClick={toggleMute}
        className={`fixed top-4 left-4 md:top-6 md:left-6 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-[9996] touch-manipulation ${gameState === "completed" || (gameState === "playing" && !isLoadingAssets)
          ? "bg-black/10 hover:bg-black/20"
          : "bg-white/10 hover:bg-white/20"
          }`}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${gameState === "completed" || (gameState === "playing" && !isLoadingAssets) ? "text-black" : "text-white"}`} />
        ) : (
          <Volume2 className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${gameState === "completed" || (gameState === "playing" && !isLoadingAssets) ? "text-black" : "text-white"}`} />
        )}
      </button>

      {/* Araihan Intro Message - Official Brief Requirement - Bottom Left */}
      {/* Show only after clicking "Play Now" button, when on card page */}
      {showIntro && !isLoading && !showStartButton && gameState === "playing" && (
        <AraihanGuide
          message={t('araihan.intro')}
          onAction={() => {
            setShowIntro(false);
            // Mark intro as seen in localStorage
            if (typeof window !== "undefined") {
              localStorage.setItem('araihanIntroSeen', 'true');
            }
          }}
          actionText={t('game.yesLetsPlay')}
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
            country={selectedCountry}
            guardianData={lastCardType === "minion" || lastCardType === "guardian" || lastCardType === "guardian-protect" ? lastCardData : null}
            petalData={lastCardType === "petal" ? lastCardData : null}
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
            collectedPetals={collectedPetals}
          />
        )}

        {/* Enhanced Golden Globe Animation */}
        {gameState === "globeAnimation" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden">
            {/* Enhanced radial gradient background with animation */}
            <div className="absolute inset-0 bg-gradient-radial from-yellow-100 via-white to-gray-50"
              style={{
                background: 'radial-gradient(circle at center, rgba(253, 224, 71, 0.4) 0%, rgba(255, 255, 255, 1) 50%, rgba(249, 250, 251, 1) 100%)',
                animation: 'background-pulse 4s ease-in-out infinite'
              }}
            />

            {/* Enhanced golden light rays emanating from center */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={`ray-${i}`}
                  className="absolute left-1/2 top-1/2 origin-bottom"
                  style={{
                    width: '3px',
                    height: '200%',
                    background: 'linear-gradient(to top, rgba(251, 191, 36, 0.4) 0%, rgba(251, 191, 36, 0.2) 40%, transparent 80%)',
                    transform: `translate(-50%, -100%) rotate(${i * 15}deg)`,
                    animation: 'ray-expand 3s ease-in-out infinite',
                    animationDelay: `${i * 0.1}s`,
                    filter: 'blur(1px)',
                  }}
                />
              ))}
            </div>

            {/* Enhanced Golden Sparkles - More dynamic */}
            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (i / 60) * Math.PI * 2;
              const distance = 100 + Math.random() * 300;
              const size = 2 + Math.random() * 6;
              return (
                <div
                  key={`gold-sparkle-${i}`}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${Math.cos(angle) * distance}px)`,
                    top: `calc(50% + ${Math.sin(angle) * distance}px)`,
                    width: `${size}px`,
                    height: `${size}px`,
                    animation: `sparkle-twinkle ${1.5 + Math.random() * 2}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 3}s`,
                  }}
                >
                  <div
                    className="w-full h-full bg-yellow-400 rounded-full"
                    style={{
                      boxShadow: `0 0 ${8 + Math.random() * 12}px rgba(250, 204, 21, ${0.6 + Math.random() * 0.4})`,
                      filter: 'blur(0.5px)'
                    }}
                  />
                </div>
              );
            })}

            {/* Floating flower petals effect */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`petal-float-${i}`}
                className="absolute text-2xl md:text-3xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float-petal ${8 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: 0.3,
                }}
              >
                🌸
              </div>
            ))}

            {/* Main Golden Globe - Enhanced */}
            <div className="relative z-10" style={{ animation: 'scaleInBounce 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), float 3s ease-in-out infinite 1.2s' }}>
              {/* Enhanced outer glow rings - multiple layers */}
              <div className="absolute inset-0 -m-24">
                <div className="w-full h-full rounded-full bg-yellow-400/30 animate-ping"
                  style={{ animationDuration: '2s' }} />
              </div>
              <div className="absolute inset-0 -m-20">
                <div className="w-full h-full rounded-full bg-yellow-300/25 animate-ping"
                  style={{ animationDuration: '2.3s', animationDelay: '0.2s' }} />
              </div>
              <div className="absolute inset-0 -m-16">
                <div className="w-full h-full rounded-full bg-yellow-200/20 animate-ping"
                  style={{ animationDuration: '2.6s', animationDelay: '0.4s' }} />
              </div>

              {/* Pulsing energy waves */}
              <div className="absolute inset-0 -m-12">
                <div className="w-full h-full rounded-full border-4 border-yellow-400/40"
                  style={{
                    animation: 'energy-wave 2s ease-out infinite',
                    animationDelay: '0.5s'
                  }} />
              </div>
              <div className="absolute inset-0 -m-8">
                <div className="w-full h-full rounded-full border-4 border-yellow-300/30"
                  style={{
                    animation: 'energy-wave 2s ease-out infinite',
                    animationDelay: '0.7s'
                  }} />
              </div>

              {/* Main Globe Container - Enhanced */}
              <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80">
                {/* Enhanced rotating golden rings */}
                <div className="absolute inset-0 rounded-full border-4 border-yellow-400/60 animate-spin"
                  style={{
                    animationDuration: '10s',
                    filter: 'blur(1px)'
                  }} />
                <div className="absolute inset-1 rounded-full border-3 border-yellow-300/40 animate-spin"
                  style={{
                    animationDuration: '8s',
                    animationDirection: 'reverse',
                    filter: 'blur(0.5px)'
                  }} />
                <div className="absolute inset-2 rounded-full border-2 border-yellow-200/30 animate-spin"
                  style={{
                    animationDuration: '6s',
                    filter: 'blur(0.5px)'
                  }} />

                {/* Enhanced Central Golden/White Globe */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-200 via-white via-yellow-50 to-yellow-100 shadow-2xl"
                  style={{
                    boxShadow: '0 0 80px rgba(250, 204, 21, 0.8), 0 0 120px rgba(251, 191, 36, 0.4), inset 0 0 80px rgba(255, 255, 255, 0.9)',
                    animation: 'globe-pulse 2.5s ease-in-out infinite, globe-glow 3s ease-in-out infinite'
                  }}
                >
                  {/* Enhanced inner shine effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/60 to-transparent"
                    style={{ animation: 'rotate 5s linear infinite' }} />

                  {/* Multiple bright spots for depth */}
                  <div className="absolute top-1/4 left-1/4 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 blur-xl" />
                  <div className="absolute bottom-1/3 right-1/3 w-12 h-12 md:w-16 md:h-16 rounded-full bg-yellow-100/60 blur-lg" />

                  {/* Enhanced sparkle points - more dynamic */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
                    <div
                      key={`sparkle-point-${i}`}
                      className="absolute w-2.5 h-2.5 bg-yellow-300 rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `rotate(${angle}deg) translateY(-${45 + (i % 3) * 8}px)`,
                        animation: `sparkle-pulse ${1.2 + (i % 4) * 0.3}s ease-in-out infinite`,
                        animationDelay: `${i * 0.15}s`,
                        boxShadow: '0 0 12px rgba(250, 204, 21, 1), 0 0 20px rgba(251, 191, 36, 0.6)'
                      }}
                    />
                  ))}
                </div>

                {/* Enhanced orbiting particles - multiple rings */}
                {Array.from({ length: 16 }).map((_, i) => {
                  const orbitAngle = (i / 16) * 360;
                  const radius = 120 + (i % 2) * 20;
                  return (
                    <div
                      key={`orbit-${i}`}
                      className="absolute w-3 h-3 bg-yellow-400 rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                        transformOrigin: '0 0',
                        animation: `orbit ${5 + (i % 4)}s linear infinite`,
                        animationDelay: `${-i * 0.25}s`,
                        boxShadow: '0 0 12px rgba(250, 204, 21, 0.8), 0 0 20px rgba(251, 191, 36, 0.4)',
                        filter: 'blur(0.5px)'
                      }}
                    />
                  );
                })}

                {/* Inner orbit ring */}
                {Array.from({ length: 8 }).map((_, i) => {
                  const orbitAngle = (i / 8) * 360;
                  return (
                    <div
                      key={`inner-orbit-${i}`}
                      className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                        transformOrigin: '0 0',
                        animation: `orbit-inner ${3 + (i % 2)}s linear infinite`,
                        animationDelay: `${-i * 0.2}s`,
                        animationDirection: 'reverse',
                        boxShadow: '0 0 8px rgba(250, 204, 21, 0.6)'
                      }}
                    />
                  );
                })}
              </div>

              {/* Enhanced bottom text with animation */}
              <div className="absolute -bottom-20 md:-bottom-24 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <div style={{ animation: 'text-appear 1s ease-out 0.8s both' }}>
                  <p className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-yellow-600 via-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent"
                    style={{
                      backgroundSize: '200% 100%',
                      animation: 'text-shimmer 3s ease-in-out infinite, text-glow 2s ease-in-out infinite',
                      textShadow: '0 0 20px rgba(250, 204, 21, 0.5)',
                      filter: 'drop-shadow(0 2px 4px rgba(250, 204, 21, 0.3))'
                    }}>
                    ✨ Flower Restored! ✨
                  </p>
                  {/* Subtitle */}
                  <p className="text-sm md:text-base text-yellow-600 mt-2 font-semibold opacity-80"
                    style={{ animation: 'fade-in-up 1s ease-out 1.2s both' }}>
                    Added to your garden collection
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced CSS Animations */}
            <style jsx>{`
              @keyframes scaleInBounce {
                0% {
                  transform: scale(0);
                  opacity: 0;
                }
                60% {
                  transform: scale(1.15);
                }
                80% {
                  transform: scale(0.95);
                }
                100% {
                  transform: scale(1);
                  opacity: 1;
                }
              }

              @keyframes float {
                0%, 100% {
                  transform: translateY(0px);
                }
                50% {
                  transform: translateY(-25px);
                }
              }

              @keyframes rotate {
                from {
                  transform: rotate(0deg);
                }
                to {
                  transform: rotate(360deg);
                }
              }

              @keyframes orbit {
                from {
                  transform: rotate(0deg) translateX(120px) rotate(0deg);
                }
                to {
                  transform: rotate(360deg) translateX(120px) rotate(-360deg);
                }
              }

              @keyframes orbit-inner {
                from {
                  transform: rotate(0deg) translateX(80px) rotate(0deg);
                }
                to {
                  transform: rotate(360deg) translateX(80px) rotate(-360deg);
                }
              }

              @keyframes globe-pulse {
                0%, 100% {
                  transform: scale(1);
                }
                50% {
                  transform: scale(1.05);
                }
              }

              @keyframes globe-glow {
                0%, 100% {
                  filter: brightness(1);
                }
                50% {
                  filter: brightness(1.2);
                }
              }

              @keyframes sparkle-pulse {
                0%, 100% {
                  opacity: 0.6;
                  transform: rotate(var(--angle, 0deg)) translateY(var(--distance, -45px)) scale(1);
                }
                50% {
                  opacity: 1;
                  transform: rotate(var(--angle, 0deg)) translateY(var(--distance, -45px)) scale(1.3);
                }
              }

              @keyframes sparkle-twinkle {
                0%, 100% {
                  opacity: 0.3;
                  transform: scale(0.8);
                }
                50% {
                  opacity: 1;
                  transform: scale(1.2);
                }
              }

              @keyframes ray-expand {
                0%, 100% {
                  opacity: 0.3;
                  transform: translate(-50%, -100%) rotate(var(--angle, 0deg)) scaleY(1);
                }
                50% {
                  opacity: 0.6;
                  transform: translate(-50%, -100%) rotate(var(--angle, 0deg)) scaleY(1.2);
                }
              }

              @keyframes energy-wave {
                0% {
                  opacity: 0.8;
                  transform: scale(0.8);
                }
                100% {
                  opacity: 0;
                  transform: scale(1.5);
                }
              }

              @keyframes background-pulse {
                0%, 100% {
                  opacity: 1;
                }
                50% {
                  opacity: 0.95;
                }
              }

              @keyframes float-petal {
                0%, 100% {
                  transform: translateY(0) translateX(0) rotate(0deg);
                }
                25% {
                  transform: translateY(-30px) translateX(10px) rotate(90deg);
                }
                50% {
                  transform: translateY(-20px) translateX(-5px) rotate(180deg);
                }
                75% {
                  transform: translateY(-40px) translateX(5px) rotate(270deg);
                }
              }

              @keyframes text-appear {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              @keyframes text-shimmer {
                0% {
                  background-position: 0% 50%;
                }
                50% {
                  background-position: 100% 50%;
                }
                100% {
                  background-position: 0% 50%;
                }
              }

              @keyframes text-glow {
                0%, 100% {
                  filter: drop-shadow(0 2px 4px rgba(250, 204, 21, 0.3));
                }
                50% {
                  filter: drop-shadow(0 4px 12px rgba(250, 204, 21, 0.6));
                }
              }

              @keyframes fade-in-up {
                from {
                  opacity: 0;
                  transform: translateY(10px);
                }
                to {
                  opacity: 0.8;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>
        )}

        {gameState === "completed" && selectedCountry && (
          <div className="fixed inset-0 z-50 overflow-y-auto"
            style={{
              background: 'linear-gradient(180deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)',
            }}>
            {/* Nature Background with Leaf Patterns */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Subtle leaf outlines scattered across background */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                {/* Faint leaf outlines - scattered throughout */}
                <g opacity="0.15" stroke="#a5d6a7" strokeWidth="1" fill="none">
                  {/* Leaf 1 - top left */}
                  <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(8, 10) scale(0.6)" />
                  {/* Leaf 2 - top center */}
                  <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(45, 8) scale(0.5) rotate(25)" />
                  {/* Leaf 3 - top right */}
                  <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(82, 12) scale(0.55) rotate(-15)" />
                  {/* Leaf 4 - middle left */}
                  <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(12, 35) scale(0.45) rotate(-30)" />
                  {/* Leaf 5 - middle */}
                  <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(50, 40) scale(0.5) rotate(40)" />
                  {/* Leaf 6 - middle right */}
                  <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(85, 38) scale(0.48) rotate(-25)" />
                  {/* Leaf 7 - bottom left */}
                  <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(10, 65) scale(0.52) rotate(20)" />
                  {/* Leaf 8 - bottom center */}
                  <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(48, 68) scale(0.46) rotate(-35)" />
                  {/* Leaf 9 - bottom right */}
                  <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(88, 70) scale(0.5) rotate(30)" />
                  {/* Additional smaller leaves */}
                  <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(25, 20) scale(0.35) rotate(15)" />
                  <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(70, 25) scale(0.38) rotate(-20)" />
                  <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(30, 55) scale(0.32) rotate(45)" />
                  <path d="M50 20 Q30 30 20 50 Q30 70 50 80 Q70 70 80 50 Q70 30 50 20" transform="translate(65, 58) scale(0.36) rotate(-40)" />
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

              {/* Golden Floating Particles */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={`particle-${i}`}
                  className="absolute rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${4 + Math.random() * 6}px`,
                    height: `${4 + Math.random() * 6}px`,
                    background: 'radial-gradient(circle, #fbbf24 0%, #f59e0b 50%, transparent 70%)',
                    opacity: 0.6,
                    animation: `float-up ${6 + Math.random() * 4}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 3}s`,
                    boxShadow: '0 0 15px rgba(251, 191, 36, 0.5)',
                  }}
                />
              ))}
            </div>

            {/* Main Content Container - Full Width */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">

              {/* Victory Title */}
              <div className="text-center mb-6 md:mb-10"
                style={{ animation: 'fade-in-down 0.8s ease-out' }}>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 text-transparent bg-clip-text"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #047857 0%, #059669 25%, #10b981 50%, #059669 75%, #047857 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'golden-shimmer 3s ease-in-out infinite',
                    WebkitBackgroundClip: 'text',
                  }}>
                  {t('game.victory')}
                </h1>
                <p className="text-xl md:text-2xl font-semibold text-emerald-700 mb-2">
                  {t('game.restoredFlower')}
                </p>
                <p className="text-lg md:text-xl text-gray-700">
                  {t('game.of')} <span className="font-bold text-emerald-800 text-3xl md:text-5xl lg:text-6xl">{selectedCountry.country}</span>
                </p>
              </div>

              {/* Interactive World Map Garden */}
              <div className="relative mb-8 md:mb-12"
                style={{ animation: 'scale-in 0.8s ease-out 0.3s both' }}>
                {/* Glow Ring Behind Map */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-full rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(251, 191, 36, 0.12) 0%, transparent 60%)',
                      animation: 'pulse-glow 3s ease-in-out infinite',
                    }} />
                </div>

                {/* World Map Container */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-4 md:p-6 lg:p-8 border border-emerald-500/30"
                  style={{
                    boxShadow: '0 0 80px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  }}>
                  {/* World Map Garden Component */}
                  <WorldMapGarden
                    completedFlowers={completedFlowers}
                    currentFlower={selectedCountry}
                  />

                  {/* Current Flower Info Below Map */}
                  <div className="text-center mt-6 pt-6 border-t border-emerald-200/50">
                    <div className="inline-block bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl px-6 py-4 border border-emerald-300/30">
                      <h3 className="text-xl md:text-2xl font-bold text-emerald-800 mb-1">
                        ✨ {selectedCountry.flowerName} ✨
                      </h3>
                      <p className="text-sm md:text-base text-emerald-700/80 italic mb-2">
                        {selectedCountry.flowerScientificName}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600 max-w-2xl mx-auto">
                        {selectedCountry.flowerDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex justify-center gap-3 md:gap-6 lg:gap-8 mb-8 md:mb-10"
                style={{ animation: 'fade-in-up 0.8s ease-out 0.5s both' }}>
                {[
                  { value: '6/6', labelKey: 'game.petals', icon: '🌸' },
                  { value: '100%', labelKey: 'game.complete', icon: '✨' },
                  { value: '⭐', labelKey: 'game.perfect', icon: '' },
                ].map((stat, i) => (
                  <div key={stat.labelKey}
                    className="text-center px-5 py-4 md:px-7 md:py-5 rounded-2xl bg-gradient-to-b from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30"
                    style={{
                      animation: `stat-pop 0.5s ease-out ${0.7 + i * 0.1}s both`,
                      boxShadow: '0 8px 30px rgba(16, 185, 129, 0.2)',
                    }}>
                    <div className="text-2xl md:text-3xl font-black text-emerald-700 mb-1">
                      {stat.icon || stat.value}
                    </div>
                    <div className="text-xs md:text-sm font-semibold text-emerald-600/80">{t(stat.labelKey)}</div>
                  </div>
                ))}
              </div>

              {/* Achievement Badge */}
              <div className="flex justify-center mb-8 md:mb-10"
                style={{ animation: 'fade-in-up 0.8s ease-out 0.7s both' }}>
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-emerald-500/20 rounded-full px-6 py-3 border border-emerald-400/40"
                  style={{
                    boxShadow: '0 0 30px rgba(16, 185, 129, 0.25)',
                    animation: 'badge-glow 2s ease-in-out infinite',
                  }}>
                  <span className="text-2xl">🏆</span>
                  <span className="text-base md:text-lg font-bold text-emerald-700">{t('game.guardianOfNature')}</span>
                  <span className="text-2xl">🏆</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-8"
                style={{ animation: 'fade-in-up 0.8s ease-out 0.9s both' }}>
                {/* Play Again Button */}
                <button
                  onClick={handleRestart}
                  className="group relative w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 rounded-xl font-bold text-base md:text-lg transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <span className="flex items-center justify-center gap-3 text-white">
                    <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-180 transition-transform duration-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    {t('game.playAgain')}
                  </span>
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="group relative w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 rounded-xl font-bold text-base md:text-lg transition-all duration-300 hover:scale-105 border-2 border-emerald-500/50 bg-transparent hover:bg-emerald-500/10"
                >
                  <span className="flex items-center justify-center gap-3 text-emerald-700">
                    {isSharing ? (
                      <>
                        <svg className="w-5 h-5 md:w-6 md:h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('game.creating')}
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                        {t('game.shareVictory')}
                      </>
                    )}
                  </span>
                </button>
              </div>

              {/* Inspirational Quote & Website Link */}
              <div className="text-center"
                style={{ animation: 'fade-in-up 0.8s ease-out 1.1s both' }}>
                <p className="text-base md:text-lg text-gray-600 italic mb-4">
                  "{t('game.inspirationalQuote')}" 🌍
                </p>
                <div className="inline-flex items-center gap-2 text-gray-600 text-sm">
                  <span>🔗</span>
                  <span className="notranslate" translate="no">aquamundi.org/game</span>
                </div>
              </div>
            </div>

            {/* Enhanced CSS Animations */}
            <style jsx>{`
              @keyframes twinkle {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 0.8; transform: scale(1.2); }
              }
              
              @keyframes float-up {
                0%, 100% { transform: translateY(0) translateX(0); opacity: 0.6; }
                50% { transform: translateY(-30px) translateX(10px); opacity: 0.9; }
              }
              
              @keyframes bounce-in {
                0% { transform: scale(0) rotate(-20deg); opacity: 0; }
                50% { transform: scale(1.2) rotate(10deg); }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
              }
              
              @keyframes float-gentle {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
              
              @keyframes golden-shimmer {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              
              @keyframes fade-in-down {
                from { transform: translateY(-30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
              
              @keyframes fade-in-up {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
              
              @keyframes scale-in {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
              }
              
              @keyframes pulse-glow {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.7; }
              }

              @keyframes flower-float {
                0%, 100% { transform: translateY(0px) scale(1); }
                50% { transform: translateY(-12px) scale(1.01); }
              }
              
              @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
              
              @keyframes stat-pop {
                from { transform: scale(0.5) translateY(20px); opacity: 0; }
                to { transform: scale(1) translateY(0); opacity: 1; }
              }
              
              @keyframes badge-glow {
                0%, 100% { box-shadow: 0 0 30px rgba(251, 191, 36, 0.2); }
                50% { box-shadow: 0 0 50px rgba(251, 191, 36, 0.4); }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}


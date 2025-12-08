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
  const [gameState, setGameState] = useState("intro"); // intro, playing, flowerFormation, globeAnimation, completed
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [petalsCollected, setPetalsCollected] = useState(0);
  const [hasGuardian, setHasGuardian] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [lastCardType, setLastCardType] = useState(null);
  const [lastCardData, setLastCardData] = useState(null); // Store card data (minion/guardian info)
  const [isMuted, setIsMuted] = useState(false);
  const [collectedPetals, setCollectedPetals] = useState([]); // Store collected petal cards
  const [showIntro, setShowIntro] = useState(true); // Show Araihan intro message
  const [isSharing, setIsSharing] = useState(false); // Share button loading state

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
    // First show the golden globe animation
    setGameState("globeAnimation");
    // Then show the congratulations page after animation
    setTimeout(() => {
      setGameState("completed");
    }, 4000); // 4 seconds for globe animation
  };

  const handleRestart = () => {
    setGameState("playing");
    setPetalsCollected(0);
    setHasGuardian(false);
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

      {/* Loader - Show while loading assets */}
      {isLoadingAssets && (
        <div className="fixed inset-0 flex items-center justify-center z-30 bg-black">
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


      {/* Mute Button - Top Left - Adjusted for mobile */}
      <button
        onClick={toggleMute}
        className={`fixed top-4 left-4 md:top-6 md:left-6 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-[9996] ${
          gameState === "completed" || (gameState === "playing" && !isLoadingAssets)
            ? "bg-black/10 hover:bg-black/20"
            : "bg-white/10 hover:bg-white/20"
        }`}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${gameState === "completed" || (gameState === "playing" && !isLoadingAssets) ? "text-black" : "text-white"}`} />
        ) : (
          <Volume2 className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${gameState === "completed" || (gameState === "playing" && !isLoadingAssets) ? "text-black" : "text-white"}`} />
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

        {/* Golden Globe Animation */}
        {gameState === "globeAnimation" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            {/* Radial gradient background */}
            <div className="absolute inset-0 bg-gradient-radial from-yellow-100 via-white to-gray-50" 
                 style={{
                   background: 'radial-gradient(circle at center, rgba(253, 224, 71, 0.3) 0%, rgba(255, 255, 255, 1) 50%, rgba(249, 250, 251, 1) 100%)'
                 }}
            />
            
            {/* Golden Sparkles Around */}
            {Array.from({ length: 40 }).map((_, i) => {
              const angle = (i / 40) * Math.PI * 2;
              const distance = 150 + Math.random() * 200;
              return (
                <div
                  key={`gold-sparkle-${i}`}
                  className="absolute animate-pulse"
                  style={{
                    left: `calc(50% + ${Math.cos(angle) * distance}px)`,
                    top: `calc(50% + ${Math.sin(angle) * distance}px)`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random()}s`,
                  }}
                >
                  <div className="w-3 h-3 bg-yellow-400 rounded-full blur-sm" 
                       style={{ boxShadow: '0 0 20px rgba(250, 204, 21, 0.8)' }} />
                </div>
              );
            })}

            {/* Main Golden Globe */}
            <div className="relative z-10" style={{ animation: 'scaleIn 1s ease-out, float 3s ease-in-out infinite 1s' }}>
              {/* Outer glow rings */}
              <div className="absolute inset-0 -m-20">
                <div className="w-full h-full rounded-full bg-yellow-400/20 animate-ping" 
                     style={{ animationDuration: '2s' }} />
              </div>
              <div className="absolute inset-0 -m-16">
                <div className="w-full h-full rounded-full bg-yellow-300/30 animate-ping" 
                     style={{ animationDuration: '2.5s', animationDelay: '0.3s' }} />
              </div>

              {/* Main Globe Container */}
              <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80">
                {/* Rotating golden ring */}
                <div className="absolute inset-0 rounded-full border-4 border-yellow-400/50 animate-spin" 
                     style={{ animationDuration: '8s' }} />
                <div className="absolute inset-2 rounded-full border-4 border-yellow-300/30 animate-spin" 
                     style={{ animationDuration: '6s', animationDirection: 'reverse' }} />

                {/* Central Golden/White Globe */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-200 via-white to-yellow-100 shadow-2xl"
                     style={{
                       boxShadow: '0 0 60px rgba(250, 204, 21, 0.6), inset 0 0 60px rgba(255, 255, 255, 0.8)',
                       animation: 'pulse 2s ease-in-out infinite'
                     }}
                >
                  {/* Inner shine effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/50 to-transparent"
                       style={{ animation: 'rotate 4s linear infinite' }} />
                  
                  {/* Center bright spot */}
                  <div className="absolute top-1/4 left-1/4 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/80 blur-xl" />
                  
                  {/* Sparkle points */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <div
                      key={`sparkle-point-${i}`}
                      className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `rotate(${angle}deg) translateY(-${40 + (i % 2) * 10}px)`,
                        animation: `pulse ${1.5 + (i % 3) * 0.5}s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                        boxShadow: '0 0 10px rgba(250, 204, 21, 0.8)'
                      }}
                    />
                  ))}
                </div>

                {/* Orbiting particles */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const orbitAngle = (i / 12) * 360;
                  return (
                    <div
                      key={`orbit-${i}`}
                      className="absolute w-3 h-3 bg-yellow-400 rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                        transformOrigin: '0 0',
                        animation: `orbit ${4 + (i % 3)}s linear infinite`,
                        animationDelay: `${-i * 0.3}s`,
                        boxShadow: '0 0 10px rgba(250, 204, 21, 0.6)'
                      }}
                    />
                  );
                })}
              </div>

              {/* Bottom text */}
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-pulse">
                  ✨ Flower Restored! ✨
                </p>
              </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
              @keyframes scaleIn {
                from {
                  transform: scale(0);
                  opacity: 0;
                }
                to {
                  transform: scale(1);
                  opacity: 1;
                }
              }

              @keyframes float {
                0%, 100% {
                  transform: translateY(0px);
                }
                50% {
                  transform: translateY(-20px);
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
            `}</style>
          </div>
        )}

        {gameState === "completed" && selectedCountry && (
          <div className="max-w-6xl mx-auto px-4 relative bg-gradient-to-br from-purple-50 via-pink-50 to-green-50 min-h-screen py-4 md:py-6 overflow-y-auto">
            {/* Animated Background Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Floating Sparkles */}
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={`sparkle-${i}`}
                  className="absolute animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                  }}
                >
                  <div 
                    className="w-2 h-2 bg-yellow-300 rounded-full blur-sm"
                    style={{
                      boxShadow: '0 0 10px rgba(253, 224, 71, 0.8)',
                    }}
                  />
                </div>
              ))}
              
              {/* Confetti Rain */}
              {Array.from({ length: 20 }).map((_, i) => {
                const colors = ['#FF6B9D', '#C084FC', '#60A5FA', '#34D399', '#FBBF24'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                return (
                  <div
                    key={`confetti-${i}`}
                    className="absolute w-3 h-3 opacity-70"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `-20px`,
                      backgroundColor: color,
                      borderRadius: Math.random() > 0.5 ? '50%' : '0',
                      animation: `fall ${3 + Math.random() * 4}s linear infinite`,
                      animationDelay: `${Math.random() * 5}s`,
                      transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                  />
                );
              })}
            </div>

            {/* Celebration Emojis with varied animations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
              {Array.from({ length: 8 }).map((_, i) => {
                const emojis = ['🎉', '🎊', '🌸', '🌺', '🌼', '✨', '💐', '🦋', '🌿'];
                const emoji = emojis[i % emojis.length];
                const angle = (i / 15) * Math.PI * 2;
                const distance = 150 + Math.random() * 150;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                return (
                  <div
                    key={`emoji-${i}`}
                    className="absolute text-3xl md:text-5xl"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(30% + ${y}px)`,
                      transform: 'translate(-50%, -50%)',
                      animation: `spin ${2 + Math.random() * 2}s ease-in-out infinite, bounce ${1 + Math.random()}s ease-in-out infinite`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  >
                    {emoji}
                  </div>
                );
              })}
            </div>

            {/* Magical Rays from Center */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={`ray-${i}`}
                  className="absolute top-1/2 left-1/2 w-1 h-48 bg-gradient-to-t from-transparent via-yellow-300/40 to-transparent origin-bottom"
                  style={{
                    transform: `rotate(${i * 30}deg)`,
                    animation: 'pulse 2s ease-in-out infinite',
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>

            {/* Main Content Card */}
            <div className="relative z-20">
              {/* Victory Banner */}
              <div className="text-center mb-4 md:mb-6 animate-fade-in">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-2 md:mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-green-600 bg-clip-text text-transparent drop-shadow-lg"
                  style={{
                    animation: 'slideDown 0.8s ease-out, pulse 2s ease-in-out infinite 1s',
                  }}
                >
                  🌟 VICTORY! 🌟
                </h1>
                <p className="text-xl md:text-2xl font-bold text-purple-700 mb-1 md:mb-2">
                  You Restored the Sacred Flower!
                </p>
                <p className="text-base md:text-lg text-gray-700 mb-2 md:mb-3">
                  of <span className="font-bold text-green-700">{selectedCountry.country}</span>
                </p>
                
                {/* Achievement Badge */}
                <div className="inline-block bg-white rounded-full px-4 py-2 md:px-6 md:py-3 shadow-lg border-4 border-purple-300 animate-pulse">
                  <p className="text-xs md:text-sm font-semibold text-purple-800">
                    🏆 Guardian of Nature 🏆
                  </p>
                </div>
              </div>

              {/* Collected Petals Showcase */}
              <div className="bg-white/90 backdrop-blur-lg border-4 border-purple-300 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-4 md:mb-6 shadow-2xl"
                style={{
                  animation: 'slideUp 0.8s ease-out 0.2s both',
                }}
              >
                <h3 className="text-xl md:text-2xl font-bold text-center mb-3 md:mb-4 text-purple-900 flex items-center justify-center gap-2">
                  <span>✨</span> Your Collected Petals <span>✨</span>
                </h3>
                
                <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-3xl mx-auto mb-4 md:mb-5">
                  {[1, 2, 3, 4, 5, 6].map((petalNum) => {
                    const petalPath = getPetalPath(selectedCountry.folder, petalNum);
                    return (
                      <div
                        key={petalNum}
                        className="relative aspect-square rounded-lg md:rounded-xl overflow-hidden border-2 md:border-4 border-purple-300 shadow-lg md:shadow-xl bg-gradient-to-br from-white to-purple-50 group cursor-pointer"
                        style={{
                          animation: `slideUp 0.6s ease-out ${0.3 + petalNum * 0.1}s both, float ${2 + (petalNum % 3) * 0.5}s ease-in-out infinite ${petalNum * 0.2}s`,
                        }}
                      >
                        {/* Petal Number Badge */}
                        <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-purple-600 text-white rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-xs md:text-sm font-bold z-10 group-hover:scale-125 transition-transform">
                          {petalNum}
                        </div>
                        
                        {/* Sparkle on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/0 group-hover:via-yellow-200/50 group-hover:to-yellow-300/30 transition-all duration-300 pointer-events-none" />
                        
                        <div className="w-full h-full p-2 md:p-3 relative z-0">
                          <Image
                            src={petalPath}
                            alt={`Petal ${petalNum}`}
                            fill
                            className="object-contain group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Completion Stats */}
                <div className="grid grid-cols-3 gap-2 md:gap-3 max-w-2xl mx-auto mb-3 md:mb-4">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg md:rounded-xl p-2 md:p-3 text-center border-2 border-purple-300">
                    <div className="text-xl md:text-2xl font-black text-purple-700">6/6</div>
                    <div className="text-xs font-semibold text-purple-600">Petals</div>
                  </div>
                  <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg md:rounded-xl p-2 md:p-3 text-center border-2 border-pink-300">
                    <div className="text-xl md:text-2xl font-black text-pink-700">100%</div>
                    <div className="text-xs font-semibold text-pink-600">Complete</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg md:rounded-xl p-2 md:p-3 text-center border-2 border-green-300">
                    <div className="text-xl md:text-2xl font-black text-green-700">⭐</div>
                    <div className="text-xs font-semibold text-green-600">Perfect!</div>
                  </div>
                </div>
              </div>

              {/* Flower Information Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-300 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-4 md:mb-6 shadow-2xl"
                style={{
                  animation: 'slideUp 0.8s ease-out 0.4s both',
                }}
              >
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <span className="text-2xl md:text-3xl">🌺</span>
                  <h3 className="text-xl md:text-2xl font-bold text-green-900">
                    {selectedCountry.flowerName}
                  </h3>
                </div>
                <p className="text-base md:text-lg text-green-700 italic mb-2 md:mb-3 font-medium">
                  {selectedCountry.flowerScientificName}
                </p>
                <div className="bg-white/60 backdrop-blur rounded-xl md:rounded-2xl p-3 md:p-4 border-2 border-green-200">
                  <p className="text-sm md:text-base text-gray-800 leading-relaxed">
                    {selectedCountry.flowerDescription}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 md:gap-5 justify-center items-center pb-4 px-4">
                {/* Play Again Button - Modern Glassmorphism */}
                <button
                  onClick={handleRestart}
                  className="group relative w-full sm:w-auto overflow-hidden"
                  style={{
                    animation: 'slideUp 0.8s ease-out 0.6s both',
                  }}
                >
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%] animate-gradient" />
                  
                  {/* Glass overlay */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                  
                  {/* Button content */}
                  <div className="relative px-8 py-4 md:px-10 md:py-5 flex items-center justify-center gap-3 group-hover:scale-105 transition-transform duration-300">
                    <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white text-base md:text-lg font-bold tracking-wide">
                      Play Again
                    </span>
                  </div>
                  
                  {/* Border glow */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-colors pointer-events-none" 
                       style={{ borderRadius: '1rem' }} />
                  
                  {/* Shadow */}
                  <div className="absolute inset-0 -z-10 blur-xl bg-purple-600/50 group-hover:bg-purple-600/70 transition-all duration-300 scale-95 group-hover:scale-100" 
                       style={{ borderRadius: '1rem' }} />
                </button>
                
                {/* Share Victory Button - Modern with Icon */}
                <button
                  onClick={handleShare}
                  className="group relative w-full sm:w-auto overflow-hidden"
                  style={{
                    animation: 'slideUp 0.8s ease-out 0.7s both',
                  }}
                >
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 bg-[length:200%_100%] animate-gradient" />
                  
                  {/* Glass overlay */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                  
                  {/* Button content */}
                  <div className="relative px-8 py-4 md:px-10 md:py-5 flex items-center justify-center gap-3 group-hover:scale-105 transition-transform duration-300">
                    {isSharing ? (
                      <>
                        <svg className="w-5 h-5 md:w-6 md:h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-white text-base md:text-lg font-bold tracking-wide">
                          Creating...
                        </span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                        <span className="text-white text-base md:text-lg font-bold tracking-wide">
                          Share Victory
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Border glow */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-colors pointer-events-none" 
                       style={{ borderRadius: '1rem' }} />
                  
                  {/* Shadow */}
                  <div className="absolute inset-0 -z-10 blur-xl bg-emerald-600/50 group-hover:bg-emerald-600/70 transition-all duration-300 scale-95 group-hover:scale-100" 
                       style={{ borderRadius: '1rem' }} />
                </button>
              </div>
              
              {/* Share Info Badge */}
              <div className="flex justify-center mb-4"
                style={{
                  animation: 'slideUp 0.8s ease-out 0.9s both',
                }}
              >
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-full px-4 py-2 shadow-lg">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold text-blue-800">
                    Play at <span className="font-mono">aquamundi.org/game</span>
                  </span>
                </div>
              </div>

              {/* Motivational Message */}
              <div className="mt-8 text-center"
                style={{
                  animation: 'slideUp 0.8s ease-out 0.8s both',
                }}
              >
                <p className="text-lg md:text-xl text-purple-800 font-semibold italic">
                  "Every flower you restore brings life back to nature!" 🌍💚
                </p>
              </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
              @keyframes fall {
                to {
                  transform: translateY(100vh) rotate(360deg);
                  opacity: 0;
                }
              }
              
              @keyframes spin {
                0%, 100% {
                  transform: translate(-50%, -50%) rotate(0deg) scale(1);
                }
                50% {
                  transform: translate(-50%, -50%) rotate(180deg) scale(1.2);
                }
              }
              
              @keyframes slideDown {
                from {
                  transform: translateY(-100px);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }
              
              @keyframes slideUp {
                from {
                  transform: translateY(50px);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }
              
              @keyframes float {
                0%, 100% {
                  transform: translateY(0px);
                }
                50% {
                  transform: translateY(-10px);
                }
              }
              
              @keyframes bounce {
                0%, 100% {
                  transform: translateY(0);
                }
                50% {
                  transform: translateY(-20px);
                }
              }
              
              @keyframes gradient {
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
              
              .animate-gradient {
                animation: gradient 3s ease infinite;
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}


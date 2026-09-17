"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import GameBoard from "@/components/game/GameBoard";
import FlowerFormation from "@/components/game/FlowerFormation";
import PageLoader from "@/components/PageLoader";
import AraihanGuide from "@/components/game/AraihanGuide";
import { countriesData } from "@/lib/gameData";
import { useTranslation } from "@/lib/useTranslation";
import { useGameLoader } from "@/hooks/useGameLoader";
import { useGamePersistence } from "@/hooks/useGamePersistence";
import { useGameHandlers } from "@/hooks/useGameHandlers";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useGameAssets } from "@/hooks/useGameAssets";
import { useGameShare } from "@/hooks/useGameShare";
import MuteButton from "@/components/game/MuteButton";
import GameBackground from "@/components/game/GameBackground";
import GameIntroScreen from "@/components/game/GameIntroScreen";
import GlobeAnimation from "@/components/game/GlobeAnimation";
import VictoryScreen from "@/components/game/VictoryScreen";
import FlowerDetailsReveal from "@/components/game/FlowerDetailsReveal";
import PollinatorQuiz from "@/components/game/PollinatorQuiz";

export default function GamePage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  // Core game state
  const [gameState, setGameState] = useState("intro");
  const [petalsCollected, setPetalsCollected] = useState(0);
  const [hasGuardian, setHasGuardian] = useState(false);
  const [collectedPetals, setCollectedPetals] = useState([]);

  // Hooks
  const { isLoading } = useGameLoader();
  const { showIntro, markIntroSeen, completedFlowers, addCompletedFlower, selectedCountry, setSelectedCountry } = useGamePersistence();
  const { isMuted, toggleMute } = useGameAudio();
  const { isLoadingAssets, showStartButton, handleStartButtonClick } = useGameAssets({ selectedCountry, setGameState });
  const { isSharing, handleShare } = useGameShare({ selectedCountry });
  const {
    lastCardType,
    lastCardData,
    handlePetalCollected,
    handleMinionRevealed,
    handleGuardianActivated,
    handleFlowerComplete,
    handleFlowerDetailsComplete,
    handleQuizComplete,
    handleRestart,
    handleCardTypeChange,
  } = useGameHandlers({
    selectedCountry,
    setSelectedCountry,
    hasGuardian,
    setHasGuardian,
    setPetalsCollected,
    setCollectedPetals,
    setGameState,
    setShowIntro: markIntroSeen,
    addCompletedFlower,
    countriesData,
  });

  // Check for country parameter in URL
  useEffect(() => {
    const countryParam = searchParams?.get('country');
    if (countryParam && !isLoading) {
      const country = countriesData.find(c => c.id === countryParam);
      if (country) {
        setSelectedCountry(country);
        setGameState("flowerDetails");
      }
    }
  }, [searchParams, isLoading, setSelectedCountry]);

  return (
    <div className={`min-h-screen relative overflow-x-hidden overflow-y-auto ${gameState === "playing" ? "bg-[#174538] text-white" : gameState === "completed" ? "text-black" : "bg-black text-white"}`}>
      <PageLoader isLoading={isLoading} />

      <GameBackground isLoading={isLoading} />

      {showStartButton && gameState === "intro" && <GameIntroScreen onStart={handleStartButtonClick} />}

      {gameState !== "playing" && <MuteButton isMuted={isMuted} onToggle={toggleMute} gameState={gameState} isLoadingAssets={isLoadingAssets} />}

      {showIntro && !isLoading && !showStartButton && gameState === "playing" && (
        <AraihanGuide
          message={t("araihan.intro")}
          onAction={markIntroSeen}
          actionText={t("game.yesLetsPlay")}
          showAction={false}
          isIntro={true}
        />
      )}

      <div className={`relative z-10 container mx-auto px-2 py-2 md:py-4 ${gameState === "playing" ? "min-h-screen" : "h-screen"} flex flex-col`}>
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

        {gameState === "playing" && selectedCountry && (
          <div className="w-full flex-1 flex flex-col overflow-visible">
            <GameBoard
              country={selectedCountry}
              petalsCollected={petalsCollected}
              hasGuardian={hasGuardian}
              isMuted={isMuted}
              onToggleMute={toggleMute}
              onPetalCollected={handlePetalCollected}
              onMinionRevealed={handleMinionRevealed}
              onGuardianActivated={handleGuardianActivated}
              onCardTypeChange={handleCardTypeChange}
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

        {gameState === "flowerDetails" && selectedCountry && (
          <FlowerDetailsReveal
            country={selectedCountry}
            onComplete={handleFlowerDetailsComplete}
          />
        )}

        {gameState === "quiz" && selectedCountry && (
          <PollinatorQuiz
            country={selectedCountry}
            onComplete={handleQuizComplete}
          />
        )}

        {gameState === "globeAnimation" && <GlobeAnimation country={selectedCountry} />}

        {gameState === "completed" && selectedCountry && (
          <VictoryScreen
            selectedCountry={selectedCountry}
            completedFlowers={completedFlowers}
            onRestart={handleRestart}
            onShare={handleShare}
            isSharing={isSharing}
          />
        )}
      </div>
    </div>
  );
}


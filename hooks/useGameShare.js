"use client";
import { useState, useCallback } from "react";

export function useGameShare({ selectedCountry }) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = useCallback(async () => {
    if (isSharing || !selectedCountry) return;
    setIsSharing(true);

    try {
      const shareText = `🌸 I just restored the ${selectedCountry.flowerName} in the Guardians of Flowers game!\n\n✨ Play now at aquamundi.org/game`;
      const shareUrl = "https://aquamundi.org/game";

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 1200;
      canvas.height = 630;

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#faf5ff");
      gradient.addColorStop(0.5, "#fce7f3");
      gradient.addColorStop(1, "#f0fdf4");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(147, 51, 234, 0.1)";
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 30 + 10, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#7c3aed";
      ctx.font = "bold 72px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🌟 VICTORY! 🌟", canvas.width / 2, 120);

      ctx.fillStyle = "#059669";
      ctx.font = "bold 48px Arial, sans-serif";
      ctx.fillText(selectedCountry.flowerName, canvas.width / 2, 200);

      ctx.fillStyle = "#6b7280";
      ctx.font = "italic 32px Arial, sans-serif";
      ctx.fillText(selectedCountry.flowerScientificName, canvas.width / 2, 250);

      ctx.fillStyle = "#10b981";
      ctx.font = "bold 36px Arial, sans-serif";
      ctx.fillText(selectedCountry.country, canvas.width / 2, 310);

      ctx.fillStyle = "#7c3aed";
      ctx.font = "bold 42px Arial, sans-serif";
      ctx.fillText("🏆 Guardian of Nature 🏆", canvas.width / 2, 390);

      ctx.fillStyle = "#ec4899";
      ctx.font = "bold 38px Arial, sans-serif";
      ctx.fillText("6/6 Petals • 100% Complete • Perfect!", canvas.width / 2, 450);

      ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
      ctx.fillRect(250, 490, 700, 80);
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 4;
      ctx.strokeRect(250, 490, 700, 80);

      ctx.fillStyle = "#1e40af";
      ctx.font = "bold 44px monospace";
      ctx.fillText("🎮 aquamundi.org/game", canvas.width / 2, 545);

      canvas.toBlob(async (blob) => {
        try {
          const file = new File([blob], "flower-victory.png", { type: "image/png" });
          if (navigator.share && navigator.canShare?.({ files: [file] })) {
            await navigator.share({ title: "Guardians of Flowers - Victory!", text: shareText, url: shareUrl, files: [file] });
          } else if (navigator.share) {
            await navigator.share({ title: "Guardians of Flowers - Victory!", text: shareText, url: shareUrl });
          } else {
            const link = document.createElement("a");
            link.download = "flower-victory.png";
            link.href = URL.createObjectURL(blob);
            link.click();
            await navigator.clipboard.writeText(shareText + "\n" + shareUrl);
            alert("✅ Victory screenshot downloaded!\n📋 Message copied to clipboard!\n\n" + shareText);
          }
        } catch {}
      }, "image/png");
    } catch {
      const fallback = `🌸 I restored the ${selectedCountry.flowerName}!\nPlay at aquamundi.org/game`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(fallback);
        alert("📋 Copied to clipboard!\n\n" + fallback);
      }
    } finally {
      setIsSharing(false);
    }
  }, [isSharing, selectedCountry]);

  return { isSharing, handleShare };
}

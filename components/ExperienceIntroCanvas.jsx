"use client";

import { useEffect, useRef } from "react";

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

export default function ExperienceIntroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const stars = Array.from({ length: 150 }, (_, index) => ({
      x: (index * 71.37) % 1,
      y: (index * 37.91) % 1,
      size: 0.6 + ((index * 13) % 10) / 10,
      speed: 0.3 + ((index * 7) % 10) / 10,
    }));
    let progress = 0;
    let raf = 0;
    const started = performance.now();

    const onScroll = (event) => {
      progress = clamp(event.detail?.progress || 0);
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawCloud = (x, y, width, height, alpha) => {
      const gradient = context.createRadialGradient(x, y, 0, x, y, width);
      gradient.addColorStop(0, `rgba(238, 246, 246, ${alpha})`);
      gradient.addColorStop(1, "rgba(238, 246, 246, 0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.ellipse(x, y, width, height, 0, 0, Math.PI * 2);
      context.fill();
    };

    const render = (now) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const time = (now - started) / 1000;
      context.clearRect(0, 0, width, height);
      const sky = context.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "#041523");
      sky.addColorStop(1, progress > 0.52 ? "#b7cdd1" : "#061b2b");
      context.fillStyle = sky;
      context.fillRect(0, 0, width, height);

      const starsOpacity = 1 - clamp(progress / 0.24);
      context.fillStyle = "#c8d8e0";
      stars.forEach((star) => {
        const y = ((star.y + time * 0.008 * star.speed) % 1) * height;
        context.globalAlpha = starsOpacity * (0.25 + star.size / 2);
        context.beginPath();
        context.arc(star.x * width, y, star.size, 0, Math.PI * 2);
        context.fill();
      });
      context.globalAlpha = 1;

      const cloudProgress = clamp((progress - 0.68) / 0.22);
      if (cloudProgress > 0) {
        context.globalAlpha = cloudProgress;
        drawCloud(width * 0.18, height * 0.68, width * 0.35, height * 0.16, 0.85);
        drawCloud(width * 0.56, height * 0.7, width * 0.48, height * 0.2, 0.78);
        drawCloud(width * 0.92, height * 0.62, width * 0.34, height * 0.18, 0.72);
        context.globalAlpha = 1;
      }

      raf = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("aquamundi:lenis-scroll", onScroll);
    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("aquamundi:lenis-scroll", onScroll);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}

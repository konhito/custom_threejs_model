"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import styles from "./ExperienceIntro.module.css";

const IntroCanvas = dynamic(() => import("./ExperienceIntroGLB"), { ssr: false });
const Globe = dynamic(() => import("./Globe"), { ssr: false });

export default function ExperienceIntro() {
  const [progress, setProgress] = useState(0);
  const [globeProgress, setGlobeProgress] = useState(0);
  useEffect(() => {
    const readNativeProgress = () => {
      const introDistance = Math.max(1, window.innerHeight * 2.2);
      const scrollY = window.scrollY;
      setGlobeProgress(Math.min(1, Math.max(0, (scrollY - introDistance) / (window.innerHeight * 1.55))));
      const nextProgress = Math.min(1, Math.max(0, scrollY / introDistance));
      window.dispatchEvent(new CustomEvent("aquamundi:intro-scroll", { detail: { progress: nextProgress } }));
      return nextProgress;
    };
    const onScroll = () => setProgress(readNativeProgress());
    window.addEventListener("aquamundi:lenis-scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    setProgress(readNativeProgress());
    return () => {
      window.removeEventListener("aquamundi:lenis-scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  const introFade = Math.min(1, Math.max(0, (progress - 0.04) / 0.16));
  // Hold the final cloud above the globe, then dissolve it during the handoff.
  const sceneFade = Math.min(1, Math.max(0, (globeProgress - 0.04) / 0.2));
  return (
    <main className={styles.experience}>
      <div className={styles.canvas} style={{ opacity: 1 - sceneFade }}><IntroCanvas /></div>
      <header className={styles.chrome} style={{ opacity: 1 - sceneFade }}>
        <span className={styles.mark} aria-label="AquaMundi">A</span>
        <span className={styles.map}>MAP <span aria-hidden="true">⌘</span></span>
      </header>
      <div className={`${styles.copy} ${styles.introCopy}`} style={{ opacity: (1 - introFade) * (1 - sceneFade), transform: `translate(-50%, ${introFade * -2}vh)` }}>
        Reporting for this project is presented by AquaMundi in partnership with the people, pollinators, and habitats that keep living corridors connected.
      </div>
      <div className={styles.spacer} aria-hidden="true" />
      <section className={styles.globeChapter} aria-label="AquaMundi living archive">
        <div className={styles.globeStage}>
          <Globe cinematic cinematicProgress={globeProgress} showOvalBorder={false} showBackground={false} />
        </div>
      </section>
    </main>
  );
}

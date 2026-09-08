"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import Snowfall from "react-snowfall";
import Navigation from "./Navigation";
import ImageGallery from "./ImageGallery";
import { BentoDemo } from "./BentoDemo";
import CurvedLoop from "./CurvedLoop";
import FieldOutro from "./FieldOutro";
import PageLoader from "./PageLoader";
import { MusicToggleButton } from "./MusicToggleButton";
import { useTranslation } from "../lib/useTranslation";
import styles from "./ExperienceIntro.module.css";

const IntroCanvas = dynamic(() => import("./ExperienceIntroGLB"), { ssr: false });
const Globe = dynamic(() => import("./Globe"), { ssr: false });

export default function ExperienceIntro() {
  const [progress, setProgress] = useState(0);
  const [introReady, setIntroReady] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);
  const [globeVisible, setGlobeVisible] = useState(false);
  const [loaderFallback, setLoaderFallback] = useState(false);
  const globeSectionRef = useRef(null);
  const { t } = useTranslation();
  useEffect(() => {
    const readNativeProgress = (scrollY = window.scrollY) => {
      const introDistance = Math.max(1, window.innerHeight * 2.2);
      // Keep reporting after the intro ends so the held cloud can crossfade
      // into the globe section instead of cutting away at the section boundary.
      const nextProgress = Math.max(0, scrollY / introDistance);
      window.dispatchEvent(new CustomEvent("aquamundi:intro-scroll", { detail: { progress: nextProgress } }));
      return nextProgress;
    };
    const onLenisScroll = (event) => setProgress(readNativeProgress(event.detail?.scroll));
    const onNativeScroll = () => setProgress(readNativeProgress());
    window.addEventListener("aquamundi:lenis-scroll", onLenisScroll);
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    setProgress(readNativeProgress());
    return () => {
      window.removeEventListener("aquamundi:lenis-scroll", onLenisScroll);
      window.removeEventListener("scroll", onNativeScroll);
    };
  }, []);
  const markIntroReady = useCallback(() => setIntroReady(true), []);
  const markGlobeReady = useCallback(() => setGlobeReady(true), []);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoaderFallback(true), 12000);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    const section = globeSectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setGlobeVisible(entry.isIntersecting));
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  const introFade = Math.min(1, Math.max(0, (progress - 0.04) / 0.16));
  const snowFade = Math.min(1, Math.max(0, (progress - 0.92) / 0.18));
  // The cloud has its own scroll interval before the globe section begins.
  const sceneFade = Math.min(1, Math.max(0, (progress - 1.02) / 0.28));
  const sceneOpacity = globeVisible ? 0 : 1 - sceneFade;
  return (
    <>
      <PageLoader isLoading={!loaderFallback && (!introReady || !globeReady)} />
      <div className={styles.snow} aria-hidden="true" style={{ opacity: (1 - snowFade) * sceneOpacity }}>
        <Snowfall snowflakeCount={150} color="#dceaf4" radius={[0.25, 1.35]} speed={[0.12, 0.55]} wind={[-0.15, 0.2]} />
      </div>
      <Navigation />
      <div className="fixed bottom-6 left-6 z-50">
        <MusicToggleButton autoPlay />
      </div>
      <main className={styles.experience}>
        <div className={styles.canvas} style={{ opacity: sceneOpacity }}><IntroCanvas onReady={markIntroReady} /></div>
        <header className={styles.chrome} style={{ opacity: sceneOpacity }}>
          <a href="/" className={styles.wordmark} aria-label="AquaMundi home">
            AquaMundi
          </a>
        </header>
        <div className={`${styles.copy} ${styles.introCopy}`} style={{ opacity: (1 - introFade) * sceneOpacity, transform: `translate(-50%, ${introFade * -2}vh)` }}>
          <p className={styles.heroEyebrow}>{t("home.heroSubtitle")}</p>
          <h1 className={styles.heroHeading}>
            <span>{t("home.heroTitle")}</span>
            <span>{t("home.heroTitleLine2")}</span>
          </h1>
        </div>
        <div className={styles.spacer} aria-hidden="true" />
      </main>

      <div className={styles.cloudBridge} aria-hidden="true" />

      <div className="relative min-h-screen bg-white">
        <main role="main" aria-label="AquaMundi, a living archive of biodiversity" className="home-experience relative">
          <section ref={globeSectionRef} id="globe-section" className="home-archive-section relative w-full py-20 md:py-28">
            <div className="min-h-[70vh] flex items-center justify-center">
              <div className="relative w-[92%] max-w-[1320px] h-[78vh] max-h-[820px] overflow-hidden rounded-[20px] bg-[#e6e6e2]">
                <Globe showOvalBorder={false} showBackground eager animateEntry={false} onReady={markGlobeReady} />
              </div>
            </div>
          </section>
          <section className="home-archive-loop relative w-full">
            <CurvedLoop marqueeText={t("home.marqueeText")} speed={2} curveAmount={220} direction="left" interactive className="font-serif" />
          </section>
          <section className="home-library-section relative w-full py-20 md:py-28">
            <ImageGallery />
          </section>
          <section className="relative w-full pb-20 md:pb-28">
            <BentoDemo />
          </section>
        </main>
        <FieldOutro />
      </div>
    </>
  );
}

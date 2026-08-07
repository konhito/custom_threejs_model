"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import styles from "./AquaLandingExperience.module.css";
import GlobeLoader from "./GlobeLoader";
import { useTranslation } from "../lib/useTranslation";

const Globe = dynamic(() => import("./Globe"), {
  ssr: false,
  loading: () => <GlobeLoader />,
});

export default function AquaLandingExperience() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const heroRef = useRef(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });
  const backgroundScale = useTransform(heroProgress, [0, 0.8], [1.03, 1.16]);
  const backgroundY = useTransform(heroProgress, [0, 0.85], [0, -90]);
  const cloudBackX = useTransform(heroProgress, [0, 0.8], [-45, 95]);
  const cloudBackY = useTransform(heroProgress, [0, 0.8], [100, -70]);
  const cloudBackOpacity = useTransform(heroProgress, [0, 0.1, 0.68, 0.82], [0.2, 0.76, 0.68, 0]);
  const cloudFrontX = useTransform(heroProgress, [0, 0.8], [80, -120]);
  const cloudFrontY = useTransform(heroProgress, [0, 0.8], [150, -110]);
  const cloudFrontOpacity = useTransform(heroProgress, [0, 0.14, 0.7, 0.84], [0.12, 0.72, 0.58, 0]);
  const heroCopyY = useTransform(heroProgress, [0, 0.42], [0, -180]);
  const heroCopyOpacity = useTransform(heroProgress, [0, 0.32, 0.48], [1, 1, 0]);
  const globeY = useTransform(heroProgress, [0, 0.52, 0.82], [150, 0, -80]);
  const globeScale = useTransform(heroProgress, [0, 0.58, 0.84], [0.72, 1, 0.8]);
  const heroDetailsOpacity = useTransform(heroProgress, [0.34, 0.52, 0.72], [0, 1, 0]);

  const noMotion = reducedMotion
    ? { transform: "none", opacity: 1 }
    : undefined;

  return (
    <div className={styles.page}>
      <section ref={heroRef} className={styles.heroTrack}>
        <div className={styles.stickyStage}>
          <motion.div
            className={styles.heroBackdrop}
            style={noMotion || { scale: backgroundScale, y: backgroundY }}
          >
            <Image
              src="/landing/aquamundi-cloud-sanctuary.webp"
              alt={t("home.heroImageAlt")}
              fill
              priority
              sizes="100vw"
            />
          </motion.div>

          <div className={styles.heroShade} />

          <motion.div
            className={`${styles.cloudLayer} ${styles.cloudLayerBack}`}
            style={
              reducedMotion
                ? { opacity: 0 }
                : { x: cloudBackX, y: cloudBackY, opacity: cloudBackOpacity }
            }
            aria-hidden="true"
          >
            <div className={`${styles.cloudDrift} ${styles.cloudDriftSlow}`}>
              <Image
                src="/landing/cloud-bank-blue-alpha.webp"
                alt=""
                fill
                loading="eager"
                sizes="140vw"
              />
            </div>
          </motion.div>

          <header className={styles.navbar}>
            <Link href="/" className={styles.wordmark} aria-label={t("nav.homeAriaLabel")}>
              AquaMundi
            </Link>
            <nav aria-label={t("nav.primaryAriaLabel")}>
              <Link href="/flowers">{t("nav.flowers")}</Link>
              <Link href="/pollinators">{t("nav.pollinators")}</Link>
              <Link href="/education">{t("nav.education")}</Link>
            </nav>
            <Link className={styles.navCta} href="/globe">
              {t("flowers.exploreGlobe")}
            </Link>
          </header>

          <motion.div
            className={styles.heroCopy}
            style={noMotion || { y: heroCopyY, opacity: heroCopyOpacity }}
          >
            <p>{t("home.heroSubtitle")}</p>
            <h1>
              {t("home.heroTitle")}
              <span>{t("home.heroTitleLine2")}</span>
            </h1>
          </motion.div>

          <motion.div
            className={styles.globeStage}
            style={noMotion || { y: globeY, scale: globeScale }}
          >
            <Globe showOvalBorder={false} showBackground={false} />
          </motion.div>

          <motion.div
            className={`${styles.cloudLayer} ${styles.cloudLayerFront}`}
            style={
              reducedMotion
                ? { opacity: 0 }
                : { x: cloudFrontX, y: cloudFrontY, opacity: cloudFrontOpacity }
            }
            aria-hidden="true"
          >
            <div className={`${styles.cloudDrift} ${styles.cloudDriftFast}`}>
              <Image
                src="/landing/cloud-bank-coral-alpha.webp"
                alt=""
                fill
                loading="eager"
                sizes="145vw"
              />
            </div>
          </motion.div>

          <motion.div
            className={styles.heroDetails}
            style={noMotion || { opacity: heroDetailsOpacity }}
          >
            <p>{t("home.scrollStory")}</p>
            <Link href="/globe">
              {t("home.scrollCta")} <ArrowUpRight aria-hidden="true" />
            </Link>
          </motion.div>

          <a className={styles.scrollCue} href="#globe-section">
            <span>{t("home.scrollToExplore")}</span>
            <ArrowDown aria-hidden="true" />
          </a>

        </div>
      </section>
    </div>
  );
}

"use client";

import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useTranslation } from "../lib/useTranslation";
import Silk from "./ui/Silk";
import styles from "./AquaLandingExperience.module.css";

export default function AquaLandingExperience() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Silk animated={!reducedMotion} className={styles.backdrop} noiseIntensity={1} speed={3} />
      <div className={styles.shade} />
      <a href="/" className={styles.wordmark} aria-label="AquaMundi home">
        AquaMundi
      </a>
      <div className={styles.copy}>
        <p>{t("home.heroSubtitle")}</p>
        <h1 id="hero-title">
          {t("home.heroTitle")}
          <span>{t("home.heroTitleLine2")}</span>
        </h1>
        <a href="https://www.asociacionnahiara.org/pollinator-corridor" className={styles.cta}>
          Pollinator Corridor <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

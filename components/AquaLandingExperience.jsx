"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "../lib/useTranslation";
import styles from "./AquaLandingExperience.module.css";

export default function AquaLandingExperience() {
  const { t } = useTranslation();

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Image
        alt="A pollinator touching a native flower in a mountain meadow at dawn"
        className={styles.backdrop}
        fill
        priority
        sizes="100vw"
        src="/landing/living-field-hero.png"
      />
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
        <p className={styles.context}>{t("landing.description")}</p>
        <a href="https://www.asociacionnahiara.org/pollinator-corridor" className={styles.cta}>
          Pollinator Corridor <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "../lib/useTranslation";
import styles from "./FieldEvidence.module.css";

export default function FieldEvidence() {
  const { t } = useTranslation();

  return (
    <section className={styles.section} aria-labelledby="field-evidence-title">
      <div className={styles.frame}>
        <Image
          alt="A field researcher documenting native mountain flowers"
          className={styles.image}
          fill
          sizes="(min-width: 900px) 58vw, 100vw"
          src="/landing/field-observation.png"
        />
      </div>
      <div className={styles.copy}>
        <p className={styles.kicker}>{t("landing.heroSubtitle")}</p>
        <h2 id="field-evidence-title">{t("landing.heroTitle")}</h2>
        <p className={styles.body}>{t("landing.description")}</p>
        <Link className={styles.link} href="/about">
          {t("nav.about")} <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

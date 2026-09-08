"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "../lib/useTranslation";
import styles from "./CorridorJourney.module.css";

const chapters = [
  { image: "/landing/carnation-pollinator.webp", href: "/flowers", label: "nav.flowers", description: "navDescriptions.flowers", cta: "home.exploreCta", theme: "flower" },
  { image: "/landing/pollinator-meadow.webp", href: "https://www.asociacionnahiara.org/pollinator-corridor", label: "nav.pollinators", description: "navDescriptions.pollinators", cta: "home.exploreCta", theme: "meadow" },
  { image: "/landing/lotus-wetland.webp", href: "/living-archive", label: "nav.archive", description: "landing.archiveDesc2", cta: "home.archiveCta", theme: "wetland" },
];

export default function CorridorJourney() {
  const { t } = useTranslation();
  return (
    <section className={styles.journey} aria-labelledby="corridor-title">
      <header className={styles.intro}>
        <p>{t("home.scrollStory")}</p>
        <h2 id="corridor-title">{t("nav.pollinators")}</h2>
      </header>
      <div className={styles.chapters}>
        {chapters.map((chapter, index) => {
          const content = <><span className={styles.number}>0{index + 1}</span><h3>{t(chapter.label)}</h3><p>{t(chapter.description)}</p><span className={styles.cta}>{t(chapter.cta)} <ArrowUpRight aria-hidden="true" /></span></>;
          const image = <Image alt="" className={styles.image} fill sizes="100vw" src={chapter.image} />;
          return <article key={chapter.href} className={`${styles.chapter} ${styles[chapter.theme]}`}>
            {chapter.href.startsWith("http") ? <a href={chapter.href} className={styles.card} target="_blank" rel="noreferrer">{image}<span className={styles.scrim} /><span className={styles.content}>{content}</span></a> : <Link href={chapter.href} className={styles.card}>{image}<span className={styles.scrim} /><span className={styles.content}>{content}</span></Link>}
          </article>;
        })}
      </div>
    </section>
  );
}

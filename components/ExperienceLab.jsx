"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./ExperienceLab.module.css";

const JourneyCanvas = dynamic(() => import("./ExperienceLabCanvas"), {
  ssr: false,
  loading: () => <div className={styles.canvasFallback} />,
});

export default function ExperienceLab() {
  const experienceRef = useRef(null);

  useEffect(() => {
    const node = experienceRef.current;
    if (!node) return;
    const onScroll = (event) => {
      const { progress = 0, velocity = 0 } = event.detail || {};
      node.style.setProperty("--journey-progress", progress);
      node.style.setProperty("--journey-velocity", Math.min(Math.abs(velocity), 2));
    };
    window.addEventListener("aquamundi:lenis-scroll", onScroll);
    return () => window.removeEventListener("aquamundi:lenis-scroll", onScroll);
  }, []);

  return (
    <main ref={experienceRef} className={styles.experience}>
      <JourneyCanvas />
      <header className={styles.chrome}>
        <Link href="/" className={styles.brand}>AquaMundi</Link>
        <span>Experience study · 01</span>
      </header>

      <section className={`${styles.beat} ${styles.opening}`} aria-labelledby="study-title">
        <div>
          <p className={styles.label}>A living connection</p>
          <h1 id="study-title">Every habitat begins with a flower.</h1>
          <p>Scroll through the first movement of AquaMundi’s proposed living archive.</p>
        </div>
      </section>

      <section className={`${styles.beat} ${styles.pollinator}`} aria-labelledby="pollinator-title">
        <div>
          <p className={styles.label}>A pollinator’s passage</p>
          <h2 id="pollinator-title">Life travels in the space between blooms.</h2>
          <p>One visit carries pollen, seed, and possibility beyond a single flower.</p>
        </div>
      </section>

      <section className={`${styles.beat} ${styles.corridor}`} aria-labelledby="corridor-title">
        <div>
          <p className={styles.label}>The corridor</p>
          <h2 id="corridor-title">Protection works when habitats connect.</h2>
          <a href="https://www.asociacionnahiara.org/pollinator-corridor">
            Explore the Pollinator Corridor <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <p className={styles.scrollHint}>Scroll to move through the field</p>
    </main>
  );
}

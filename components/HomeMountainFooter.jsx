"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "../lib/useTranslation";
import styles from "./HomeMountainFooter.module.css";

const ashFragments = Array.from({ length: 28 }, (_, index) => index);

export default function HomeMountainFooter() {
  const { t } = useTranslation();
  const footerRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRevealed(true);
        observer.disconnect();
      }
    }, { threshold: 0.02, rootMargin: "0px 0px -8%" });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);
  const columns = [
    { title: t("footer.explore"), links: [["/flowers", t("nav.flowers")], ["/pollinators", t("nav.pollinators")], ["/living-archive", t("nav.archive")]] },
    { title: t("footer.learn"), links: [["/education", t("nav.education")], ["/guardians", t("nav.guardians")], ["/impact", t("nav.impact")]] },
    { title: t("footer.legal"), links: [["/about", t("nav.about")], ["/privacy", t("footer.privacyPolicy")], ["/contact-the-author", "Contact"]] },
  ];

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={`${styles.mountainFrame} ${revealed ? styles.revealed : ""}`} aria-hidden="true">
        <Image src="/landing/archive-mountain-footer.png" alt="" fill sizes="100vw" className={styles.mountain} />
      </div>
      <div className={`${styles.burnFragments} ${revealed ? styles.revealed : ""}`} aria-hidden="true">
        {ashFragments.map((fragment) => (
          <i
            key={fragment}
            style={{
              "--delay": `${0.15 + fragment * 0.035}s`,
              "--drift": `${28 + (fragment % 5) * 7}vw`,
              "--size": `${2 + (fragment % 3)}px`,
              "--y": `${50 + (fragment % 10) * 4.5}%`,
            }}
          />
        ))}
      </div>
      <div className={styles.content}>
        <div className={styles.brand}>
          <Link href="/" className={styles.brandLink}>
            <Image src="/logo1.png" alt="" width={72} height={72} className={styles.logo} />
            <span className={styles.wordmark}>AquaMundi</span>
          </Link>
          <p>Proveneya &amp; Nahiara</p>
        </div>
        <nav className={styles.links} aria-label="Footer navigation">
          {columns.map((column) => (
            <section key={column.title}>
              <h2>{column.title}</h2>
              {column.links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
            </section>
          ))}
        </nav>
      </div>
      <p className={styles.copyright}>&copy; {new Date().getFullYear()} AquaMundi. All rights reserved.</p>
    </footer>
  );
}

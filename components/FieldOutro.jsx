import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "../lib/useTranslation";
import styles from "./FieldOutro.module.css";

const motes = Array.from({ length: 14 }, (_, index) => index);

export default function FieldOutro() {
  const { t } = useTranslation();
  const columns = [
    { title: t("footer.explore"), links: [["/flowers", t("nav.flowers")], ["/pollinators", t("nav.pollinators")], ["/living-archive", t("nav.archive")]] },
    { title: t("footer.learn"), links: [["/education", t("nav.education")], ["/guardians", t("nav.guardians")], ["/impact", t("nav.impact")]] },
    { title: t("footer.legal"), links: [["/about", t("nav.about")], ["/privacy", t("footer.privacyPolicy")], ["/contact-the-author", "Contact"]] },
  ];

  return (
    <footer className={styles.outro} aria-label="AquaMundi field observatory">
      <Image
        src="/landing/field-observatory-outro.png"
        alt="A botanical field observatory at twilight"
        fill
        sizes="100vw"
        className={styles.image}
      />
      <div className={styles.dusk} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.brand}>
          <Link href="/" className={styles.brandLink} aria-label="AquaMundi home">
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
      <div className={styles.motes} aria-hidden="true">
        {motes.map((mote) => (
          <i
            key={mote}
            style={{
              "--delay": `${mote * -0.5}s`,
              "--left": `${6 + mote * 6.8}%`,
              "--bottom": `${8 + mote * 2.6}%`,
            }}
          />
        ))}
      </div>
      <p className={styles.copyright}>&copy; {new Date().getFullYear()} AquaMundi. All rights reserved.</p>
    </footer>
  );
}

"use client";

import { useTranslation } from "../lib/useTranslation";
import copy from "../messages/wildfireBanner.json";
import WildfireArt from "./WildfireArt";

export default function WildfirePollinatorBanner() {
  const { locale } = useTranslation();
  const content = copy[locale] || copy.en;

  return (
    <section className="wildfire-banner" aria-label={content.emphasis}>
      <div className="wildfire-banner__copy">
        {/* Monthly refresh: update this date and every figure below while fire season continues. */}
        <p className="wildfire-banner__meta">Proveneya &amp; Nahiara · {content.date}</p>
        <p>{content.text} <strong>{content.emphasis}</strong></p>
        <details className="wildfire-banner__details">
          <summary>{content.details}</summary>
          <div className="wildfire-banner__data">
            <button
              className="wildfire-banner__close"
              type="button"
              aria-label={content.close}
              title={content.close}
              onClick={(event) => event.currentTarget.closest("details").removeAttribute("open")}
            >
              ×
            </button>
            {content.groups.map((group) => (
              <section key={group.title}>
                <h2>{group.title}</h2>
                <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>
            ))}
            <p className="wildfire-banner__sources">{content.sources}</p>
          </div>
        </details>
      </div>
      <WildfireArt />
    </section>
  );
}

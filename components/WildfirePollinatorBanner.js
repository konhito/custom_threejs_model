"use client";

import { useTranslation } from "../lib/useTranslation";
import copy from "../messages/wildfireBanner.json";
import WildfireArt from "./WildfireArt";

export default function WildfirePollinatorBanner() {
  const { locale } = useTranslation();
  const content = copy[locale] ?? copy.en;
  const message = locale === "es"
    ? "Incendios forestales 2026 — actualización diaria. Los polinizadores también son víctimas — y merecen ser contados. Son la gran incógnita de estos incendios, ausentes de la cobertura informativa."
    : "Wildfires 2026 — daily update. Pollinators are victims too — and they deserve to be counted. They are the great unknown of these fires, absent from the reporting.";

  return (
    <section className="wildfire-banner" aria-label={message}>
      <div className="wildfire-banner__copy">
        {/* Daily refresh: update only the date and figures in wildfireBanner.json. */}
        <p className="wildfire-banner__meta">Proveneya &amp; Nahiara · {content.date}</p>
        <p>{message}</p>
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
                <ul>{group.items.map((item) => (
                  <li key={typeof item === "string" ? item : item.text}>
                    {typeof item === "string" ? item : (
                      <a className="wildfire-banner__source-link" href={item.href} target="_blank" rel="noreferrer">{item.text}</a>
                    )}
                  </li>
                ))}</ul>
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

"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";

function getCycleDates(now = new Date()) {
  let year = now.getFullYear();
  let dayStart = new Date(year, 5, 21, 0, 0, 0, 0);
  let dayEnd = new Date(year, 5, 22, 0, 0, 0, 0);

  if (now >= dayEnd) {
    year += 1;
    dayStart = new Date(year, 5, 21, 0, 0, 0, 0);
    dayEnd = new Date(year, 5, 22, 0, 0, 0, 0);
  }

  return { year, dayStart, dayEnd };
}

function getCountdownState(now = new Date()) {
  const { year, dayStart, dayEnd } = getCycleDates(now);

  if (now >= dayStart && now < dayEnd) {
    return {
      arrived: true,
      year,
      dd: "00",
      hh: "00",
      mm: "00",
      ss: "00",
    };
  }

  const diff = Math.max(dayStart.getTime() - now.getTime(), 0);
  const dd = Math.floor(diff / 86400000);
  const hh = Math.floor((diff % 86400000) / 3600000);
  const mm = Math.floor((diff % 3600000) / 60000);
  const ss = Math.floor((diff % 60000) / 1000);

  return {
    arrived: false,
    year,
    dd: String(dd).padStart(2, "0"),
    hh: String(hh).padStart(2, "0"),
    mm: String(mm).padStart(2, "0"),
    ss: String(ss).padStart(2, "0"),
  };
}

function RealPollinator({ type }) {
  return <span className={`real-pollinator real-pollinator--${type}`} aria-hidden="true" />;
}

const CLOCK_UNITS = [
  { key: "dd", label: "Dias" },
  { key: "hh", label: "Horas" },
  { key: "mm", label: "Min" },
  { key: "ss", label: "Seg" },
];

export default function RelojClient() {
  const [countdown, setCountdown] = useState(() => getCountdownState());

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdownState());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toward = useMemo(() => {
    if (countdown.arrived) {
      return "Hoy, 21 de junio, celebramos oficialmente el Dia de Todos los Polinizadores.";
    }

    return `Faltan para el 21 de junio de ${countdown.year}`;
  }, [countdown]);

  return (
    <main className={`page ${countdown.arrived ? "arrived" : ""}`}>
      <section className="hero-frame">
        <div className="sun" />
        <div className="haze" />
        <div className="grain" />
        <div className="flyer f1">
          <div className="bobwrap"><RealPollinator type="butterfly" /></div>
        </div>
        <div className="flyer f2">
          <div className="bobwrap"><RealPollinator type="bee" /></div>
        </div>
        <div className="flyer f3">
          <div className="bobwrap"><RealPollinator type="hoverfly" /></div>
        </div>
        <div className="flyer f4">
          <div className="bobwrap"><RealPollinator type="hummingbird" /></div>
        </div>
        <div className="flyer f5">
          <div className="bobwrap"><RealPollinator type="moth" /></div>
        </div>

        <div className="stage">
          <p className="eyebrow">Universo Nahiara</p>
          <h1 id="headline">
            Dia de <em>Todos</em>
            <br />
            los Polinizadores
          </h1>
          <p className="subtitle">21 de junio · Solsticio</p>

          {countdown.arrived ? (
            <p className="celebrate">La red de la vida florece completa.</p>
          ) : null}

          <p className="toward">{toward}</p>

          {!countdown.arrived ? (
            <div className="clock" aria-live="polite" aria-label="Cuenta regresiva al 21 de junio">
              {CLOCK_UNITS.map((unit, index) => (
                <Fragment key={unit.key}>
                  <div className="unit">
                    <span className="num">{countdown[unit.key]}</span>
                    <span className="label">{unit.label}</span>
                  </div>
                  {index < CLOCK_UNITS.length - 1 ? <span className="sep">:</span> : null}
                </Fragment>
              ))}
            </div>
          ) : null}

          <div className="actions">
            <Link href="/dia-de-todos-los-polinizadores" className="cta primary">
              Leer manifiesto
            </Link>
            <Link href="/pollinators/gallery" className="cta secondary">
              Explorar polinizadores
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f4f1ef;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(10px, 1.5vw, 18px);
          font-family: Outfit, sans-serif;
          color: #fdf3e3;
        }

        .hero-frame {
          --sky-top: #1d1433;
          --sky-mid: #623562;
          --sky-low: #d47653;
          --sun: #ffd279;
          --sun-core: #fff3d6;
          --gold: #f5c45e;
          --cream: #fdf3e3;
          --deep: #1a1028;
          position: relative;
          width: min(1980px, 100%);
          min-height: clamp(560px, 92vh, 1140px);
          overflow: hidden;
          border-radius: 34px;
          border: 1px solid rgba(255, 245, 229, 0.42);
          box-shadow:
            0 14px 36px rgba(52, 31, 23, 0.16),
            inset 0 0 0 1px rgba(255, 255, 255, 0.2);
          background:
            radial-gradient(120% 90% at 50% 96%, var(--sun) 0%, rgba(255, 210, 121, 0) 42%),
            linear-gradient(180deg, var(--sky-top) 0%, var(--sky-mid) 46%, var(--sky-low) 82%, #f0a06a 100%);
        }

        .sun {
          position: absolute;
          left: 50%;
          bottom: -7vh;
          transform: translateX(-50%);
          width: 46vh;
          height: 46vh;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 50%, var(--sun-core) 0%, var(--sun) 38%, rgba(255, 210, 121, 0) 70%);
          filter: blur(2px);
          pointer-events: none;
          animation: breathe 8s ease-in-out infinite;
        }

        .haze {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(60% 40% at 30% 30%, rgba(255, 243, 214, 0.08), transparent 60%),
            radial-gradient(50% 40% at 75% 60%, rgba(255, 210, 121, 0.07), transparent 60%);
          pointer-events: none;
        }

        .grain {
          position: absolute;
          inset: 0;
          opacity: 0.05;
          pointer-events: none;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .stage {
          position: relative;
          z-index: 5;
          text-align: center;
          padding: clamp(1.4rem, 4vw, 2.6rem);
          max-width: 980px;
          margin: 0 auto;
          min-height: inherit;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.42em;
          font-size: 0.72rem;
          font-weight: 500;
          color: var(--gold);
        }

        h1 {
          margin: 1.2rem 0 0;
          font-family: var(--font-fraunces), "Playfair Display", serif;
          font-weight: 400;
          font-size: clamp(2.3rem, 6vw, 4.4rem);
          line-height: 1.04;
          letter-spacing: -0.01em;
          text-shadow: 0 2px 30px rgba(26, 16, 40, 0.4);
        }

        h1 em {
          font-style: italic;
          color: var(--sun-core);
        }

        .subtitle {
          font-family: var(--font-fraunces), "Playfair Display", serif;
          font-style: italic;
          font-size: clamp(1rem, 2.2vw, 1.3rem);
          margin-top: 1rem;
        }

        .toward {
          font-size: 0.82rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(253, 243, 227, 0.78);
          margin-top: 1.7rem;
        }

        .clock {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          gap: clamp(0.55rem, 1.8vw, 1.2rem);
          margin: 1.4rem 0 0;
          max-width: 860px;
        }

        .unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: clamp(70px, 11vw, 120px);
        }

        .num {
          font-family: var(--font-fraunces), "Playfair Display", serif;
          font-weight: 500;
          font-size: clamp(2.4rem, 7vw, 5rem);
          line-height: 1.14;
          letter-spacing: -0.012em;
          padding: 0.04em 0 0.02em;
          background: linear-gradient(180deg, #fff7e8, #f5c45e);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 4px 24px rgba(255, 210, 121, 0.18);
          font-variant-numeric: tabular-nums;
        }

        .label {
          text-transform: uppercase;
          letter-spacing: 0.22em;
          font-size: 0.62rem;
          color: rgba(253, 243, 227, 0.72);
          margin-top: 0.5rem;
        }

        .sep {
          font-family: "Playfair Display", serif;
          font-size: clamp(2rem, 6vw, 4rem);
          color: var(--gold);
          opacity: 0.5;
          align-self: flex-start;
          margin-top: 0.16em;
        }

        .celebrate {
          margin: 2.1rem 0 0;
          font-family: "Playfair Display", serif;
          font-style: italic;
          font-size: clamp(1.2rem, 3vw, 1.8rem);
          color: var(--sun-core);
        }

        .actions {
          margin-top: 1.4rem;
          display: inline-flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.7rem;
        }

        .cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0.72rem 1.5rem;
          text-decoration: none;
          font-size: 0.92rem;
          letter-spacing: 0.04em;
          border: 1px solid rgba(253, 243, 227, 0.4);
          transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .primary {
          background: var(--gold);
          color: var(--deep);
          border-color: var(--gold);
          font-weight: 600;
        }

        .secondary {
          color: var(--cream);
          background: rgba(253, 243, 227, 0.08);
          backdrop-filter: blur(4px);
        }

        .cta:hover {
          transform: translateY(-2px);
        }

        .arrived .clock,
        .arrived .toward {
          display: none;
        }

        .flyer {
          position: absolute;
          z-index: 4;
          will-change: transform;
          pointer-events: none;
          transition: filter 0.16s ease, opacity 0.16s ease;
        }

        .flyer svg {
          display: block;
          overflow: visible;
        }

        .real-pollinator {
          display: block;
          width: 148px;
          height: 148px;
          position: relative;
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
          filter: drop-shadow(0 8px 10px rgba(26, 16, 40, 0.28));
          transform-origin: center;
          animation: body-hover 1.6s ease-in-out infinite alternate;
        }

        .real-pollinator--bee { background-image: url("/pollinators/realistic-bee-wingbeat.gif"); }
        .real-pollinator--hummingbird { background-image: url("/pollinators/realistic-hummingbird-wingbeat.gif"); width: 182px; }
        .real-pollinator--butterfly { background-image: url("/pollinators/realistic-butterfly-wingbeat.gif"); }
        .real-pollinator--moth { background-image: url("/pollinators/realistic-moth-wingbeat.gif"); }
        .real-pollinator--hoverfly { background-image: url("/pollinators/realistic-hoverfly-wingbeat.gif"); }

        .wing {
          transform-origin: center;
          animation: flap 0.14s ease-in-out infinite alternate;
        }

        .wing.slow {
          animation-duration: 0.34s;
        }

        .f1 {
          animation: path1 26s linear infinite;
        }

        .f2 {
          animation: path2 32s linear infinite;
        }

        .f3 {
          animation: path3 22s linear infinite;
        }

        .f4 {
          animation: path4 38s linear infinite;
        }

        .f5 {
          animation: path5 19s linear infinite;
        }

        .bobwrap {
          animation: bob 2.6s ease-in-out infinite;
        }

        @keyframes flap {
          from {
            transform: scaleY(0.55) rotate(-4deg);
          }
          to {
            transform: scaleY(1) rotate(4deg);
          }
        }

        @keyframes body-hover {
          from { transform: scale(0.97) rotate(-1.5deg); }
          to { transform: scale(1.03) rotate(1.5deg); }
        }


        @keyframes path1 {
          0% {
            transform: translate(-12vw, 72vh) rotate(8deg);
          }
          25% {
            transform: translate(28vw, 40vh) rotate(-10deg);
          }
          50% {
            transform: translate(62vw, 58vh) rotate(6deg);
          }
          75% {
            transform: translate(85vw, 28vh) rotate(-8deg);
          }
          100% {
            transform: translate(112vw, 46vh) rotate(8deg);
          }
        }

        @keyframes path2 {
          0% {
            transform: translate(110vw, 20vh) rotate(-6deg) scaleX(-1);
          }
          30% {
            transform: translate(64vw, 52vh) rotate(8deg) scaleX(-1);
          }
          60% {
            transform: translate(34vw, 22vh) rotate(-10deg) scaleX(-1);
          }
          100% {
            transform: translate(-14vw, 40vh) rotate(-6deg) scaleX(-1);
          }
        }

        @keyframes path3 {
          0% {
            transform: translate(-10vw, 30vh) rotate(4deg);
          }
          40% {
            transform: translate(40vw, 66vh) rotate(-6deg);
          }
          70% {
            transform: translate(72vw, 38vh) rotate(8deg);
          }
          100% {
            transform: translate(114vw, 60vh) rotate(4deg);
          }
        }

        @keyframes path4 {
          0% {
            transform: translate(108vw, 70vh) rotate(-8deg) scaleX(-1);
          }
          35% {
            transform: translate(58vw, 30vh) rotate(6deg) scaleX(-1);
          }
          65% {
            transform: translate(26vw, 56vh) rotate(-6deg) scaleX(-1);
          }
          100% {
            transform: translate(-12vw, 26vh) rotate(-8deg) scaleX(-1);
          }
        }

        @keyframes path5 {
          0% {
            transform: translate(-8vw, 52vh) rotate(0deg);
          }
          50% {
            transform: translate(50vw, 18vh) rotate(-8deg);
          }
          100% {
            transform: translate(112vw, 34vh) rotate(0deg);
          }
        }

        @keyframes bob {
          50% {
            margin-top: -2.2vh;
          }
        }

        @keyframes breathe {
          50% {
            transform: translateX(-50%) scale(1.06);
            opacity: 0.92;
          }
        }

        @media (max-width: 560px) {
          .clock {
            gap: 0.9rem;
            flex-wrap: wrap;
          }

          .sep {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .flyer,
          .wing,
          .real-pollinator,
          .sun,
          .bobwrap {
            animation: none !important;
          }

          .flyer {
            display: none;
          }

        }
      `}</style>
    </main>
  );
}

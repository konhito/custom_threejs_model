"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
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

function Monarch() {
  return (
    <svg width="56" height="46" viewBox="0 0 56 46" aria-hidden="true">
      <g className="wing">
        <path d="M28 23 C14 4, 2 8, 6 22 C2 36, 16 42, 28 23 Z" fill="#e8702a" />
        <path d="M28 23 C42 4, 54 8, 50 22 C54 36, 40 42, 28 23 Z" fill="#f08a3c" />
        <path d="M28 23 C16 8, 6 11, 8 21 Z" fill="#2a1626" opacity="0.55" />
        <path d="M28 23 C40 8, 50 11, 48 21 Z" fill="#2a1626" opacity="0.55" />
      </g>
      <ellipse cx="28" cy="24" rx="2" ry="9" fill="#1a1028" />
    </svg>
  );
}

function Bee() {
  return (
    <svg width="40" height="30" viewBox="0 0 40 30" aria-hidden="true">
      <g className="wing">
        <ellipse cx="17" cy="9" rx="9" ry="5" fill="#fff7e8" opacity="0.75" />
      </g>
      <g className="wing" style={{ animationDelay: ".07s" }}>
        <ellipse cx="24" cy="9" rx="9" ry="5" fill="#fff7e8" opacity="0.75" />
      </g>
      <ellipse cx="22" cy="18" rx="11" ry="8" fill="#f5c45e" />
      <path d="M16 12 a11 8 0 0 1 12 0 l-1.6 3 a8 6 0 0 0-8.8 0 Z" fill="#2a1626" />
      <path d="M14.5 18 a11 8 0 0 0 15 0 l-1.4 3.4 a8 6 0 0 1-12.2 0 Z" fill="#2a1626" />
      <circle cx="32" cy="15" r="2.4" fill="#2a1626" />
    </svg>
  );
}

function Swallowtail() {
  return (
    <svg width="50" height="42" viewBox="0 0 50 42" aria-hidden="true">
      <g className="wing slow">
        <path d="M25 21 C12 5, 3 9, 6 20 C3 33, 15 38, 25 21 Z" fill="#f7d98f" />
        <path d="M25 21 C38 5, 47 9, 44 20 C47 33, 35 38, 25 21 Z" fill="#fbe6ad" />
        <path d="M9 26 l-4 9 6 -4 Z" fill="#e8a64c" />
        <path d="M41 26 l4 9 -6 -4 Z" fill="#e8a64c" />
      </g>
      <ellipse cx="25" cy="22" rx="1.8" ry="8" fill="#3a2418" />
    </svg>
  );
}

function Hummingbird() {
  return (
    <svg width="58" height="34" viewBox="0 0 58 34" aria-hidden="true">
      <path d="M40 16 C46 12, 54 13, 57 17 C53 18, 46 19, 41 18 Z" fill="#2f8f6b" />
      <ellipse cx="34" cy="17" rx="12" ry="7" fill="#3ba074" />
      <path d="M30 17 C22 17, 12 22, 4 30 C14 24, 24 22, 31 21 Z" fill="#256e52" />
      <circle cx="44" cy="14" r="1.6" fill="#1a1028" />
      <path d="M44 15 l11 -2 -10 4 Z" fill="#1a1028" />
      <path d="M40 17 c-3 -1 -6 0 -8 1" stroke="#c0507a" strokeWidth="3" fill="none" opacity="0.8" />
      <g className="wing">
        <path d="M33 15 C30 2, 16 0, 22 14 Z" fill="#5fc79a" opacity="0.7" />
      </g>
    </svg>
  );
}

function Moth() {
  return (
    <svg width="44" height="34" viewBox="0 0 44 34" aria-hidden="true">
      <g className="wing slow">
        <path d="M22 17 C10 7, 2 12, 5 19 C2 28, 14 30, 22 17 Z" fill="#b98a5e" />
        <path d="M22 17 C34 7, 42 12, 39 19 C42 28, 30 30, 22 17 Z" fill="#cda074" />
        <path d="M22 17 C13 11, 6 14, 7 18 Z" fill="#7a5638" opacity="0.6" />
        <path d="M22 17 C31 11, 38 14, 37 18 Z" fill="#7a5638" opacity="0.6" />
      </g>
      <ellipse cx="22" cy="18" rx="2.2" ry="7.5" fill="#4a3220" />
    </svg>
  );
}

const CLOCK_UNITS = [
  { key: "dd", label: "Dias" },
  { key: "hh", label: "Horas" },
  { key: "mm", label: "Min" },
  { key: "ss", label: "Seg" },
];

export default function RelojClient() {
  const [countdown, setCountdown] = useState(() => getCountdownState());
  const frameRef = useRef(null);
  const burstRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdownState());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const flyers = Array.from(frame.querySelectorAll("[data-flyer]"));
    if (!flyers.length) return;

    const hitTimeouts = new Map();
    const hitCooldown = new Map();

    const setCursorPosition = (clientX, clientY) => {
      const rect = frame.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(clientY - rect.top, rect.height));
      frame.style.setProperty("--cursor-x", `${x}px`);
      frame.style.setProperty("--cursor-y", `${y}px`);
    };

    const clearAlerts = () => {
      flyers.forEach((flyer) => flyer.classList.remove("is-alert"));
    };

    const applyThreat = (clientX, clientY, forceBurst = false) => {
      const now = performance.now();

      flyers.forEach((flyer) => {
        const box = flyer.getBoundingClientRect();
        const centerX = box.left + box.width / 2;
        const centerY = box.top + box.height / 2;
        const distance = Math.hypot(clientX - centerX, clientY - centerY);

        flyer.classList.toggle("is-alert", distance < 130);

        const withinHitRange = forceBurst ? distance < 180 : distance < 72;
        if (!withinHitRange) return;

        const lastHit = hitCooldown.get(flyer) || 0;
        if (now - lastHit < 550) return;
        hitCooldown.set(flyer, now);

        flyer.classList.add("is-hit");
        const previousTimeout = hitTimeouts.get(flyer);
        if (previousTimeout) window.clearTimeout(previousTimeout);

        const timeoutId = window.setTimeout(() => {
          flyer.classList.remove("is-hit");
        }, 520);
        hitTimeouts.set(flyer, timeoutId);
      });
    };

    const triggerBurstPulse = () => {
      const burst = burstRef.current;
      if (!burst) return;
      burst.classList.remove("bursting");
      void burst.offsetWidth;
      burst.classList.add("bursting");
    };

    const handlePointerEnter = (event) => {
      frame.classList.add("cursor-on");
      setCursorPosition(event.clientX, event.clientY);
    };

    const handlePointerMove = (event) => {
      setCursorPosition(event.clientX, event.clientY);
      applyThreat(event.clientX, event.clientY, false);
    };

    const handlePointerLeave = () => {
      frame.classList.remove("cursor-on");
      clearAlerts();
    };

    const handlePointerDown = (event) => {
      setCursorPosition(event.clientX, event.clientY);
      triggerBurstPulse();
      applyThreat(event.clientX, event.clientY, true);
    };

    frame.addEventListener("pointerenter", handlePointerEnter);
    frame.addEventListener("pointermove", handlePointerMove);
    frame.addEventListener("pointerleave", handlePointerLeave);
    frame.addEventListener("pointerdown", handlePointerDown);

    return () => {
      frame.removeEventListener("pointerenter", handlePointerEnter);
      frame.removeEventListener("pointermove", handlePointerMove);
      frame.removeEventListener("pointerleave", handlePointerLeave);
      frame.removeEventListener("pointerdown", handlePointerDown);
      for (const timeoutId of hitTimeouts.values()) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  const toward = useMemo(() => {
    if (countdown.arrived) {
      return "Hoy, 21 de junio, celebramos oficialmente el Dia de Todos los Polinizadores.";
    }

    return `Faltan para el 21 de junio de ${countdown.year}`;
  }, [countdown]);

  return (
    <main className={`page ${countdown.arrived ? "arrived" : ""}`}>
      <section className="hero-frame" ref={frameRef}>
        <div className="sun" />
        <div className="haze" />
        <div className="grain" />
        <div className="cursor-layer" aria-hidden="true">
          <div className="cursor-ring" />
          <div className="cursor-core" />
          <div className="cursor-burst" ref={burstRef} />
        </div>

        <div className="flyer f1" data-flyer>
          <div className="bobwrap"><Monarch /></div>
        </div>
        <div className="flyer f2" data-flyer>
          <div className="bobwrap"><Bee /></div>
        </div>
        <div className="flyer f3" data-flyer>
          <div className="bobwrap"><Swallowtail /></div>
        </div>
        <div className="flyer f4" data-flyer>
          <div className="bobwrap"><Hummingbird /></div>
        </div>
        <div className="flyer f5" data-flyer>
          <div className="bobwrap"><Moth /></div>
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
          --cursor-x: 50%;
          --cursor-y: 50%;

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
          cursor: none;
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

        .cursor-layer {
          position: absolute;
          inset: 0;
          z-index: 8;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.18s ease;
        }

        .cursor-on .cursor-layer {
          opacity: 1;
        }

        .cursor-ring,
        .cursor-core,
        .cursor-burst {
          position: absolute;
          left: var(--cursor-x);
          top: var(--cursor-y);
          transform: translate(-50%, -50%);
          border-radius: 999px;
        }

        .cursor-ring {
          width: 76px;
          height: 76px;
          border: 1px solid rgba(253, 243, 227, 0.52);
          background: radial-gradient(circle, rgba(245, 196, 94, 0.2), rgba(245, 196, 94, 0));
          box-shadow: 0 0 24px rgba(245, 196, 94, 0.2);
          transition: width 0.2s ease, height 0.2s ease, border-color 0.2s ease;
        }

        .cursor-core {
          width: 12px;
          height: 12px;
          background: #fff5dd;
          box-shadow: 0 0 18px rgba(255, 245, 221, 0.7);
        }

        .cursor-burst {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(245, 196, 94, 0.75);
          opacity: 0;
        }

        .cursor-burst.bursting {
          animation: burst 0.35s ease-out forwards;
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

        .flyer.is-alert {
          filter: drop-shadow(0 0 14px rgba(255, 236, 173, 0.48)) saturate(1.1);
        }

        .flyer.is-alert .bobwrap {
          animation-duration: 1.4s;
        }

        .flyer.is-hit {
          filter: drop-shadow(0 0 20px rgba(255, 215, 121, 0.74)) brightness(1.12);
        }

        .flyer.is-hit .bobwrap {
          animation: bob 2.6s ease-in-out infinite, skitter 0.26s ease-in-out 2;
        }

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

        @keyframes skitter {
          0% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-16px) rotate(-5deg);
          }
          50% {
            transform: translateX(12px) rotate(5deg);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes burst {
          0% {
            opacity: 0.95;
            transform: translate(-50%, -50%) scale(0.25);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(3.4);
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
          .cursor-layer {
            display: none;
          }

          .flyer,
          .wing,
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

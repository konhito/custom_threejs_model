"use client";

import { motion } from "motion/react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import {
  Leaf,
  MapPin,
  Thermometer,
  ShieldCheck,
  BookOpen,
  AlertTriangle,
  Info,
  ChevronRight,
  Layers,
  Globe2,
} from "lucide-react";
import Link from "next/link";

// ─── Decorations ──────────────────────────────────────────────────────────────

const GlowingOrb = ({ className, color = "rose", size = "md" }) => {
  const sizes = { sm: "w-24 h-24", md: "w-40 h-40", lg: "w-64 h-64", xl: "w-96 h-96" };
  const colors = {
    rose: "from-rose-400/20 via-pink-300/10 to-transparent",
    emerald: "from-emerald-400/20 via-teal-300/10 to-transparent",
    violet: "from-violet-400/20 via-purple-300/10 to-transparent",
    amber: "from-amber-400/20 via-yellow-300/10 to-transparent",
    sky: "from-sky-400/20 via-blue-300/10 to-transparent",
  };
  return (
    <div
      className={`absolute rounded-full bg-gradient-radial ${colors[color]} ${sizes[size]} blur-3xl pointer-events-none ${className}`}
    />
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const INDICATORS = [
  {
    no: 1,
    icon: Leaf,
    name: "Ecological Health",
    description:
      "Absence of severe biological and environmental threats to the flower species.",
    optimal: "No detectable threats — healthy ecosystem",
    critical: "Active critical threats — species in immediate danger",
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    no: 2,
    icon: MapPin,
    name: "Habitat Conservation",
    description:
      "Preservation of the territory where the flower can grow and reproduce naturally.",
    optimal: "Intact and protected habitat",
    critical: "Destroyed or irreversibly fragmented habitat",
    gradient: "from-green-500 to-lime-500",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  {
    no: 3,
    icon: Thermometer,
    name: "Climatic Stability",
    description:
      "Favourable and stable climate conditions for the life cycles of the species.",
    optimal: "Stable and favourable climate",
    critical: "Extremely adverse or collapsing climate",
    gradient: "from-sky-500 to-blue-500",
    bg: "bg-sky-50",
    border: "border-sky-200",
  },
  {
    no: 4,
    icon: ShieldCheck,
    name: "Protection from Human Pressure",
    description:
      "Level of effective protection against harmful human activities (logging, urbanisation, extraction, direct contamination).",
    optimal: "Well protected — active legal frameworks",
    critical: "No legal or effective protection of any kind",
    gradient: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  {
    no: 5,
    icon: BookOpen,
    name: "Population Knowledge",
    description:
      "Level of public knowledge and recognition regarding the national flower and its ecological and cultural value.",
    optimal: "High knowledge — the population identifies, values and protects it",
    critical: "Total ignorance — the flower is invisible to its own society",
    gradient: "from-rose-500 to-pink-500",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
];

const RISK_LEVELS = [
  {
    label: "VERY LOW",
    range: "22 – 25 pts",
    dot: "bg-emerald-400",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    description: "Flower in optimal condition",
    detail:
      "All five factors are under control. Preventive monitoring and maintenance action recommended.",
  },
  {
    label: "LOW",
    range: "17 – 21 pts",
    dot: "bg-lime-400",
    bg: "bg-lime-50",
    border: "border-lime-200",
    text: "text-lime-700",
    description: "Flower in stable condition",
    detail:
      "Satisfactory conservation status with identified areas for improvement. Planned intervention recommended to sustain the current level.",
  },
  {
    label: "MODERATE",
    range: "11 – 16 pts",
    dot: "bg-amber-400",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    description: "Flower in alert situation",
    detail:
      "Detectable stress in one or more indicators. The species may deteriorate if action is not taken. Active intervention required.",
  },
  {
    label: "HIGH",
    range: "6 – 10 pts",
    dot: "bg-orange-400",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    description: "Flower at significant risk",
    detail:
      "Consolidated threat with measurable damage to the species. One or more indicators in critical condition. Urgent and coordinated action essential.",
  },
  {
    label: "EXTREME",
    range: "5 pts",
    dot: "bg-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    description: "Flower in critical danger",
    detail:
      "All indicators in a state of collapse. The national flower faces real risk of disappearance. Conservation emergency — immediate intervention required.",
  },
];

const EXAMPLE_INDICATORS = [
  {
    no: 1,
    name: "Ecological Health",
    assessment: "The Carnation is botanically robust with no active biological threats.",
    score: 4,
    signal: "🟢",
  },
  {
    no: 2,
    name: "Habitat Conservation",
    assessment: "Habitat partially degraded by agricultural expansion in Southern Spain.",
    score: 4,
    signal: "🟢",
  },
  {
    no: 3,
    name: "Climatic Stability",
    assessment: "Growing climate variability in the Mediterranean region.",
    score: 3,
    signal: "🟡",
  },
  {
    no: 4,
    name: "Protection from Human Pressure",
    assessment: "No official legal protection as there is no governmental decree — it is a PFNO flower.",
    score: 2,
    signal: "🟠",
  },
  {
    no: 5,
    name: "Population Knowledge",
    assessment: "Maximum recognition — universally associated with Spain in popular culture worldwide.",
    score: 4,
    signal: "🟢",
  },
];

const COMPARISON_ROWS = [
  {
    without: "Conservation depends solely on external factors",
    with: "Public education becomes a measurable conservation factor",
  },
  {
    without: "A flower can be legally protected and remain unknown",
    with: "A forgotten flower receives a low score — action is required",
  },
  {
    without: "The NAHIARA project would be mere entertainment",
    with: "The NAHIARA project is a real conservation tool",
  },
  {
    without: "Children and families are passive recipients",
    with: "Children and families are active conservation agents",
  },
];

const ECOSYSTEM_CHAIN = [
  {
    step: 1,
    tool: "SAN Code",
    scale: "Unique identification",
    provides: "SAN·F (flower) · SAN·A (pollinator) · SAN·P (country)",
    href: "/san-calculator",
    color: "from-indigo-500 to-violet-500",
  },
  {
    step: 2,
    tool: "Nahiara Measure (NCI)",
    scale: "Flower species",
    provides: "Disappearance risk of the flower — range 5–25",
    href: "/nahiara-measure",
    color: "from-rose-500 to-pink-500",
    active: true,
  },
  {
    step: 3,
    tool: "Araihan Measure (ACI)",
    scale: "Associated pollinator",
    provides: "Disappearance risk of the pollinator — range 5–25",
    href: "/araihan-measure",
    color: "from-amber-500 to-orange-500",
  },
  {
    step: 4,
    tool: "Scorfidon Protocol (TI)",
    scale: "Ecosystem / territory",
    provides: "Active physical threats to the habitat — range 9–27",
    href: null,
    color: "from-teal-500 to-cyan-500",
  },
  {
    step: 5,
    tool: "PFNO",
    scale: "Species without official decree",
    provides: "Cultural flowers without state recognition",
    href: null,
    color: "from-slate-500 to-gray-500",
  },
];

// ─── Score dots helper ────────────────────────────────────────────────────────

const ScoreDots = ({ score }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className={`w-3 h-3 rounded-full ${
          i <= score
            ? score >= 4
              ? "bg-emerald-400"
              : score >= 3
              ? "bg-amber-400"
              : "bg-red-400"
            : "bg-gray-200"
        }`}
      />
    ))}
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NahiaraMeasurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/20 to-white relative overflow-hidden">
      {/* Background aurora */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 10%, rgba(244,63,94,0.2) 0%, transparent 55%),
              radial-gradient(ellipse 60% 40% at 80% 20%, rgba(52,211,153,0.2) 0%, transparent 55%),
              radial-gradient(ellipse 70% 50% at 50% 80%, rgba(139,92,246,0.15) 0%, transparent 55%)
            `,
          }}
        />
      </div>

      {/* Orbs */}
      <GlowingOrb className="top-20 -right-20" color="rose" size="xl" />
      <GlowingOrb className="top-1/3 -left-32" color="emerald" size="lg" />
      <GlowingOrb className="bottom-1/4 right-10" color="violet" size="md" />

      <Navigation />

      <main className="relative pt-24 pb-20">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Institution badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 rounded-full mb-8">
                <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                <span className="text-xs uppercase tracking-[0.2em] text-rose-700 font-semibold">
                  International Association for the Defence of Flowers
                </span>
              </div>

              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 leading-tight"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                Nahiara Measure
              </h1>

              <p className="text-lg sm:text-xl text-gray-500 mb-3 tracking-widest uppercase font-medium">
                National Flower Disappearance Risk Assessment System
              </p>

              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
                <span className="text-xs uppercase tracking-[0.25em] text-gray-400">
                  Canonical Document v1.0 · March 2026
                </span>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
              </div>

              <p
                className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed italic"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                "A forgotten flower is a flower at risk. Public education is a direct conservation factor, not a complement."
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Canonical Notice ─────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex gap-4 items-start">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-rose-800 uppercase tracking-wide mb-1">
                    Canonical Document — Internal Use Only
                  </p>
                  <p className="text-sm text-rose-700 leading-relaxed">
                    This document establishes the official definition, architecture and application
                    criteria of the Nahiara Measure within the scientific ecosystem of the Nahiara Universe.
                    No indicator, scale or data may be modified without the express authorisation of Uno
                    (Matías Octavio González).
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Section 1: Definition ────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  1
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-gray-900"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  Definition and Nature of the System
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* What it is */}
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-400/20 to-pink-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-7 border border-white/50 shadow-lg h-full">
                    <h3
                      className="text-xl font-bold text-gray-900 mb-4"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      Scientific and Educational Tool
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      The <strong>Nahiara Measure</strong> is the scientific and educational tool of the
                      Nahiara Universe for assessing the <strong>disappearance risk of any national flower</strong>.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      It operates at the scale of an <strong>individual species</strong> — not an ecosystem —
                      and combines two sources of knowledge that do not normally speak to each other.
                    </p>
                  </div>
                </div>

                {/* Two knowledge sources */}
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-7 border border-white/50 shadow-lg h-full">
                    <h3
                      className="text-xl font-bold text-gray-900 mb-4"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      Foundational Methodological Principle
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                        <span className="text-emerald-500 text-lg flex-shrink-0">🔬</span>
                        <div>
                          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-0.5">Verified Scientific Knowledge</p>
                          <p className="text-sm text-gray-600">Academic studies, biodiversity data, official botanical records, IUCN assessments.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-rose-50 rounded-xl p-3 border border-rose-100">
                        <span className="text-rose-500 text-lg flex-shrink-0">🎨</span>
                        <div>
                          <p className="text-xs font-bold text-rose-700 uppercase tracking-wide mb-0.5">Complete Cultural Knowledge</p>
                          <p className="text-sm text-gray-600">Local traditions, medicinal uses, symbolism, collective memory, literature and art.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Art as science */}
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-400/20 to-purple-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-7 border border-white/50 shadow-lg h-full">
                    <div className="flex items-start gap-3 mb-3">
                      <Info className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                      <h3
                        className="text-lg font-bold text-gray-900"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        Art as a Scientific Source
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      Art is a scientifically valid documentary source. A painting records what a species
                      looked like at a specific moment and place — information that traditional academic
                      science systematically ignores.
                    </p>
                  </div>
                </div>

                {/* Institutional alignment */}
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400/20 to-blue-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-7 border border-white/50 shadow-lg h-full">
                    <div className="flex items-start gap-3 mb-3">
                      <Globe2 className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                      <h3
                        className="text-lg font-bold text-gray-900"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        Institutional Alignment
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      The Nahiara Measure is aligned with the{" "}
                      <strong>Kunming-Montreal Global Biodiversity Framework</strong>,
                      the international reference for biodiversity conservation policy through 2030.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Section 2: The Five Indicators ───────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  2
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-gray-900"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  The Five Indicators
                </h2>
              </div>
              <p className="text-gray-500 ml-11 text-sm">
                Each indicator is assessed independently on a scale of <strong>1 to 5</strong>, where
                5 = excellent condition / low risk and 1 = critical condition / extreme risk.
              </p>
            </motion.div>

            <div className="space-y-4">
              {INDICATORS.map((ind, i) => (
                <motion.div
                  key={ind.no}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                >
                  <div className={`group relative ${ind.bg} border ${ind.border} rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                      {/* Icon + number */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${ind.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                          <ind.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-gray-200 font-mono w-6">{ind.no}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3
                          className="text-lg font-bold text-gray-900 mb-1"
                          style={{ fontFamily: '"Cormorant Garamond", serif' }}
                        >
                          {ind.name}
                          {ind.no === 5 && (
                            <span className="ml-2 inline-flex items-center text-xs font-semibold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                              ✦ Revolutionary
                            </span>
                          )}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{ind.description}</p>

                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="bg-white/60 rounded-xl p-3 border border-white/80">
                            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">5 — Optimal</p>
                            <p className="text-sm text-gray-700">{ind.optimal}</p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-3 border border-white/80">
                            <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">1 — Critical</p>
                            <p className="text-sm text-gray-700">{ind.critical}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 3: NCI Scoring ───────────────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  3
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-gray-900"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  Scoring System — Nahiara Conservation Index (NCI)
                </h2>
              </div>

              {/* Formula */}
              <div className="relative mb-8">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 via-pink-400 to-violet-400 rounded-3xl blur-lg opacity-20" />
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-rose-600 font-semibold mb-4">NCI Formula</p>
                  <p
                    className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    NCI = I1 + I2 + I3 + I4 + I5
                  </p>
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                    <span>Minimum: <strong className="text-red-600">5</strong></span>
                    <div className="h-4 w-px bg-gray-300" />
                    <span>Maximum: <strong className="text-emerald-600">25</strong></span>
                  </div>
                </div>
              </div>

              {/* Reading principles */}
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                  <p className="text-sm font-semibold text-emerald-700 mb-1">Higher NCI →</p>
                  <p className="text-sm text-gray-700">Better conservation status and lower disappearance risk.</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                  <p className="text-sm font-semibold text-red-700 mb-1">Lower NCI →</p>
                  <p className="text-sm text-gray-700">Greater urgency to intervene.</p>
                </div>
              </div>

              {/* Risk levels */}
              <h3
                className="text-xl font-bold text-gray-900 mb-5"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                The Five Risk Levels
              </h3>

              <div className="space-y-3">
                {RISK_LEVELS.map((level, i) => (
                  <motion.div
                    key={level.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                  >
                    <div className={`${level.bg} border ${level.border} rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start gap-4`}>
                      <div className="flex items-center gap-3 flex-shrink-0 sm:w-40">
                        <div className={`w-3 h-3 rounded-full ${level.dot} flex-shrink-0`} />
                        <div>
                          <p className={`text-sm font-bold ${level.text} uppercase tracking-wide`}>{level.label}</p>
                          <p className="text-xs text-gray-500 font-mono">{level.range}</p>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${level.text} mb-1`}>▼ {level.description}</p>
                        <p className="text-sm text-gray-600">{level.detail}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Section 4: The Fifth Indicator ───────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  4
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-gray-900"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  The Fifth Indicator — Educational Key of the System
                </h2>
              </div>

              <div className="group relative mb-8">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-400/20 to-violet-400/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl">
                  <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                    The <strong>Population Knowledge</strong> indicator is the most original and revolutionary
                    element of the Nahiara Measure. Its inclusion transforms the system from a conventional
                    ecological index into a <strong>tool for social change</strong>.
                  </p>

                  {/* Comparison table */}
                  <div className="overflow-hidden rounded-2xl border border-gray-100">
                    {/* Header */}
                    <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-100">
                      <div className="px-5 py-3 text-xs font-bold text-red-600 uppercase tracking-wide flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                        Without this indicator
                      </div>
                      <div className="px-5 py-3 text-xs font-bold text-emerald-600 uppercase tracking-wide flex items-center gap-2 border-l border-gray-100">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                        With this indicator
                      </div>
                    </div>
                    {COMPARISON_ROWS.map((row, i) => (
                      <div
                        key={i}
                        className={`grid grid-cols-2 border-b border-gray-50 last:border-0 ${i % 2 === 0 ? "bg-white/60" : "bg-white/30"}`}
                      >
                        <div className="px-5 py-4 text-sm text-gray-500 leading-snug border-r border-gray-100">
                          {row.without}
                        </div>
                        <div className="px-5 py-4 text-sm text-gray-800 font-medium leading-snug">
                          {row.with}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Section 5: Application Example ───────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  5
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-gray-900"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  Application Example
                </h2>
              </div>

              {/* Flower card */}
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center mb-8">
                <span className="text-5xl mb-3 block">🌹</span>
                <p className="text-xs uppercase tracking-wider text-rose-500 font-semibold mb-1">Flower · Spain</p>
                <p
                  className="text-2xl font-bold text-gray-900 italic mb-1"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  Carnation — Dianthus caryophyllus
                </p>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <span className="inline-block bg-rose-100 text-rose-700 text-xs font-mono px-3 py-1 rounded-full">
                    SAN·F · 310197
                  </span>
                  <span className="inline-block bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full">
                    PFNO canonical case
                  </span>
                </div>
              </div>

              {/* Indicators table */}
              <div className="group relative mb-8">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-400/20 to-pink-400/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden">
                  <div className="grid grid-cols-[2rem_1fr_2fr_auto_auto] gap-x-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <span>No.</span>
                    <span>Indicator</span>
                    <span>Assessment</span>
                    <span className="text-center">Score</span>
                    <span className="text-center">Signal</span>
                  </div>
                  {EXAMPLE_INDICATORS.map((row, i) => (
                    <motion.div
                      key={row.no}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className={`grid grid-cols-[2rem_1fr_2fr_auto_auto] gap-x-4 px-6 py-4 items-center text-sm border-b border-gray-50 last:border-0 ${i % 2 === 0 ? "bg-white/60" : "bg-white/30"}`}
                    >
                      <span className="font-bold text-gray-400 font-mono">{row.no}</span>
                      <span className="font-semibold text-gray-800">{row.name}</span>
                      <span className="text-gray-600 leading-snug">{row.assessment}</span>
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-bold text-gray-900 text-base">{row.score}</span>
                        <ScoreDots score={row.score} />
                      </div>
                      <span className="text-center text-xl">{row.signal}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* NCI Result */}
              <div className="relative mb-8">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 to-pink-400 rounded-2xl blur-md opacity-30" />
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-rose-300 mb-2 font-semibold">NCI Result</p>
                  <p
                    className="text-4xl font-bold text-white mb-2"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    NCI = 4 + 4 + 3 + 2 + 4 = <span className="text-lime-400">17</span>
                  </p>
                  <div className="inline-flex items-center gap-2 bg-lime-400/20 border border-lime-400/30 rounded-full px-4 py-1.5">
                    <div className="w-2 h-2 rounded-full bg-lime-400" />
                    <p className="text-lime-200 text-sm font-semibold">
                      LOW Level — Flower in stable condition.
                    </p>
                  </div>
                </div>
              </div>

              {/* Analysis note */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Analysis</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The low score for indicator 4 (no legal protection as a PFNO flower) is the main risk
                  factor. Cultural recognition (indicator 5) partially compensates, but legal protection
                  is a <strong>structural pending matter</strong>.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Section 6: Ecosystem Integration ─────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  6
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-gray-900"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  Integration within the Scientific Ecosystem
                </h2>
              </div>

              <p className="text-gray-500 text-sm mb-8 ml-11 -mt-6">
                The Nahiara Measure is the <strong>first link</strong> in the complete national flower
                diagnostic chain — always applied alongside the rest of the system protocols.
              </p>

              <div className="space-y-3">
                {ECOSYSTEM_CHAIN.map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                  >
                    <div
                      className={`relative flex items-start gap-5 rounded-2xl p-5 border transition-all duration-300 ${
                        item.active
                          ? "bg-rose-50 border-rose-300 shadow-lg"
                          : "bg-white/60 border-white/50 shadow-sm hover:shadow-md hover:bg-white/80"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md`}>
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-1">
                          <p className={`font-bold text-gray-900 ${item.active ? "text-rose-800" : ""}`}>
                            {item.tool}
                          </p>
                          {item.active && (
                            <span className="inline-flex items-center gap-1 bg-rose-200 text-rose-800 text-xs font-bold px-2 py-0.5 rounded-full w-fit">
                              ✦ Current page
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">{item.scale}</p>
                        <p className="text-sm text-gray-600">{item.provides}</p>
                      </div>
                      {item.href && !item.active && (
                        <Link
                          href={item.href}
                          className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-800 transition-colors mt-1"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Authority footer ──────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 via-pink-400 to-violet-400 rounded-3xl blur-lg opacity-20" />
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl text-center">
                  <BookOpen className="w-8 h-8 text-rose-400 mx-auto mb-4" />
                  <p
                    className="text-lg font-bold text-gray-800 mb-1"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    Canonical Document v1.0 · March 2026
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    Editorial authority: <strong>Matías Octavio González (Uno)</strong> · Secretary and Creative Director
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    International Association for the Defence of Flowers · CIF: G72737570
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <a
                      href="https://www.asociacionnahiara.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-rose-600 hover:text-rose-700 font-medium transition-colors"
                    >
                      www.asociacionnahiara.org
                    </a>
                    <div className="w-px h-4 bg-gray-300" />
                    <a
                      href="https://aquamundi.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-rose-600 hover:text-rose-700 font-medium transition-colors"
                    >
                      AquaMundi.org
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

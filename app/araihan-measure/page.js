"use client";

import { motion } from "motion/react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import {
  Leaf,
  FlaskConical,
  AlertTriangle,
  Shield,
  Thermometer,
  Network,
  Sun,
  Info,
  ChevronRight,
  BookOpen,
  Layers,
} from "lucide-react";
import Link from "next/link";

// ─── Decorations ──────────────────────────────────────────────────────────────

const GlowingOrb = ({ className, color = "amber", size = "md" }) => {
  const sizes = { sm: "w-24 h-24", md: "w-40 h-40", lg: "w-64 h-64", xl: "w-96 h-96" };
  const colors = {
    amber: "from-amber-400/20 via-yellow-300/10 to-transparent",
    emerald: "from-emerald-400/20 via-teal-300/10 to-transparent",
    violet: "from-violet-400/20 via-purple-300/10 to-transparent",
    rose: "from-rose-400/20 via-pink-300/10 to-transparent",
    sky: "from-sky-400/20 via-blue-300/10 to-transparent",
  };
  return (
    <div
      className={`absolute rounded-full bg-gradient-radial ${colors[color]} ${sizes[size]} blur-3xl pointer-events-none ${className}`}
    />
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const VARIABLES = [
  {
    no: 1,
    icon: Leaf,
    name: "Population Health",
    description:
      "Size, density and positive demographic trend of the pollinator population.",
    optimal: "Stable or growing population",
    critical: "Population in demographic collapse",
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    chip: "bg-emerald-100 text-emerald-800",
  },
  {
    no: 2,
    icon: Sun,
    name: "Pollen Availability",
    description:
      "Abundance of flowers as a food source for the pollinator within its range of action.",
    optimal: "High abundance — sufficient floral resources",
    critical: "Critical scarcity — the pollinator cannot feed",
    gradient: "from-yellow-500 to-amber-500",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    chip: "bg-yellow-100 text-yellow-800",
  },
  {
    no: 3,
    icon: Shield,
    name: "Protection from Pesticides",
    description:
      "Absence of exposure to pesticides, herbicides and systemic agrochemicals that affect the pollinator directly or through the flowers it visits.",
    optimal: "No exposure — environment free of harmful agrochemicals",
    critical: "Extreme exposure — systemic environmental contamination",
    gradient: "from-sky-500 to-blue-500",
    bg: "bg-sky-50",
    border: "border-sky-200",
    chip: "bg-sky-100 text-sky-800",
  },
  {
    no: 4,
    icon: Thermometer,
    name: "Climatic Stability",
    description:
      "Favourable and predictable climate conditions for the pollinator's life cycles, reproduction and migration.",
    optimal: "Stable climate — favourable for the vital cycle",
    critical: "Extremely adverse climate — vital cycles disrupted",
    gradient: "from-orange-500 to-rose-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
    chip: "bg-orange-100 text-orange-800",
  },
  {
    no: 5,
    icon: Network,
    name: "Ecosystem Connectivity",
    description:
      "Preservation of ecological corridors that allow the pollinator to move between feeding, reproduction and refuge zones.",
    optimal: "Connected ecosystem — functional corridors",
    critical: "Total fragmentation — the pollinator is isolated",
    gradient: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
    border: "border-violet-200",
    chip: "bg-violet-100 text-violet-800",
  },
];

const RISK_LEVELS = [
  {
    label: "VERY LOW",
    range: "22 – 25 pts",
    color: "from-emerald-400 to-teal-400",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
    description: "Pollinator in optimal condition",
    detail:
      "All five factors are under control. Preventive monitoring and maintenance action recommended.",
  },
  {
    label: "LOW",
    range: "17 – 21 pts",
    color: "from-lime-400 to-green-400",
    bg: "bg-lime-50",
    border: "border-lime-200",
    text: "text-lime-700",
    dot: "bg-lime-400",
    description: "Pollinator in stable condition",
    detail:
      "Satisfactory conservation status with identified areas for improvement. Planned intervention recommended to sustain the current level.",
  },
  {
    label: "MODERATE",
    range: "11 – 16 pts",
    color: "from-amber-400 to-yellow-400",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-400",
    description: "Pollinator in alert situation",
    detail:
      "Detectable stress in one or more variables. The pollinator species may deteriorate if action is not taken. Active intervention required.",
  },
  {
    label: "HIGH",
    range: "6 – 10 pts",
    color: "from-orange-400 to-red-400",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    dot: "bg-orange-400",
    description: "Pollinator at significant risk",
    detail:
      "Consolidated threat with measurable damage to the pollinator population. One or more variables in critical condition. Urgent and coordinated action essential.",
  },
  {
    label: "EXTREME",
    range: "5 pts",
    color: "from-red-500 to-rose-600",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    dot: "bg-red-500",
    description: "Pollinator in critical danger",
    detail:
      "All variables in a state of collapse. The pollinator faces real risk of local or regional extinction. Conservation emergency — immediate intervention required.",
  },
];

const EXAMPLE_VARS = [
  {
    no: 1,
    name: "Population Health",
    assessment:
      "Documented decline of euglossine bees due to tropical forest loss in Venezuela.",
    score: 3,
    signal: "🟡",
  },
  {
    no: 2,
    name: "Pollen Availability",
    assessment:
      "Variable orchid availability — habitat fragmentation reduces access to floral sources.",
    score: 3,
    signal: "🟡",
  },
  {
    no: 3,
    name: "Protection from Pesticides",
    assessment:
      "Intensive agrochemical use in agricultural zones adjacent to natural habitats.",
    score: 2,
    signal: "🟠",
  },
  {
    no: 4,
    name: "Climatic Stability",
    assessment:
      "Increasing climate variability in the Llanos and Orinoquía affects reproductive cycles.",
    score: 3,
    signal: "🟡",
  },
  {
    no: 5,
    name: "Ecosystem Connectivity",
    assessment:
      "Ecological corridors fragmented by deforestation and monoculture expansion.",
    score: 3,
    signal: "🟡",
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
    href: null,
    color: "from-pink-500 to-rose-500",
  },
  {
    step: 3,
    tool: "Araihan Measure (ACI)",
    scale: "Associated pollinator",
    provides: "Disappearance risk of the pollinator — range 5–25",
    href: "/araihan-measure",
    color: "from-amber-500 to-orange-500",
    active: true,
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

// ─── Score dot helper ─────────────────────────────────────────────────────────

const ScoreDots = ({ score }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className={`w-3 h-3 rounded-full transition-all ${
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

export default function AraihanMeasurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/20 to-white relative overflow-hidden">
      {/* Background aurora */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 10%, rgba(251,191,36,0.3) 0%, transparent 55%),
              radial-gradient(ellipse 60% 40% at 80% 20%, rgba(52,211,153,0.25) 0%, transparent 55%),
              radial-gradient(ellipse 70% 50% at 50% 80%, rgba(139,92,246,0.2) 0%, transparent 55%)
            `,
          }}
        />
      </div>

      {/* Orbs */}
      <GlowingOrb className="top-20 -right-20" color="amber" size="xl" />
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
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full mb-8">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs uppercase tracking-[0.2em] text-amber-700 font-semibold">
                  International Association for the Defence of Flowers
                </span>
              </div>

              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 leading-tight"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                Araihan Measure
              </h1>

              <p
                className="text-lg sm:text-xl text-gray-500 mb-3 tracking-widest uppercase font-medium"
              >
                Pollinator Disappearance Risk Assessment System
              </p>

              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
                <span className="text-xs uppercase tracking-[0.25em] text-gray-400">
                  Canonical Document v1.0 · March 2026
                </span>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
              </div>

              <p
                className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed italic"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                "Without pollinators, flowers cannot reproduce. Without flowers, pollinators cannot feed."
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
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4 items-start">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-800 uppercase tracking-wide mb-1">
                    Canonical Document — Internal Use Only
                  </p>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    This document establishes the official definition, architecture and application
                    criteria of the Araihan Measure within the scientific ecosystem of the Nahiara Universe.
                    No data, variable or scale may be modified without the express authorisation of Uno
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
              {/* Section label */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
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
                {/* Main definition */}
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-7 border border-white/50 shadow-lg h-full">
                    <h3
                      className="text-xl font-bold text-gray-900 mb-4"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      Scientific Sister of the Nahiara Measure
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      The <strong>Araihan Measure</strong> is the scientific sister of the Nahiara Measure.
                      While the Nahiara Measure assesses the disappearance risk of a national flower,
                      the Araihan Measure assesses the disappearance risk of those who protect that flower:
                      the <strong>pollinators</strong>.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      It operates at the scale of the pollinator species associated with a specific
                      flower — evaluating the conservation status of the pollinator fauna through
                      five key variables.
                    </p>
                  </div>
                </div>

                {/* Ecological pair */}
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-7 border border-white/50 shadow-lg h-full">
                    <h3
                      className="text-xl font-bold text-gray-900 mb-4"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      The Ecological Pair — Foundational Principle
                    </h3>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-3 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                        <span className="text-emerald-500 text-lg">🌸</span>
                        <p className="text-sm text-gray-700">
                          Without pollinators, <strong>flowers cannot reproduce</strong>.
                        </p>
                      </div>
                      <div className="flex items-start gap-3 bg-amber-50 rounded-xl p-3 border border-amber-100">
                        <span className="text-amber-500 text-lg">🐝</span>
                        <p className="text-sm text-gray-700">
                          Without flowers, <strong>pollinators cannot feed</strong>.
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      Flower and pollinator are an inseparable unit of conservation. Protecting the flower
                      without protecting its pollinator is a scientific illusion. The Araihan Measure makes
                      that bond <strong>measurable</strong>.
                    </p>
                  </div>
                </div>

                {/* Narrative connection — full width */}
                <div className="md:col-span-2 group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-400/20 to-purple-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-7 border border-white/50 shadow-lg">
                    <div className="flex items-start gap-4">
                      <Info className="w-5 h-5 text-violet-500 flex-shrink-0 mt-1" />
                      <div>
                        <h3
                          className="text-lg font-bold text-gray-900 mb-2"
                          style={{ fontFamily: '"Cormorant Garamond", serif' }}
                        >
                          Narrative Connection
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          In the Nahiara Universe, <strong>Araihan</strong> is Nahiara's loyal squire.
                          As a symbol, it represents the interdependence between flowers and pollinators:
                          two distinct entities that only exist in their fullness when each sustains the other.
                          The name of the protocol is the name of that alliance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Section 2: The Five Variables ────────────────────────────────── */}
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
                  The Five Variables
                </h2>
              </div>
              <p className="text-gray-500 ml-11 text-sm">
                Each variable is assessed independently on a scale of <strong>1 to 5</strong>, where
                5 = excellent condition / low risk and 1 = critical condition / extreme risk.
              </p>
            </motion.div>

            <div className="space-y-4">
              {VARIABLES.map((v, i) => (
                <motion.div
                  key={v.no}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                >
                  <div className={`group relative ${v.bg} border ${v.border} rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                      {/* Variable number + icon */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${v.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                          <v.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-gray-200 font-mono w-6">
                          {v.no}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3
                          className="text-lg font-bold text-gray-900 mb-1"
                          style={{ fontFamily: '"Cormorant Garamond", serif' }}
                        >
                          {v.name}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {v.description}
                        </p>

                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="bg-white/60 rounded-xl p-3 border border-white/80">
                            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">
                              5 — Optimal
                            </p>
                            <p className="text-sm text-gray-700">{v.optimal}</p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-3 border border-white/80">
                            <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">
                              1 — Critical
                            </p>
                            <p className="text-sm text-gray-700">{v.critical}</p>
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

        {/* ── Section 3: ACI Scoring ───────────────────────────────────────── */}
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
                  Scoring System — Araihan Conservation Index (ACI)
                </h2>
              </div>

              {/* Formula card */}
              <div className="relative mb-8">
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 rounded-3xl blur-lg opacity-20" />
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-sky-600 font-semibold mb-4">
                    ACI Formula
                  </p>
                  <p
                    className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    ACI = V1 + V2 + V3 + V4 + V5
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
                  <p className="text-sm font-semibold text-emerald-700 mb-1">Higher ACI →</p>
                  <p className="text-sm text-gray-700">Better conservation status and lower disappearance risk.</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                  <p className="text-sm font-semibold text-red-700 mb-1">Lower ACI →</p>
                  <p className="text-sm text-gray-700">Greater urgency to intervene.</p>
                </div>
                <div className="sm:col-span-2 bg-violet-50 border border-violet-200 rounded-2xl p-5 flex gap-3 items-start">
                  <Info className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    <strong>Relationship with NCI:</strong> The ACI is always read together with the NCI
                    (Nahiara Conservation Index) of the associated flower. The difference between both
                    indices reveals imbalances in the ecological pair.
                  </p>
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
                      {/* Level + range */}
                      <div className="flex items-center gap-3 flex-shrink-0 sm:w-40">
                        <div className={`w-3 h-3 rounded-full ${level.dot} flex-shrink-0`} />
                        <div>
                          <p className={`text-sm font-bold ${level.text} uppercase tracking-wide`}>
                            {level.label}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">{level.range}</p>
                        </div>
                      </div>
                      {/* Description */}
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${level.text} mb-1`}>
                          ▼ {level.description}
                        </p>
                        <p className="text-sm text-gray-600">{level.detail}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Section 4: Integrated Example ───────────────────────────────── */}
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
                  Integrated Application Example
                </h2>
              </div>

              <p className="text-gray-500 text-sm mb-8 ml-11 -mt-6">
                Uses the same case as the Nahiara Measure to demonstrate combined reading of both indices.
              </p>

              {/* Species pair */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
                  <span className="text-4xl mb-3 block">🌺</span>
                  <p className="text-xs uppercase tracking-wider text-rose-500 font-semibold mb-1">Flower</p>
                  <p
                    className="text-xl font-bold text-gray-900 italic mb-1"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    Cattleya mossiae
                  </p>
                  <p className="text-sm text-gray-600 mb-2">Venezuelan Orchid</p>
                  <span className="inline-block bg-rose-100 text-rose-700 text-xs font-mono px-3 py-1 rounded-full">
                    SAN·F · 158228
                  </span>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                  <span className="text-4xl mb-3 block">🐝</span>
                  <p className="text-xs uppercase tracking-wider text-amber-500 font-semibold mb-1">Main Pollinator</p>
                  <p
                    className="text-xl font-bold text-gray-900 italic mb-1"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    Eulaema cingulata
                  </p>
                  <p className="text-sm text-gray-600 mb-2">Euglossine orchid bee</p>
                  <span className="inline-block bg-amber-100 text-amber-700 text-xs font-mono px-3 py-1 rounded-full">
                    SAN·A · Pollinator
                  </span>
                </div>
              </div>

              {/* Variables table */}
              <div className="group relative mb-8">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400/20 to-rose-400/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden">
                  {/* Table header */}
                  <div className="grid grid-cols-[2rem_1fr_2fr_auto_auto] gap-x-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <span>No.</span>
                    <span>Variable</span>
                    <span>Assessment</span>
                    <span className="text-center">Score</span>
                    <span className="text-center">Signal</span>
                  </div>
                  {EXAMPLE_VARS.map((row, i) => (
                    <motion.div
                      key={row.no}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className={`grid grid-cols-[2rem_1fr_2fr_auto_auto] gap-x-4 px-6 py-4 items-center text-sm border-b border-gray-50 last:border-0 ${
                        i % 2 === 0 ? "bg-white/60" : "bg-white/30"
                      }`}
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

              {/* ACI Result */}
              <div className="relative mb-8">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl blur-md opacity-30" />
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-300 mb-2 font-semibold">
                    ACI Result
                  </p>
                  <p
                    className="text-4xl font-bold text-white mb-2"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    ACI = 3 + 3 + 2 + 3 + 3 = <span className="text-amber-400">14</span>
                  </p>
                  <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 rounded-full px-4 py-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <p className="text-amber-200 text-sm font-semibold">
                      MODERATE Level — Pollinator in an alert situation. Active intervention required.
                    </p>
                  </div>
                </div>
              </div>

              {/* Combined NCI + ACI reading */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-7">
                <h3
                  className="text-lg font-bold text-gray-900 mb-6 text-center"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  Combined NCI + ACI Reading
                </h3>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-center flex-1">
                    <p className="text-xs uppercase tracking-wider text-rose-500 font-semibold mb-2">
                      Nahiara Measure (NCI)
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">15 <span className="text-lg text-gray-400">/ 25</span></p>
                    <p className="text-sm font-semibold text-amber-600">MODERATE — Flower in alert</p>
                  </div>
                  <div className="text-2xl text-gray-300 font-bold">⟷</div>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center flex-1">
                    <p className="text-xs uppercase tracking-wider text-amber-500 font-semibold mb-2">
                      Araihan Measure (ACI)
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">14 <span className="text-lg text-gray-400">/ 25</span></p>
                    <p className="text-sm font-semibold text-amber-600">MODERATE — Pollinator in alert</p>
                  </div>
                </div>
                <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Ecological Pair Diagnosis</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Both the flower and its pollinator are at <strong>MODERATE level</strong> with almost
                    identical scores (15 vs 14). The complete ecosystem is on alert — no partial intervention
                    is sufficient. Protecting only the orchid without protecting <em>Eulaema cingulata</em> does
                    not resolve the conservation problem.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Section 5: Ecosystem Integration ─────────────────────────────── */}
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
                  5
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-gray-900"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  Integration within the Scientific Ecosystem
                </h2>
              </div>

              <p className="text-gray-500 text-sm mb-8 ml-11 -mt-6">
                The Araihan Measure is the second link in the complete conservation diagnostic chain of
                the Nahiara Universe.
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
                          ? "bg-amber-50 border-amber-300 shadow-lg"
                          : "bg-white/60 border-white/50 shadow-sm hover:shadow-md hover:bg-white/80"
                      }`}
                    >
                      {/* Step badge */}
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md`}>
                        {item.step}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-1">
                          <p className={`font-bold text-gray-900 ${item.active ? "text-amber-800" : ""}`}>
                            {item.tool}
                          </p>
                          {item.active && (
                            <span className="inline-flex items-center gap-1 bg-amber-200 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full w-fit">
                              ✦ Current page
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">{item.scale}</p>
                        <p className="text-sm text-gray-600">{item.provides}</p>
                      </div>

                      {item.href && (
                        <Link
                          href={item.href}
                          className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors mt-1"
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

        {/* ── Footer authority ─────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl blur-lg opacity-20" />
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl text-center">
                  <BookOpen className="w-8 h-8 text-amber-400 mx-auto mb-4" />
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
                      className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
                    >
                      www.asociacionnahiara.org
                    </a>
                    <div className="w-px h-4 bg-gray-300" />
                    <a
                      href="https://aquamundi.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
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

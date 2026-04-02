"use client";

import { motion } from "motion/react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import {
  Flower2,
  BookOpen,
  Star,
  Landmark,
  Palette,
  Users,
  Clock,
  Trophy,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

// ─── Decorations ──────────────────────────────────────────────────────────────

const GlowingOrb = ({ className, color = "violet", size = "md" }) => {
  const sizes = { sm: "w-24 h-24", md: "w-40 h-40", lg: "w-64 h-64", xl: "w-96 h-96" };
  const colors = {
    violet: "from-violet-400/20 via-purple-300/10 to-transparent",
    rose: "from-rose-400/20 via-pink-300/10 to-transparent",
    amber: "from-amber-400/20 via-yellow-300/10 to-transparent",
    emerald: "from-emerald-400/20 via-teal-300/10 to-transparent",
    sky: "from-sky-400/20 via-blue-300/10 to-transparent",
  };
  return (
    <div
      className={`absolute rounded-full bg-gradient-radial ${colors[color]} ${sizes[size]} blur-3xl pointer-events-none ${className}`}
    />
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const CRITERIA = [
  {
    no: 1,
    icon: Flower2,
    name: "Deep Cultural Roots",
    mandatory: false,
    description:
      "The flower appears in festivals, regional dress, popular traditions, rituals or collective celebrations associated with the country or territory.",
    evidence:
      "The Carnation features in flamenco dress, spring festivals in Andalusia and civil celebrations across Spain.",
    gradient: "from-rose-500 to-pink-500",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
  {
    no: 2,
    icon: Palette,
    name: "Presence in Art and Literature",
    mandatory: false,
    description:
      "The flower is documented in painting, sculpture, poetry, music, literature or any manifestation of the country's artistic heritage.",
    evidence:
      "Federico García Lorca immortalised the Carnation in his poetry. It features in Goya's paintings and in centuries of Spanish artistic tradition.",
    gradient: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  {
    no: 3,
    icon: Users,
    name: "Popular Recognition",
    mandatory: true,
    description:
      "The majority of the country's population identifies the flower as a national symbol without any explanation needed. The association is immediate and intuitive.",
    evidence:
      "Anyone with knowledge of Spanish culture spontaneously associates the Carnation with Spain — no official reference is required.",
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-300",
  },
  {
    no: 4,
    icon: Clock,
    name: "Historical Presence",
    mandatory: false,
    description:
      "The flower has been part of the territory's identity for at least several generations. Its bond with the country transcends the contemporary era.",
    evidence:
      "The Carnation has been linked to Spanish culture for centuries. Its presence in national iconography predates any modern institution.",
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    no: 5,
    icon: Trophy,
    name: "Presence in Unofficial Symbols",
    mandatory: false,
    description:
      "The flower appears in sport, brands, products, tourism or any popular representation associated with the country in non-governmental contexts.",
    evidence:
      "The Spanish national football team carries the Carnation embroidered on its kit. It appears in export products, tourism imagery and brands associated with Spain.",
    gradient: "from-sky-500 to-blue-500",
    bg: "bg-sky-50",
    border: "border-sky-200",
  },
];

const ACTIVATION_RULES = [
  {
    condition: "Prerequisite NOT met",
    criteria: "Irrelevant — official decree exists",
    status: "PFNO DOES NOT ACTIVATE",
    color: "bg-red-50 border-red-200",
    statusColor: "bg-red-100 text-red-700",
    dot: "bg-red-400",
  },
  {
    condition: "Prerequisite met + Criterion 3 NOT met",
    criteria: "Any number",
    status: "PFNO NOT APPLICABLE",
    color: "bg-orange-50 border-orange-200",
    statusColor: "bg-orange-100 text-orange-700",
    dot: "bg-orange-400",
  },
  {
    condition: "Prerequisite met + Criterion 3 met + Only 1 additional criterion",
    criteria: "2 of 5",
    status: "PFNO UNDER REVIEW",
    color: "bg-amber-50 border-amber-200",
    statusColor: "bg-amber-100 text-amber-700",
    dot: "bg-amber-400",
  },
  {
    condition: "Prerequisite met + Criterion 3 met + 2 or more additional criteria",
    criteria: "3, 4 or 5 of 5",
    status: "PFNO APPLICABLE",
    color: "bg-emerald-50 border-emerald-200",
    statusColor: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-400",
  },
];

const PFNO_STATES = [
  {
    state: "PFNO APPLICABLE",
    condition: "3, 4 or 5 criteria met (criterion 3 mandatory)",
    description:
      "The flower enters the Nahiara Universe under the Unofficial Flower Protocol. It receives its own SAN·F code, appears in the book with a PFNO label, and has a distinctive design in the card game. Its inclusion is legitimate and permanent.",
    bg: "bg-emerald-50",
    border: "border-emerald-300",
    text: "text-emerald-800",
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-400",
  },
  {
    state: "PFNO UNDER REVIEW",
    condition: "2 criteria met (whether or not criterion 3 is met)",
    description:
      "Borderline case requiring additional verification. The flower cannot yet be included, but the case remains open. It is documented for future review with further cultural or historical evidence.",
    bg: "bg-amber-50",
    border: "border-amber-300",
    text: "text-amber-800",
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-400",
  },
  {
    state: "PFNO NOT APPLICABLE",
    condition: "0 or 1 criterion met",
    description:
      "The flower does not meet the minimum conditions of cultural rootedness for inclusion under the protocol. It does not enter the universe as a flower of that country or territory.",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    badge: "bg-red-100 text-red-700",
    dot: "bg-red-400",
  },
];

const CANONICAL_CRITERIA = [
  {
    no: 1,
    name: "Deep Cultural Roots",
    evidence: "Present in flamenco dress, bullfighting suits, Holy Week processions and popular celebrations throughout Spain.",
    met: true,
  },
  {
    no: 2,
    name: "Presence in Art and Literature",
    evidence: "Federico García Lorca immortalised it in his poetry. Featured in Goya's paintings and centuries of Spanish artistic iconography.",
    met: true,
  },
  {
    no: 3,
    name: "Popular Recognition ★",
    evidence: "Anyone in the world familiar with Spanish culture spontaneously and immediately associates the Carnation with Spain.",
    met: true,
  },
  {
    no: 4,
    name: "Historical Presence",
    evidence: "Its bond with Spain predates any modern institution. Centuries of presence in the cultural identity of the territory.",
    met: true,
  },
  {
    no: 5,
    name: "Presence in Unofficial Symbols",
    evidence: "The Spanish national football team carries it embroidered on its kit. It appears in export products, tourism imagery and brands associated with Spain.",
    met: true,
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
    provides: "Cultural inclusion without state recognition",
    href: "/pfno",
    color: "from-violet-500 to-purple-500",
    active: true,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PFNOPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-violet-50/20 to-white relative overflow-hidden">
      {/* Background aurora */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 10%, rgba(139,92,246,0.3) 0%, transparent 55%),
              radial-gradient(ellipse 60% 40% at 80% 20%, rgba(244,63,94,0.2) 0%, transparent 55%),
              radial-gradient(ellipse 70% 50% at 50% 80%, rgba(251,191,36,0.2) 0%, transparent 55%)
            `,
          }}
        />
      </div>

      {/* Orbs */}
      <GlowingOrb className="top-20 -right-20" color="violet" size="xl" />
      <GlowingOrb className="top-1/3 -left-32" color="rose" size="lg" />
      <GlowingOrb className="bottom-1/4 right-10" color="amber" size="md" />

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
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-200 rounded-full mb-8">
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-xs uppercase tracking-[0.2em] text-violet-700 font-semibold">
                  International Association for the Defence of Flowers
                </span>
              </div>

              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 leading-tight"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                PFNO Protocol
              </h1>

              <p className="text-lg sm:text-xl text-gray-500 mb-3 tracking-wide font-medium">
                Unofficial Flower Protocol — Cultural Inclusion System without Governmental Decree
              </p>

              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-violet-300 to-transparent" />
                <span className="text-xs uppercase tracking-[0.25em] text-gray-400">
                  Canonical Document v1.0 · March 2026
                </span>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-violet-300 to-transparent" />
              </div>

              <p
                className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed italic"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                "Culture chooses its symbols before the State does — and that choice carries as much weight as any decree."
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
              <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6 flex gap-4 items-start">
                <AlertTriangle className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-violet-800 uppercase tracking-wide mb-1">
                    Canonical Document — Internal Use Only
                  </p>
                  <p className="text-sm text-violet-700 leading-relaxed">
                    This document establishes the official definition, architecture and application
                    criteria of the PFNO Protocol within the scientific ecosystem of the Nahiara Universe.
                    No criterion or activation rule may be modified without the express authorisation of
                    Uno (Matías Octavio González).
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
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  1
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-gray-900"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  Definition and Nature of the Protocol
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* What it is */}
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-400/20 to-purple-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-7 border border-white/50 shadow-lg h-full">
                    <h3
                      className="text-xl font-bold text-gray-900 mb-4"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      Cultural Recognition Without a Decree
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      The <strong>PFNO Protocol</strong> (Unofficial Flower) allows the integration of
                      flowers that have <strong>no governmental decree</strong> declaring them a national
                      flower, but which culture has turned into a <em>de facto</em> national symbol.
                    </p>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      It is the institutional recognition of a truth that governments have yet to sign:
                      that culture chooses its symbols before the State does, and that choice carries as
                      much weight as any decree.
                    </p>
                  </div>
                </div>

                {/* The distinction */}
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-400/20 to-amber-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-7 border border-white/50 shadow-lg h-full">
                    <h3
                      className="text-xl font-bold text-gray-900 mb-5"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      The Distinction That Defines the PFNO
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <p className="text-xs font-bold text-red-700 uppercase tracking-wide">
                            PFNO does NOT apply
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">
                          A decree, law, resolution or official governmental document exists declaring the national flower.
                        </p>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                            PFNO may apply
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">
                          No official governmental document exists. The flower is a <em>de facto</em> cultural symbol, chosen by the country's culture.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Section 2: Prerequisite ───────────────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  2
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-gray-900"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  The Prerequisite — Activation Condition
                </h2>
              </div>

              <div className="relative mb-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl blur-lg opacity-20" />
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-amber-200 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <Landmark className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-bold text-amber-800 uppercase tracking-widest">
                      Mandatory Prerequisite
                    </p>
                  </div>
                  <p
                    className="text-xl text-gray-800 leading-relaxed font-medium"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    The country or territory has <strong>NO governmental document</strong> (decree, law,
                    resolution, official declaration) designating a flower as a national symbol.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex gap-3 items-start">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-700 mb-1">If an official document exists</p>
                    <p className="text-sm text-gray-600">
                      The PFNO is <strong>not activated</strong> and the five criteria are not assessed.
                      The flower enters the universe as an official flower, not as a PFNO.
                    </p>
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-sm flex gap-3 items-start">
                  <Info className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-gray-800 mb-1">Valid verification sources</p>
                    <p className="text-sm text-gray-600">
                      Official State Gazette, parliamentary resolutions, presidential decrees, official bulletins.
                      <span className="text-red-500 font-medium"> Not valid: Wikipedia, general publications, encyclopaedias.</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Section 3: Five Criteria ─────────────────────────────────────── */}
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
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  3
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-gray-900"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  The Five Inclusion Criteria
                </h2>
              </div>
              <p className="text-gray-500 ml-11 text-sm">
                Each criterion is <strong>binary</strong>: either met (✓) or not met (✗). There is no partial scoring.
              </p>
            </motion.div>

            <div className="space-y-4">
              {CRITERIA.map((c, i) => (
                <motion.div
                  key={c.no}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                >
                  <div className={`group relative ${c.bg} border ${c.border} rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                      {/* Icon + number */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                          <c.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-gray-200 font-mono w-6">{c.no}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3
                            className="text-lg font-bold text-gray-900"
                            style={{ fontFamily: '"Cormorant Garamond", serif' }}
                          >
                            {c.name}
                          </h3>
                          {c.mandatory && (
                            <span className="inline-flex items-center gap-1 bg-amber-200 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                              <Star className="w-3 h-3" /> MANDATORY
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{c.description}</p>

                        <div className="bg-white/60 rounded-xl p-3 border border-white/80">
                          <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-1">
                            Canonical evidence — Spain / Carnation
                          </p>
                          <p className="text-sm text-gray-700 italic">{c.evidence}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mandatory note */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6"
            >
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 flex gap-3 items-start">
                <Star className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  <strong>Criterion 3 (Popular Recognition) is mandatory.</strong> A flower may meet 4 criteria,
                  but if criterion 3 is not met, the PFNO is <strong>NOT applicable</strong>. Without
                  majority popular recognition, no <em>de facto</em> cultural symbol exists.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Section 4: Activation Rule ───────────────────────────────────── */}
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
                  4
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-gray-900"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  The Canonical Activation Rule
                </h2>
              </div>

              <div className="space-y-3">
                {ACTIVATION_RULES.map((rule, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                  >
                    <div className={`${rule.color} border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4`}>
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-1">
                          <div className={`w-2.5 h-2.5 rounded-full ${rule.dot} flex-shrink-0 mt-1.5`} />
                          <p className="text-sm text-gray-700 leading-snug">{rule.condition}</p>
                        </div>
                        <p className="text-xs text-gray-500 ml-4">Criteria met: <strong>{rule.criteria}</strong></p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-block ${rule.statusColor} text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide`}>
                          {rule.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Section 5: Three PFNO States ─────────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  5
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-gray-900"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  The Three PFNO States
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                {PFNO_STATES.map((state, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className={`${state.bg} border ${state.border} rounded-2xl p-6 h-full flex flex-col`}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-3 h-3 rounded-full ${state.dot}`} />
                        <span className={`text-xs font-bold ${state.badge} px-2 py-0.5 rounded-full uppercase tracking-wide bg-white/60`}>
                          {state.state}
                        </span>
                      </div>
                      <p className={`text-xs font-semibold ${state.text} mb-3 uppercase tracking-wide`}>
                        {state.condition}
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed flex-1">{state.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Section 6: Canonical Example ─────────────────────────────────── */}
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
                  6
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-gray-900"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  Canonical Example — Spain / Carnation
                </h2>
              </div>

              {/* PFNO Record card */}
              <div className="relative mb-8">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 via-violet-400 to-purple-400 rounded-3xl blur-lg opacity-20" />
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                    <div className="text-center sm:text-left">
                      <span className="text-6xl block mb-3">🌹</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wider text-violet-500 font-semibold mb-1">PFNO Record</p>
                      <p
                        className="text-2xl font-bold text-gray-900 italic mb-1"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        Dianthus caryophyllus
                      </p>
                      <p className="text-gray-600 text-sm mb-3">Carnation · Spain</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-block bg-rose-100 text-rose-700 text-xs font-mono px-3 py-1 rounded-full">
                          SAN·F · 310197
                        </span>
                        <span className="inline-block bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full">
                          Highest SAN·F in Volume I
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Prerequisite */}
                  <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      <strong>Prerequisite verified:</strong> Spain has no governmental decree declaring the Carnation its official national flower. ✓
                    </p>
                  </div>
                </div>
              </div>

              {/* Criteria verification table */}
              <div className="group relative mb-8">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-400/20 to-rose-400/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden">
                  <div className="grid grid-cols-[2rem_1fr_2fr_auto] gap-x-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <span>No.</span>
                    <span>Criterion</span>
                    <span>Verified Evidence</span>
                    <span className="text-center">Met?</span>
                  </div>
                  {CANONICAL_CRITERIA.map((row, i) => (
                    <motion.div
                      key={row.no}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className={`grid grid-cols-[2rem_1fr_2fr_auto] gap-x-4 px-6 py-4 items-start text-sm border-b border-gray-50 last:border-0 ${
                        i % 2 === 0 ? "bg-white/60" : "bg-white/30"
                      }`}
                    >
                      <span className="font-bold text-gray-400 font-mono pt-0.5">{row.no}</span>
                      <span className="font-semibold text-gray-800 leading-snug">{row.name}</span>
                      <span className="text-gray-600 leading-snug">{row.evidence}</span>
                      <div className="flex justify-center">
                        {row.met ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Result */}
              <div className="relative mb-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-md opacity-30" />
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-300 mb-2 font-semibold">Result</p>
                  <p
                    className="text-3xl font-bold text-white mb-2"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    5 of 5 criteria met (criterion 3 mandatory: ✓)
                  </p>
                  <div className="inline-flex items-center gap-2 bg-emerald-400/20 border border-emerald-400/30 rounded-full px-4 py-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <p className="text-emerald-200 text-sm font-semibold">
                      PFNO APPLICABLE — The Spanish Carnation enters the Nahiara Universe.
                    </p>
                  </div>
                </div>
              </div>

              {/* Short description */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Its <strong>PFNO label</strong> is part of its identity in the book, in the card game and
                  on the digital platform. The Carnation's SAN·F code (310197) is the highest in Volume I —
                  the flower of the country where the universe was born carries the largest numerical
                  footprint in the book.
                </p>
              </div>

              {/* Venezuelan note */}
              <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3 items-start">
                <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  <strong>Note on the Venezuelan example (Cattleya mossiae):</strong> This flower does NOT
                  activate the PFNO because Venezuela does have a governmental decree declaring it the
                  official national flower. In the complete system record, the PFNO field appears as
                  <em> 'Not applicable — official flower'</em>.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Section 7: Ecosystem Integration ─────────────────────────────── */}
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
                  7
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-gray-900"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  Integration within the Scientific Ecosystem
                </h2>
              </div>

              <p className="text-gray-500 text-sm mb-8 ml-11 -mt-6">
                The PFNO Protocol is the <strong>fifth link</strong> in the Nahiara Universe protocol
                system — applied once it has been verified that the flower has no official decree.
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
                          ? "bg-violet-50 border-violet-300 shadow-lg"
                          : "bg-white/60 border-white/50 shadow-sm hover:shadow-md hover:bg-white/80"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md`}>
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-1">
                          <p className={`font-bold text-gray-900 ${item.active ? "text-violet-800" : ""}`}>
                            {item.tool}
                          </p>
                          {item.active && (
                            <span className="inline-flex items-center gap-1 bg-violet-200 text-violet-800 text-xs font-bold px-2 py-0.5 rounded-full w-fit">
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
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 via-purple-400 to-rose-400 rounded-3xl blur-lg opacity-20" />
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl text-center">
                  <BookOpen className="w-8 h-8 text-violet-400 mx-auto mb-4" />
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
                      className="text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors"
                    >
                      www.asociacionnahiara.org
                    </a>
                    <div className="w-px h-4 bg-gray-300" />
                    <a
                      href="https://aquamundi.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors"
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

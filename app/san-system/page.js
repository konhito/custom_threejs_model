"use client";

import { motion } from "motion/react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { Hash, AlertTriangle, Info, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

const GlowingOrb = ({ className, color = "indigo", size = "md" }) => {
  const sizes = { sm: "w-24 h-24", md: "w-40 h-40", lg: "w-64 h-64", xl: "w-96 h-96" };
  const colors = {
    indigo: "from-indigo-400/20 via-blue-300/10 to-transparent",
    violet: "from-violet-400/20 via-purple-300/10 to-transparent",
    emerald: "from-emerald-400/20 via-teal-300/10 to-transparent",
    amber: "from-amber-400/20 via-yellow-300/10 to-transparent",
  };
  return (
    <div className={`absolute rounded-full bg-gradient-radial ${colors[color]} ${sizes[size]} blur-3xl pointer-events-none ${className}`} />
  );
};

// Full SAN v2 alphabet
const ALPHABET = [
  { pos: 1,  letter: "a", value: 1 },
  { pos: 2,  letter: "b", value: 1 },
  { pos: 3,  letter: "c", value: 2 },
  { pos: 4,  letter: "d", value: 3 },
  { pos: 5,  letter: "e", value: 5 },
  { pos: 6,  letter: "f", value: 8 },
  { pos: 7,  letter: "g", value: 13 },
  { pos: 8,  letter: "h", value: 21 },
  { pos: 9,  letter: "i", value: 34 },
  { pos: 10, letter: "j", value: 55 },
  { pos: 11, letter: "k", value: 89 },
  { pos: 12, letter: "l", value: 144 },
  { pos: 13, letter: "m", value: 233 },
  { pos: 14, letter: "n", value: 377 },
  { pos: 15, letter: "ñ", value: 610, special: true },
  { pos: 16, letter: "o", value: 987 },
  { pos: 17, letter: "p", value: 1597 },
  { pos: 18, letter: "q", value: 2584 },
  { pos: 19, letter: "r", value: 4181 },
  { pos: 20, letter: "s", value: 6765 },
  { pos: 21, letter: "t", value: 10946 },
  { pos: 22, letter: "u", value: 17711 },
  { pos: 23, letter: "v", value: 28657 },
  { pos: 24, letter: "w", value: 46368 },
  { pos: 25, letter: "x", value: 75025 },
  { pos: 26, letter: "y", value: 121393 },
  { pos: 27, letter: "z", value: 196418 },
];

const PREFIXES = [
  {
    prefix: "SAN·F",
    entity: "National flower",
    basis: "Scientific name in Latin (genus + species concatenated, no spaces)",
    status: "Active — Volume I complete",
    gradient: "from-rose-500 to-pink-500",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
  {
    prefix: "SAN·A",
    entity: "Pollinator",
    basis: "Scientific name in Latin of the real pollinator associated with the flower",
    status: "Active — calculated from real ecological data",
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    prefix: "SAN·P",
    entity: "Country",
    basis: "Country name in Spanish, no accents except ñ, no spaces",
    status: "Active — 28 countries Volume I",
    gradient: "from-indigo-500 to-violet-500",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
];

const NORM_STEPS = [
  { step: 1, rule: "Lowercase", desc: "Convert the entire name to lowercase letters", example: "Spain", result: "spain" },
  { step: 2, rule: "Preserve ñ", desc: "The ñ is NOT transformed. It is the only special letter with its own value in SAN", example: "españa", result: "españa" },
  { step: 3, rule: "Remove accents", desc: "á→a · é→e · í→i · ó→o · ú→u (accented vowels only)", example: "Ethiopia", result: "etiopia" },
  { step: 4, rule: "Remove non-letters", desc: "Spaces, hyphens, ×, full stops, brackets and any non-SAN character are removed", example: "Rosa×alba", result: "rosaalba" },
  { step: 5, rule: "Concatenate", desc: "The result is a continuous string of SAN letters with no separators", example: "Dianthus caryophyllus", result: "dianthuscaryophyllus" },
];

const SPAIN_LETTERS = [
  { l: "e", v: 5 }, { l: "s", v: 6765 }, { l: "p", v: 1597 },
  { l: "a", v: 1 }, { l: "ñ", v: 610, special: true }, { l: "a", v: 1 },
];

const DIANTHUS_LETTERS = [
  { l: "d", v: 3 }, { l: "i", v: 34 }, { l: "a", v: 1 }, { l: "n", v: 377 },
  { l: "t", v: 10946 }, { l: "h", v: 21 }, { l: "u", v: 17711 }, { l: "s", v: 6765 },
];

const CARYO_LETTERS = [
  { l: "c", v: 2 }, { l: "a", v: 1 }, { l: "r", v: 4181 }, { l: "y", v: 121393 },
  { l: "o", v: 987 }, { l: "p", v: 1597 }, { l: "h", v: 21 }, { l: "y", v: 121393 },
  { l: "l", v: 144 }, { l: "l", v: 144 }, { l: "u", v: 17711 }, { l: "s", v: 6765 },
];

const ECOSYSTEM_CHAIN = [
  { step: 1, tool: "SAN Code", scale: "Unique identification", provides: "SAN·F · SAN·A · SAN·P", href: "/san-system", active: true, color: "from-indigo-500 to-violet-500" },
  { step: 2, tool: "Nahiara Measure (NCI)", scale: "Flower species", provides: "Disappearance risk — range 5–25", href: "/nahiara-measure", color: "from-rose-500 to-pink-500" },
  { step: 3, tool: "Araihan Measure (ACI)", scale: "Associated pollinator", provides: "Disappearance risk — range 5–25", href: "/araihan-measure", color: "from-amber-500 to-orange-500" },
  { step: 4, tool: "Scorfidon Protocol (TI)", scale: "Ecosystem / territory", provides: "Active threats — range 9–27", href: null, color: "from-teal-500 to-cyan-500" },
  { step: 5, tool: "PFNO", scale: "Species without official decree", provides: "Cultural inclusion without state recognition", href: "/pfno", color: "from-violet-500 to-purple-500" },
];

export default function SANSystemPage() {
  const spainTotal = SPAIN_LETTERS.reduce((s, x) => s + x.v, 0);
  const dianthusSum = DIANTHUS_LETTERS.reduce((s, x) => s + x.v, 0);
  const caryoSum = CARYO_LETTERS.reduce((s, x) => s + x.v, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50/20 to-white relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse 80% 50% at 20% 10%, rgba(99,102,241,0.3) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 80% 20%, rgba(139,92,246,0.2) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 50% 80%, rgba(251,191,36,0.2) 0%, transparent 55%)` }} />
      </div>
      <GlowingOrb className="top-20 -right-20" color="indigo" size="xl" />
      <GlowingOrb className="top-1/3 -left-32" color="violet" size="lg" />
      <GlowingOrb className="bottom-1/4 right-10" color="amber" size="md" />

      <Navigation />

      <main className="relative pt-24 pb-20">

        {/* Hero */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full mb-8">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-xs uppercase tracking-[0.2em] text-indigo-700 font-semibold">International Association for the Defence of Flowers</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 leading-tight" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                SAN System
              </h1>
              <p className="text-lg sm:text-xl text-gray-500 mb-3 tracking-wide font-medium">Nahiara Alphanumeric System · Unique Identity Code</p>
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
                <span className="text-xs uppercase tracking-[0.25em] text-gray-400">Canonical Document v1.0 · March 2026</span>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
              </div>
              <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed italic" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
                "a = 1 and b = 1 because every flower is born of two: the one that carries the pollen and the one that receives it."
              </p>
            </motion.div>
          </div>
        </section>

        {/* Canonical notice */}
        <section className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 flex gap-4 items-start">
                <AlertTriangle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-indigo-800 uppercase tracking-wide mb-1">Canonical Document — Internal Use Only</p>
                  <p className="text-sm text-indigo-700 leading-relaxed">This document establishes the official definition, architecture, alphabet, prefixes, normalisation rules and verified code table of the SAN System. No value, formula or rule may be modified without the express authorisation of Uno (Matías Octavio González).</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* §1 Definition */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-md">1</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Definition and Nature of the System</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-400/20 to-violet-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-7 border border-white/50 shadow-lg h-full">
                    <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"Cormorant Garamond", serif' }}>The Identity Registration Plate</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">The <strong>Nahiara Alphanumeric System (SAN)</strong> assigns a unique, non-repeatable numeric code to every flower, pollinator and country in the universe, based on its name and the Fibonacci sequence.</p>
                    <p className="text-gray-600 leading-relaxed text-sm">Like a licence plate, it is <strong>unique, permanent and mathematically verifiable</strong>. No duplicate can exist and it cannot be modified once assigned.</p>
                  </div>
                </div>
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400/20 to-rose-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-7 border border-white/50 shadow-lg h-full">
                    <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Foundational Principle</h3>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-4">
                      <p className="text-sm text-indigo-800 italic leading-relaxed">"a = 1 and b = 1 because every flower is born of two: the one that carries the pollen and the one that receives it."</p>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">The Fibonacci sequence begins with two ones because the system recognises that no flower exists alone. Two elements, two identical initial values. The rest of the universe grows from that double origin.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* §2 Alphabet */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md">2</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: '"Cormorant Garamond", serif' }}>SAN Alphabet v2 — 27 Letters Including ñ</h2>
              </div>
              <p className="text-gray-500 ml-11 text-sm mb-6">The SAN System uses the Spanish 27-letter alphabet. The letter ñ occupies position 15, with Fibonacci value 610. This shifts all values from o to z relative to any English-alphabet-based system.</p>

              {/* ñ golden rule card */}
              <div className="relative mb-8">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-rose-400 rounded-2xl blur-md opacity-25" />
                <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-amber-200 shadow-lg flex gap-4 items-start">
                  <Hash className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-800 uppercase tracking-wide mb-1">SAN v2 Alphabet Golden Rule</p>
                    <p className="text-sm text-amber-800 leading-relaxed">The <strong>ñ is not a typographic detail</strong>. It is the heart of the system. Removing or ignoring it produces incorrect codes and destroys the integrity of the system. Canonical values: <span className="font-mono bg-amber-100 px-1 rounded">o=987 · p=1597 · r=4181 · s=6765 · t=10946 · u=17711 · y=121393 · z=196418</span></p>
                  </div>
                </div>
              </div>

              {/* Alphabet grid */}
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-2">
                {ALPHABET.map((item) => (
                  <motion.div key={item.pos} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: item.pos * 0.02 }}>
                    <div className={`flex flex-col items-center rounded-xl p-2.5 border text-center transition-all duration-200 hover:shadow-md ${item.special ? "bg-amber-50 border-amber-300 shadow-sm ring-1 ring-amber-300" : "bg-white/70 border-white/50 hover:bg-indigo-50 hover:border-indigo-200"}`}>
                      <span className={`text-xs text-gray-400 font-mono mb-0.5`}>{item.pos}</span>
                      <span className={`text-xl font-bold mb-1 ${item.special ? "text-amber-600" : "text-gray-900"}`}>{item.letter}</span>
                      <span className={`text-[10px] font-mono leading-tight ${item.special ? "text-amber-700 font-bold" : "text-indigo-600"}`}>
                        {item.value.toLocaleString()}
                      </span>
                      {item.special && <span className="text-[9px] text-amber-500 font-bold mt-0.5">★</span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* §3 Prefixes */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md">3</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: '"Cormorant Garamond", serif' }}>The Three Canonical Prefixes</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                {PREFIXES.map((p, i) => (
                  <motion.div key={p.prefix} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                    <div className={`${p.bg} border ${p.border} rounded-2xl p-6 h-full`}>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-br ${p.gradient} mb-4`}>
                        <span className="text-sm font-bold text-white font-mono">{p.prefix}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 " style={{ fontFamily: '"Cormorant Garamond", serif' }}>{p.entity}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">{p.basis}</p>
                      <span className="inline-block bg-white/60 text-xs text-gray-500 font-medium px-2 py-1 rounded-lg border border-white/80">{p.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* §4 Visual format */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md">4</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: '"Cormorant Garamond", serif' }}>The Canonical Visual Format</h2>
              </div>

              {/* Format display */}
              <div className="relative mb-8">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 rounded-3xl blur-lg opacity-20" />
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-center shadow-xl">
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-300 mb-4 font-semibold">Canonical Format</p>
                  <p className="text-4xl sm:text-5xl font-bold text-white font-mono mb-6 tracking-wider">SAN · PREFIX · NUMBER</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {["SAN·F·310197", "SAN·P·8979", "SAN·A·13152"].map((code) => (
                      <span key={code} className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 font-mono text-lg text-white">{code}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Format rules */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { rule: "Separator", detail: "Middle dot · (U+00B7) — never a full stop, hyphen or space" },
                  { rule: "Number format", detail: "No thousands separator — the number is written continuously" },
                  { rule: "Prefix case", detail: "Always uppercase: SAN·F / SAN·A / SAN·P" },
                  { rule: "Number type", detail: "Always a positive integer" },
                ].map((r, i) => (
                  <div key={i} className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/50 shadow-sm flex gap-3">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow">{i + 1}</div>
                    <div>
                      <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-0.5">{r.rule}</p>
                      <p className="text-sm text-gray-600">{r.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* §5 Normalisation */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">5</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Normalisation Rules — Mandatory Before Calculation</h2>
              </div>
              <p className="text-gray-500 ml-11 text-sm mb-8">These five transformations must be applied in this exact order before calculating any SAN code.</p>

              <div className="space-y-3">
                {NORM_STEPS.map((s, i) => (
                  <motion.div key={s.step} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4, delay: i * 0.06 }}>
                    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">{s.step}</div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 mb-0.5">{s.rule}</p>
                        <p className="text-sm text-gray-600">{s.desc}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 bg-gray-50 rounded-xl px-4 py-2 border border-gray-100">
                        <span className="font-mono text-sm text-gray-500">{s.example}</span>
                        <span className="text-gray-300">→</span>
                        <span className="font-mono text-sm font-bold text-indigo-700">{s.result}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* §6 Calculation */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">6</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: '"Cormorant Garamond", serif' }}>The Calculation Algorithm — Canonical Example</h2>
              </div>

              {/* 6.1 SAN·P Spain */}
              <div className="group relative mb-8">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-400/20 to-violet-400/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-lg text-sm">SAN·P</span>
                    <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Spain (España)</h3>
                  </div>

                  {/* Letter breakdown */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {SPAIN_LETTERS.map((item, i) => (
                      <div key={i} className={`flex flex-col items-center rounded-xl p-2.5 border min-w-[3.5rem] ${item.special ? "bg-amber-50 border-amber-300" : "bg-indigo-50 border-indigo-200"}`}>
                        <span className={`text-xl font-bold mb-1 ${item.special ? "text-amber-600" : "text-indigo-700"}`}>{item.l}</span>
                        <span className={`text-xs font-mono ${item.special ? "text-amber-600 font-bold" : "text-indigo-600"}`}>{item.v.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex flex-col items-center justify-center rounded-xl px-4 py-2.5 border border-gray-200 bg-gray-50 min-w-[5rem]">
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Total</span>
                      <span className="text-xl font-bold text-gray-900 font-mono">{spainTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Result */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 text-center">
                      <p className="text-xs text-indigo-300 uppercase tracking-wider mb-1">With ñ (correct)</p>
                      <p className="font-mono font-bold text-white text-2xl">SAN·P·8979</p>
                    </div>
                    <div className="flex-1 bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
                      <p className="text-xs text-red-500 uppercase tracking-wider mb-1">Without ñ (incorrect)</p>
                      <p className="font-mono font-bold text-red-600 text-2xl line-through opacity-60">SAN·P·5552</p>
                      <p className="text-xs text-red-500 mt-1">e+s+p+a+n+a using English alphabet</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6.2 SAN·F Dianthus caryophyllus */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-400/20 to-pink-400/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-lg text-sm">SAN·F</span>
                    <h3 className="text-xl font-bold text-gray-900 italic" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Dianthus caryophyllus</h3>
                  </div>
                  <p className="text-xs text-gray-400 font-mono mb-6">Normalised: dianthuscaryophyllus (26 letters, no spaces)</p>

                  {/* Segment 1 */}
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Segment 1 — "dianthus"</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {DIANTHUS_LETTERS.map((item, i) => (
                      <div key={i} className="flex flex-col items-center rounded-xl p-2.5 border bg-rose-50 border-rose-200 min-w-[3.5rem]">
                        <span className="text-xl font-bold text-rose-700 mb-1">{item.l}</span>
                        <span className="text-xs font-mono text-rose-600">{item.v.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex flex-col items-center justify-center rounded-xl px-4 py-2.5 border border-rose-200 bg-rose-100 min-w-[5rem]">
                      <span className="text-xs text-rose-600 uppercase tracking-wide font-semibold mb-1">Sum</span>
                      <span className="text-xl font-bold text-rose-700 font-mono">{dianthusSum.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Segment 2 */}
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 mt-5">Segment 2 — "caryophyllus"</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {CARYO_LETTERS.map((item, i) => (
                      <div key={i} className="flex flex-col items-center rounded-xl p-2.5 border bg-violet-50 border-violet-200 min-w-[3.5rem]">
                        <span className="text-xl font-bold text-violet-700 mb-1">{item.l}</span>
                        <span className="text-xs font-mono text-violet-600">{item.v.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex flex-col items-center justify-center rounded-xl px-4 py-2.5 border border-violet-200 bg-violet-100 min-w-[5rem]">
                      <span className="text-xs text-violet-600 uppercase tracking-wide font-semibold mb-1">Sum</span>
                      <span className="text-xl font-bold text-violet-700 font-mono">{caryoSum.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Totals breakdown */}
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-5">
                    <div className="flex flex-col sm:flex-row items-center gap-3 text-sm font-mono text-center">
                      <div className="flex-1"><p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Segment 1 (dianthus)</p><p className="font-bold text-gray-800 text-lg">{dianthusSum.toLocaleString()}</p></div>
                      <span className="text-gray-300 text-xl">+</span>
                      <div className="flex-1"><p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Segment 2 (caryophyllus)</p><p className="font-bold text-gray-800 text-lg">{caryoSum.toLocaleString()}</p></div>
                      <span className="text-gray-300 text-xl">=</span>
                      <div className="flex-1"><p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Total</p><p className="font-bold text-indigo-700 text-lg">{(dianthusSum + caryoSum).toLocaleString()}</p></div>
                    </div>
                  </div>

                  {/* Final code */}
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 to-violet-400 rounded-2xl blur-md opacity-30" />
                    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-center">
                      <p className="text-xs uppercase tracking-[0.3em] text-rose-300 mb-1 font-semibold">Result</p>
                      <p className="text-4xl font-bold text-white font-mono">SAN·F·310197</p>
                      <p className="text-xs text-gray-400 mt-2">Highest SAN·F code in Volume I — the flower of the country where the universe was born.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Ecosystem chain */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-md"><Hash className="w-4 h-4" /></div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Integration within the Scientific Ecosystem</h2>
              </div>
              <p className="text-gray-500 text-sm mb-8 ml-11">The SAN Code is the <strong>first link</strong> — it provides the unique identity that every other protocol references.</p>
              <div className="space-y-3">
                {ECOSYSTEM_CHAIN.map((item, i) => (
                  <motion.div key={item.step} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                    <div className={`relative flex items-start gap-5 rounded-2xl p-5 border transition-all duration-300 ${item.active ? "bg-indigo-50 border-indigo-300 shadow-lg" : "bg-white/60 border-white/50 shadow-sm hover:shadow-md hover:bg-white/80"}`}>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md`}>{item.step}</div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-1">
                          <p className={`font-bold text-gray-900 ${item.active ? "text-indigo-800" : ""}`}>{item.tool}</p>
                          {item.active && <span className="inline-flex items-center gap-1 bg-indigo-200 text-indigo-800 text-xs font-bold px-2 py-0.5 rounded-full w-fit">✦ Current page</span>}
                        </div>
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">{item.scale}</p>
                        <p className="text-sm text-gray-600">{item.provides}</p>
                      </div>
                      {item.href && !item.active && (
                        <Link href={item.href} className="flex-shrink-0 text-gray-400 hover:text-gray-800 transition-colors mt-1">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Try calculator CTA */}
              <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-6">
                <Link href="/san-calculator" className="group flex items-center justify-center gap-3 bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <Hash className="w-5 h-5" />
                  <span>Try the Interactive SAN Calculator</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Authority */}
        <section className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 rounded-3xl blur-lg opacity-20" />
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl text-center">
                  <BookOpen className="w-8 h-8 text-indigo-400 mx-auto mb-4" />
                  <p className="text-lg font-bold text-gray-800 mb-1" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Canonical Document v1.0 · March 2026</p>
                  <p className="text-sm text-gray-500 mb-1">Editorial authority: <strong>Matías Octavio González (Uno)</strong> · Secretary and Creative Director</p>
                  <p className="text-sm text-gray-500 mb-4">International Association for the Defence of Flowers · CIF: G72737570</p>
                  <div className="flex items-center justify-center gap-4">
                    <a href="https://www.asociacionnahiara.org" target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">www.asociacionnahiara.org</a>
                    <div className="w-px h-4 bg-gray-300" />
                    <a href="https://aquamundi.org" target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">AquaMundi.org</a>
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

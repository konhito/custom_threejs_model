"use client";

import { motion } from "motion/react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { AlertTriangle, BookOpen, ChevronRight, Flame, Info } from "lucide-react";
import Link from "next/link";

const GlowingOrb = ({ className, color = "red", size = "md" }) => {
  const sizes = { sm: "w-24 h-24", md: "w-40 h-40", lg: "w-64 h-64", xl: "w-96 h-96" };
  const colors = {
    red: "from-red-400/20 via-rose-300/10 to-transparent",
    orange: "from-orange-400/20 via-amber-300/10 to-transparent",
    slate: "from-slate-400/20 via-gray-300/10 to-transparent",
  };
  return <div className={`absolute rounded-full bg-gradient-radial ${colors[color]} ${sizes[size]} blur-3xl pointer-events-none ${className}`} />;
};

const FACTORS = [
  { letter: "S", name: "Overexploitation", desc: "Intensive and unsustainable extraction of natural resources — excessive harvesting, predatory collection, uncontrolled tourist pressure.", gradient: "from-red-600 to-rose-500", bg: "bg-red-50", border: "border-red-200" },
  { letter: "C", name: "Contamination", desc: "Chemical, light or sound degradation — pesticides, herbicides, water and soil pollution.", gradient: "from-orange-600 to-red-500", bg: "bg-orange-50", border: "border-orange-200" },
  { letter: "O", name: "Territorial Occupation", desc: "Urban encroachment and infrastructure that destroys or degrades the natural habitats of flowers and pollinators.", gradient: "from-amber-600 to-orange-500", bg: "bg-amber-50", border: "border-amber-200" },
  { letter: "R", name: "Residues", desc: "Plastics, agrochemicals, industrial and domestic waste that disrupt the natural cycles of the ecosystem.", gradient: "from-yellow-600 to-amber-500", bg: "bg-yellow-50", border: "border-yellow-200" },
  { letter: "F", name: "Fragmentation", desc: "Rupture of ecological corridors that prevents the movement of pollinators and the dispersal of pollen between populations.", gradient: "from-lime-600 to-green-500", bg: "bg-lime-50", border: "border-lime-200" },
  { letter: "I", name: "Intentional Fires", desc: "Deliberate or negligent burning that massively destroys plant matter, nests and pollinator habitats, with short-term irreversible effects.", gradient: "from-red-700 to-orange-600", bg: "bg-red-50", border: "border-red-300" },
  { letter: "D", name: "Deforestation", desc: "Systematic felling, clearing and removal of plant cover that sustains the floral and pollinator ecosystem.", gradient: "from-emerald-700 to-teal-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  { letter: "O", name: "Obsolete Agriculture", desc: "Extensive monocultures, intensive use of systemic pesticides and loss of agricultural biodiversity that eliminates pollinator sustenance.", gradient: "from-brown-600 to-amber-700", bg: "bg-amber-50", border: "border-amber-300" },
  { letter: "N", name: "Nitrification", desc: "Excess nitrogen in the soil from artificial fertilisers that disrupts the nutritional balance and favours invasive species over native flora.", gradient: "from-violet-600 to-purple-500", bg: "bg-violet-50", border: "border-violet-200" },
];

const SCORES = [
  { score: 1, label: "Low", desc: "The factor is present but with limited and manageable impact. The ecosystem shows autonomous recovery capacity.", color: "bg-emerald-50 border-emerald-200", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" },
  { score: 2, label: "Medium", desc: "The factor is active with measurable impact on flowers or pollinators. Requires continuous monitoring and planned intervention.", color: "bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
  { score: 3, label: "High", desc: "The factor is operating at maximum intensity with structural damage to the ecosystem. Natural recovery is uncertain without external intervention.", color: "bg-red-50 border-red-200", badge: "bg-red-100 text-red-700", dot: "bg-red-400" },
];

const ALERT_LEVELS = [
  { label: "LATENT", range: "9 – 13 pts", dot: "bg-emerald-400", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", desc: "Ecosystem in relative equilibrium. Threats exist but have not reached critical mass. Preventive monitoring recommended." },
  { label: "EMERGING", range: "14 – 18 pts", dot: "bg-amber-400", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", desc: "Detectable tension in the ecosystem. One or more factors have escalated. Active intervention recommended before the dynamic becomes entrenched." },
  { label: "ACTIVE", range: "19 – 23 pts", dot: "bg-orange-500", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", desc: "Consolidated threat with measurable impact on flowers and pollinators. Urgent and coordinated action essential." },
  { label: "CRITICAL", range: "24 – 27 pts", dot: "bg-red-600", bg: "bg-red-50", border: "border-red-300", text: "text-red-700", desc: "Scorfidon collapse. Point of no return approaching. Emergency intervention and possible activation of international conservation protocols." },
];

const COMPARISON = [
  { scorfidon: "Active and physical threat", nameless: "Silent and conceptual threat" },
  { scorfidon: "Visible and direct destruction", nameless: "Erosion of memory and the bond" },
  { scorfidon: "Damage to the material ecosystem", nameless: "Damage to collective memory" },
  { scorfidon: "Measures impact on flowers and pollinators", nameless: "Measures disconnection between living beings and their purpose" },
  { scorfidon: "Operates with violence and evidence", nameless: "Operates with indifference and invisibility" },
  { scorfidon: "Scale: ecosystem / territory", nameless: "Scale: collective consciousness" },
  { scorfidon: "Present from Volume 1", nameless: "Introduces its influence in Volume 2" },
];

const ECOSYSTEM = [
  { step: 1, tool: "SAN Code", scale: "Unique identification", provides: "SAN·F · SAN·A · SAN·P", href: "/san-system", color: "from-indigo-500 to-violet-500" },
  { step: 2, tool: "Nahiara Measure (NCI)", scale: "Flower species", provides: "Disappearance risk — range 5–25", href: "/nahiara-measure", color: "from-rose-500 to-pink-500" },
  { step: 3, tool: "Araihan Measure (ACI)", scale: "Associated pollinator", provides: "Disappearance risk — range 5–25", href: "/araihan-measure", color: "from-amber-500 to-orange-500" },
  { step: 4, tool: "Scorfidon Protocol (SI)", scale: "Ecosystem / territory", provides: "Active physical threats — range 9–27", href: "/scorfidon", color: "from-red-600 to-orange-500", active: true },
  { step: 5, tool: "PFNO", scale: "Species without official decree", provides: "Cultural inclusion without state recognition", href: "/pfno", color: "from-violet-500 to-purple-500" },
];

export default function ScorfidonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-red-50/15 to-white relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse 80% 50% at 20% 10%, rgba(239,68,68,0.25) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 80% 20%, rgba(249,115,22,0.2) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 50% 80%, rgba(139,92,246,0.15) 0%, transparent 55%)` }} />
      </div>
      <GlowingOrb className="top-20 -right-20" color="red" size="xl" />
      <GlowingOrb className="top-1/3 -left-32" color="orange" size="lg" />
      <GlowingOrb className="bottom-1/4 right-10" color="slate" size="md" />

      <Navigation />

      <main className="relative pt-24 pb-20">

        {/* Hero */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full mb-8">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs uppercase tracking-[0.2em] text-red-700 font-semibold">International Association for the Defence of Flowers</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 leading-tight" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                Scorfidon Protocol
              </h1>
              <p className="text-lg sm:text-xl text-gray-500 mb-3 tracking-wide font-medium">Floral and Pollinator Ecosystem Threat Assessment System</p>
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-red-300 to-transparent" />
                <span className="text-xs uppercase tracking-[0.25em] text-gray-400">Canonical Document v1.0 · March 2026</span>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-red-300 to-transparent" />
              </div>
              <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed italic" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
                "The narrative universe and the scientific universe share the same name because they represent exactly the same reality."
              </p>
            </motion.div>
          </div>
        </section>

        {/* Canonical notice */}
        <section className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex gap-4 items-start">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-800 uppercase tracking-wide mb-1">Canonical Document — Internal Use Only</p>
                  <p className="text-sm text-red-700 leading-relaxed">This document establishes the official definition, architecture and application criteria of the Scorfidon Protocol within the scientific ecosystem of the Nahiara Universe. No factor, scale or rule may be modified without the express authorisation of Uno (Matías Octavio González).</p>
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
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md">1</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Definition and Nature of the Protocol</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-7 border border-white/50 shadow-lg h-full">
                    <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Ecosystem-Scale Assessment</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">The <strong>Scorfidon Protocol</strong> is the official system for assessing active and physical threats to a floral and pollinator ecosystem — measuring destructive forces operating at the level of a territory, habitat or geographical zone.</p>
                    <p className="text-gray-600 leading-relaxed text-sm">It complements the <strong>Nahiara Measure</strong> (species level) and the <strong>Araihan Measure</strong> (pollinator level). Together, the three systems form the complete health diagnostic of the floral ecosystem.</p>
                  </div>
                </div>
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-7 border border-white/50 shadow-lg h-full">
                    <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Foundational Principle</h3>
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
                      <p className="text-sm text-red-800 italic leading-relaxed">Scorfidon is not only the name of the narrative antagonist. It is also the acronym for the nine real, active and measurable forces that threaten floral ecosystems on the planet.</p>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">This alignment between fiction and science is one of the fundamental architectural principles of the project — the narrative universe and the scientific universe share the same name because they represent the same reality.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* §2 SCORFIDON acronym */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} className="mb-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600 to-red-500 flex items-center justify-center text-white font-bold text-sm shadow-md">2</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: '"Cormorant Garamond", serif' }}>The S·C·O·R·F·I·D·O·N Acronym — Nine Factors</h2>
              </div>
              <p className="text-gray-500 ml-11 text-sm">Each letter corresponds to a real, verifiable and scientifically documented threat to floral ecosystems.</p>
            </motion.div>

            {/* Acronym display */}
            <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-10">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 rounded-3xl blur-lg opacity-20" />
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 sm:p-8">
                  <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                    {"SCORFIDON".split("").map((l, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                        <div className="flex flex-col items-center">
                          <span className="text-4xl sm:text-5xl font-bold text-white" style={{ fontFamily: '"Cormorant Garamond", serif', textShadow: "0 0 20px rgba(239,68,68,0.5)" }}>{l}</span>
                          <span className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">{FACTORS[i].name.split(" ")[0]}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Factor cards */}
            <div className="space-y-3">
              {FACTORS.map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.45, delay: i * 0.05 }}>
                  <div className={`${f.bg} border ${f.border} rounded-2xl p-5 flex items-start gap-5 group hover:shadow-md transition-all duration-300`}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`} style={{ fontFamily: '"Cormorant Garamond", serif' }}>{f.letter}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{f.name}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                    </div>
                    <span className="text-2xl font-bold text-gray-100 font-mono flex-shrink-0 mt-1">{i + 1}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* §3 Scoring */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md">3</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Scoring System</h2>
              </div>

              {/* Scale */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {SCORES.map((s) => (
                  <div key={s.score} className={`${s.color} border rounded-2xl p-5`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${s.dot}`} />
                      <span className={`text-xs font-bold uppercase tracking-wide ${s.badge} px-2 py-0.5 rounded-full`}>{s.score} — {s.label}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>

              {/* Formula */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 rounded-2xl blur-md opacity-20" />
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-orange-300 mb-3 font-semibold">Scorfidon Index Formula</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white font-mono mb-3">SI = S + C + O + R + F + I + D + O + N</p>
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
                    <span>Minimum: <strong className="text-emerald-400">9</strong></span>
                    <div className="h-4 w-px bg-gray-600" />
                    <span>Maximum: <strong className="text-red-400">27</strong></span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* §4 Alert levels */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-rose-500 flex items-center justify-center text-white font-bold text-sm shadow-md">4</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: '"Cormorant Garamond", serif' }}>The Four Scorfidon Alert Levels</h2>
              </div>
              <div className="space-y-3">
                {ALERT_LEVELS.map((level, i) => (
                  <motion.div key={level.label} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                    <div className={`${level.bg} border ${level.border} rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start gap-4`}>
                      <div className="flex items-center gap-3 flex-shrink-0 sm:w-44">
                        <div className={`w-3 h-3 rounded-full ${level.dot} flex-shrink-0`} />
                        <div>
                          <p className={`text-sm font-bold ${level.text} uppercase tracking-wide`}>{level.label}</p>
                          <p className="text-xs text-gray-500 font-mono">{level.range}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 flex-1 leading-relaxed">{level.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* §5 Distinction vs The Nameless */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-gray-500 flex items-center justify-center text-white font-bold text-sm shadow-md">5</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Scorfidon Protocol vs. The Nameless</h2>
              </div>
              <p className="text-gray-500 text-sm mb-6 ml-11 -mt-6">The Nahiara Universe recognises two fundamentally distinct categories of threat. This distinction is <strong>canonical and inviolable</strong>.</p>

              <div className="group relative mb-6">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400/20 to-slate-400/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden">
                  <div className="grid grid-cols-2">
                    <div className="px-6 py-4 bg-red-50 border-b border-r border-red-100 text-xs font-bold text-red-700 uppercase tracking-wide flex items-center gap-2">
                      <Flame className="w-3.5 h-3.5" /> Scorfidon Protocol
                    </div>
                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-2">
                      <span className="text-slate-400">◌</span> The Nameless (Volume 2)
                    </div>
                  </div>
                  {COMPARISON.map((row, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className={`grid grid-cols-2 border-b border-gray-50 last:border-0 ${i % 2 === 0 ? "bg-white/60" : "bg-white/30"}`}>
                      <div className="px-6 py-3.5 text-sm text-gray-700 font-medium border-r border-gray-100">{row.scorfidon}</div>
                      <div className="px-6 py-3.5 text-sm text-gray-500">{row.nameless}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex gap-3 items-start">
                <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700">
                  <strong>Canonical application rule:</strong> Ignorance, Indifference, Oblivion and Disconnection belong exclusively to the domain of <strong>The Nameless</strong> (Volume 2). They must never be included as Scorfidon Protocol factors under any circumstances.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* §6 Ecosystem integration */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">6</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Integration within the Scientific Ecosystem</h2>
              </div>
              <p className="text-gray-500 text-sm mb-8 ml-11 -mt-4">Each protocol operates in a specific and complementary dimension — together forming the complete diagnostic of the floral and pollinator ecosystem.</p>
              <div className="space-y-3">
                {ECOSYSTEM.map((item, i) => (
                  <motion.div key={item.step} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                    <div className={`relative flex items-start gap-5 rounded-2xl p-5 border transition-all duration-300 ${item.active ? "bg-red-50 border-red-300 shadow-lg" : "bg-white/60 border-white/50 shadow-sm hover:shadow-md hover:bg-white/80"}`}>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md`}>{item.step}</div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-1">
                          <p className={`font-bold text-gray-900 ${item.active ? "text-red-800" : ""}`}>{item.tool}</p>
                          {item.active && <span className="inline-flex items-center gap-1 bg-red-200 text-red-800 text-xs font-bold px-2 py-0.5 rounded-full w-fit">✦ Current page</span>}
                        </div>
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">{item.scale}</p>
                        <p className="text-sm text-gray-600">{item.provides}</p>
                      </div>
                      {item.href && !item.active && (
                        <Link href={item.href} className="flex-shrink-0 text-gray-400 hover:text-gray-800 transition-colors mt-1"><ChevronRight className="w-3.5 h-3.5" /></Link>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Authority */}
        <section className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 rounded-3xl blur-lg opacity-20" />
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl text-center">
                  <BookOpen className="w-8 h-8 text-red-500 mx-auto mb-4" />
                  <p className="text-lg font-bold text-gray-800 mb-1" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Canonical Document v1.0 · March 2026</p>
                  <p className="text-sm text-gray-500 mb-1">Editorial authority: <strong>Matías Octavio González (Uno)</strong> · Secretary and Creative Director</p>
                  <p className="text-sm text-gray-500 mb-4">International Association for the Defence of Flowers · CIF: G72737570</p>
                  <div className="flex items-center justify-center gap-4">
                    <a href="https://www.asociacionnahiara.org" target="_blank" rel="noopener noreferrer" className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors">www.asociacionnahiara.org</a>
                    <div className="w-px h-4 bg-gray-300" />
                    <a href="https://aquamundi.org" target="_blank" rel="noopener noreferrer" className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors">AquaMundi.org</a>
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

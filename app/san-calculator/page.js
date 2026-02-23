"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { Hash, Calculator, Sparkles, Search, FlaskConical } from "lucide-react";
import { useTranslation } from "../../lib/useTranslation";
import {
    FIBONACCI_VALUES,
    calculateSAN,
    formatNumber,
    formatSANCode,
} from "../../lib/sanCode";

const CATEGORIES = [
    { value: "F", label: "Flower", labelEs: "Flor", emoji: "🌸" },
    { value: "P", label: "Pollinator", labelEs: "Polinizador", emoji: "🐝" },
    { value: "G", label: "Guardian", labelEs: "Guardián", emoji: "🛡️" },
];

const EXAMPLES = [
    { name: "Cantuta buxifolia", category: "F", expected: "SAN-F-83,003" },
    { name: "Nectarinia famosa", category: "P", expected: "SAN-P-15,214" },
];

const FIBONACCI_TABLE = Object.entries(FIBONACCI_VALUES).map(([letter, value]) => ({
    letter: letter.toUpperCase(),
    value,
}));

export default function SANCalculatorPage() {
    const { t } = useTranslation();
    const [scientificName, setScientificName] = useState("");
    const [category, setCategory] = useState("F");
    const [showTable, setShowTable] = useState(false);

    const sanNumber = useMemo(
        () => calculateSAN(scientificName),
        [scientificName]
    );
    const sanCode = useMemo(
        () => (sanNumber > 0 ? formatSANCode(sanNumber, category) : null),
        [sanNumber, category]
    );

    // Breakdown of each character's contribution
    const breakdown = useMemo(() => {
        if (!scientificName) return [];
        return scientificName
            .toLowerCase()
            .split("")
            .map((char, i) => ({
                char: scientificName[i], // preserve original case
                value: FIBONACCI_VALUES[char] || 0,
                isLetter: /[a-z]/.test(char),
            }));
    }, [scientificName]);

    const handleExample = (example) => {
        setScientificName(example.name);
        setCategory(example.category);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
            {/* Aurora-inspired background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: `
              radial-gradient(ellipse 80% 50% at 20% 20%, rgba(147, 197, 253, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 30%, rgba(196, 181, 253, 0.35) 0%, transparent 50%),
              radial-gradient(ellipse 70% 50% at 50% 80%, rgba(167, 243, 208, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse 50% 30% at 10% 60%, rgba(251, 191, 36, 0.25) 0%, transparent 50%)
            `,
                    }}
                />
            </div>

            {/* Decorative orbs */}
            <motion.div
                className="absolute top-20 -right-20 w-96 h-96 rounded-full bg-gradient-radial from-indigo-400/20 via-purple-300/10 to-transparent blur-3xl pointer-events-none"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 1.5 }}
            />
            <motion.div
                className="absolute bottom-1/4 -left-32 w-64 h-64 rounded-full bg-gradient-radial from-emerald-400/20 via-teal-300/10 to-transparent blur-3xl pointer-events-none"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 1.5 }}
            />

            <Navigation />

            <main className="relative pt-24 pb-20">
                {/* Hero */}
                <section className="px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                                <Hash className="w-5 h-5 text-indigo-400" />
                                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                            </div>

                            <h1
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
                                style={{ fontFamily: '"Cormorant Garamond", serif' }}
                            >
                                S.A.N. Code Calculator
                            </h1>

                            <div className="w-24 h-px bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 mx-auto mb-8" />

                            <p
                                className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed italic"
                                style={{
                                    fontFamily: '"Playfair Display", Georgia, serif',
                                }}
                            >
                                Fibonacci Nomenclature System — assigning a unique numerical identifier
                                to every species in the Nahiara universe
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Calculator Section */}
                <section className="px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="group relative">
                                {/* Glow */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-emerald-400/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Card */}
                                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl">
                                    {/* Header */}
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                                            <Calculator className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2
                                                className="text-2xl lg:text-3xl font-bold text-gray-900"
                                                style={{
                                                    fontFamily: '"Cormorant Garamond", serif',
                                                }}
                                            >
                                                Calculate SAN Code
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                Enter the complete scientific name of any species
                                            </p>
                                        </div>
                                    </div>

                                    {/* Input */}
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Scientific Name
                                            </label>
                                            <div className="relative">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    id="san-scientific-name"
                                                    type="text"
                                                    value={scientificName}
                                                    onChange={(e) => setScientificName(e.target.value)}
                                                    placeholder="e.g. Cantuta buxifolia"
                                                    className="w-full pl-12 pr-4 py-4 bg-white/80 border border-gray-200 rounded-xl text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 transition-all"
                                                    style={{
                                                        fontFamily: '"Cormorant Garamond", serif',
                                                        fontStyle: "italic",
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Category selector */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Category
                                            </label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {CATEGORIES.map((cat) => (
                                                    <button
                                                        key={cat.value}
                                                        id={`san-category-${cat.value}`}
                                                        onClick={() => setCategory(cat.value)}
                                                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-300 ${category === cat.value
                                                                ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white border-transparent shadow-lg scale-105"
                                                                : "bg-white/80 text-gray-700 border-gray-200 hover:bg-indigo-50 hover:border-indigo-200"
                                                            }`}
                                                    >
                                                        <span className="text-lg">{cat.emoji}</span>
                                                        <span>{cat.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Result */}
                                        {sanCode && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3 }}
                                                className="relative overflow-hidden"
                                            >
                                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 rounded-2xl blur-sm opacity-30" />
                                                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-center">
                                                    <p className="text-xs uppercase tracking-[0.3em] text-indigo-300 mb-3 font-semibold">
                                                        SAN Code Result
                                                    </p>
                                                    <p
                                                        id="san-result"
                                                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-mono tracking-wider"
                                                    >
                                                        {sanCode}
                                                    </p>
                                                    <p className="text-sm text-gray-400 mt-3">
                                                        Fibonacci sum:{" "}
                                                        <span className="text-indigo-300 font-mono">
                                                            {formatNumber(sanNumber)}
                                                        </span>
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Character breakdown */}
                                        {breakdown.length > 0 && sanNumber > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold mb-3">
                                                    Character Breakdown
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {breakdown.map((item, i) => (
                                                        <div
                                                            key={i}
                                                            className={`flex flex-col items-center min-w-[2.5rem] rounded-lg p-1.5 text-xs border ${item.isLetter
                                                                    ? "bg-indigo-50 border-indigo-200"
                                                                    : "bg-gray-50 border-gray-200"
                                                                }`}
                                                        >
                                                            <span
                                                                className={`font-semibold text-sm ${item.isLetter
                                                                        ? "text-indigo-700"
                                                                        : "text-gray-400"
                                                                    }`}
                                                            >
                                                                {item.char === " " ? "⎵" : item.char}
                                                            </span>
                                                            <span
                                                                className={`font-mono text-[10px] ${item.isLetter
                                                                        ? "text-indigo-500"
                                                                        : "text-gray-300"
                                                                    }`}
                                                            >
                                                                {item.isLetter
                                                                    ? formatNumber(item.value)
                                                                    : "—"}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Example Buttons */}
                <section className="px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <div className="group relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-rose-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                                            <FlaskConical className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2
                                                className="text-2xl lg:text-3xl font-bold text-gray-900"
                                                style={{
                                                    fontFamily: '"Cormorant Garamond", serif',
                                                }}
                                            >
                                                Verified Examples
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                Click to test with verified reference species
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {EXAMPLES.map((example) => (
                                            <button
                                                key={example.name}
                                                id={`san-example-${example.category}`}
                                                onClick={() => handleExample(example)}
                                                className="group/btn relative text-left p-5 rounded-2xl border border-gray-200 bg-white/80 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-200 transition-all duration-300 hover:shadow-md"
                                            >
                                                <p
                                                    className="text-lg font-semibold text-gray-900 italic mb-1"
                                                    style={{
                                                        fontFamily: '"Cormorant Garamond", serif',
                                                    }}
                                                >
                                                    {example.name}
                                                </p>
                                                <p className="text-xs text-gray-500 mb-2">
                                                    Category:{" "}
                                                    {CATEGORIES.find(
                                                        (c) => c.value === example.category
                                                    )?.label || example.category}
                                                </p>
                                                <p className="text-sm font-mono font-bold text-indigo-600">
                                                    {example.expected}
                                                </p>
                                                <div className="absolute top-4 right-4 opacity-0 group-hover/btn:opacity-100 transition-opacity">
                                                    <Sparkles className="w-4 h-4 text-indigo-400" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* How it works */}
                <section className="px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="group relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl">
                                    <h2
                                        className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6"
                                        style={{
                                            fontFamily: '"Cormorant Garamond", serif',
                                        }}
                                    >
                                        How It Works
                                    </h2>

                                    <div className="space-y-4 text-gray-700">
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-indigo-600">
                                                1
                                            </div>
                                            <p className="leading-relaxed">
                                                <span className="font-semibold">Enter the scientific name</span>{" "}
                                                — use the complete official scientific name of the species.
                                            </p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-indigo-600">
                                                2
                                            </div>
                                            <p className="leading-relaxed">
                                                <span className="font-semibold">Select a category</span>{" "}
                                                — F for flowers, P for pollinators, G for guardians.
                                            </p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-indigo-600">
                                                3
                                            </div>
                                            <p className="leading-relaxed">
                                                <span className="font-semibold">
                                                    Each letter maps to a Fibonacci value
                                                </span>{" "}
                                                — all letters are converted to lowercase, then each letter's
                                                Fibonacci value is summed. Spaces and punctuation are ignored.
                                            </p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-indigo-600">
                                                4
                                            </div>
                                            <p className="leading-relaxed">
                                                <span className="font-semibold">
                                                    The result is the SAN number
                                                </span>{" "}
                                                — formatted as{" "}
                                                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-indigo-600">
                                                    SAN-{"{category}"}-{"{number}"}
                                                </code>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Fibonacci Table Toggle */}
                                    <div className="mt-8">
                                        <button
                                            id="san-toggle-table"
                                            onClick={() => setShowTable(!showTable)}
                                            className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                                        >
                                            <Hash className="w-4 h-4" />
                                            {showTable
                                                ? "Hide Fibonacci Value Table"
                                                : "Show Fibonacci Value Table"}
                                        </button>

                                        {showTable && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="mt-4"
                                            >
                                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-13 gap-2">
                                                    {FIBONACCI_TABLE.map(({ letter, value }) => (
                                                        <div
                                                            key={letter}
                                                            className="flex flex-col items-center bg-white/80 rounded-lg p-2 border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                                                        >
                                                            <span className="text-lg font-bold text-gray-900">
                                                                {letter}
                                                            </span>
                                                            <span className="text-[10px] font-mono text-indigo-600">
                                                                {formatNumber(value)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Code Format Reference */}
                <section className="px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

                                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-2xl text-center overflow-hidden">
                                    <div
                                        className="absolute inset-0 opacity-10"
                                        style={{
                                            backgroundImage: `
                        radial-gradient(circle at 20% 30%, rgba(147, 197, 253, 0.5) 0%, transparent 40%),
                        radial-gradient(circle at 80% 70%, rgba(167, 243, 208, 0.5) 0%, transparent 40%)
                      `,
                                        }}
                                    />

                                    <div className="relative">
                                        <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-6" />

                                        <h2
                                            className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6"
                                            style={{
                                                fontFamily: '"Cormorant Garamond", serif',
                                            }}
                                        >
                                            SAN Code Format
                                        </h2>

                                        <div className="grid sm:grid-cols-3 gap-4 max-w-lg mx-auto">
                                            {CATEGORIES.map((cat) => (
                                                <div
                                                    key={cat.value}
                                                    className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                                                >
                                                    <span className="text-2xl mb-2 block">
                                                        {cat.emoji}
                                                    </span>
                                                    <p className="font-mono text-sm font-bold text-indigo-600">
                                                        SAN-{cat.value}-XXXXX
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {cat.label}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        <p className="text-sm text-gray-500 mt-6 italic">
                                            Part of the original scientific protocols of the Nahiara
                                            universe
                                        </p>
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

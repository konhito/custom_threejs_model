"use client";

import { motion } from "motion/react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { 
  Globe2, 
  Sparkles, 
  Shield,
  Flower2,
  Zap,
  Leaf
} from "lucide-react";
import { useTranslation } from "../../lib/useTranslation";

// Floating floral decoration component
const FloralDecoration = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 1, ease: "easeOut" }}
  >
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(147, 197, 253, 0.3)" />
          <stop offset="50%" stopColor="rgba(196, 181, 253, 0.2)" />
          <stop offset="100%" stopColor="rgba(249, 168, 212, 0.3)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#glow)" className="animate-float">
        <ellipse cx="60" cy="30" rx="12" ry="25" fill="url(#petalGradient)" transform="rotate(0 60 60)"/>
        <ellipse cx="60" cy="30" rx="12" ry="25" fill="url(#petalGradient)" transform="rotate(72 60 60)"/>
        <ellipse cx="60" cy="30" rx="12" ry="25" fill="url(#petalGradient)" transform="rotate(144 60 60)"/>
        <ellipse cx="60" cy="30" rx="12" ry="25" fill="url(#petalGradient)" transform="rotate(216 60 60)"/>
        <ellipse cx="60" cy="30" rx="12" ry="25" fill="url(#petalGradient)" transform="rotate(288 60 60)"/>
        <circle cx="60" cy="60" r="8" fill="rgba(168, 85, 247, 0.4)"/>
      </g>
    </svg>
  </motion.div>
);

// Glowing orb decoration
const GlowingOrb = ({ className, color = "blue", delay = 0, size = "md" }) => {
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-64 h-64",
    xl: "w-96 h-96",
  };
  
  const colorClasses = {
    blue: "from-blue-400/20 via-indigo-300/10 to-transparent",
    purple: "from-purple-400/20 via-violet-300/10 to-transparent",
    pink: "from-pink-400/20 via-rose-300/10 to-transparent",
    teal: "from-teal-400/20 via-cyan-300/10 to-transparent",
    emerald: "from-emerald-400/20 via-green-300/10 to-transparent",
    violet: "from-violet-400/20 via-purple-300/10 to-transparent",
    rainbow: "from-blue-400/15 via-purple-400/15 to-pink-400/15",
  };

  return (
    <motion.div
      className={`absolute rounded-full bg-gradient-radial ${colorClasses[color]} ${sizeClasses[size]} blur-3xl pointer-events-none ${className}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 1.5, ease: "easeOut" }}
    />
  );
};

export default function GuardiansPage() {
  const { t, isLoading } = useTranslation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
      {/* Aurora-inspired background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Main aurora gradient */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 20%, rgba(196, 181, 253, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 30%, rgba(167, 139, 250, 0.35) 0%, transparent 50%),
              radial-gradient(ellipse 70% 50% at 50% 80%, rgba(221, 214, 254, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse 50% 30% at 10% 60%, rgba(139, 92, 246, 0.25) 0%, transparent 50%)
            `,
          }}
        />
        
        {/* Animated aurora streaks */}
        <div 
          className="absolute inset-0 animate-aurora opacity-20"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                100deg,
                rgba(139, 92, 246, 0.1) 10%,
                rgba(167, 139, 250, 0.1) 15%,
                rgba(196, 181, 253, 0.1) 20%,
                rgba(221, 214, 254, 0.1) 25%,
                rgba(168, 85, 247, 0.1) 30%
              )
            `,
            backgroundSize: '300% 200%',
          }}
        />
      </div>

      {/* Decorative elements */}
      <GlowingOrb className="top-20 -right-20" color="purple" delay={0.2} size="xl" />
      <GlowingOrb className="top-1/3 -left-32" color="violet" delay={0.4} size="lg" />
      <GlowingOrb className="bottom-1/4 right-10" color="purple" delay={0.6} size="md" />
      <GlowingOrb className="bottom-40 left-1/4" color="violet" delay={0.8} size="lg" />
      
      <FloralDecoration className="top-32 right-20 opacity-60" delay={1} />
      <FloralDecoration className="top-1/2 left-10 opacity-40" delay={1.2} />
      <FloralDecoration className="bottom-60 right-1/3 opacity-50" delay={1.4} />

      <Navigation />

      <main className="relative pt-24 pb-20">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Decorative line */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <Shield className="w-5 h-5 text-purple-400" />
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>

              <h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {t('guardians.pageTitle')}
              </h1>

              {/* Separator */}
              <div className="w-24 h-px bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 mx-auto mb-8" />

              <p 
                className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed italic"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                {t('guardians.heroSubtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="group relative">
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 via-violet-400/20 to-indigo-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Card */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <h2 
                    className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {t('guardians.introTitle')}
                  </h2>
                  
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {t('guardians.introText')}
                  </p>
                  
                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-purple-100/50 to-transparent rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Floral Guardians Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {t('guardians.floralTitle')}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-purple-400 to-violet-400 mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('guardians.floralText')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
              >
                <div className="group relative h-full">
                  <div className="relative h-full bg-emerald-50/80 backdrop-blur-lg rounded-2xl p-6 lg:p-8 border border-emerald-200 shadow-lg hover:shadow-xl hover:bg-emerald-50 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h3 
                      className="text-xl font-bold text-gray-900 mb-3"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      {t('guardians.individualProtection')}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {t('guardians.individualProtectionDesc')}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="group relative h-full">
                  <div className="relative h-full bg-blue-50/80 backdrop-blur-lg rounded-2xl p-6 lg:p-8 border border-blue-200 shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Flower2 className="w-6 h-6 text-white" />
                    </div>
                    <h3 
                      className="text-xl font-bold text-gray-900 mb-3"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      {t('guardians.nahiaraConnection')}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {t('guardians.nahiaraConnectionDesc')}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Collective Guardians Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {t('guardians.collectiveTitle')}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('guardians.collectiveText')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: t('guardians.greenLegion'),
                  volume: t('guardians.volume1'),
                  description: t('guardians.greenLegionDesc'),
                  gradient: "from-emerald-500 to-green-500",
                  bgColor: "bg-emerald-50",
                  borderColor: "border-emerald-200",
                  icon: Leaf,
                  delay: 0,
                },
                {
                  title: t('guardians.pollinatorGuardians'),
                  volume: t('guardians.volume2'),
                  description: t('guardians.pollinatorGuardiansDesc'),
                  gradient: "from-amber-500 to-orange-500",
                  bgColor: "bg-amber-50",
                  borderColor: "border-amber-200",
                  icon: Flower2,
                  delay: 0.1,
                },
                {
                  title: t('guardians.elementalGuardians'),
                  volume: t('guardians.volume3'),
                  description: t('guardians.elementalGuardiansDesc'),
                  gradient: "from-purple-500 to-violet-500",
                  bgColor: "bg-purple-50",
                  borderColor: "border-purple-200",
                  icon: Zap,
                  delay: 0.2,
                },
              ].map((legion, index) => (
                <motion.div
                  key={legion.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: legion.delay }}
                >
                  <div className="group relative h-full">
                    <div className={`relative h-full ${legion.bgColor} backdrop-blur-lg rounded-2xl p-6 border ${legion.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 text-center`}>
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${legion.gradient} flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <legion.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 
                        className="text-2xl font-bold text-gray-900 mb-2"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        {legion.title}
                      </h3>
                      <p className={`text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r ${legion.gradient} mb-3`}>
                        {legion.volume}
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {legion.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Symbolic Nature Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="group relative">
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-400/20 via-purple-400/20 to-indigo-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Card */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <h2 
                    className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {t('guardians.symbolicTitle')}
                  </h2>
                  
                  <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    {t('guardians.symbolicText')}
                  </p>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { icon: "✨", label: t('guardians.lights'), gradient: "from-yellow-300 to-orange-400" },
                      { icon: "⚡", label: t('guardians.energies'), gradient: "from-blue-300 to-cyan-400" },
                      { icon: "👤", label: t('guardians.silhouettes'), gradient: "from-purple-300 to-pink-400" },
                      { icon: "📝", label: t('guardians.poeticForms'), gradient: "from-green-300 to-emerald-400" },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="text-center"
                      >
                        <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-full mx-auto mb-3 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                          <span className="text-2xl">{item.icon}</span>
                        </div>
                        <h4 className="font-semibold text-gray-800">{item.label}</h4>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-violet-100/50 to-transparent rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Function Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="group relative">
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-violet-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Card */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <h2 
                    className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {t('guardians.functionTitle')}
                  </h2>
                  
                  <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    {t('guardians.functionText')}
                  </p>
                  
                  <div className="space-y-6">
                    {[1, 2, 3, 4].map((num) => (
                      <motion.div
                        key={num}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: (num - 1) * 0.1 }}
                        className="flex items-start space-x-4"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">
                          {num}
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed pt-2">
                          {t(`guardians.function${num}`)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-indigo-100/50 to-transparent rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quote / Call to Action Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative group">
                {/* Animated gradient border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-slow" />
                
                {/* Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/50 shadow-2xl text-center overflow-hidden">
                  {/* Decorative background */}
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 20% 30%, rgba(196, 181, 253, 0.5) 0%, transparent 40%),
                        radial-gradient(circle at 80% 70%, rgba(167, 139, 250, 0.5) 0%, transparent 40%)
                      `,
                    }}
                  />
                  
                  <div className="relative">
                    <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-6" />
                    
                    <blockquote 
                      className="text-xl sm:text-2xl lg:text-3xl text-gray-800 leading-relaxed mb-8 italic"
                      style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                    >
                      &ldquo;{t('guardians.heroSubtitle')}&rdquo;
                    </blockquote>
                    
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                      <Shield className="w-5 h-5 text-purple-400" />
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    </div>
                    
                    <a
                      href="/flowers"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full shadow-lg hover:bg-gray-800 hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <span>{t('guardians.exploreFlowers') || "Explore Flowers"}</span>
                      <Globe2 className="w-5 h-5" />
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

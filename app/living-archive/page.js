"use client";

import { motion } from "motion/react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { 
  Globe2, 
  Sparkles, 
  BookOpen,
  Archive,
  Gamepad2,
  Flower2,
  Bug,
  Shield,
  Download,
  Star,
  Library,
  PlayCircle
} from "lucide-react";
import { useTranslation } from "../../lib/useTranslation";
import Link from "next/link";

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
          <stop offset="0%" stopColor="rgba(251, 191, 36, 0.3)" />
          <stop offset="50%" stopColor="rgba(249, 115, 22, 0.2)" />
          <stop offset="100%" stopColor="rgba(239, 68, 68, 0.3)" />
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
        <circle cx="60" cy="60" r="8" fill="rgba(251, 191, 36, 0.4)"/>
      </g>
    </svg>
  </motion.div>
);

// Glowing orb decoration
const GlowingOrb = ({ className, color = "amber", delay = 0, size = "md" }) => {
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-64 h-64",
    xl: "w-96 h-96",
  };
  
  const colorClasses = {
    amber: "from-amber-400/20 via-orange-300/10 to-transparent",
    orange: "from-orange-400/20 via-amber-300/10 to-transparent",
    red: "from-red-400/20 via-orange-300/10 to-transparent",
    yellow: "from-yellow-400/20 via-amber-300/10 to-transparent",
    rainbow: "from-amber-400/15 via-orange-400/15 to-red-400/15",
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

// Book collection data
const getBookCollections = (t) => [
  {
    icon: BookOpen,
    title: t('livingArchive.illustratedBooks'),
    description: t('livingArchive.illustratedBooksDesc'),
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    delay: 0,
    cta: t('livingArchive.viewAll'),
  },
  {
    icon: Library,
    title: t('livingArchive.bookCollection'),
    description: t('livingArchive.bookCollectionDesc'),
    gradient: "from-emerald-500 to-green-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    delay: 0.1,
    cta: t('livingArchive.exploreCollection'),
  },
];

// Game collection data
const getGameCollections = (t) => [
  {
    icon: Gamepad2,
    title: t('livingArchive.digitalCardGame'),
    description: t('livingArchive.digitalCardGameDesc'),
    gradient: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    delay: 0,
    cta: t('livingArchive.playGame'),
  },
  {
    icon: Star,
    title: t('livingArchive.gameFeatures'),
    description: t('livingArchive.gameFeaturesDesc'),
    gradient: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    delay: 0.1,
    cta: t('livingArchive.learnMore'),
  },
];

// Archive features data
const getArchiveFeatures = (t) => [
  {
    icon: Flower2,
    title: t('livingArchive.flowersArchive'),
    description: t('livingArchive.flowersArchiveDesc'),
    gradient: "from-pink-500 to-rose-500",
    delay: 0,
  },
  {
    icon: Bug,
    title: t('livingArchive.pollinatorsArchive'),
    description: t('livingArchive.pollinatorsArchiveDesc'),
    gradient: "from-blue-500 to-cyan-500",
    delay: 0.1,
  },
  {
    icon: Shield,
    title: t('livingArchive.guardiansArchive'),
    description: t('livingArchive.guardiansArchiveDesc'),
    gradient: "from-purple-500 to-violet-500",
    delay: 0.2,
  },
];

export default function LivingArchivePage() {
  const { t, isLoading } = useTranslation();
  
  // Get translated data
  const bookCollections = getBookCollections(t);
  const gameCollections = getGameCollections(t);
  const archiveFeatures = getArchiveFeatures(t);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
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
              radial-gradient(ellipse 80% 50% at 20% 20%, rgba(251, 191, 36, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 30%, rgba(249, 115, 22, 0.35) 0%, transparent 50%),
              radial-gradient(ellipse 70% 50% at 50% 80%, rgba(239, 68, 68, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse 50% 30% at 10% 60%, rgba(245, 158, 11, 0.25) 0%, transparent 50%)
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
                rgba(251, 191, 36, 0.1) 10%,
                rgba(249, 115, 22, 0.1) 15%,
                rgba(239, 68, 68, 0.1) 20%,
                rgba(245, 158, 11, 0.1) 25%,
                rgba(251, 191, 36, 0.1) 30%
              )
            `,
            backgroundSize: '300% 200%',
          }}
        />
      </div>

      {/* Decorative elements */}
      <GlowingOrb className="top-20 -right-20" color="amber" delay={0.2} size="xl" />
      <GlowingOrb className="top-1/3 -left-32" color="orange" delay={0.4} size="lg" />
      <GlowingOrb className="bottom-1/4 right-10" color="amber" delay={0.6} size="md" />
      <GlowingOrb className="bottom-40 left-1/4" color="red" delay={0.8} size="lg" />
      
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
                <Archive className="w-5 h-5 text-amber-400" />
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>

              <h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {t('livingArchive.pageTitle')}
              </h1>

              {/* Separator */}
              <div className="w-24 h-px bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 mx-auto mb-8" />

              <p 
                className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed italic"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                {t('livingArchive.heroSubtitle')}
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
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-red-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Card */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <h2 
                    className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {t('livingArchive.introTitle')}
                  </h2>
                  
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {t('livingArchive.introText')}
                  </p>
                  
                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-amber-100/50 to-transparent rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Book Section */}
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
                {t('livingArchive.booksTitle')}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('livingArchive.booksSubtitle')}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
              {bookCollections.map((book, index) => (
                <motion.div
                  key={book.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: book.delay }}
                >
                  <div className="group relative h-full">
                    {/* Frosted glass card */}
                    <div className={`relative h-full ${book.bgColor} backdrop-blur-lg rounded-2xl p-8 border ${book.borderColor} shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300 text-center`}>
                      {/* Icon */}
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${book.gradient} flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <book.icon className="w-10 h-10 text-white" />
                      </div>
                      
                      <h3 
                        className="text-2xl font-bold text-gray-900 mb-4"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        {book.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {book.description}
                      </p>
                      
                      <button className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br ${book.gradient} text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300`}>
                        <Download className="w-5 h-5" />
                        <span>{book.cta}</span>
                      </button>
                      
                      {/* Subtle gradient line */}
                      <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${book.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* The Digital Card Game Section */}
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
                {t('livingArchive.gamesTitle')}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-purple-400 to-violet-400 mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('livingArchive.gamesSubtitle')}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
              {gameCollections.map((game, index) => (
                <motion.div
                  key={game.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: game.delay }}
                >
                  <div className="group relative h-full">
                    {/* Frosted glass card */}
                    <div className={`relative h-full ${game.bgColor} backdrop-blur-lg rounded-2xl p-8 border ${game.borderColor} shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300 text-center`}>
                      {/* Icon */}
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${game.gradient} flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <game.icon className="w-10 h-10 text-white" />
                      </div>
                      
                      <h3 
                        className="text-2xl font-bold text-gray-900 mb-4"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        {game.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {game.description}
                      </p>
                      
                      <button className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br ${game.gradient} text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300`}>
                        <PlayCircle className="w-5 h-5" />
                        <span>{game.cta}</span>
                      </button>
                      
                      {/* Subtle gradient line */}
                      <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${game.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Archive Features Section */}
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
                {t('livingArchive.featuresTitle')}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-pink-400 to-rose-400 mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('livingArchive.featuresSubtitle')}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
              {archiveFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: feature.delay }}
                >
                  <div className="group relative h-full">
                    {/* Frosted glass card */}
                    <div className="relative h-full bg-white/70 backdrop-blur-lg rounded-2xl p-6 lg:p-8 border border-white/50 shadow-lg hover:shadow-xl hover:bg-white/90 transition-all duration-300 text-center">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 
                        className="text-xl font-bold text-gray-900 mb-3"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {feature.description}
                      </p>
                      
                      {/* Subtle gradient line */}
                      <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
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
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-slow" />
                
                {/* Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/50 shadow-2xl text-center overflow-hidden">
                  {/* Decorative background */}
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 20% 30%, rgba(251, 191, 36, 0.5) 0%, transparent 40%),
                        radial-gradient(circle at 80% 70%, rgba(249, 115, 22, 0.5) 0%, transparent 40%)
                      `,
                    }}
                  />
                  
                  <div className="relative">
                    <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-6" />
                    
                    <h2 
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      {t('livingArchive.ctaTitle')}
                    </h2>
                    
                    <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed">
                      {t('livingArchive.ctaText')}
                    </p>
                    
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                      <Archive className="w-5 h-5 text-amber-400" />
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        href="/flowers"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full shadow-lg hover:bg-gray-800 hover:shadow-xl hover:scale-105 transition-all duration-300"
                      >
                        <Globe2 className="w-5 h-5" />
                        <span>{t('livingArchive.exploreArchive')}</span>
                      </Link>
                      <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-full shadow-lg border-2 border-gray-200 hover:bg-gray-50 hover:shadow-xl hover:scale-105 transition-all duration-300"
                      >
                        <Gamepad2 className="w-5 h-5" />
                        <span>{t('livingArchive.playGame')}</span>
                      </Link>
                    </div>
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

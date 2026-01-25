"use client";

import { motion } from "motion/react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { 
  Globe2, 
  Sparkles, 
  GraduationCap,
  BookOpen,
  Users,
  Heart,
  Target,
  Zap,
  Shield,
  TrendingUp,
  Award,
  CheckCircle2,
  BarChart3,
  Eye
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
          <stop offset="0%" stopColor="rgba(16, 185, 129, 0.3)" />
          <stop offset="50%" stopColor="rgba(5, 150, 105, 0.2)" />
          <stop offset="100%" stopColor="rgba(34, 197, 94, 0.3)" />
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
        <circle cx="60" cy="60" r="8" fill="rgba(16, 185, 129, 0.4)"/>
      </g>
    </svg>
  </motion.div>
);

// Glowing orb decoration
const GlowingOrb = ({ className, color = "emerald", delay = 0, size = "md" }) => {
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-64 h-64",
    xl: "w-96 h-96",
  };
  
  const colorClasses = {
    emerald: "from-emerald-400/20 via-green-300/10 to-transparent",
    green: "from-green-400/20 via-emerald-300/10 to-transparent",
    lime: "from-lime-400/20 via-green-300/10 to-transparent",
    teal: "from-teal-400/20 via-cyan-300/10 to-transparent",
    cyan: "from-cyan-400/20 via-blue-300/10 to-transparent",
    rainbow: "from-emerald-400/15 via-green-400/15 to-lime-400/15",
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

// Educational impact data
const getEducationalImpact = (t) => [
  {
    icon: BookOpen,
    title: t('impact.learningResources'),
    description: t('impact.learningResourcesDesc'),
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    delay: 0,
  },
  {
    icon: Globe2,
    title: t('impact.globalAccess'),
    description: t('impact.globalAccessDesc'),
    gradient: "from-emerald-500 to-green-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    delay: 0.1,
  },
  {
    icon: Target,
    title: t('impact.integration'),
    description: t('impact.integrationDesc'),
    gradient: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    delay: 0.2,
  },
];

// Social impact data
const getSocialImpact = (t) => [
  {
    icon: Heart,
    title: t('impact.floralEconomy'),
    description: t('impact.floralEconomyDesc'),
    gradient: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    delay: 0,
  },
  {
    icon: Sparkles,
    title: t('impact.sharedBeauty'),
    description: t('impact.sharedBeautyDesc'),
    gradient: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    delay: 0.1,
  },
  {
    icon: Users,
    title: t('impact.globalNetwork'),
    description: t('impact.globalNetworkDesc'),
    gradient: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    delay: 0.2,
  },
];

// Cultural impact data
const getCulturalImpact = (t) => [
  {
    icon: Award,
    title: t('impact.digitalMuseum'),
    description: t('impact.digitalMuseumDesc'),
    gradient: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    delay: 0,
  },
  {
    icon: Sparkles,
    title: t('impact.symbolicNarratives'),
    description: t('impact.symbolicNarrativesDesc'),
    gradient: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    delay: 0.1,
  },
];

// Scientific impact data
const getScientificImpact = (t) => [
  {
    icon: Globe2,
    title: t('impact.globalArchive'),
    description: t('impact.globalArchiveDesc'),
    gradient: "from-emerald-500 to-green-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    delay: 0,
  },
  {
    icon: Zap,
    title: t('impact.originalDevelopments'),
    description: t('impact.originalDevelopmentsDesc'),
    gradient: "from-lime-500 to-yellow-500",
    bgColor: "bg-lime-50",
    borderColor: "border-lime-200",
    delay: 0.1,
    items: [
      t('impact.nahiaraMeasure'),
      t('impact.araihanMeasure'),
      t('impact.pfnoProtocol'),
      t('impact.sanCode'),
    ],
  },
  {
    icon: Shield,
    title: t('impact.conservation'),
    description: t('impact.conservationDesc'),
    gradient: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    delay: 0.2,
  },
];

// Transparency metrics data
const getTransparencyMetrics = (t) => [
  { number: "1", text: t('impact.fundsRaised') },
  { number: "2", text: t('impact.booksDonated') },
  { number: "3", text: t('impact.resourcesDeveloped') },
  { number: "4", text: t('impact.communitiesSupported') },
];

export default function ImpactPage() {
  const { t, isLoading } = useTranslation();
  
  // Get translated data
  const educationalImpact = getEducationalImpact(t);
  const socialImpact = getSocialImpact(t);
  const culturalImpact = getCulturalImpact(t);
  const scientificImpact = getScientificImpact(t);
  const transparencyMetrics = getTransparencyMetrics(t);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
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
              radial-gradient(ellipse 80% 50% at 20% 20%, rgba(16, 185, 129, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 30%, rgba(5, 150, 105, 0.35) 0%, transparent 50%),
              radial-gradient(ellipse 70% 50% at 50% 80%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse 50% 30% at 10% 60%, rgba(20, 184, 166, 0.25) 0%, transparent 50%)
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
                rgba(16, 185, 129, 0.1) 10%,
                rgba(5, 150, 105, 0.1) 15%,
                rgba(34, 197, 94, 0.1) 20%,
                rgba(20, 184, 166, 0.1) 25%,
                rgba(16, 185, 129, 0.1) 30%
              )
            `,
            backgroundSize: '300% 200%',
          }}
        />
      </div>

      {/* Decorative elements */}
      <GlowingOrb className="top-20 -right-20" color="emerald" delay={0.2} size="xl" />
      <GlowingOrb className="top-1/3 -left-32" color="green" delay={0.4} size="lg" />
      <GlowingOrb className="bottom-1/4 right-10" color="emerald" delay={0.6} size="md" />
      <GlowingOrb className="bottom-40 left-1/4" color="lime" delay={0.8} size="lg" />
      
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
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>

              <h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {t('impact.pageTitle')}
              </h1>

              {/* Separator */}
              <div className="w-24 h-px bg-gradient-to-r from-emerald-400 via-green-400 to-lime-400 mx-auto mb-8" />

              <p 
                className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed italic"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                {t('impact.heroSubtitle')}
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
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 via-green-400/20 to-lime-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Card */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <h2 
                    className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {t('impact.introTitle')}
                  </h2>
                  
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {t('impact.introText')}
                  </p>
                  
                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-emerald-100/50 to-transparent rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Educational Impact Section */}
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
                {t('impact.educationalImpact')}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto mb-6" />
            </motion.div>

            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
              {educationalImpact.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: item.delay }}
                >
                  <div className="group relative h-full">
                    {/* Frosted glass card */}
                    <div className={`relative h-full ${item.bgColor} backdrop-blur-lg rounded-2xl p-6 lg:p-8 border ${item.borderColor} shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300`}>
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 
                        className="text-xl font-bold text-gray-900 mb-3"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                      
                      {/* Subtle gradient line */}
                      <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Impact Section */}
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
                {t('impact.socialImpact')}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-amber-400 to-orange-400 mx-auto mb-6" />
            </motion.div>

            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
              {socialImpact.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: item.delay }}
                >
                  <div className="group relative h-full">
                    {/* Frosted glass card */}
                    <div className={`relative h-full ${item.bgColor} backdrop-blur-lg rounded-2xl p-6 lg:p-8 border ${item.borderColor} shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300`}>
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 
                        className="text-xl font-bold text-gray-900 mb-3"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                      
                      {/* Subtle gradient line */}
                      <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Cultural Impact Section */}
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
                {t('impact.culturalImpact')}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-violet-400 to-purple-400 mx-auto mb-6" />
            </motion.div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
              {culturalImpact.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: item.delay }}
                >
                  <div className="group relative h-full">
                    {/* Frosted glass card */}
                    <div className={`relative h-full ${item.bgColor} backdrop-blur-lg rounded-2xl p-6 lg:p-8 border ${item.borderColor} shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300`}>
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 
                        className="text-xl font-bold text-gray-900 mb-3"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                      
                      {/* Subtle gradient line */}
                      <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Scientific Impact Section */}
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
                {t('impact.scientificImpact')}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-emerald-400 to-green-400 mx-auto mb-6" />
            </motion.div>

            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
              {scientificImpact.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: item.delay }}
                >
                  <div className="group relative h-full">
                    {/* Frosted glass card */}
                    <div className={`relative h-full ${item.bgColor} backdrop-blur-lg rounded-2xl p-6 lg:p-8 border ${item.borderColor} shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300`}>
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 
                        className="text-xl font-bold text-gray-900 mb-3"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {item.description}
                      </p>
                      
                      {/* List items for original developments */}
                      {item.items && (
                        <ul className="space-y-2 text-gray-600">
                          {item.items.map((listItem, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="font-semibold mr-2 text-gray-700">{idx + 1}.</span>
                              <span>{listItem}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      {/* Subtle gradient line */}
                      <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Transparency Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="group relative mb-8">
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 via-green-400/20 to-lime-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Card */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <h2 
                    className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {t('impact.transparencyTitle')}
                  </h2>
                  
                  <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    {t('impact.transparencyText')}
                  </p>
                  
                  {/* Annual Reports */}
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-200 mb-8">
                    <h3 
                      className="text-2xl font-bold text-gray-900 mb-6"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      {t('impact.annualReports')}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {transparencyMetrics.map((metric, idx) => (
                        <div key={idx} className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1 shadow-md">
                            {metric.number}
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-2">{metric.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Traceability and Ethical Commitment */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 shadow-md">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                      <h3 
                        className="text-xl font-bold text-gray-900 mb-3"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        {t('impact.traceability')}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {t('impact.traceabilityDesc')}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center mb-4 shadow-md">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <h3 
                        className="text-xl font-bold text-gray-900 mb-3"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        {t('impact.ethicalCommitment')}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {t('impact.ethicalCommitmentDesc')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-emerald-100/50 to-transparent rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Conclusion / Call to Action Section */}
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
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-green-400 to-lime-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-slow" />
                
                {/* Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/50 shadow-2xl text-center overflow-hidden">
                  {/* Decorative background */}
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.5) 0%, transparent 40%),
                        radial-gradient(circle at 80% 70%, rgba(5, 150, 105, 0.5) 0%, transparent 40%)
                      `,
                    }}
                  />
                  
                  <div className="relative">
                    <BarChart3 className="w-8 h-8 text-emerald-400 mx-auto mb-6" />
                    
                    <h2 
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      {t('impact.conclusionTitle')}
                    </h2>
                    
                    <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                      {t('impact.conclusionText')}
                    </p>
                    
                    <div className="flex items-center justify-center gap-4 mt-8">
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
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

"use client";

import { motion } from "motion/react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { 
  Globe2, 
  Sparkles, 
  BookOpen,
  GraduationCap,
  Users,
  Download,
  Lightbulb,
  Heart,
  Target,
  Zap
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
        <circle cx="60" cy="60" r="8" fill="rgba(20, 184, 166, 0.4)"/>
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
    cyan: "from-cyan-400/20 via-blue-300/10 to-transparent",
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

// Learning resources data
const getLearningResources = (t) => [
  {
    icon: BookOpen,
    title: t('education.digitalLibrary'),
    description: t('education.digitalLibraryDesc'),
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    delay: 0,
  },
  {
    icon: Zap,
    title: t('education.interactiveTools'),
    description: t('education.interactiveToolsDesc'),
    gradient: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    delay: 0.1,
  },
  {
    icon: Target,
    title: t('education.nahiaraMeasurement'),
    description: t('education.nahiaraMeasurementDesc'),
    gradient: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    delay: 0.2,
  },
  {
    icon: Heart,
    title: t('education.floralEconomy'),
    description: t('education.floralEconomyDesc'),
    gradient: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    delay: 0.3,
  },
];

// Community features data
const getCommunityFeatures = (t) => [
  {
    icon: Users,
    title: t('education.floralAmbassadors'),
    description: t('education.floralAmbassadorsDesc'),
    gradient: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    delay: 0,
  },
  {
    icon: Globe2,
    title: t('education.globalGarden'),
    description: t('education.globalGardenDesc'),
    gradient: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    delay: 0.1,
  },
  {
    icon: Sparkles,
    title: t('education.collectiveGuardians'),
    description: t('education.collectiveGuardiansDesc'),
    gradient: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    delay: 0.2,
  },
  {
    icon: Lightbulb,
    title: t('education.communityEvents'),
    description: t('education.communityEventsDesc'),
    gradient: "from-yellow-500 to-amber-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    delay: 0.3,
  },
];

export default function EducationPage() {
  const { t, isLoading } = useTranslation();
  
  // Get translated data
  const learningResources = getLearningResources(t);
  const communityFeatures = getCommunityFeatures(t);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
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
              radial-gradient(ellipse 80% 50% at 20% 20%, rgba(20, 184, 166, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 30%, rgba(6, 182, 212, 0.35) 0%, transparent 50%),
              radial-gradient(ellipse 70% 50% at 50% 80%, rgba(14, 165, 233, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse 50% 30% at 10% 60%, rgba(59, 130, 246, 0.25) 0%, transparent 50%)
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
                rgba(20, 184, 166, 0.1) 10%,
                rgba(6, 182, 212, 0.1) 15%,
                rgba(14, 165, 233, 0.1) 20%,
                rgba(59, 130, 246, 0.1) 25%,
                rgba(20, 184, 166, 0.1) 30%
              )
            `,
            backgroundSize: '300% 200%',
          }}
        />
      </div>

      {/* Decorative elements */}
      <GlowingOrb className="top-20 -right-20" color="teal" delay={0.2} size="xl" />
      <GlowingOrb className="top-1/3 -left-32" color="cyan" delay={0.4} size="lg" />
      <GlowingOrb className="bottom-1/4 right-10" color="teal" delay={0.6} size="md" />
      <GlowingOrb className="bottom-40 left-1/4" color="cyan" delay={0.8} size="lg" />
      
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
                <GraduationCap className="w-5 h-5 text-teal-400" />
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>

              <h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {t('education.pageTitle')}
              </h1>

              {/* Separator */}
              <div className="w-24 h-px bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 mx-auto mb-8" />

              <p 
                className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed italic"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                {t('education.heroSubtitle')}
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
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-400/20 via-cyan-400/20 to-blue-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Card */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <h2 
                    className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {t('education.introTitle')}
                  </h2>
                  
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {t('education.introText')}
                  </p>
                  
                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-teal-100/50 to-transparent rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Learning Resources Section */}
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
                {t('education.resourcesTitle')}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-teal-400 to-cyan-400 mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('education.resourcesSubtitle') || "Discover tools and materials to deepen your understanding of biodiversity"}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
              {learningResources.map((resource, index) => (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: resource.delay }}
                >
                  <div className="group relative h-full">
                    {/* Frosted glass card */}
                    <div className={`relative h-full ${resource.bgColor} backdrop-blur-lg rounded-2xl p-6 lg:p-8 border ${resource.borderColor} shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300`}>
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${resource.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <resource.icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 
                        className="text-xl font-bold text-gray-900 mb-3"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        {resource.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {resource.description}
                      </p>
                      
                      {/* Subtle gradient line */}
                      <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${resource.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Section */}
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
                {t('education.communityTitle')}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('education.communitySubtitle') || "Join a global network of learners, creators, and protectors"}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
              {communityFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: feature.delay }}
                >
                  <div className="group relative h-full">
                    {/* Frosted glass card */}
                    <div className={`relative h-full ${feature.bgColor} backdrop-blur-lg rounded-2xl p-6 lg:p-8 border ${feature.borderColor} shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300`}>
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 
                        className="text-xl font-bold text-gray-900 mb-3"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed">
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

        {/* Purpose Section */}
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
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 via-teal-400/20 to-blue-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Card */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 text-center">
                  <h2 
                    className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {t('education.purposeTitle')}
                  </h2>
                  
                  <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-4xl mx-auto italic" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
                    {t('education.purposeText')}
                  </p>
                  
                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-cyan-100/50 to-transparent rounded-full" />
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
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-slow" />
                
                {/* Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/50 shadow-2xl text-center overflow-hidden">
                  {/* Decorative background */}
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 20% 30%, rgba(20, 184, 166, 0.5) 0%, transparent 40%),
                        radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.5) 0%, transparent 40%)
                      `,
                    }}
                  />
                  
                  <div className="relative">
                    <Sparkles className="w-8 h-8 text-teal-400 mx-auto mb-6" />
                    
                    <h2 
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      {t('education.joinCommunity')}
                    </h2>
                    
                    <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed">
                      {t('education.joinCommunityText')}
                    </p>
                    
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                      <GraduationCap className="w-5 h-5 text-teal-400" />
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        href="/living-archive"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full shadow-lg hover:bg-gray-800 hover:shadow-xl hover:scale-105 transition-all duration-300"
                      >
                        <Download className="w-5 h-5" />
                        <span>{t('education.exploreResources')}</span>
                      </Link>
                      <Link
                        href="/guardians"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-full shadow-lg border-2 border-gray-200 hover:bg-gray-50 hover:shadow-xl hover:scale-105 transition-all duration-300"
                      >
                        <Users className="w-5 h-5" />
                        <span>{t('education.joinCommunityBtn')}</span>
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

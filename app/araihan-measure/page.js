"use client";

import { motion } from "motion/react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { 
  Globe2, 
  Sparkles, 
  TrendingUp,
  Target,
  BarChart3,
  Shield,
  Flower2,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowLeft
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
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
          <stop offset="50%" stopColor="rgba(99, 102, 241, 0.2)" />
          <stop offset="100%" stopColor="rgba(139, 92, 246, 0.3)" />
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
        <circle cx="60" cy="60" r="8" fill="rgba(59, 130, 246, 0.4)"/>
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
    indigo: "from-indigo-400/20 via-blue-300/10 to-transparent",
    purple: "from-purple-400/20 via-violet-300/10 to-transparent",
    violet: "from-violet-400/20 via-purple-300/10 to-transparent",
    rainbow: "from-blue-400/15 via-indigo-400/15 to-purple-400/15",
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

// Key features data
const getKeyFeatures = (t) => [
  {
    icon: Target,
    title: t('araihanMeasure.purpose'),
    description: t('araihanMeasure.purposeDesc'),
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    delay: 0,
  },
  {
    icon: BarChart3,
    title: t('araihanMeasure.methodology'),
    description: t('araihanMeasure.methodologyDesc'),
    gradient: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    delay: 0.1,
  },
  {
    icon: Shield,
    title: t('araihanMeasure.protection'),
    description: t('araihanMeasure.protectionDesc'),
    gradient: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    delay: 0.2,
  },
];

// Benefits data
const getBenefits = (t) => [
  {
    icon: CheckCircle2,
    title: t('araihanMeasure.benefit1'),
    description: t('araihanMeasure.benefit1Desc'),
    delay: 0,
  },
  {
    icon: CheckCircle2,
    title: t('araihanMeasure.benefit2'),
    description: t('araihanMeasure.benefit2Desc'),
    delay: 0.1,
  },
  {
    icon: CheckCircle2,
    title: t('araihanMeasure.benefit3'),
    description: t('araihanMeasure.benefit3Desc'),
    delay: 0.2,
  },
  {
    icon: CheckCircle2,
    title: t('araihanMeasure.benefit4'),
    description: t('araihanMeasure.benefit4Desc'),
    delay: 0.3,
  },
];

export default function AraihanMeasurePage() {
  const { t, isLoading } = useTranslation();
  
  // Get translated data
  const keyFeatures = getKeyFeatures(t);
  const benefits = getBenefits(t);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
              radial-gradient(ellipse 80% 50% at 20% 20%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 30%, rgba(99, 102, 241, 0.35) 0%, transparent 50%),
              radial-gradient(ellipse 70% 50% at 50% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse 50% 30% at 10% 60%, rgba(79, 70, 229, 0.25) 0%, transparent 50%)
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
                rgba(59, 130, 246, 0.1) 10%,
                rgba(99, 102, 241, 0.1) 15%,
                rgba(139, 92, 246, 0.1) 20%,
                rgba(79, 70, 229, 0.1) 25%,
                rgba(59, 130, 246, 0.1) 30%
              )
            `,
            backgroundSize: '300% 200%',
          }}
        />
      </div>

      {/* Decorative elements */}
      <GlowingOrb className="top-20 -right-20" color="blue" delay={0.2} size="xl" />
      <GlowingOrb className="top-1/3 -left-32" color="indigo" delay={0.4} size="lg" />
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
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>

              <h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {t('araihanMeasure.pageTitle')}
              </h1>

              {/* Separator */}
              <div className="w-24 h-px bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mx-auto mb-8" />

              <p 
                className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed italic"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                {t('araihanMeasure.heroSubtitle')}
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
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Card */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <h2 
                    className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {t('araihanMeasure.introTitle')}
                  </h2>
                  
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {t('araihanMeasure.introText')}
                  </p>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-start gap-4">
                      <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <p className="text-gray-700 leading-relaxed">
                        {t('araihanMeasure.introNote')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Key Features Section */}
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
                {t('araihanMeasure.featuresTitle')}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('araihanMeasure.featuresSubtitle')}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
              {keyFeatures.map((feature, index) => (
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

        {/* Benefits Section */}
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
                {t('araihanMeasure.benefitsTitle')}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('araihanMeasure.benefitsSubtitle')}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: benefit.delay }}
                >
                  <div className="group relative h-full">
                    {/* Frosted glass card */}
                    <div className="relative h-full bg-white/70 backdrop-blur-lg rounded-2xl p-6 lg:p-8 border border-white/50 shadow-lg hover:shadow-xl hover:bg-white/90 transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md">
                          <benefit.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 
                            className="text-xl font-bold text-gray-900 mb-2"
                            style={{ fontFamily: '"Cormorant Garamond", serif' }}
                          >
                            {benefit.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
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
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 via-violet-400/20 to-indigo-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Card */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <h2 
                    className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {t('araihanMeasure.howItWorksTitle')}
                  </h2>
                  
                  <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    {t('araihanMeasure.howItWorksText')}
                  </p>

                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="flex items-start gap-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">
                          {step}
                        </div>
                        <p className="text-gray-700 leading-relaxed pt-1">
                          {t(`araihanMeasure.step${step}`)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-purple-100/50 to-transparent rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
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
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-slow" />
                
                {/* Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/50 shadow-2xl text-center overflow-hidden">
                  {/* Decorative background */}
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.5) 0%, transparent 40%),
                        radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.5) 0%, transparent 40%)
                      `,
                    }}
                  />
                  
                  <div className="relative">
                    <Zap className="w-8 h-8 text-blue-400 mx-auto mb-6" />
                    
                    <h2 
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      {t('araihanMeasure.ctaTitle')}
                    </h2>
                    
                    <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed">
                      {t('araihanMeasure.ctaText')}
                    </p>
                    
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                      <Flower2 className="w-5 h-5 text-blue-400" />
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        href="/flowers"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full shadow-lg hover:bg-gray-800 hover:shadow-xl hover:scale-105 transition-all duration-300"
                      >
                        <Globe2 className="w-5 h-5" />
                        <span>{t('araihanMeasure.exploreFlowers')}</span>
                      </Link>
                      <Link
                        href="/impact"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-full shadow-lg border-2 border-gray-200 hover:bg-gray-50 hover:shadow-xl hover:scale-105 transition-all duration-300"
                      >
                        <BarChart3 className="w-5 h-5" />
                        <span>{t('araihanMeasure.learnMore')}</span>
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

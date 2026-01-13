"use client";

import { motion } from "motion/react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { 
  Flower2, 
  Globe2, 
  Heart, 
  Sparkles, 
  Users, 
  Leaf, 
  BookOpen,
  Target,
  Eye,
  Shield,
  Lightbulb,
  TreePine
} from "lucide-react";
import { useTranslation } from "../../lib/useTranslation";

// Team member data with translation keys
const getTeamMembers = (t) => [
  {
    name: t('about.founderRole'),
    role: t('about.creativeDirector'),
    description: t('about.founderDesc'),
    icon: Flower2,
    gradient: "from-rose-400 to-pink-500",
  },
  {
    name: t('about.environmentalLead'),
    role: t('about.conservationSpecialist'),
    description: t('about.environmentalDesc'),
    icon: Leaf,
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    name: t('about.educationDirector'),
    role: t('about.learningDesigner'),
    description: t('about.educationDesc'),
    icon: BookOpen,
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    name: t('about.communityManager'),
    role: t('about.outreachCoordinator'),
    description: t('about.communityDesc'),
    icon: Users,
    gradient: "from-violet-400 to-purple-500",
  },
];

// Core values data with translation keys
const getCoreValues = (t) => [
  {
    icon: Heart,
    title: t('about.passionForNature'),
    description: t('about.passionDesc'),
    color: "text-rose-500",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
  },
  {
    icon: Globe2,
    title: t('about.globalUnity'),
    description: t('about.globalUnityDesc'),
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    icon: Lightbulb,
    title: t('about.innovation'),
    description: t('about.innovationDesc'),
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    icon: Shield,
    title: t('about.preservation'),
    description: t('about.preservationDesc'),
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
];

// Timeline milestones with translation keys
const getMilestones = (t) => [
  {
    year: t('about.origin'),
    title: t('about.originTitle'),
    description: t('about.originDesc'),
    icon: Sparkles,
  },
  {
    year: t('about.growth'),
    title: t('about.growthTitle'),
    description: t('about.growthDesc'),
    icon: TreePine,
  },
  {
    year: t('about.bloom'),
    title: t('about.bloomTitle'),
    description: t('about.bloomDesc'),
    icon: Flower2,
  },
  {
    year: t('about.future'),
    title: t('about.futureTitle'),
    description: t('about.futureDesc'),
    icon: Globe2,
  },
];

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
        <circle cx="60" cy="60" r="8" fill="rgba(251, 191, 36, 0.4)"/>
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

export default function AboutPage() {
  const { t, isLoading } = useTranslation();
  
  // Get translated data
  const teamMembers = getTeamMembers(t);
  const coreValues = getCoreValues(t);
  const milestones = getMilestones(t);

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
              radial-gradient(ellipse 80% 50% at 20% 20%, rgba(147, 197, 253, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 30%, rgba(196, 181, 253, 0.35) 0%, transparent 50%),
              radial-gradient(ellipse 70% 50% at 50% 80%, rgba(249, 168, 212, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse 50% 30% at 10% 60%, rgba(167, 243, 208, 0.25) 0%, transparent 50%)
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
                rgba(165, 180, 252, 0.1) 15%,
                rgba(147, 197, 253, 0.1) 20%,
                rgba(221, 214, 254, 0.1) 25%,
                rgba(96, 165, 250, 0.1) 30%
              )
            `,
            backgroundSize: '300% 200%',
          }}
        />
      </div>

      {/* Decorative elements */}
      <GlowingOrb className="top-20 -right-20" color="purple" delay={0.2} size="xl" />
      <GlowingOrb className="top-1/3 -left-32" color="blue" delay={0.4} size="lg" />
      <GlowingOrb className="bottom-1/4 right-10" color="pink" delay={0.6} size="md" />
      <GlowingOrb className="bottom-40 left-1/4" color="teal" delay={0.8} size="lg" />
      
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
                <Flower2 className="w-5 h-5 text-purple-400" />
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>

              <h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {t('about.heroTitle')}
              </h1>

              {/* Separator */}
              <div className="w-24 h-px bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mx-auto mb-8" />

              <p 
                className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed italic"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                {t('about.heroSubtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Mission Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="group relative h-full">
                  {/* Glow effect on hover */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Card */}
                  <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                    <h2 
                      className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      {t('about.missionTitle')}
                    </h2>
                    
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      {t('about.missionText')}
                    </p>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {t('about.missionText2')}
                    </p>
                    
                    {/* Decorative corner element */}
                    <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                      <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Vision Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                <div className="group relative h-full">
                  {/* Glow effect on hover */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-rose-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Card */}
                  <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                    <h2 
                      className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      {t('about.visionTitle')}
                    </h2>
                    
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      {t('about.visionText')}
                    </p>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {t('about.visionText2')}
                    </p>
                    
                    {/* Decorative corner element */}
                    <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                      <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-purple-100/50 to-transparent rounded-full" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Purpose Section - What We Do */}
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
                {t('about.purposeTitle')}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('about.purposeSubtitle')}
              </p>
            </motion.div>

            {/* Purpose Cards Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: Globe2,
                  title: t('about.universalArchive'),
                  description: t('about.universalArchiveDesc'),
                  gradient: "from-blue-500 to-cyan-500",
                  delay: 0,
                },
                {
                  icon: BookOpen,
                  title: t('about.environmentalEducation'),
                  description: t('about.environmentalEducationDesc'),
                  gradient: "from-emerald-500 to-teal-500",
                  delay: 0.1,
                },
                {
                  icon: Users,
                  title: t('about.globalCommunity'),
                  description: t('about.globalCommunityDesc'),
                  gradient: "from-purple-500 to-pink-500",
                  delay: 0.2,
                },
                {
                  icon: Heart,
                  title: t('about.positiveImpact'),
                  description: t('about.positiveImpactDesc'),
                  gradient: "from-rose-500 to-orange-500",
                  delay: 0.3,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: item.delay }}
                >
                  <div className="group relative h-full">
                    {/* Frosted glass card */}
                    <div className="relative h-full bg-white/60 backdrop-blur-lg rounded-2xl p-6 lg:p-8 border border-white/40 shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300">
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

        {/* Core Values Section */}
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
                {t('about.coreValuesTitle')}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('about.coreValuesSubtitle')}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="group relative h-full">
                    <div className={`relative h-full ${value.bgColor} backdrop-blur-sm rounded-2xl p-6 border ${value.borderColor} hover:shadow-lg transition-all duration-300`}>
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-full ${value.bgColor} border ${value.borderColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <value.icon className={`w-6 h-6 ${value.color}`} />
                      </div>
                      
                      <h3 
                        className="text-lg font-bold text-gray-900 mb-2"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        {value.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Journey Timeline Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-5xl mx-auto">
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
                {t('about.journeyTitle')}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-teal-400 to-emerald-400 mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('about.journeySubtitle')}
              </p>
            </motion.div>

            {/* Timeline */}
            <div className="relative">
              {/* Central line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 transform -translate-x-1/2 hidden md:block" />
              
              <div className="space-y-12 md:space-y-0">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative md:flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} md:mb-12`}
                  >
                    {/* Content */}
                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                      <div className="group bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl hover:bg-white/90 transition-all duration-300">
                        <span className="text-sm font-semibold text-purple-500 uppercase tracking-wider">
                          {milestone.year}
                        </span>
                        <h3 
                          className="text-xl font-bold text-gray-900 mt-2 mb-2"
                          style={{ fontFamily: '"Cormorant Garamond", serif' }}
                        >
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600">
                          {milestone.description}
                        </p>
                      </div>
                    </div>

                    {/* Center icon */}
                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-purple-200 items-center justify-center shadow-lg z-10">
                      <milestone.icon className="w-5 h-5 text-purple-500" />
                    </div>

                    {/* Empty space for alternating layout */}
                    <div className="hidden md:block md:w-1/2" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
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
                {t('about.teamTitle')}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('about.teamSubtitle')}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="group relative h-full">
                    {/* Glow effect on hover */}
                    <div className={`absolute -inset-1 bg-gradient-to-r ${member.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                    
                    {/* Frosted glass card */}
                    <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      {/* Icon avatar */}
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <member.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 
                        className="text-lg font-bold text-gray-900 text-center mb-1"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        {member.name}
                      </h3>
                      
                      <p className={`text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r ${member.gradient} text-center mb-3`}>
                        {member.role}
                      </p>
                      
                      <p className="text-sm text-gray-600 text-center leading-relaxed">
                        {member.description}
                      </p>
                      
                      {/* Decorative background element */}
                      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-gray-50 to-transparent opacity-50" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-slow" />
                
                {/* Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/50 shadow-2xl text-center overflow-hidden">
                  {/* Decorative background */}
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 20% 30%, rgba(147, 197, 253, 0.5) 0%, transparent 40%),
                        radial-gradient(circle at 80% 70%, rgba(249, 168, 212, 0.5) 0%, transparent 40%)
                      `,
                    }}
                  />
                  
                  <div className="relative">
                    <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-6" />
                    
                    <blockquote 
                      className="text-xl sm:text-2xl lg:text-3xl text-gray-800 leading-relaxed mb-8 italic"
                      style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                    >
                      &ldquo;{t('about.quoteText')}&rdquo;
                    </blockquote>
                    
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                      <Flower2 className="w-5 h-5 text-pink-400" />
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    </div>
                    
                    <a
                      href="/flowers"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full shadow-lg hover:bg-gray-800 hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <span>{t('about.exploreGarden')}</span>
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

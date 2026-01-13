'use client';
import { useState, useRef, useEffect } from 'react';
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import Link from "next/link";
import { ArrowRight, Heart, Zap, Globe, BookOpen, AlertTriangle, TrendingDown, Shield, Users, Target, ExternalLink, Rotate3D, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "../../lib/useTranslation";

// Mobile-Friendly Bar Chart with Horizontal Slider
function PollinatorDeclineChart({ t }) {
  const data = [
    { label: t('pollinators.ofCrops'), percentage: 75, color: "#3b82f6", category: "2016" },
    { label: t('pollinators.depend'), percentage: 90, color: "#1e40af", category: "2016" },
    { label: t('pollinators.evidence1'), percentage: 40, color: "#dc2626", category: "2025" },
    { label: t('pollinators.evidence2'), percentage: 9, color: "#ef4444", category: "2025" },
    { label: t('pollinators.evidence3'), percentage: 65, color: "#ea580c", category: "US" },
    { label: t('pollinators.evidence4'), percentage: 22, color: "#f97316", category: "US" }
  ];

  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  return (
    <div className="bg-white/95 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-lg">
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
        {t('pollinators.chartTitle')}
      </h3>
      
      {/* Mobile: Horizontal Slider */}
      <div className="md:hidden">
        <div className="relative">
          {/* Scroll Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto hide-scrollbar snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex space-x-4 px-8 py-4 min-w-max">
              {data.map((item, index) => (
                <div key={index} className="snap-center flex-shrink-0">
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-md w-[280px] h-[400px] flex flex-col">
                    {/* Percentage Badge */}
                    <div className="text-center mb-4">
                      <div 
                        className="inline-block px-6 py-3 rounded-full text-white font-bold text-3xl shadow-lg"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.percentage}%
                      </div>
                    </div>
                    
                    {/* Bar Container */}
                    <div className="flex-1 flex flex-col justify-end items-center px-4">
                      <div className="w-full bg-gray-100 rounded-lg overflow-hidden h-[200px] flex flex-col-reverse border border-gray-200">
                        <div
                          className="w-full transition-all duration-500 rounded-t-lg relative"
                          style={{
                            height: `${item.percentage}%`,
                            backgroundColor: item.color
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                        </div>
                      </div>
                    </div>

                    {/* Label */}
                    <div className="mt-4 text-center">
                      <p className="text-sm font-semibold text-gray-800 leading-tight">
                        {item.label}
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                        {item.category === "2016" ? t('pollinators.data2016') : item.category === "2025" ? t('pollinators.crisis2025') : t('pollinators.usImpact')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center mt-4 space-x-2">
            {data.map((_, index) => (
              <div key={index} className="w-2 h-2 bg-gray-300 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: Traditional Bar Chart */}
      <div className="hidden md:block">
        <div className="relative h-[32rem] lg:h-[36rem] pt-32 lg:pt-36 pb-8">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[100, 80, 60, 40, 20, 0].map((value) => (
              <div key={value} className="flex items-center">
                <div className="w-12 lg:w-16 text-xs text-gray-400 font-medium pr-3 text-right">
                  {value}%
                </div>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>
            ))}
          </div>

          {/* Bars */}
          <div className="relative flex items-end justify-center space-x-6 lg:space-x-12 h-full">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col items-center relative z-10 group">
                <div 
                  className="w-16 lg:w-20 rounded-t-lg relative shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                  style={{ 
                    height: `${(item.percentage / 100) * 28}rem`,
                    backgroundColor: item.color 
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-t-lg"></div>
                  <div className="absolute -top-14 lg:-top-16 left-1/2 transform -translate-x-1/2 text-sm font-bold text-white px-4 py-3 rounded-lg shadow-lg transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: item.color }}>
                    {item.percentage}%
                  </div>
                </div>
                <div className="mt-6 text-sm text-gray-600 text-center max-w-[120px] leading-tight font-medium">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 lg:space-x-8 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded shadow-sm"></div>
            <span className="font-medium">{t('pollinators.data2016')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600 rounded shadow-sm"></div>
            <span className="font-medium">{t('pollinators.crisis2025')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-600 rounded shadow-sm"></div>
            <span className="font-medium">{t('pollinators.usImpact')}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default function PollinatorsPage() {
  const { t, isLoading } = useTranslation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <Navigation />
      
      <div className="pt-16 sm:pt-20 px-4 sm:px-6 lg:pr-24 lg:pl-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-4 sm:mb-6">
              {t('pollinators.pageTitle')}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed">
              {t('pollinators.heroSubtitle')}
            </p>
          </div>

          {/* Guardians of Biodiversity */}
          <section className="mb-12 sm:mb-16 lg:mb-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-white/20">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">
                  {t('pollinators.guardiansTitle')}
                </h2>
                <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-gray-700 leading-relaxed">
                  <p>
                    {t('pollinators.guardiansText1')}
                  </p>
                  <p>
                    {t('pollinators.guardiansText2')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* NAHIARA Manifesto Section */}
          <section className="mb-12 sm:mb-16 lg:mb-20">
            <div className="bg-gradient-to-br from-red-50 to-orange-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-red-200">
              <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-800 mb-3 sm:mb-4">
                  {t('pollinators.manifestoTitle')}
                </h2>
                <p className="text-lg sm:text-xl text-red-700 font-medium">
                  {t('pollinators.manifestoSubtitle')}
                </p>
              </div>

              <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
                {/* 2016 Section */}
                <div className="bg-white/80 rounded-2xl p-6 sm:p-8 border border-red-200">
                  <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-4 sm:mb-6 flex items-center">
                    <span className="w-8 sm:w-10 h-8 sm:h-10 bg-red-100 rounded-full mr-3 sm:mr-4 flex items-center justify-center text-red-600 font-bold text-sm sm:text-base">2016</span>
                    {t('pollinators.ipbesReport')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{t('pollinators.ipbesPoint1')}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{t('pollinators.ipbesPoint2')}</p>
                    </div>
                  </div>
                </div>

                {/* 2025 Section */}
                <div className="bg-red-100/80 rounded-2xl p-6 sm:p-8 border border-red-300">
                  <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-4 sm:mb-6 flex items-center">
                    <span className="w-8 sm:w-10 h-8 sm:h-10 bg-red-200 rounded-full mr-3 sm:mr-4 flex items-center justify-center text-red-700 font-bold text-sm sm:text-base">2025</span>
                    {t('pollinators.evidence2025')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                    <div className="flex items-start space-x-3">
                      <TrendingDown className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{t('pollinators.evidence1')}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <TrendingDown className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{t('pollinators.evidence2')}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <TrendingDown className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{t('pollinators.evidence3')}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <TrendingDown className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{t('pollinators.evidence4')}</p>
                    </div>
                  </div>
                </div>

                {/* Institutional Inertia Section */}
                <div className="bg-white/80 rounded-2xl p-6 sm:p-8 border border-red-200">
                  <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-4 sm:mb-6 flex items-center">
                    <Shield className="w-6 h-6 text-red-600 mr-3" />
                    {t('pollinators.institutionalInertia')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{t('pollinators.inertia1')}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{t('pollinators.inertia2')}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{t('pollinators.inertia3')}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{t('pollinators.inertia4')}</p>
                    </div>
                  </div>
                </div>

                {/* Call for Action Section */}
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6 sm:p-8 border border-amber-300">
                  <h3 className="text-xl sm:text-2xl font-bold text-amber-800 mb-4 sm:mb-6 flex items-center">
                    <Target className="w-6 h-6 text-amber-600 mr-3" />
                    {t('pollinators.callForAction')}
                  </h3>
                  <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                    {t('pollinators.callText')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base">
                    <div className="flex items-start space-x-3">
                      <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                      <p className="text-gray-700">{t('pollinators.action1')}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                      <p className="text-gray-700">{t('pollinators.action2')}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                      <p className="text-gray-700">{t('pollinators.action3')}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                      <p className="text-gray-700">{t('pollinators.action4')}</p>
                    </div>
                    <div className="flex items-start space-x-3 sm:col-span-2">
                      <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                      <p className="text-gray-700">{t('pollinators.action5')}</p>
                    </div>
                  </div>
                </div>

                {/* Conclusion Section */}
                <div className="bg-red-50 rounded-2xl p-6 sm:p-8 border border-red-200 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-3 sm:mb-4">{t('pollinators.conclusion')}</h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {t('pollinators.conclusionText')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Chart Section */}
          <section className="mb-12 sm:mb-16 lg:mb-20">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                  {t('pollinators.numbersTitle')}
                  </h2>
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 max-w-2xl mx-auto">
                    {t('pollinators.numbersSubtitle')}
                  </p>
                </div>
                
                <PollinatorDeclineChart t={t} />
              </div>
            </section>

          {/* Guardians Section */}
          <section className="mb-12 sm:mb-16 lg:mb-20">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                {t('pollinators.guardiansTitle')}
                  </h2>
              <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto">
                {t('pollinators.guardiansText2')}
                  </p>
                </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Bees */}
              <div className="bg-white/90 rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl">🐝</span>
                      </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">{t('pollinators.bees')}</h3>
                <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
                  {t('pollinators.beesDesc')}
                </p>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('pollinators.honeybees')}</span>
                    <span className="font-semibold text-gray-800">{t('pollinators.global')}</span>
                      </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('pollinators.bumblebees')}</span>
                    <span className="font-semibold text-gray-800">{t('pollinators.temperateRegions')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('pollinators.solitaryBees')}</span>
                    <span className="font-semibold text-gray-800">{t('pollinators.diverseHabitats')}</span>
                      </div>
                    </div>
                  </div>

              {/* Birds */}
              <div className="bg-white/90 rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl">🐦</span>
                      </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">{t('pollinators.birds')}</h3>
                <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
                  {t('pollinators.birdsDesc')}
                </p>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('pollinators.hummingbirds')}</span>
                    <span className="font-semibold text-gray-800">{t('pollinators.americas')}</span>
                      </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('pollinators.sunbirds')}</span>
                    <span className="font-semibold text-gray-800">{t('pollinators.africaAsia')}</span>
                      </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('pollinators.honeyeaters')}</span>
                    <span className="font-semibold text-gray-800">{t('pollinators.australia')}</span>
                      </div>
                    </div>
                  </div>

              {/* Butterflies */}
              <div className="bg-white/90 rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl">🦋</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">{t('pollinators.butterflies')}</h3>
                <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
                  {t('pollinators.butterfliesDesc')}
                </p>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('pollinators.monarchs')}</span>
                    <span className="font-semibold text-gray-800">{t('pollinators.northAmerica')}</span>
                      </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('pollinators.swallowtails')}</span>
                    <span className="font-semibold text-gray-800">{t('pollinators.global')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('pollinators.hawkMoths')}</span>
                    <span className="font-semibold text-gray-800">{t('pollinators.nightPollinators')}</span>
                  </div>
                </div>
              </div>

              {/* Bats */}
              <div className="bg-white/90 rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl">🦇</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">{t('pollinators.bats')}</h3>
                <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
                  {t('pollinators.batsDesc')}
                </p>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('pollinators.lesserLongNosed')}</span>
                    <span className="font-semibold text-gray-800">{t('pollinators.mexicoUS')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('pollinators.fruitBats')}</span>
                    <span className="font-semibold text-gray-800">{t('pollinators.tropicalRegions')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('pollinators.nectarBats')}</span>
                    <span className="font-semibold text-gray-800">{t('pollinators.desertEcosystems')}</span>
                  </div>
                </div>
              </div>

              {/* Beetles */}
              <div className="bg-white/90 rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl">🪲</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">{t('pollinators.beetles')}</h3>
                <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
                  {t('pollinators.beetlesDesc')}
                </p>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('pollinators.flowerBeetles')}</span>
                    <span className="font-semibold text-gray-800">{t('pollinators.diverseSpecies')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('pollinators.hoverflies')}</span>
                    <span className="font-semibold text-gray-800">{t('pollinators.beeMimics')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('pollinators.wasps')}</span>
                    <span className="font-semibold text-gray-800">{t('pollinators.diverseSpecies')}</span>
                  </div>
                </div>
              </div>

              {/* Impact */}
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-lg">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Globe className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">{t('pollinators.globalImpactTitle')}</h3>
                <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
                  {t('pollinators.globalImpactDesc')}
                </p>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('pollinators.foodProduction')}</span>
                    <span className="font-semibold text-gray-800">{t('pollinators.ofCrops')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('pollinators.wildPlants')}</span>
                    <span className="font-semibold text-gray-800">{t('pollinators.depend')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('pollinators.ecosystemHealth')}</span>
                    <span className="font-semibold text-gray-800">{t('pollinators.critical')}</span>
                  </div>
                </div>
              </div>
              </div>
            </section>

          {/* Call to Action */}
          <section className="mb-12 sm:mb-16 lg:mb-20">
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-amber-200 text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                {t('pollinators.takeAction')}
                </h2>
              <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 max-w-2xl mx-auto">
                {t('pollinators.takeActionText')}
                </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link 
                  href="/pollinators/gallery"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <span>{t('pollinators.exploreGallery')}</span>
                  <ExternalLink className="w-4 sm:w-5 h-4 sm:h-5" />
                </Link>
                <Link 
                  href="/education"
                  className="inline-flex items-center space-x-2 bg-white/80 hover:bg-white text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 border border-amber-200"
                >
                  <span>{t('common.learnMore')}</span>
                  <ExternalLink className="w-4 sm:w-5 h-4 sm:h-5" />
                </Link>
              </div>
              </div>
            </section>

          {/* Future Vision */}
          <section className="mb-12 sm:mb-16 lg:mb-20">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-blue-200">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                  {t('pollinators.futureVision')}
                </h2>
                <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto">
                  {t('pollinators.futureVisionText')}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="bg-white/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Globe className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t('pollinators.globalCoverage')}</h3>
                  <p className="text-sm text-gray-600">{t('pollinators.globalCoverageDesc')}</p>
                </div>
                
                <div className="bg-white/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Rotate3D className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t('pollinators.exploration3D')}</h3>
                  <p className="text-sm text-gray-600">{t('pollinators.exploration3DDesc')}</p>
                </div>
                
                <div className="bg-white/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Heart className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t('pollinators.conservationFocus')}</h3>
                  <p className="text-sm text-gray-600">{t('pollinators.conservationFocusDesc')}</p>
                </div>
              </div>
              </div>
            </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

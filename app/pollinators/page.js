'use client';
import { useState, useRef, useEffect } from 'react';
import Navigation from "../../components/Navigation";
import Link from "next/link";
import { ArrowRight, Heart, Zap, Globe, BookOpen, AlertTriangle, TrendingDown, Shield, Users, Target, ExternalLink, Rotate3D, ChevronLeft, ChevronRight } from "lucide-react";

// Mobile-Friendly Bar Chart with Horizontal Slider
function PollinatorDeclineChart() {
  const data = [
    { label: "Wild flowering plants (2016)", percentage: 90, color: "#1e40af", category: "2016" },
    { label: "Food crops (2016)", percentage: 75, color: "#3b82f6", category: "2016" },
    { label: "Insects threatened (2025)", percentage: 40, color: "#dc2626", category: "2025" },
    { label: "Annual decline (per decade)", percentage: 9, color: "#ef4444", category: "2025" },
    { label: "US bee losses (2025)", percentage: 65, color: "#ea580c", category: "US" },
    { label: "Native pollinators at risk", percentage: 22, color: "#f97316", category: "US" }
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
        Pollinator decline - Key figures
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
                        {item.category === "2016" ? "📊 2016 Data" : item.category === "2025" ? "⚠️ 2025 Crisis" : "🇺🇸 US Impact"}
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
            <span className="font-medium">2016 Data</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600 rounded shadow-sm"></div>
            <span className="font-medium">2025 Crisis</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-600 rounded shadow-sm"></div>
            <span className="font-medium">US Impact</span>
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <Navigation />
      
      <div className="pt-16 sm:pt-20 px-4 sm:px-6 lg:pr-24 lg:pl-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-4 sm:mb-6">
              Pollinators
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed">
              The invisible guardians of life on Earth. These essential creatures keep our planet&apos;s biodiversity in balance, pollinating the plants that feed us all.
            </p>
          </div>

          {/* Guardians of Biodiversity */}
          <section className="mb-12 sm:mb-16 lg:mb-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-white/20">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">
                  Guardians of biodiversity
                </h2>
                <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-gray-700 leading-relaxed">
                  <p>
                    In AquaMundi, pollinators hold a central place alongside national flowers, as they represent the bridge between nature, culture, and survival. These remarkable creatures are the unsung heroes that keep our planet&apos;s delicate balance intact.
                  </p>
                  <p>
                    From the tiniest bee to the most magnificent hummingbird, each pollinator plays a vital role in the grand symphony of life, ensuring that future generations can continue to marvel at the beauty and abundance of our natural world.
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
                  From decline to guardianship
                </h2>
                <p className="text-lg sm:text-xl text-red-700 font-medium">
                  A manifesto from the NAHIARA universe (2016 – 2025)
                </p>
              </div>

              <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
                {/* 2016 Section */}
                <div className="bg-white/80 rounded-2xl p-6 sm:p-8 border border-red-200">
                  <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-4 sm:mb-6 flex items-center">
                    <span className="w-8 sm:w-10 h-8 sm:h-10 bg-red-100 rounded-full mr-3 sm:mr-4 flex items-center justify-center text-red-600 font-bold text-sm sm:text-base">2016</span>
                    The historic IPBES report
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">90% of wild flowering plants depended on animal pollinators</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">More than 75% of global food crops required their intervention</p>
                    </div>
                  </div>
                </div>

                {/* 2025 Section */}
                <div className="bg-red-100/80 rounded-2xl p-6 sm:p-8 border border-red-300">
                  <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-4 sm:mb-6 flex items-center">
                    <span className="w-8 sm:w-10 h-8 sm:h-10 bg-red-200 rounded-full mr-3 sm:mr-4 flex items-center justify-center text-red-700 font-bold text-sm sm:text-base">2025</span>
                    The evidence is alarming
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                    <div className="flex items-start space-x-3">
                      <TrendingDown className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">Over 40% of global pollinating insects are highly threatened</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <TrendingDown className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">Terrestrial insect populations decline at ~9% per decade</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <TrendingDown className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">Managed bee colony losses in U.S. reached 60–70% in a single year</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <TrendingDown className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">22% of North America&apos;s native pollinators at high risk of extinction</p>
                    </div>
                  </div>
                </div>

                {/* Institutional Inertia Section */}
                <div className="bg-white/80 rounded-2xl p-6 sm:p-8 border border-red-200">
                  <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-4 sm:mb-6 flex items-center">
                    <Shield className="w-6 h-6 text-red-600 mr-3" />
                    Institutional inertia
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">Fragmented initiatives that never reached global coordination</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">Short-term priorities that relegated biodiversity</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">Underestimation of pollinators as vital infrastructure</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">Resistance to move away from pesticide-intensive agriculture</p>
                    </div>
                  </div>
                </div>

                {/* Call for Action Section */}
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6 sm:p-8 border border-amber-300">
                  <h3 className="text-xl sm:text-2xl font-bold text-amber-800 mb-4 sm:mb-6 flex items-center">
                    <Target className="w-6 h-6 text-amber-600 mr-3" />
                    A call for the next decade
                  </h3>
                  <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                    The NAHIARA thesis calls for urgent global action:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base">
                    <div className="flex items-start space-x-3">
                      <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                      <p className="text-gray-700">Integrate pollinator protection into national and food security policies</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                      <p className="text-gray-700">Establish ecological corridors for species survival and mobility</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                      <p className="text-gray-700">Transition agricultural systems toward regenerative models</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                      <p className="text-gray-700">Implement real-time global monitoring, accessible and transparent</p>
                    </div>
                    <div className="flex items-start space-x-3 sm:col-span-2">
                      <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                      <p className="text-gray-700">Embed pollinators into education and culture as living symbols of life</p>
                    </div>
                  </div>
                </div>

                {/* Conclusion Section */}
                <div className="bg-red-50 rounded-2xl p-6 sm:p-8 border border-red-200 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-3 sm:mb-4">Conclusion</h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    Protecting pollinators is not optional – it is a moral, ecological, and cultural duty. The coming decade will decide whether humanity chooses restoration or collapse.
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
                  The numbers don&apos;t lie
                  </h2>
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 max-w-2xl mx-auto">
                    Visual representation of the pollinator crisis from 2016 to 2025, showing the dramatic decline and urgent need for action.
                  </p>
                </div>
                
                <PollinatorDeclineChart />
              </div>
            </section>

          {/* Guardians Section */}
          <section className="mb-12 sm:mb-16 lg:mb-20">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                Guardians of biodiversity
                  </h2>
              <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto">
                From tiny bees to magnificent hummingbirds, these creatures form the foundation of our food web and ecosystem health.
                  </p>
                </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Bees */}
              <div className="bg-white/90 rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl">🐝</span>
                      </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">Bees</h3>
                <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
                  The most efficient pollinators, responsible for pollinating over 80% of flowering plants worldwide.
                </p>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Honeybees</span>
                    <span className="font-semibold text-gray-800">Global</span>
                      </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bumblebees</span>
                    <span className="font-semibold text-gray-800">Temperate regions</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Solitary bees</span>
                    <span className="font-semibold text-gray-800">Diverse habitats</span>
                      </div>
                    </div>
                  </div>

              {/* Birds */}
              <div className="bg-white/90 rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl">🐦</span>
                      </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">Birds</h3>
                <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
                  Hummingbirds, sunbirds, and other nectar-feeding birds pollinate tubular flowers with their long beaks.
                </p>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Hummingbirds</span>
                    <span className="font-semibold text-gray-800">Americas</span>
                      </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sunbirds</span>
                    <span className="font-semibold text-gray-800">Africa, Asia</span>
                      </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Honeyeaters</span>
                    <span className="font-semibold text-gray-800">Australia</span>
                      </div>
                    </div>
                  </div>

              {/* Butterflies */}
              <div className="bg-white/90 rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl">🦋</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">Butterflies & moths</h3>
                <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
                  Beautiful pollinators that prefer flat, open flowers and are active during daylight hours.
                </p>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monarchs</span>
                    <span className="font-semibold text-gray-800">North America</span>
                      </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Swallowtails</span>
                    <span className="font-semibold text-gray-800">Global</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Hawk moths</span>
                    <span className="font-semibold text-gray-800">Night pollinators</span>
                  </div>
                </div>
              </div>

              {/* Bats */}
              <div className="bg-white/90 rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl">🦇</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">Bats</h3>
                <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
                  Nocturnal pollinators that feed on nectar and pollinate night-blooming flowers like agave and cacti.
                </p>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Lesser long-nosed</span>
                    <span className="font-semibold text-gray-800">Mexico, US</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fruit bats</span>
                    <span className="font-semibold text-gray-800">Tropical regions</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nectar bats</span>
                    <span className="font-semibold text-gray-800">Desert ecosystems</span>
                  </div>
                </div>
              </div>

              {/* Beetles */}
              <div className="bg-white/90 rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl">🪲</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">Beetles & other pollinators</h3>
                <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
                  Ancient pollinators that have been pollinating flowers for over 150 million years, including flies and wasps.
                </p>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Flower beetles</span>
                    <span className="font-semibold text-gray-800">Global</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Hoverflies</span>
                    <span className="font-semibold text-gray-800">Bee mimics</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Wasps</span>
                    <span className="font-semibold text-gray-800">Diverse species</span>
                  </div>
                </div>
              </div>

              {/* Impact */}
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-lg">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Globe className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">Global impact</h3>
                <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
                  Pollinators are essential for maintaining biodiversity and food security worldwide.
                </p>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Food production</span>
                    <span className="font-semibold text-gray-800">75% of crops</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Wild plants</span>
                    <span className="font-semibold text-gray-800">90% depend</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ecosystem health</span>
                    <span className="font-semibold text-gray-800">Critical</span>
                  </div>
                </div>
              </div>
              </div>
            </section>

          {/* Call to Action */}
          <section className="mb-12 sm:mb-16 lg:mb-20">
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-amber-200 text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                Take action today
                </h2>
              <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Every small action counts. Plant native flowers, avoid pesticides, and support pollinator-friendly initiatives in your community.
                </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link 
                  href="/pollinators/gallery"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <span>Explore gallery</span>
                  <ExternalLink className="w-4 sm:w-5 h-4 sm:h-5" />
                </Link>
                <Link 
                  href="/education"
                  className="inline-flex items-center space-x-2 bg-white/80 hover:bg-white text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 border border-amber-200"
                >
                  <span>Learn more</span>
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
                  Future vision
                </h2>
                <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto">
                  We&apos;re building a comprehensive living archive of Earth&apos;s pollinators, connecting them with national flowers and creating an interactive 3D experience.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="bg-white/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Globe className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">Global coverage</h3>
                  <p className="text-sm text-gray-600">Comprehensive database of pollinators from every continent and ecosystem</p>
                </div>
                
                <div className="bg-white/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Rotate3D className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">3D exploration</h3>
                  <p className="text-sm text-gray-600">Interactive 3D models and virtual environments for immersive learning</p>
                </div>
                
                <div className="bg-white/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Heart className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">Conservation focus</h3>
                  <p className="text-sm text-gray-600">Data-driven insights to support pollinator conservation efforts worldwide</p>
                </div>
              </div>
              </div>
            </section>
        </div>
      </div>
    </div>
  );
}

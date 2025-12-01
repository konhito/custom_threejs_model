"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HeroSection } from "../components/HeroSection";
import LazyGlobe from "../components/LazyGlobe";
import ImageGallery from "../components/ImageGallery";
import CurvedLoop from "../components/CurvedLoop";
import { BentoDemo } from "../components/BentoDemo";
import Footer from "../components/Footer";
import PageLoader from "../components/PageLoader";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only redirect if we're on the asociacionnahiara.org domain
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'www.asociacionnahiara.org' || hostname === 'asociacionnahiara.org') {
        router.replace("/landing");
      }
    }
  }, [router]);

  // Handle page loading
  useEffect(() => {
    // Preload critical content
    const preloadContent = () => {
      // Force layout calculation to prevent first-paint jank
      if (typeof window !== 'undefined') {
        requestAnimationFrame(() => {
          document.body.offsetHeight; // Force reflow
        });
      }
    };

    preloadContent();

    // Handle load completion
    const handleLoad = () => {
      requestAnimationFrame(() => {
        setIsLoading(false);
      });
    };

    // Minimum loading time for better UX
    const minLoadTime = setTimeout(() => {
      requestAnimationFrame(() => {
        setIsLoading(false);
      });
    }, 1000); // 1 second minimum

    // Also listen for when page is fully loaded
    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        requestAnimationFrame(() => {
          setIsLoading(false);
        });
      } else {
        window.addEventListener('load', handleLoad);
      }
    }
    
    return () => {
      clearTimeout(minLoadTime);
      if (typeof window !== 'undefined') {
        window.removeEventListener('load', handleLoad);
      }
    };
  }, []);

  // Check if we should show the redirect screen or normal content
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'www.asociacionnahiara.org' || hostname === 'asociacionnahiara.org') {
        setShouldRedirect(true);
      }
    }
  }, []);

  if (shouldRedirect) {
    // Show loading while redirecting for asociacionnahiara.org
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Redirecting...
          </h2>
          <p className="text-gray-600">Taking you to the landing page.</p>
        </div>
      </div>
    );
  }

  // Show normal content for aquamundi.org
  return (
    <>
      {/* Page Loader */}
      <PageLoader isLoading={isLoading} />
      
      {/* Main Content with fade-in animation */}
      <div 
        className="relative min-h-screen bg-white"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'opacity',
          transform: 'translateZ(0)',
        }}
      >
      <main role="main" aria-label="Interactive 3D Globe of Sacred Flowers" className="relative">
        {/* Hero Section - Loads First */}
        <HeroSection />
        {/* Globe Section - Lazy Loaded with Rounded Rectangle Container */}
        <div id="globe-section" className="relative w-full min-h-screen flex items-center justify-center py-8 md:py-12 bg-white">
          {/* Large Rounded Rectangle Container for Globe */}
          <div 
            className="relative w-[95%] max-w-[1400px] h-[85vh] max-h-[900px] flex items-center justify-center rounded-[80px] md:rounded-[100px] lg:rounded-[120px]"
          >
            {/* Outer Light Grey Border */}
            <div 
              className="absolute inset-0 rounded-[80px] md:rounded-[100px] lg:rounded-[120px]"
              style={{
                border: '1px solid #d0d0d0',
              }}
            />
            
            {/* Light Grey Middle Section - Plain background */}
            <div 
              className="absolute inset-[1px] rounded-[79px] md:rounded-[99px] lg:rounded-[119px]"
              style={{
                background: '#e5e5e5',
                overflow: 'visible',
              }}
            >
              {/* Decorative Botanical Patterns - Top Border Only */}
              <div className="absolute -top-[1px] left-0 right-0 h-[6px] overflow-hidden rounded-t-[79px] md:rounded-t-[99px] lg:rounded-t-[119px]">
                <svg className="absolute top-0 left-0 w-full h-[6px] pointer-events-none" style={{ opacity: 0.7 }}>
                  <defs>
                    <pattern id="floralBorderPattern" x="0" y="0" width="80" height="6" patternUnits="userSpaceOnUse">
                      {/* Decorative vine */}
                      <path d="M0,3 Q20,1 40,3 T80,3" stroke="#059669" fill="none" strokeWidth="1" opacity="0.6" />
                      {/* Small flowers */}
                      <circle cx="20" cy="3" r="1.5" fill="#10b981" opacity="0.5" />
                      <circle cx="60" cy="3" r="1.5" fill="#047857" opacity="0.5" />
                      {/* Tiny leaves */}
                      <ellipse cx="10" cy="3" rx="2" ry="1" fill="#059669" opacity="0.4" transform="rotate(-30 10 3)" />
                      <ellipse cx="50" cy="3" rx="2" ry="1" fill="#10b981" opacity="0.4" transform="rotate(30 50 3)" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#floralBorderPattern)" />
                </svg>
              </div>
              
              {/* Decorative Botanical Patterns - Bottom Border Only */}
              <div className="absolute -bottom-[1px] left-0 right-0 h-[6px] overflow-hidden rounded-b-[79px] md:rounded-b-[99px] lg:rounded-b-[119px]">
                <svg className="absolute bottom-0 left-0 w-full h-[6px] pointer-events-none" style={{ opacity: 0.7, transform: 'scaleY(-1)' }}>
                  <defs>
                    <pattern id="floralBorderPatternBottom" x="0" y="0" width="80" height="6" patternUnits="userSpaceOnUse">
                      <path d="M0,3 Q20,1 40,3 T80,3" stroke="#059669" fill="none" strokeWidth="1" opacity="0.6" />
                      <circle cx="20" cy="3" r="1.5" fill="#10b981" opacity="0.5" />
                      <circle cx="60" cy="3" r="1.5" fill="#047857" opacity="0.5" />
                      <ellipse cx="10" cy="3" rx="2" ry="1" fill="#059669" opacity="0.4" transform="rotate(-30 10 3)" />
                      <ellipse cx="50" cy="3" rx="2" ry="1" fill="#10b981" opacity="0.4" transform="rotate(30 50 3)" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#floralBorderPatternBottom)" />
                </svg>
              </div>
              
              {/* Decorative Botanical Patterns - Left Border Only */}
              <div className="absolute -left-[1px] top-0 bottom-0 w-[6px] overflow-hidden rounded-l-[79px] md:rounded-l-[99px] lg:rounded-l-[119px]">
                <svg className="absolute left-0 top-0 w-[6px] h-full pointer-events-none" style={{ opacity: 0.7, transform: 'rotate(-90deg) translateX(-100%)', transformOrigin: 'left top' }}>
                  <defs>
                    <pattern id="floralBorderPatternLeft" x="0" y="0" width="80" height="6" patternUnits="userSpaceOnUse">
                      <path d="M0,3 Q20,1 40,3 T80,3" stroke="#059669" fill="none" strokeWidth="1" opacity="0.6" />
                      <circle cx="20" cy="3" r="1.5" fill="#10b981" opacity="0.5" />
                      <circle cx="60" cy="3" r="1.5" fill="#047857" opacity="0.5" />
                      <ellipse cx="10" cy="3" rx="2" ry="1" fill="#059669" opacity="0.4" transform="rotate(-30 10 3)" />
                      <ellipse cx="50" cy="3" rx="2" ry="1" fill="#10b981" opacity="0.4" transform="rotate(30 50 3)" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="6" fill="url(#floralBorderPatternLeft)" />
                </svg>
              </div>
              
              {/* Decorative Botanical Patterns - Right Border Only */}
              <div className="absolute -right-[1px] top-0 bottom-0 w-[6px] overflow-hidden rounded-r-[79px] md:rounded-r-[99px] lg:rounded-r-[119px]">
                <svg className="absolute right-0 top-0 w-[6px] h-full pointer-events-none" style={{ opacity: 0.7, transform: 'rotate(90deg) translateY(-100%)', transformOrigin: 'right top' }}>
                  <defs>
                    <pattern id="floralBorderPatternRight" x="0" y="0" width="80" height="6" patternUnits="userSpaceOnUse">
                      <path d="M0,3 Q20,1 40,3 T80,3" stroke="#059669" fill="none" strokeWidth="1" opacity="0.6" />
                      <circle cx="20" cy="3" r="1.5" fill="#10b981" opacity="0.5" />
                      <circle cx="60" cy="3" r="1.5" fill="#047857" opacity="0.5" />
                      <ellipse cx="10" cy="3" rx="2" ry="1" fill="#059669" opacity="0.4" transform="rotate(-30 10 3)" />
                      <ellipse cx="50" cy="3" rx="2" ry="1" fill="#10b981" opacity="0.4" transform="rotate(30 50 3)" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="6" fill="url(#floralBorderPatternRight)" />
                </svg>
              </div>

              {/* Corner Accent Decorations */}
              <svg className="absolute -top-2 -left-2 w-12 h-12 md:w-14 md:h-14 pointer-events-none" style={{ opacity: 0.5 }}>
                <path d="M12,8 Q8,4 8,0" stroke="#047857" fill="none" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="4" r="1.5" fill="#10b981" opacity="0.7" />
                <circle cx="6" cy="6" r="1.2" fill="#059669" opacity="0.6" />
              </svg>
              
              <svg className="absolute -top-2 -right-2 w-12 h-12 md:w-14 md:h-14 pointer-events-none" style={{ opacity: 0.5, transform: 'scaleX(-1)' }}>
                <path d="M12,8 Q8,4 8,0" stroke="#047857" fill="none" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="4" r="1.5" fill="#10b981" opacity="0.7" />
                <circle cx="6" cy="6" r="1.2" fill="#059669" opacity="0.6" />
              </svg>
              
              <svg className="absolute -bottom-2 -left-2 w-12 h-12 md:w-14 md:h-14 pointer-events-none" style={{ opacity: 0.5, transform: 'scaleY(-1)' }}>
                <path d="M12,8 Q8,4 8,0" stroke="#047857" fill="none" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="4" r="1.5" fill="#10b981" opacity="0.7" />
                <circle cx="6" cy="6" r="1.2" fill="#059669" opacity="0.6" />
              </svg>
              
              <svg className="absolute -bottom-2 -right-2 w-12 h-12 md:w-14 md:h-14 pointer-events-none" style={{ opacity: 0.5, transform: 'scale(-1)' }}>
                <path d="M12,8 Q8,4 8,0" stroke="#047857" fill="none" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="4" r="1.5" fill="#10b981" opacity="0.7" />
                <circle cx="6" cy="6" r="1.2" fill="#059669" opacity="0.6" />
              </svg>

              {/* Scattered Colorful Flowers Around the Border */}
              {/* Top Edge Flowers */}
              <svg className="absolute -top-4 left-[15%] w-12 h-12 md:w-16 md:h-16 pointer-events-none" style={{ opacity: 0.8 }}>
                <g transform="translate(6, 6)">
                  <circle cx="0" cy="0" r="4" fill="#ec4899" opacity="0.7" />
                  <circle cx="-3" cy="-1.5" r="3" fill="#f9a8d4" opacity="0.8" />
                  <circle cx="3" cy="-1.5" r="3" fill="#f9a8d4" opacity="0.8" />
                  <circle cx="-2" cy="2.5" r="3" fill="#f9a8d4" opacity="0.8" />
                  <circle cx="2" cy="2.5" r="3" fill="#f9a8d4" opacity="0.8" />
                  <circle cx="0" cy="0" r="1.5" fill="#fbbf24" opacity="0.9" />
                </g>
              </svg>

              <svg className="absolute -top-5 left-[35%] w-10 h-10 md:w-14 md:h-14 pointer-events-none" style={{ opacity: 0.8 }}>
                <g transform="translate(5, 5)">
                  <circle cx="0" cy="0" r="3.5" fill="#a855f7" opacity="0.7" />
                  <circle cx="-2.5" cy="-1.2" r="2.5" fill="#c084fc" opacity="0.8" />
                  <circle cx="2.5" cy="-1.2" r="2.5" fill="#c084fc" opacity="0.8" />
                  <circle cx="-1.8" cy="2" r="2.5" fill="#c084fc" opacity="0.8" />
                  <circle cx="1.8" cy="2" r="2.5" fill="#c084fc" opacity="0.8" />
                  <circle cx="0" cy="0" r="1.3" fill="#fbbf24" opacity="0.9" />
                </g>
              </svg>

              <svg className="absolute -top-4 right-[25%] w-12 h-12 md:w-16 md:h-16 pointer-events-none" style={{ opacity: 0.8 }}>
                <g transform="translate(6, 6)">
                  <circle cx="0" cy="0" r="4" fill="#3b82f6" opacity="0.7" />
                  <circle cx="-3" cy="-1.5" r="3" fill="#93c5fd" opacity="0.8" />
                  <circle cx="3" cy="-1.5" r="3" fill="#93c5fd" opacity="0.8" />
                  <circle cx="-2" cy="2.5" r="3" fill="#93c5fd" opacity="0.8" />
                  <circle cx="2" cy="2.5" r="3" fill="#93c5fd" opacity="0.8" />
                  <circle cx="0" cy="0" r="1.5" fill="#fde047" opacity="0.9" />
                </g>
              </svg>

              {/* Right Edge Flowers */}
              <svg className="absolute top-[25%] -right-4 w-12 h-12 md:w-16 md:h-16 pointer-events-none" style={{ opacity: 0.8 }}>
                <g transform="translate(6, 6)">
                  <circle cx="0" cy="0" r="4" fill="#f97316" opacity="0.7" />
                  <circle cx="-3" cy="-1.5" r="3" fill="#fdba74" opacity="0.8" />
                  <circle cx="3" cy="-1.5" r="3" fill="#fdba74" opacity="0.8" />
                  <circle cx="-2" cy="2.5" r="3" fill="#fdba74" opacity="0.8" />
                  <circle cx="2" cy="2.5" r="3" fill="#fdba74" opacity="0.8" />
                  <circle cx="0" cy="0" r="1.5" fill="#fef08a" opacity="0.9" />
                </g>
              </svg>

              <svg className="absolute top-[45%] -right-5 w-10 h-10 md:w-14 md:h-14 pointer-events-none" style={{ opacity: 0.8 }}>
                <g transform="translate(5, 5)">
                  <circle cx="0" cy="0" r="3.5" fill="#14b8a6" opacity="0.7" />
                  <circle cx="-2.5" cy="-1.2" r="2.5" fill="#5eead4" opacity="0.8" />
                  <circle cx="2.5" cy="-1.2" r="2.5" fill="#5eead4" opacity="0.8" />
                  <circle cx="-1.8" cy="2" r="2.5" fill="#5eead4" opacity="0.8" />
                  <circle cx="1.8" cy="2" r="2.5" fill="#5eead4" opacity="0.8" />
                  <circle cx="0" cy="0" r="1.3" fill="#fbbf24" opacity="0.9" />
                </g>
              </svg>

              {/* Bottom Edge Flowers */}
              <svg className="absolute -bottom-4 left-[20%] w-12 h-12 md:w-16 md:h-16 pointer-events-none" style={{ opacity: 0.8 }}>
                <g transform="translate(6, 6)">
                  <circle cx="0" cy="0" r="4" fill="#ef4444" opacity="0.7" />
                  <circle cx="-3" cy="-1.5" r="3" fill="#fca5a5" opacity="0.8" />
                  <circle cx="3" cy="-1.5" r="3" fill="#fca5a5" opacity="0.8" />
                  <circle cx="-2" cy="2.5" r="3" fill="#fca5a5" opacity="0.8" />
                  <circle cx="2" cy="2.5" r="3" fill="#fca5a5" opacity="0.8" />
                  <circle cx="0" cy="0" r="1.5" fill="#fde047" opacity="0.9" />
                </g>
              </svg>

              <svg className="absolute -bottom-5 right-[30%] w-10 h-10 md:w-14 md:h-14 pointer-events-none" style={{ opacity: 0.8 }}>
                <g transform="translate(5, 5)">
                  <circle cx="0" cy="0" r="3.5" fill="#8b5cf6" opacity="0.7" />
                  <circle cx="-2.5" cy="-1.2" r="2.5" fill="#c4b5fd" opacity="0.8" />
                  <circle cx="2.5" cy="-1.2" r="2.5" fill="#c4b5fd" opacity="0.8" />
                  <circle cx="-1.8" cy="2" r="2.5" fill="#c4b5fd" opacity="0.8" />
                  <circle cx="1.8" cy="2" r="2.5" fill="#c4b5fd" opacity="0.8" />
                  <circle cx="0" cy="0" r="1.3" fill="#fef08a" opacity="0.9" />
                </g>
              </svg>

              {/* Left Edge Flowers */}
              <svg className="absolute top-[30%] -left-4 w-12 h-12 md:w-16 md:h-16 pointer-events-none" style={{ opacity: 0.8 }}>
                <g transform="translate(6, 6)">
                  <circle cx="0" cy="0" r="4" fill="#06b6d4" opacity="0.7" />
                  <circle cx="-3" cy="-1.5" r="3" fill="#67e8f9" opacity="0.8" />
                  <circle cx="3" cy="-1.5" r="3" fill="#67e8f9" opacity="0.8" />
                  <circle cx="-2" cy="2.5" r="3" fill="#67e8f9" opacity="0.8" />
                  <circle cx="2" cy="2.5" r="3" fill="#67e8f9" opacity="0.8" />
                  <circle cx="0" cy="0" r="1.5" fill="#fde047" opacity="0.9" />
                </g>
              </svg>

              <svg className="absolute bottom-[35%] -left-5 w-10 h-10 md:w-14 md:h-14 pointer-events-none" style={{ opacity: 0.8 }}>
                <g transform="translate(5, 5)">
                  <circle cx="0" cy="0" r="3.5" fill="#10b981" opacity="0.7" />
                  <circle cx="-2.5" cy="-1.2" r="2.5" fill="#6ee7b7" opacity="0.8" />
                  <circle cx="2.5" cy="-1.2" r="2.5" fill="#6ee7b7" opacity="0.8" />
                  <circle cx="-1.8" cy="2" r="2.5" fill="#6ee7b7" opacity="0.8" />
                  <circle cx="1.8" cy="2" r="2.5" fill="#6ee7b7" opacity="0.8" />
                  <circle cx="0" cy="0" r="1.3" fill="#fbbf24" opacity="0.9" />
                </g>
              </svg>
            </div>
            
            {/* Inner Light Grey Border */}
            <div 
              className="absolute inset-[6px] rounded-[74px] md:rounded-[94px] lg:rounded-[114px]"
              style={{
                border: '1px solid #d0d0d0',
              }}
            />
            
            {/* Globe inside rounded rectangle - Loads only when scrolled into view */}
            <div 
              className="absolute inset-[7px] rounded-[73px] md:rounded-[93px] lg:rounded-[113px] overflow-hidden z-10"
              style={{
                width: 'calc(100% - 14px)',
                height: 'calc(100% - 14px)',
              }}
            >
              <LazyGlobe showOvalBorder={false} showBackground={true} />
            </div>
          </div>
        </div>
        
        {/* Curved Loop Section - Below Globe */}
        <div className="relative w-full bg-white py-4 md:py-8">
          <CurvedLoop 
            marqueeText="Explore ✦ Nations ✦ Through ✦ Blooming ✦ Stories ✦ AquaMundi ✦"
            speed={2}
            curveAmount={220}
            direction="left"
            interactive={true}
            className="font-serif"
          />
        </div>
        
        {/* Image Gallery Section - Below Curved Loop */}
        <div className="relative w-full bg-white">
          <ImageGallery />
        </div>

        {/* Bento Grid Section - Below Image Gallery */}
        <BentoDemo />
      </main>
      
      {/* Footer */}
      <Footer />
      </div>
    </>
  );
}

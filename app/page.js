"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Navigation from "../components/Navigation";
import { HeroSection } from "../components/HeroSection";
import ImageGallery from "../components/ImageGallery";
import CurvedLoop from "../components/CurvedLoop";
import { BentoDemo } from "../components/BentoDemo";
import Footer from "../components/Footer";
import PageLoader from "../components/PageLoader";
import GlobeLoader from "../components/GlobeLoader";
import { MusicToggleButton } from "../components/MusicToggleButton";
import { useTranslation } from "../lib/useTranslation";

// Lazy load Globe component
const Globe = dynamic(() => import("../components/Globe"), {
  ssr: false,
  loading: () => <GlobeLoader />,
});

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isGlobeLoaded, setIsGlobeLoaded] = useState(false);
  const { t, isLoading: isTranslationLoading } = useTranslation();

  useEffect(() => {
    // Only redirect if we're on the asociacionnahiara.org domain
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'www.asociacionnahiara.org' || hostname === 'asociacionnahiara.org') {
        router.replace("/landing");
      }
    }
  }, [router]);

  // Handle page loading with minimum 5 seconds and parallel book cover preloading
  useEffect(() => {
    const startTime = Date.now();
    const MIN_LOAD_TIME = 5000; // 5 seconds minimum

    // Preload all book cover images in parallel
    const preloadBookCovers = async () => {
      const bookImages = [
        "/books/Book-Cover---Vol1-Spanish-Spine.png",
        "/books/1.png",
        "/books/Book-Cover---Vol2-Spine.png",
        "/books/2.png",
        "/books/Book-Cover---Vol3-spine.png",
        "/books/3.png",
        "/books/Book-Cover---Vol4-Spine.png",
        "/books/4.png",
        "/books/Book-Cover---Vol5-Spine.png",
        "/books/5.png",
        "/books/Book-Cover---Vol6-Spine.png",
        "/books/6.png",
        "/books/Book-Cover---Vol7-Spanish-spine.png",
        "/books/7.png",
      ];

      // Load all images in parallel
      const imagePromises = bookImages.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve; // Continue even if image fails
          img.src = src;
        });
      });

      // Start loading all images in parallel (don't wait for them)
      Promise.all(imagePromises).catch(() => {
        // Ignore errors, continue loading
      });
    };

    // Start preloading book covers immediately
    preloadBookCovers();

    // Always wait for minimum 5 seconds before hiding loader
    const minLoadTimer = setTimeout(() => {
      setIsLoading(false);
    }, MIN_LOAD_TIME);

    return () => {
      clearTimeout(minLoadTimer);
    };
  }, []);

  // Handle globe loading
  useEffect(() => {
    // Small delay to ensure smooth loading
    const timer = setTimeout(() => {
      setIsGlobeLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Check if we should show the redirect screen or normal content
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'www.asociacionnahiara.org' || hostname === 'asociacionnahiara.org') {
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
          transition: 'opacity 0.8s ease-in-out',
        }}
      >
      <main role="main" aria-label="Interactive 3D Globe of Sacred Flowers" className="relative">
        <Navigation />
        {/* Hero Section - Loads First */}
        <HeroSection />
        
        {/* Music Toggle Button - Bottom Left */}
        <div className="fixed bottom-6 left-6 z-50">
          <MusicToggleButton autoPlay={true} onLoadComplete={!isLoading} />
        </div>
        {/* GIF Animation Section - Rounded Rectangle Container */}
        <div id="globe-section" className="relative w-full min-h-screen flex items-center justify-center py-8 md:py-12 bg-transparent">
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
              className="absolute inset-[1px] rounded-[79px] md:rounded-[99px] lg:rounded-[119px] overflow-visible"
              style={{
                background: '#e5e5e5',
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
                  <rect width="100%" height="100%" fill="url(#floralBorderPattern)" />
                </svg>
              </div>
              
              {/* Decorative Botanical Patterns - Left Border Only */}
              <div className="absolute -left-[1px] top-0 bottom-0 w-[6px] overflow-hidden rounded-l-[79px] md:rounded-l-[99px] lg:rounded-l-[119px]">
                <svg className="absolute left-0 top-0 w-[6px] h-full pointer-events-none" style={{ opacity: 0.7, transform: 'rotate(-90deg) translateX(-100%)', transformOrigin: 'left top' }}>
                  <rect width="100%" height="6" fill="url(#floralBorderPattern)" />
                </svg>
              </div>
              
              {/* Decorative Botanical Patterns - Right Border Only */}
              <div className="absolute -right-[1px] top-0 bottom-0 w-[6px] overflow-hidden rounded-r-[79px] md:rounded-r-[99px] lg:rounded-r-[119px]">
                <svg className="absolute right-0 top-0 w-[6px] h-full pointer-events-none" style={{ opacity: 0.7, transform: 'rotate(90deg) translateY(-100%)', transformOrigin: 'right top' }}>
                  <rect width="100%" height="6" fill="url(#floralBorderPattern)" />
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
            </div>
            
            {/* Inner Light Grey Border */}
            <div 
              className="absolute inset-[6px] rounded-[74px] md:rounded-[94px] lg:rounded-[114px]"
              style={{
                border: '1px solid #d0d0d0',
              }}
            />
            
            {/* Interactive 3D Globe - Main landing page */}
            <div 
              className="absolute inset-[7px] rounded-[73px] md:rounded-[93px] lg:rounded-[113px] overflow-hidden z-10"
              style={{
                width: 'calc(100% - 14px)',
                height: 'calc(100% - 14px)',
              }}
            >
              {/* Show loader while globe is loading */}
              {!isGlobeLoaded && (
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 z-20"
                  role="status"
                  aria-live="polite"
                  aria-label="Loading interactive globe"
                >
                  <GlobeLoader />
                </div>
              )}
              
              {/* Interactive 3D Globe Component */}
              {isGlobeLoaded && (
                <div className="w-full h-full">
                  <Globe showOvalBorder={false} showBackground={true} />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Curved Loop Section - Below Globe */}
        <div className="relative w-full bg-transparent py-4 md:py-8">
          <CurvedLoop 
            marqueeText={t('home.marqueeText')}
            speed={2}
            curveAmount={220}
            direction="left"
            interactive={true}
            className="font-serif"
          />
        </div>
        
        {/* Image Gallery Section - Below Curved Loop */}
        <div className="relative w-full bg-transparent">
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

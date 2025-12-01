"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import GlobeLoader from "./GlobeLoader";

// Lazy load Globe component - no loading fallback, we handle it ourselves
const Globe = dynamic(() => import("./Globe"), {
  ssr: false,
});

export default function LazyGlobe({ showOvalBorder = false, showBackground = true }) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [isGlobeLoaded, setIsGlobeLoaded] = useState(false);
  const containerRef = useRef(null);
  const loadingStartTimeRef = useRef(null);

  // Check if hero section has been scrolled past
  useEffect(() => {
    const checkHeroScroll = () => {
      if (typeof window === 'undefined') return false;
      
      // Check if user has scrolled down significantly (past hero section)
      // Hero section is typically full viewport height, so scroll > 50vh means past hero
      const scrollThreshold = window.innerHeight * 0.5; // 50% of viewport height
      return window.scrollY > scrollThreshold;
    };

    const handleScroll = () => {
      if (checkHeroScroll() && !showLoader && !shouldLoad) {
        setShowLoader(true);
        loadingStartTimeRef.current = Date.now();
      }
    };

    // Check on mount and on scroll
    if (typeof window !== 'undefined') {
      handleScroll(); // Check immediately in case already scrolled
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [showLoader, shouldLoad]);

  // Handle globe loading with minimum 2 second display time
  useEffect(() => {
    if (!containerRef.current || !showLoader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Start loading when the container is about to be visible (200px before)
          if (entry.isIntersecting && !shouldLoad && showLoader) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // Start loading 200px before it's visible
        threshold: 0.01,
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad, showLoader]);

  // Ensure minimum 2 second loading time
  useEffect(() => {
    if (showLoader && loadingStartTimeRef.current) {
      const checkMinTime = () => {
        const elapsed = Date.now() - loadingStartTimeRef.current;
        const minLoadTime = 2000; // 2 seconds minimum
        
        if (elapsed < minLoadTime) {
          const remainingTime = minLoadTime - elapsed;
          const timer = setTimeout(() => {
            setIsGlobeReady(true);
          }, remainingTime);
          
          return () => clearTimeout(timer);
        } else {
          setIsGlobeReady(true);
        }
      };
      
      // Check immediately and set timer if needed
      const cleanup = checkMinTime();
      return cleanup;
    }
  }, [showLoader]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {shouldLoad && isGlobeReady ? (
        <>
          {/* Show loader overlay until Globe component is loaded */}
          {!isGlobeLoaded && (
            <div className="w-full h-full flex items-center justify-center bg-white/50 min-h-[600px] absolute inset-0 z-10">
              <GlobeLoader />
            </div>
          )}
          <GlobeComponentWrapper 
            showOvalBorder={showOvalBorder} 
            showBackground={showBackground}
            onMount={() => setIsGlobeLoaded(true)}
          />
        </>
      ) : (
        showLoader ? (
          <div className="w-full h-full flex items-center justify-center bg-white/50 min-h-[600px]">
            <GlobeLoader />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/50 min-h-[600px]">
            {/* Empty placeholder - no loader until scrolled from hero */}
          </div>
        )
      )}
    </div>
  );
}

// Wrapper to detect when Globe mounts
function GlobeComponentWrapper({ showOvalBorder, showBackground, onMount }) {
  useEffect(() => {
    // Small delay to ensure Globe is actually rendered
    const timer = setTimeout(() => {
      onMount();
    }, 200);
    return () => clearTimeout(timer);
  }, [onMount]);
  
  return <Globe showOvalBorder={showOvalBorder} showBackground={showBackground} />;
}


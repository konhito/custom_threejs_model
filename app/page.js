"use client";
import { useEffect, Suspense, lazy } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Navigation from "../components/Navigation";
import { HeroSection } from "../components/HeroSection";

// Lazy load Globe component - only load after hero section is visible
// Using intersection observer in the component itself for better control
const Globe = dynamic(() => import("../components/Globe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm">Preparing interactive globe...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're on the asociacionnahiara.org domain
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'www.asociacionnahiara.org' || hostname === 'asociacionnahiara.org') {
        router.replace("/landing");
      }
    }
  }, [router]);

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
    <main role="main" aria-label="Interactive 3D Globe of Sacred Flowers" className="relative">
      <Navigation />
      {/* Hero Section - Loads First */}
      <HeroSection />
      {/* Globe Section - Lazy Loaded */}
      <div id="globe-section" className="relative w-full">
        <Suspense fallback={
          <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">Loading interactive globe...</p>
            </div>
          </div>
        }>
          <Globe />
        </Suspense>
      </div>
    </main>
  );
}

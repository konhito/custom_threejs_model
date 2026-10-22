"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import Navigation from "../../components/Navigation";
import GlobeLoader from "../../components/GlobeLoader";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "../../lib/useTranslation";

// Lazy load Globe component
const Globe = dynamic(() => import("../../components/Globe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <GlobeLoader />
    </div>
  ),
});

export default function GlobePage() {
  const { t, isLoading } = useTranslation();
  return (
    <main role="main" aria-label={isLoading ? undefined : t("globeUi.pageAriaLabel")} className="relative min-h-screen">
      <Navigation />
      
      {/* Back to Home Button */}
      <Link
        href="/"
        className="absolute top-4 left-4 md:top-6 md:left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 group"
        aria-label={isLoading ? undefined : t("globeUi.backToHome")}
      >
        <ArrowLeft className="w-4 h-4 text-gray-700 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium text-gray-700">{isLoading ? "" : t("globeUi.backToHome")}</span>
      </Link>

      {/* Full Globe Experience - No oval border, full screen */}
      <div className="w-full h-screen relative">
        <Suspense fallback={
          <div className="w-full h-screen flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <GlobeLoader />
          </div>
        }>
          <Globe showOvalBorder={false} showBackground={true} />
        </Suspense>
      </div>
    </main>
  );
}


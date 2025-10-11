"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to landing page
    router.replace("/landing");
  }, [router]);

  // Show loading while redirecting
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

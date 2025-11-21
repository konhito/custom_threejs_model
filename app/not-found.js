'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Search, Flower2, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Flowers */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          >
            <Flower2 
              className="text-green-200 opacity-30" 
              size={20 + Math.random() * 30}
            />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 
            className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 bg-clip-text text-transparent animate-pulse"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            404
          </h1>
        </div>

        {/* Flower Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full shadow-2xl animate-bounce">
            <Flower2 className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Oops! It seems this flower has wilted away...
          </p>
          <p className="text-gray-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Auto Redirect Notice */}
        <div className="mb-8 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-green-200 shadow-lg">
          <p className="text-sm text-gray-600">
            Redirecting to home in{' '}
            <span className="font-bold text-emerald-600 text-xl">{countdown}</span>{' '}
            seconds...
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link
            href="/"
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-green-700 transform hover:scale-105 transition-all duration-300"
          >
            <Home className="w-5 h-5 group-hover:animate-pulse" />
            Back to Home
          </Link>

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-xl border-2 border-emerald-300 hover:bg-emerald-50 hover:border-emerald-500 transform hover:scale-105 transition-all duration-300 shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-green-200 shadow-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Popular Pages
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              href="/shop"
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-emerald-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🛍️</span>
              </div>
              <span className="text-xs font-medium text-gray-700">Shop</span>
            </Link>

            <Link
              href="/flowers"
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-emerald-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Flower2 className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">Flowers</span>
            </Link>

            <Link
              href="/pollinators"
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-emerald-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🐝</span>
              </div>
              <span className="text-xs font-medium text-gray-700">Pollinators</span>
            </Link>

            <Link
              href="/about"
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-emerald-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">About</span>
            </Link>
          </div>
        </div>

        {/* Footer Message */}
        <p className="mt-8 text-sm text-gray-500">
          Lost? Try the{' '}
          <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-semibold underline">
            home page
          </Link>{' '}
          or{' '}
          <Link href="/contact-the-author" className="text-emerald-600 hover:text-emerald-700 font-semibold underline">
            contact us
          </Link>
        </p>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
          }
          50% {
            transform: translateY(-10px) rotate(-5deg);
          }
          75% {
            transform: translateY(-15px) rotate(3deg);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}


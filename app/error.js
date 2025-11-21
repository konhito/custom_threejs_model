'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-full shadow-2xl animate-pulse">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h1 
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            Something Went Wrong
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            We encountered an unexpected error while processing your request.
          </p>
          {error?.message && (
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-red-200 shadow-md">
              <p className="text-sm text-gray-700 font-mono">
                {error.message}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button
            onClick={reset}
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-green-700 transform hover:scale-105 transition-all duration-300"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-xl border-2 border-emerald-300 hover:bg-emerald-50 hover:border-emerald-500 transform hover:scale-105 transition-all duration-300 shadow-md"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {/* Help Text */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200 shadow-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            If the problem persists:
          </h3>
          <ul className="text-sm text-gray-600 space-y-2 text-left max-w-md mx-auto">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">•</span>
              <span>Refresh the page or try again later</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">•</span>
              <span>Clear your browser cache and cookies</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">•</span>
              <span>Check your internet connection</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">•</span>
              <span>
                <Link href="/contact-the-author" className="text-emerald-600 hover:text-emerald-700 font-semibold underline">
                  Contact our support team
                </Link>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}


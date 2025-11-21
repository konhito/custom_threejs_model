'use client';

import { Flower2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Flower */}
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full shadow-2xl animate-bounce">
            <Flower2 className="w-12 h-12 text-white animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          
          {/* Pulse Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-emerald-300 rounded-full animate-ping"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-emerald-200 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 
          className="text-2xl md:text-3xl font-bold text-gray-800 mb-3"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          Loading...
        </h2>
        <p className="text-gray-600">
          Preparing something beautiful for you
        </p>

        {/* Animated Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}


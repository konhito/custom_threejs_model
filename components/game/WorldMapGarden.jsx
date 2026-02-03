"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { countriesData, getCompleteFlowerPath } from "@/lib/gameData";

// Country coordinates on the world map (percentage-based positioning)
const countryCoordinates = {
    PAKISTAN: { x: 68, y: 32 },
    PERU: { x: 22, y: 58 },
    TANZANIA: { x: 58, y: 55 },
    NICARAGUA: { x: 18, y: 45 },
    JAMAICA: { x: 23, y: 42 },
    SPAIN: { x: 48, y: 28 },
    SCOTLAND: { x: 48, y: 20 },
    GERMANY: { x: 51, y: 25 },
};

export default function WorldMapGarden({ completedFlowers = [], currentFlower }) {
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Get all completed flowers including the current one
    const allCompletedFlowers = [...new Set([...completedFlowers, currentFlower?.id])].filter(Boolean);

    return (
        <div className="relative w-full h-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-center justify-center">
            {/* World Map Background */}
            <div className="relative w-full h-full max-w-6xl mx-auto">
                {/* SVG World Map */}
                <svg
                    viewBox="0 0 1000 500"
                    className="w-full h-full"
                    style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
                >
                    {/* Ocean background */}
                    <rect width="1000" height="500" fill="#e0f2fe" />

                    {/* Simplified world continents */}
                    <g fill="#a7f3d0" stroke="#059669" strokeWidth="2">
                        {/* North America */}
                        <path d="M 50 80 Q 80 60 120 70 L 180 90 Q 200 110 190 150 L 170 180 Q 150 200 120 190 L 80 170 Q 60 140 50 120 Z" />

                        {/* South America */}
                        <path d="M 150 220 Q 170 210 190 230 L 200 280 Q 210 320 200 360 L 180 380 Q 160 390 150 370 L 140 320 Q 130 270 150 220 Z" />

                        {/* Europe */}
                        <path d="M 450 100 Q 480 90 510 100 L 540 120 Q 550 140 540 160 L 520 180 Q 490 190 460 180 L 440 160 Q 430 130 450 100 Z" />

                        {/* Africa */}
                        <path d="M 480 200 Q 510 190 540 210 L 560 250 Q 570 300 560 350 L 540 380 Q 510 390 480 380 L 460 340 Q 450 280 480 200 Z" />

                        {/* Asia */}
                        <path d="M 600 80 Q 650 70 700 90 L 750 120 Q 780 150 770 190 L 740 220 Q 700 240 660 230 L 620 200 Q 590 160 600 80 Z" />

                        {/* Australia */}
                        <path d="M 750 320 Q 780 310 810 330 L 830 360 Q 840 380 820 400 L 790 410 Q 760 400 750 380 Z" />
                    </g>

                    {/* Grid lines for a subtle map effect */}
                    <g stroke="#94a3b8" strokeWidth="0.5" opacity="0.3">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <line key={`h-${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} />
                        ))}
                        {Array.from({ length: 20 }).map((_, i) => (
                            <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
                        ))}
                    </g>
                </svg>

                {/* Flower Markers */}
                {mounted && countriesData.map((country) => {
                    const coords = countryCoordinates[country.id];
                    if (!coords) return null;

                    const isCompleted = allCompletedFlowers.includes(country.id);
                    const isCurrent = currentFlower?.id === country.id;
                    const isHovered = hoveredCountry === country.id;

                    return (
                        <div
                            key={country.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                            style={{
                                left: `${coords.x}%`,
                                top: `${coords.y}%`,
                                zIndex: isHovered ? 50 : isCurrent ? 40 : isCompleted ? 30 : 10,
                            }}
                            onMouseEnter={() => setHoveredCountry(country.id)}
                            onMouseLeave={() => setHoveredCountry(null)}
                        >
                            {/* Marker Pin */}
                            <div className="relative">
                                {/* Pulsing ring for current flower */}
                                {isCurrent && (
                                    <div className="absolute inset-0 -m-4">
                                        <div className="w-full h-full rounded-full bg-yellow-400/30 animate-ping" />
                                    </div>
                                )}

                                {/* Pin Container */}
                                <div
                                    className={`relative transition-all duration-300 ${isHovered ? 'scale-125' : 'scale-100'
                                        }`}
                                >
                                    {/* Pin Shadow */}
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-black/20 rounded-full blur-sm" />

                                    {/* Pin */}
                                    <div
                                        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                                                ? 'bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-500/50'
                                                : 'bg-gradient-to-br from-gray-300 to-gray-400 shadow-md'
                                            }`}
                                        style={{
                                            boxShadow: isCompleted
                                                ? '0 0 20px rgba(34, 197, 94, 0.6), 0 4px 6px rgba(0, 0, 0, 0.1)'
                                                : '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
                                        {/* Flower Icon or Lock */}
                                        <div className="text-xl">
                                            {isCompleted ? '🌸' : '🔒'}
                                        </div>

                                        {/* Sparkle effect for completed */}
                                        {isCompleted && (
                                            <div className="absolute inset-0 rounded-full">
                                                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                                                    <div
                                                        key={i}
                                                        className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                                                        style={{
                                                            left: '50%',
                                                            top: '50%',
                                                            transform: `rotate(${angle}deg) translateY(-20px)`,
                                                            animation: `sparkle-pulse ${1.5 + i * 0.1}s ease-in-out infinite`,
                                                            animationDelay: `${i * 0.1}s`,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Pin Stem */}
                                    <div
                                        className={`absolute left-1/2 -translate-x-1/2 top-full w-1 h-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-400'
                                            }`}
                                        style={{
                                            clipPath: 'polygon(50% 0%, 100% 0%, 75% 100%, 25% 100%, 0% 0%)',
                                        }}
                                    />
                                </div>

                                {/* Hover Card */}
                                {isHovered && (
                                    <div
                                        className="absolute left-1/2 -translate-x-1/2 bottom-full mb-6 w-64 bg-white rounded-xl shadow-2xl p-4 border-2 border-green-400 z-50"
                                        style={{
                                            animation: 'scaleIn 0.2s ease-out',
                                        }}
                                    >
                                        {/* Arrow pointing down */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 w-4 h-4 bg-white border-r-2 border-b-2 border-green-400 transform rotate-45" />

                                        {/* Content */}
                                        <div className="space-y-2">
                                            {/* Country Flag Emoji */}
                                            <div className="text-4xl text-center">
                                                {country.countryCode === 'PK' && '🇵🇰'}
                                                {country.countryCode === 'PE' && '🇵🇪'}
                                                {country.countryCode === 'TZ' && '🇹🇿'}
                                                {country.countryCode === 'NI' && '🇳🇮'}
                                                {country.countryCode === 'JM' && '🇯🇲'}
                                                {country.countryCode === 'ES' && '🇪🇸'}
                                                {country.countryCode === 'GB-SCT' && '🏴󠁧󠁢󠁳󠁣󠁴󠁿'}
                                                {country.countryCode === 'DE' && '🇩🇪'}
                                            </div>

                                            {/* Country Name */}
                                            <h3 className="text-lg font-bold text-center text-gray-800">
                                                {country.country}
                                            </h3>

                                            {/* Flower Name */}
                                            <div className="text-center">
                                                <p className="text-sm font-semibold text-green-600">
                                                    {country.flowerName}
                                                </p>
                                                <p className="text-xs italic text-gray-500">
                                                    {country.flowerScientificName}
                                                </p>
                                            </div>

                                            {/* Status */}
                                            <div className="text-center pt-2 border-t border-gray-200">
                                                {isCompleted ? (
                                                    <div className="flex items-center justify-center gap-2 text-green-600">
                                                        <span className="text-lg">✓</span>
                                                        <span className="text-sm font-semibold">Restored!</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2 text-gray-500">
                                                        <span className="text-lg">🔒</span>
                                                        <span className="text-sm">Not yet restored</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Flower Image Preview (if completed) */}
                                            {isCompleted && (
                                                <div className="relative w-full h-24 mt-2 rounded-lg overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
                                                    <Image
                                                        src={getCompleteFlowerPath(country.folder, 'png')}
                                                        alt={country.flowerName}
                                                        fill
                                                        className="object-contain p-2"
                                                        unoptimized
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Legend */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-200">
                    <h4 className="text-xs font-bold text-gray-700 mb-2">Your Garden</h4>
                    <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-600" />
                            <span className="text-gray-600">Restored ({allCompletedFlowers.length}/{countriesData.length})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-400" />
                            <span className="text-gray-600">Locked</span>
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-600 drop-shadow-lg">
                        🌍 Your Global Garden 🌍
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 mt-1">
                        Hover over countries to see your collection
                    </p>
                </div>
            </div>

            {/* CSS for animations */}
            <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translateX(-50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) scale(1);
          }
        }

        @keyframes sparkle-pulse {
          0%, 100% {
            opacity: 0;
            transform: rotate(var(--angle)) translateY(-20px) scale(0);
          }
          50% {
            opacity: 1;
            transform: rotate(var(--angle)) translateY(-25px) scale(1);
          }
        }
      `}</style>
        </div>
    );
}

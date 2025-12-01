"use client";

import { Flower2, Globe2, ShoppingBag, Sparkles, BookOpen, Gamepad2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import Shuffle from "./Shuffle";

const features = [
  {
    Icon: ShoppingBag,
    name: "Shop",
    description: "Support our mission with beautiful botanical collections",
    href: "/shop",
    cta: "Browse Shop",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-white overflow-hidden">
        {/* Base Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="shopPattern" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
              <g transform="translate(45, 45)">
                <ellipse cx="0" cy="0" rx="10" ry="15" fill="#6ee7b7" opacity="0.3" transform="rotate(-30)" />
                <ellipse cx="0" cy="0" rx="10" ry="15" fill="#6ee7b7" opacity="0.3" transform="rotate(30)" />
                <ellipse cx="0" cy="0" rx="10" ry="15" fill="#10b981" opacity="0.4" transform="rotate(90)" />
                <circle cx="0" cy="0" r="4" fill="#047857" opacity="0.5" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#shopPattern)" />
        </svg>
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-8 left-8 w-16 h-16 rounded-full bg-emerald-200/20 blur-xl group-hover:bg-emerald-300/30 transition-all duration-500" />
        <div className="absolute top-20 right-12 w-12 h-12 rounded-full bg-teal-200/25 blur-lg group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute bottom-16 left-12 w-8 h-8 rounded-full bg-emerald-300/30 blur-md group-hover:bg-emerald-400/40 transition-all duration-500" />
        
        {/* Grid Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="shopGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#shopGrid)" />
        </svg>
        
        {/* Main Icon */}
        <div className="absolute bottom-4 right-4 text-emerald-200/40 group-hover:text-emerald-300/60 transition-colors duration-300">
          <ShoppingBag size={100} strokeWidth={0.5} />
        </div>
        
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-teal-400/10 to-transparent rounded-tl-full" />
        
        {/* Glow Effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
          style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0) 0%, rgba(16, 185, 129, 0.05) 50%, transparent 100%)' }}
        />
      </div>
    ),
  },
  {
    Icon: Gamepad2,
    name: "Card Game",
    description: "Play and learn about flowers through an interactive card experience",
    href: "/flowers",
    cta: "Play Now",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-amber-50/30 to-white overflow-hidden">
        {/* Base Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cardGamePattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect x="10" y="10" width="30" height="40" rx="4" fill="#fcd34d" opacity="0.3" stroke="#fbbf24" strokeWidth="1" />
              <rect x="50" y="15" width="30" height="40" rx="4" fill="#fde68a" opacity="0.3" stroke="#f59e0b" strokeWidth="1" />
              <rect x="30" y="50" width="30" height="40" rx="4" fill="#fed7aa" opacity="0.3" stroke="#f97316" strokeWidth="1" />
              <circle cx="25" cy="30" r="3" fill="#fbbf24" opacity="0.4" />
              <circle cx="65" cy="35" r="3" fill="#f59e0b" opacity="0.4" />
              <circle cx="45" cy="70" r="3" fill="#f97316" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cardGamePattern)" />
        </svg>
        
        {/* Floating Card Shapes */}
        <div className="absolute top-12 left-16 w-20 h-28 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-lg rotate-12 shadow-lg group-hover:rotate-6 group-hover:scale-105 transition-all duration-500" />
        <div className="absolute top-20 right-20 w-16 h-24 bg-gradient-to-br from-orange-200/25 to-amber-200/25 rounded-lg -rotate-12 shadow-md group-hover:rotate-0 group-hover:scale-110 transition-all duration-500" />
        <div className="absolute bottom-16 left-24 w-18 h-26 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-lg rotate-6 shadow-lg group-hover:-rotate-6 group-hover:scale-105 transition-all duration-500" />
        
        {/* Sparkle Effects */}
        <div className="absolute top-8 right-12 w-2 h-2 bg-amber-400 rounded-full blur-sm opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300" />
        <div className="absolute top-24 left-32 w-1.5 h-1.5 bg-orange-400 rounded-full blur-sm opacity-50 group-hover:opacity-90 group-hover:scale-200 transition-all duration-300" />
        <div className="absolute bottom-20 right-24 w-2.5 h-2.5 bg-yellow-400 rounded-full blur-sm opacity-55 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300" />
        
        {/* Diagonal Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-8" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cardGameLines" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="60" y2="60" stroke="#f59e0b" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cardGameLines)" />
        </svg>
        
        {/* Main Icon */}
        <div className="absolute bottom-4 right-4 text-orange-200/40 group-hover:text-orange-300/60 transition-colors duration-300">
          <Gamepad2 size={110} strokeWidth={0.5} />
        </div>
        
        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-300/15 to-transparent rounded-br-3xl" />
        <div className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-tl from-orange-300/15 to-transparent rounded-tl-3xl" />
        
        {/* Animated Glow */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
          style={{ background: 'radial-gradient(circle, rgba(251, 191, 36, 0) 0%, rgba(251, 146, 60, 0.08) 50%, transparent 100%)' }}
        />
      </div>
    ),
  },
  {
    Icon: Flower2,
    name: "Sacred Flowers",
    description: "Discover the beauty and meaning behind each nation's sacred bloom",
    href: "/flowers",
    cta: "Explore Flowers",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-rose-50/30 to-white overflow-hidden">
        {/* Base Flower Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="flowerPattern1" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <g transform="translate(50, 50)">
                <circle cx="0" cy="0" r="8" fill="#fda4af" opacity="0.3" />
                <circle cx="-6" cy="-4" r="6" fill="#fecdd3" opacity="0.4" />
                <circle cx="6" cy="-4" r="6" fill="#fecdd3" opacity="0.4" />
                <circle cx="-5" cy="5" r="6" fill="#fecdd3" opacity="0.4" />
                <circle cx="5" cy="5" r="6" fill="#fecdd3" opacity="0.4" />
                <circle cx="0" cy="0" r="3" fill="#fb7185" opacity="0.5" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#flowerPattern1)" />
        </svg>
        
        {/* Floating Flower Petals */}
        <div className="absolute top-10 left-12 w-12 h-12 rounded-full bg-pink-200/30 blur-md group-hover:bg-pink-300/40 group-hover:scale-125 transition-all duration-500" />
        <div className="absolute top-16 right-16 w-10 h-10 rounded-full bg-rose-200/35 blur-lg group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute bottom-12 left-20 w-14 h-14 rounded-full bg-pink-300/25 blur-xl group-hover:bg-rose-300/35 group-hover:scale-130 transition-all duration-500" />
        <div className="absolute bottom-20 right-12 w-8 h-8 rounded-full bg-rose-300/30 blur-sm group-hover:scale-150 transition-transform duration-300" />
        
        {/* Petal Shapes */}
        <svg className="absolute top-8 right-8 w-16 h-16 opacity-20 group-hover:opacity-30 transition-opacity duration-300" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="8" cy="8" rx="6" ry="10" fill="#fda4af" transform="rotate(-20 8 8)" />
          <ellipse cx="8" cy="8" rx="6" ry="10" fill="#fecdd3" transform="rotate(20 8 8)" />
          <ellipse cx="8" cy="8" rx="6" ry="10" fill="#fda4af" transform="rotate(60 8 8)" />
          <circle cx="8" cy="8" r="3" fill="#fb7185" />
        </svg>
        
        <svg className="absolute bottom-16 left-12 w-12 h-12 opacity-15 group-hover:opacity-25 transition-opacity duration-300" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="6" cy="6" rx="5" ry="8" fill="#fecdd3" transform="rotate(-30 6 6)" />
          <ellipse cx="6" cy="6" rx="5" ry="8" fill="#fda4af" transform="rotate(30 6 6)" />
          <circle cx="6" cy="6" r="2.5" fill="#fb7185" />
        </svg>
        
        {/* Vine Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,50 Q100,30 200,50 T400,50" stroke="#fda4af" strokeWidth="1.5" fill="none" opacity="0.4" />
          <path d="M0,80 Q150,60 300,80 T600,80" stroke="#fecdd3" strokeWidth="1" fill="none" opacity="0.3" />
        </svg>
        
        {/* Main Icon */}
        <div className="absolute bottom-4 right-4 text-pink-200/40 group-hover:text-pink-300/60 transition-colors duration-300">
          <Flower2 size={120} strokeWidth={0.5} />
        </div>
        
        {/* Corner Flower Accents */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-pink-300/20 via-rose-300/10 to-transparent rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-rose-300/20 via-pink-300/10 to-transparent rounded-tl-full" />
        
        {/* Soft Glow */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
          style={{ background: 'radial-gradient(circle, rgba(251, 113, 133, 0) 0%, rgba(244, 63, 94, 0.06) 50%, transparent 100%)' }}
        />
      </div>
    ),
  },
  {
    Icon: Globe2,
    name: "Interactive Globe",
    description: "Journey through nations on our 3D globe of blooming stories",
    href: "/globe",
    cta: "View Globe",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-cyan-50/30 to-white overflow-hidden">
        {/* Base Globe Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="globePattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="20" fill="none" stroke="#67e8f9" strokeWidth="1" opacity="0.4" />
              <circle cx="40" cy="40" r="15" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.3" />
              <circle cx="40" cy="40" r="2" fill="#06b6d4" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#globePattern)" />
        </svg>
        
        {/* Orbiting Circles */}
        <div className="absolute top-12 left-12 w-16 h-16 rounded-full border-2 border-cyan-200/40 group-hover:border-cyan-300/60 group-hover:scale-110 transition-all duration-500" />
        <div className="absolute top-20 right-16 w-12 h-12 rounded-full border-2 border-blue-200/35 group-hover:border-blue-300/55 group-hover:scale-125 transition-all duration-500" />
        <div className="absolute bottom-16 left-16 w-10 h-10 rounded-full border-2 border-cyan-300/30 group-hover:border-cyan-400/50 group-hover:scale-150 transition-all duration-300" />
        
        {/* Latitude/Longitude Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-12" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="globeGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="25" fill="none" stroke="#67e8f9" strokeWidth="0.5" opacity="0.3" />
              <line x1="0" y1="30" x2="60" y2="30" stroke="#22d3ee" strokeWidth="0.5" opacity="0.3" />
              <line x1="30" y1="0" x2="30" y2="60" stroke="#22d3ee" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#globeGrid)" />
        </svg>
        
        {/* Satellite Points */}
        <div className="absolute top-16 left-20 w-2 h-2 bg-cyan-400 rounded-full blur-sm opacity-60 group-hover:opacity-100 group-hover:scale-200 group-hover:shadow-lg group-hover:shadow-cyan-400/50 transition-all duration-300" />
        <div className="absolute top-24 right-24 w-1.5 h-1.5 bg-blue-400 rounded-full blur-sm opacity-50 group-hover:opacity-90 group-hover:scale-250 transition-all duration-300" />
        <div className="absolute bottom-20 left-24 w-2.5 h-2.5 bg-cyan-500 rounded-full blur-sm opacity-55 group-hover:opacity-100 group-hover:scale-200 group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300" />
        <div className="absolute bottom-16 right-20 w-2 h-2 bg-blue-500 rounded-full blur-sm opacity-60 group-hover:opacity-100 group-hover:scale-200 transition-all duration-300" />
        
        {/* Main Icon */}
        <div className="absolute bottom-4 right-4 text-cyan-200/40 group-hover:text-cyan-300/60 transition-colors duration-300">
          <Globe2 size={100} strokeWidth={0.5} />
        </div>
        
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-cyan-300/15 to-transparent rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-blue-300/15 to-transparent rounded-tl-full" />
        
        {/* Radial Glow */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
          style={{ background: 'radial-gradient(circle, rgba(103, 232, 249, 0) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 100%)' }}
        />
      </div>
    ),
  },
  {
    Icon: Sparkles,
    name: "Pollinators",
    description: "Meet the guardians of our floral heritage and biodiversity",
    href: "/pollinators",
    cta: "Learn More",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-yellow-50/30 to-white overflow-hidden">
        {/* Base Pollinator Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pollinatorPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="6" fill="#fde047" opacity="0.4" />
              <circle cx="42" cy="45" r="5" fill="#fef08a" opacity="0.5" />
              <circle cx="58" cy="45" r="5" fill="#fef08a" opacity="0.5" />
              <path d="M50,50 Q30,40 20,50" stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.3" />
              <path d="M50,50 Q70,40 80,50" stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pollinatorPattern)" />
        </svg>
        
        {/* Butterfly Wings */}
        <svg className="absolute top-12 left-16 w-20 h-20 opacity-15 group-hover:opacity-25 transition-opacity duration-300" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="10" cy="10" rx="8" ry="12" fill="#fde047" transform="rotate(-30 10 10)" />
          <ellipse cx="10" cy="10" rx="8" ry="12" fill="#fef08a" transform="rotate(30 10 10)" />
          <circle cx="10" cy="10" r="2" fill="#fbbf24" />
        </svg>
        
        <svg className="absolute bottom-16 right-20 w-16 h-16 opacity-12 group-hover:opacity-22 transition-opacity duration-300" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="8" cy="8" rx="7" ry="10" fill="#fef08a" transform="rotate(-25 8 8)" />
          <ellipse cx="8" cy="8" rx="7" ry="10" fill="#fde047" transform="rotate(25 8 8)" />
          <circle cx="8" cy="8" r="1.5" fill="#fbbf24" />
        </svg>
        
        {/* Bee Shapes */}
        <div className="absolute top-20 right-16 w-8 h-8 rounded-full bg-yellow-300/40 blur-sm group-hover:scale-125 transition-transform duration-300" />
        <div className="absolute top-18 right-18 w-6 h-6 rounded-full bg-amber-300/50 blur-sm group-hover:scale-150 transition-transform duration-300" />
        <div className="absolute top-22 right-14 w-4 h-4 rounded-full bg-yellow-400/60 blur-sm group-hover:scale-175 transition-transform duration-300" />
        
        {/* Flight Paths */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 Q100,20 200,40 T400,40" stroke="#fbbf24" strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="4,4" />
          <path d="M0,70 Q150,50 300,70 T600,70" stroke="#fde047" strokeWidth="1" fill="none" opacity="0.25" strokeDasharray="3,3" />
          <path d="M0,100 Q120,80 240,100 T480,100" stroke="#fef08a" strokeWidth="1" fill="none" opacity="0.2" strokeDasharray="5,5" />
        </svg>
        
        {/* Sparkle Particles */}
        <div className="absolute top-12 right-24 w-1.5 h-1.5 bg-yellow-400 rounded-full blur-sm opacity-60 group-hover:opacity-100 group-hover:scale-200 group-hover:shadow-lg group-hover:shadow-yellow-400/50 transition-all duration-300" />
        <div className="absolute top-28 left-32 w-2 h-2 bg-amber-400 rounded-full blur-sm opacity-50 group-hover:opacity-90 group-hover:scale-250 transition-all duration-300" />
        <div className="absolute bottom-20 right-16 w-1.5 h-1.5 bg-yellow-500 rounded-full blur-sm opacity-55 group-hover:opacity-100 group-hover:scale-200 transition-all duration-300" />
        <div className="absolute bottom-24 left-24 w-2 h-2 bg-amber-500 rounded-full blur-sm opacity-60 group-hover:opacity-100 group-hover:scale-200 group-hover:shadow-lg group-hover:shadow-amber-500/50 transition-all duration-300" />
        
        {/* Main Icon */}
        <div className="absolute bottom-4 right-4 text-yellow-200/40 group-hover:text-yellow-300/60 transition-colors duration-300">
          <Sparkles size={110} strokeWidth={0.5} />
        </div>
        
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-28 h-28 bg-gradient-to-br from-yellow-300/20 via-amber-300/10 to-transparent rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-300/20 via-yellow-300/10 to-transparent rounded-tl-full" />
        
        {/* Warm Glow */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
          style={{ background: 'radial-gradient(circle, rgba(253, 224, 71, 0) 0%, rgba(251, 191, 36, 0.06) 50%, transparent 100%)' }}
        />
      </div>
    ),
  },
  {
    Icon: BookOpen,
    name: "Living Archive",
    description: "Stories, wisdom, and cultural heritage preserved for generations",
    href: "/living-archive",
    cta: "Read Stories",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-violet-50/30 to-white overflow-hidden">
        {/* Base Archive Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="archivePattern" x="0" y="0" width="110" height="110" patternUnits="userSpaceOnUse">
              <g transform="translate(55, 55)">
                <circle cx="0" cy="0" r="7" fill="#c4b5fd" opacity="0.4" />
                <circle cx="-5" cy="-3" r="5" fill="#ddd6fe" opacity="0.5" />
                <circle cx="5" cy="-3" r="5" fill="#ddd6fe" opacity="0.5" />
                <circle cx="-4" cy="4" r="5" fill="#ddd6fe" opacity="0.5" />
                <circle cx="4" cy="4" r="5" fill="#ddd6fe" opacity="0.5" />
                <circle cx="0" cy="0" r="2.5" fill="#a78bfa" opacity="0.6" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#archivePattern)" />
        </svg>
        
        {/* Floating Book Pages */}
        <div className="absolute top-10 left-12 w-16 h-20 bg-gradient-to-br from-violet-200/25 to-purple-200/25 rounded-sm shadow-md rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500" />
        <div className="absolute top-16 right-12 w-14 h-18 bg-gradient-to-br from-purple-200/30 to-violet-200/30 rounded-sm shadow-md -rotate-6 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500" />
        <div className="absolute bottom-12 left-16 w-12 h-16 bg-gradient-to-br from-violet-300/20 to-purple-300/20 rounded-sm shadow-sm rotate-2 group-hover:-rotate-2 group-hover:scale-105 transition-all duration-500" />
        
        {/* Text Lines Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-8" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="textLines" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <line x1="0" y1="20" x2="40" y2="20" stroke="#c4b5fd" strokeWidth="0.5" opacity="0.2" />
              <line x1="0" y1="25" x2="35" y2="25" stroke="#ddd6fe" strokeWidth="0.5" opacity="0.15" />
              <line x1="0" y1="30" x2="38" y2="30" stroke="#c4b5fd" strokeWidth="0.5" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#textLines)" />
        </svg>
        
        {/* Decorative Dots */}
        <div className="absolute top-20 right-20 w-2 h-2 bg-purple-400 rounded-full blur-sm opacity-50 group-hover:opacity-100 group-hover:scale-200 group-hover:shadow-lg group-hover:shadow-purple-400/50 transition-all duration-300" />
        <div className="absolute top-28 left-24 w-1.5 h-1.5 bg-violet-400 rounded-full blur-sm opacity-45 group-hover:opacity-90 group-hover:scale-250 transition-all duration-300" />
        <div className="absolute bottom-20 right-16 w-2 h-2 bg-purple-500 rounded-full blur-sm opacity-55 group-hover:opacity-100 group-hover:scale-200 transition-all duration-300" />
        <div className="absolute bottom-24 left-20 w-2.5 h-2.5 bg-violet-500 rounded-full blur-sm opacity-60 group-hover:opacity-100 group-hover:scale-200 group-hover:shadow-lg group-hover:shadow-violet-500/50 transition-all duration-300" />
        
        {/* Corner Bookmarks */}
        <div className="absolute top-0 right-8 w-3 h-12 bg-gradient-to-b from-purple-400/40 to-violet-400/40 rounded-b-sm group-hover:from-purple-500/60 group-hover:to-violet-500/60 transition-colors duration-300" />
        <div className="absolute top-4 right-12 w-2 h-10 bg-gradient-to-b from-violet-400/35 to-purple-400/35 rounded-b-sm group-hover:from-violet-500/55 group-hover:to-purple-500/55 transition-colors duration-300" />
        
        {/* Main Icon */}
        <div className="absolute bottom-4 right-4 text-purple-200/40 group-hover:text-purple-300/60 transition-colors duration-300">
          <BookOpen size={110} strokeWidth={0.5} />
        </div>
        
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-300/20 via-violet-300/10 to-transparent rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-tl from-violet-300/20 via-purple-300/10 to-transparent rounded-tl-full" />
        
        {/* Mystical Glow */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
          style={{ background: 'radial-gradient(circle, rgba(196, 181, 253, 0) 0%, rgba(139, 92, 246, 0.06) 50%, transparent 100%)' }}
        />
      </div>
    ),
  },
];

export function BentoDemo() {
  return (
    <div className="w-full px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50/30 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Shuffle
            text="Explore AquaMundi"
            tag="h2"
            shuffleDirection="right"
            duration={1}
            animationMode="evenodd"
            shuffleTimes={1}
            ease="power3.out"
            stagger={0.03}
            threshold={0.1}
            triggerOnce={true}
            triggerOnHover={true}
            respectReducedMotion={true}
            loop={true}
            loopDelay={0}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          />
          <motion.p 
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            Discover the beauty of nations through their sacred flowers and cultural stories
          </motion.p>
        </div>

        <BentoGrid>
          {features.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
}


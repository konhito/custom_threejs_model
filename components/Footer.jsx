"use client";

import Link from 'next/link';
import CircularText from './CircularText';

export default function Footer() {
  return (
    <footer className="relative w-full bg-black border-t border-gray-800 py-8 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 md:gap-12 lg:gap-16">
          {/* Left Side - AquaMundi Title and CircularText */}
          <div className="flex flex-col items-center lg:items-start w-full lg:w-auto">
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 md:mb-6 lg:mb-8 text-center lg:text-left"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              AquaMundi
            </h2>
            
            {/* CircularText below AquaMundi - Hidden on mobile, visible on tablet+ */}
            <div className="hidden sm:flex items-center justify-center lg:justify-start w-full mt-2">
              <div className="relative" style={{ width: '140px', height: '140px' }}>
                <CircularText
                  text="PROVENEYA & NAHIARA * "
                  spinDuration={20}
                  onHover="speedUp"
                  className="!text-white !w-[140px] !h-[140px]"
                />
              </div>
            </div>
            
            {/* Mobile Subtitle - Visible only on mobile */}
            <p className="sm:hidden text-gray-400 text-sm text-center mt-2">
              Proveneya & Nahiara
            </p>
          </div>

          {/* Center - Additional Footer Content */}
          <div className="grid grid-cols-2 sm:flex sm:flex-row sm:flex-wrap gap-6 sm:gap-8 md:gap-10 lg:gap-12 text-gray-400 flex-1 w-full lg:w-auto">
            {/* Explore Section */}
            <div className="text-left w-full sm:w-auto">
              <h3 className="font-semibold text-white mb-3 md:mb-4 text-base md:text-lg">Explore</h3>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
                <li>
                  <Link href="/" className="hover:text-white transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors duration-200">
                    What is AquaMundi?
                  </Link>
                </li>
                <li>
                  <Link href="/flowers" className="hover:text-white transition-colors duration-200">
                    National Flowers
                  </Link>
                </li>
                <li>
                  <Link href="/pollinators" className="hover:text-white transition-colors duration-200">
                    Pollinators
                  </Link>
                </li>
                <li>
                  <Link href="/pollinators/gallery" className="hover:text-white transition-colors duration-200">
                    Pollinator Gallery
                  </Link>
                </li>
              </ul>
            </div>

            {/* Learn Section */}
            <div className="text-left w-full sm:w-auto">
              <h3 className="font-semibold text-white mb-3 md:mb-4 text-base md:text-lg">Learn</h3>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
                <li>
                  <Link href="/guardians" className="hover:text-white transition-colors duration-200">
                    Guardians
                  </Link>
                </li>
                <li>
                  <Link href="/education" className="hover:text-white transition-colors duration-200">
                    Education & Community
                  </Link>
                </li>
                <li>
                  <Link href="/impact" className="hover:text-white transition-colors duration-200">
                    Impact & Transparency
                  </Link>
                </li>
                <li>
                  <Link href="/living-archive" className="hover:text-white transition-colors duration-200">
                    The Living Archive
                  </Link>
                </li>
              </ul>
            </div>

            {/* Initiatives Section */}
            <div className="text-left w-full sm:w-auto">
              <h3 className="font-semibold text-white mb-3 md:mb-4 text-base md:text-lg">Initiatives</h3>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
                <li>
                  <Link href="/araihan-measure" className="hover:text-white transition-colors duration-200">
                    Araihan Measure
                  </Link>
                </li>
                <li>
                  <Link href="/professionals" className="hover:text-white transition-colors duration-200">
                    Professionals
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Section */}
            <div className="text-left w-full sm:w-auto">
              <h3 className="font-semibold text-white mb-3 md:mb-4 text-base md:text-lg">Legal</h3>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
            <p className="text-center">© {new Date().getFullYear()} AquaMundi. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}


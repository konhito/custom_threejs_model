"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const [userEmail, setUserEmail] = useState('');
  const contactEmail = 'partnerships@asociacionnahiara.org';

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!userEmail.trim()) return;
    
    // Create mailto link to organization's email
    const mailtoSubject = encodeURIComponent('Contact from AquaMundi Website');
    const mailtoBody = encodeURIComponent(`Hello,\n\nFrom: ${userEmail.trim()}\n\nBest regards`);
    
    window.location.href = `mailto:${contactEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
    
    // Clear form after opening email client
    setTimeout(() => {
      setUserEmail('');
    }, 100);
  };

  return (
    <footer className="relative w-full bg-black border-t border-gray-800 py-6 sm:py-8 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 sm:gap-8 md:gap-12 lg:gap-16">
          {/* Left Side - Logo, AquaMundi Title and CircularText */}
          <div className="flex flex-col items-center lg:items-start w-full lg:w-auto">
            {/* Logo and AquaMundi in one line */}
            <div className="flex flex-row items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 mb-3 sm:mb-4 md:mb-6 lg:mb-8 w-full justify-center lg:justify-start">
              <div className="relative flex-shrink-0">
                <Image
                  src="/logo1.png"
                  alt="AquaMundi Logo"
                  width={120}
                  height={120}
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-24 lg:h-24 xl:w-28 xl:h-28 object-contain"
                  priority
                  sizes="(max-width: 640px) 40px, (max-width: 768px) 56px, (max-width: 1024px) 72px, 96px"
                />
              </div>
              <h2 
                className="text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white notranslate"
                style={{ fontFamily: '"Cormorant Garamond", serif', lineHeight: '1.2' }}
                translate="no"
              >
                AquaMundi
              </h2>
            </div>
            
            {/* Subtitle - Single line on all devices */}
            <p className="text-gray-400 text-xs sm:text-sm md:text-base text-center lg:text-left mt-2 notranslate whitespace-nowrap" translate="no">
              PROVENE & NIHAHA
            </p>
          </div>

          {/* Center - Additional Footer Content */}
          <div className="grid grid-cols-2 sm:flex sm:flex-row sm:flex-wrap gap-4 sm:gap-6 md:gap-8 lg:gap-12 text-gray-400 flex-1 w-full lg:w-auto">
            {/* Explore Section */}
            <div className="text-left w-full sm:w-auto">
              <h3 className="font-semibold text-white mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg">Explore</h3>
              <ul className="space-y-1.5 sm:space-y-2 md:space-y-3 text-xs sm:text-sm">
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
              <h3 className="font-semibold text-white mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg">Learn</h3>
              <ul className="space-y-1.5 sm:space-y-2 md:space-y-3 text-xs sm:text-sm">
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
              <h3 className="font-semibold text-white mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg">Initiatives</h3>
              <ul className="space-y-1.5 sm:space-y-2 md:space-y-3 text-xs sm:text-sm">
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
              <h3 className="font-semibold text-white mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg">Legal</h3>
              <ul className="space-y-1.5 sm:space-y-2 md:space-y-3 text-xs sm:text-sm">
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

        {/* Contact Section - Minimal */}
        <div className="mt-2 sm:mt-3">
          <div className="max-w-md mx-auto px-2">
            <p className="text-gray-500 text-xs text-center mb-2">Get in touch</p>
            <form onSubmit={handleEmailSubmit} className="flex gap-2">
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-3 sm:px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                required
              />
              <button
                type="submit"
                className="px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 md:pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
            <p className="text-center">© {new Date().getFullYear()} AquaMundi. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}


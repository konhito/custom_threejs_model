"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CircularText from './CircularText';
import { Mail, Send } from 'lucide-react';

export default function Footer() {
  const [userEmail, setUserEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const contactEmail = 'partnerships@asociacionnahiara.org';

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!userEmail.trim()) return;
    
    // Create mailto link to organization's email
    const mailtoSubject = subject.trim() 
      ? encodeURIComponent(subject.trim())
      : encodeURIComponent('Contact from AquaMundi Website');
    
    const mailtoBody = encodeURIComponent(
      `Hello,\n\n` +
      `From: ${userEmail.trim()}\n\n` +
      (message.trim() ? `Message:\n${message.trim()}\n\n` : '') +
      `Best regards,\n${userEmail.trim()}`
    );
    
    window.location.href = `mailto:${contactEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
    
    // Clear form after opening email client
    setTimeout(() => {
      setUserEmail('');
      setSubject('');
      setMessage('');
    }, 100);
  };

  return (
    <footer className="relative w-full bg-black border-t border-gray-800 py-8 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 md:gap-12 lg:gap-16">
          {/* Left Side - Logo, AquaMundi Title and CircularText */}
          <div className="flex flex-col items-center lg:items-start w-full lg:w-auto">
            {/* Logo and AquaMundi in one line */}
            <div className="flex flex-row items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 mb-4 md:mb-6 lg:mb-8 w-full justify-center lg:justify-start">
              <div className="relative flex-shrink-0">
                <Image
                  src="/logo1.png"
                  alt="AquaMundi Logo"
                  width={120}
                  height={120}
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 object-contain"
                  priority
                  sizes="(max-width: 640px) 48px, (max-width: 768px) 64px, (max-width: 1024px) 80px, 96px"
                />
              </div>
              <h2 
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white notranslate"
                style={{ fontFamily: '"Cormorant Garamond", serif', lineHeight: '1.2' }}
                translate="no"
              >
                AquaMundi
              </h2>
            </div>
            
            {/* CircularText below AquaMundi - Hidden on mobile, visible on tablet+ */}
            <div className="hidden sm:flex items-center justify-center lg:justify-start w-full mt-2">
              <div className="relative" style={{ width: '140px', height: '140px' }}>
                <CircularText
                  text="PROVENE & NIHAHA * "
                  spinDuration={20}
                  onHover="speedUp"
                  className="!text-white !w-[140px] !h-[140px]"
                  translate="no"
                />
              </div>
            </div>
            
            {/* Mobile Subtitle - Visible only on mobile */}
            <p className="sm:hidden text-gray-400 text-sm text-center mt-2 notranslate" translate="no">
              PROVENE & NIHAHA
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

        {/* Contact Section */}
        <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-gray-800">
          <div className="max-w-lg mx-auto">
            <h3 className="text-white font-semibold text-lg md:text-xl mb-4 text-center flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Us
            </h3>
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  required
                />
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject (optional)"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message (optional)"
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm resize-none"
              />
              <button
                type="submit"
                className="w-full px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
              >
                <Send className="w-4 h-4" />
                <span>Open Email Client</span>
              </button>
            </form>
            <p className="text-gray-400 text-xs text-center mt-3">
              Clicking "Open Email Client" will open your default email application
            </p>
            <p className="text-gray-500 text-xs text-center mt-1">
              Email will be sent to: <span className="text-emerald-400">{contactEmail}</span>
            </p>
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


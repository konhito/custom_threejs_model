"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '../lib/useTranslation';
import LanguageSwitcher from './LanguageSwitcher';

export default function Footer() {
  const [userEmail, setUserEmail] = useState('');
  const contactEmail = 'partnerships@asociacionnahiara.org';
  const { t, locale } = useTranslation();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!userEmail.trim()) return;
    
    // Create mailto link to organization's email
    const mailtoSubject = encodeURIComponent(t('footer.contactSubject'));
    const mailtoBody = encodeURIComponent(t('footer.contactBody', { email: userEmail.trim() }));
    
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
                  alt={t('footer.logoAlt')}
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
                {t('home.brandName')}
              </h2>
            </div>
            
            {/* Subtitle - Single line on all devices */}
            <p className="text-gray-400 text-xs sm:text-sm md:text-base text-center lg:text-left mt-2 notranslate whitespace-nowrap" translate="no">
              {t('gamePilot.ui.brandName')}
            </p>
          </div>

          {/* Center - Additional Footer Content */}
          <div className="grid grid-cols-2 sm:flex sm:flex-row sm:flex-wrap gap-4 sm:gap-6 md:gap-8 lg:gap-12 text-gray-400 flex-1 w-full lg:w-auto">
            {/* Explore Section */}
            <div className="text-left w-full sm:w-auto">
              <h3 className="font-semibold text-white mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg">{t('footer.explore')}</h3>
              <ul className="space-y-1.5 sm:space-y-2 md:space-y-3 text-xs sm:text-sm">
                <li>
                  <Link href="/" className="hover:text-white transition-colors duration-200">
                    {t('nav.home')}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors duration-200">
                    {t('nav.about')}
                  </Link>
                </li>
                <li>
                  <Link href="/flowers" className="hover:text-white transition-colors duration-200">
                    {t('nav.flowers')}
                  </Link>
                </li>
                <li>
                  <Link href="/pollinators" className="hover:text-white transition-colors duration-200">
                    {t('nav.pollinators')}
                  </Link>
                </li>
                <li>
                  <Link href="/pollinators/gallery" className="hover:text-white transition-colors duration-200">
                    {t('nav.pollinatorGallery')}
                  </Link>
                </li>
                <li>
                  <Link href="/evento-dibuja-flor" className="hover:text-white transition-colors duration-200">
                    {t('footer.aprilEvent')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Learn Section */}
            <div className="text-left w-full sm:w-auto">
              <h3 className="font-semibold text-white mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg">{t('footer.learn')}</h3>
              <ul className="space-y-1.5 sm:space-y-2 md:space-y-3 text-xs sm:text-sm">
                <li>
                  <Link href="/guardians" className="hover:text-white transition-colors duration-200">
                    {t('nav.guardians')}
                  </Link>
                </li>
                <li>
                  <Link href="/education" className="hover:text-white transition-colors duration-200">
                    {t('nav.education')}
                  </Link>
                </li>
                <li>
                  <Link href="/impact" className="hover:text-white transition-colors duration-200">
                    {t('nav.impact')}
                  </Link>
                </li>
                <li>
                  <Link href="/living-archive" className="hover:text-white transition-colors duration-200">
                    {t('nav.archive')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Initiatives Section */}
            <div className="text-left w-full sm:w-auto">
              <h3 className="font-semibold text-white mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg">{t('footer.initiatives')}</h3>
              <ul className="space-y-1.5 sm:space-y-2 md:space-y-3 text-xs sm:text-sm">
                <li>
                  <Link href="/san-system" className="hover:text-white transition-colors duration-200">
                    {t('footer.sanSystem')}
                  </Link>
                </li>
                <li>
                  <Link href="/nahiara-measure" className="hover:text-white transition-colors duration-200">
                    {t('footer.nahiaraMeasure')}
                  </Link>
                </li>
                <li>
                  <Link href="/araihan-measure" className="hover:text-white transition-colors duration-200">
                    {t('nav.araihan')}
                  </Link>
                </li>
                <li>
                  <Link href="/scorfidon" className="hover:text-white transition-colors duration-200">
                    {t('footer.scorfidonProtocol')}
                  </Link>
                </li>
                <li>
                  <Link href="/pfno" className="hover:text-white transition-colors duration-200">
                    {t('footer.pfnoProtocol')}
                  </Link>
                </li>
                <li>
                  <Link href="/professionals" className="hover:text-white transition-colors duration-200">
                    {t('nav.professionals')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Section */}
            <div className="text-left w-full sm:w-auto">
              <h3 className="font-semibold text-white mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg">{t('footer.legal')}</h3>
              <ul className="space-y-1.5 sm:space-y-2 md:space-y-3 text-xs sm:text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                    {t('footer.privacyPolicy')}
                  </Link>
                </li>
                <li>
                  <Link href="/legal-notice" className="hover:text-white transition-colors duration-200">{t('footer.legalNotice')}</Link>
                </li>
                <li>
                  <button type="button" onClick={() => window.dispatchEvent(new Event('cookie-settings'))} className="hover:text-white transition-colors duration-200">{t('footer.cookieSettings')}</button>
                </li>
              </ul>
            </div>

            {/* Language Section */}
            <div className="text-left w-full sm:w-auto">
              <h3 className="font-semibold text-white mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg">{t('footer.language')}</h3>
              <LanguageSwitcher currentLocale={locale} variant="footer" />
            </div>
          </div>
        </div>

        {/* Contact Section - Minimal */}
        <div className="mt-2 sm:mt-3">
          <div className="max-w-md mx-auto px-2">
            <p className="text-gray-500 text-xs text-center mb-2">{t('footer.getInTouch')}</p>
            <form onSubmit={handleEmailSubmit} className="space-y-2">
              <div className="flex gap-2">
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder={t('footer.yourEmail')}
                className="flex-1 px-3 sm:px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                required
              />
              <button
                type="submit"
                className="px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
              >
                {t('footer.send')}
              </button>
              </div>
              <label className="flex items-start gap-2 text-xs text-gray-400">
                <input type="checkbox" required className="mt-0.5 h-3.5 w-3.5" />
                <span>{t('footer.privacyAcceptPrefix')} <Link href="/privacy" className="underline">{t('footer.privacyPolicy')}</Link>{t('footer.privacyAcceptSuffix')}</span>
              </label>
            </form>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-8 mb-4">
          <div className="flex flex-col items-center justify-center gap-1.5">
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
              {/* WhatsApp */}
              <a href="https://whatsapp.com/channel/0029VbCGKZbLNSa1vvIXdK0H" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="WhatsApp Canal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/proveneya_and_nahiara" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              {/* TikTok */}
              <a href="https://www.tiktok.com/@proveneya_and_nahiara" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="TikTok">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </a>
              {/* Pinterest */}
              <a href="https://es.pinterest.com/proveneyaandnahiara" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Pinterest">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.614 0 12.017 0z"/></svg>
              </a>
              {/* X / Twitter */}
              <a href="https://x.com/NahiaraOfficial" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="X">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* YouTube */}
              <a href="https://www.youtube.com/@Proveneya_and_Nahiara" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/proveneya-and-nahiara/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 md:pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
            <p className="text-center">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}


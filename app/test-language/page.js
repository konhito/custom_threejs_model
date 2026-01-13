"use client";
import { useState, useEffect } from "react";
import { useTranslation, getCurrentLocale, changeLanguage, locales } from "../../lib/useTranslation";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

export default function TestLanguagePage() {
  const { t, locale, isLoading, messages } = useTranslation();
  const [cookies, setCookies] = useState({});
  const [refreshCount, setRefreshCount] = useState(0);

  // Get all cookies
  useEffect(() => {
    const parseCookies = () => {
      const cookieObj = {};
      document.cookie.split('; ').forEach(cookie => {
        const [name, value] = cookie.split('=');
        if (name) cookieObj[name] = value;
      });
      setCookies(cookieObj);
    };
    
    parseCookies();
    const interval = setInterval(parseCookies, 1000);
    return () => clearInterval(interval);
  }, [refreshCount]);

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  const handleClearCookies = () => {
    // Clear language-related cookies
    document.cookie = 'NEXT_LOCALE=;path=/;max-age=0';
    document.cookie = 'LOCALE_MANUAL=;path=/;max-age=0';
    setRefreshCount(prev => prev + 1);
    alert('Cookies cleared! Page will reload...');
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            🌍 Language Translation Test
          </h1>

          {isLoading ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading translations...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Status */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  📊 Current Status
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Current Locale (from hook):</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {locale.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">getCurrentLocale():</span>
                    <span className="text-lg font-mono text-gray-900">
                      {getCurrentLocale()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Messages Loaded:</span>
                    <span className={`text-lg font-semibold ${messages ? 'text-green-600' : 'text-red-600'}`}>
                      {messages ? '✅ Yes' : '❌ No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cookie Status */}
              <div className="bg-yellow-50 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  🍪 Cookie Values
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-yellow-200">
                    <span className="font-medium text-gray-700">NEXT_LOCALE:</span>
                    <span className="text-lg font-mono text-gray-900 bg-yellow-100 px-3 py-1 rounded">
                      {cookies.NEXT_LOCALE || '(not set)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-yellow-200">
                    <span className="font-medium text-gray-700">LOCALE_MANUAL:</span>
                    <span className="text-lg font-mono text-gray-900 bg-yellow-100 px-3 py-1 rounded">
                      {cookies.LOCALE_MANUAL || '(not set)'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleClearCookies}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Clear Language Cookies
                </button>
              </div>

              {/* Language Switcher Test */}
              <div className="bg-green-50 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  🔄 Switch Language
                </h2>
                <div className="flex flex-wrap gap-3">
                  {locales.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        locale === lang
                          ? 'bg-green-600 text-white shadow-lg scale-105'
                          : 'bg-white text-gray-700 hover:bg-green-100 border border-gray-200'
                      }`}
                    >
                      {lang === 'en' && '🇬🇧 English'}
                      {lang === 'es' && '🇪🇸 Español'}
                      {lang === 'zh' && '🇨🇳 中文'}
                      {lang === 'fr' && '🇫🇷 Français'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Translation Test - Hero Section */}
              <div className="bg-blue-50 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  🎯 Landing Page Hero Section (translated)
                </h2>
                <div className="space-y-4 bg-white p-6 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-500">landing.heroTitle:</span>
                    <p className="text-2xl font-bold text-gray-900">{t('landing.heroTitle')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">landing.heroSubtitle:</span>
                    <p className="text-xl text-green-700">{t('landing.heroSubtitle')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">landing.heroTagline:</span>
                    <p className="text-lg text-gray-600 italic">{t('landing.heroTagline')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">landing.contactUs:</span>
                    <p className="text-lg text-gray-700">{t('landing.contactUs')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">landing.explore3DArchive:</span>
                    <p className="text-lg text-gray-700">{t('landing.explore3DArchive')}</p>
                  </div>
                </div>
              </div>

              {/* Other Translation Tests */}
              <div className="bg-purple-50 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  📝 Other Translations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <span className="text-sm text-gray-500">nav.home:</span>
                    <p className="font-semibold">{t('nav.home')}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <span className="text-sm text-gray-500">nav.about:</span>
                    <p className="font-semibold">{t('nav.about')}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <span className="text-sm text-gray-500">nav.flowers:</span>
                    <p className="font-semibold">{t('nav.flowers')}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <span className="text-sm text-gray-500">common.loading:</span>
                    <p className="font-semibold">{t('common.loading')}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <span className="text-sm text-gray-500">footer.explore:</span>
                    <p className="font-semibold">{t('footer.explore')}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <span className="text-sm text-gray-500">language.currentLanguage:</span>
                    <p className="font-semibold">{t('language.currentLanguage')}</p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-50 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  📋 How to Test
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Click any language button above to switch languages</li>
                  <li>The page will reload with the new language</li>
                  <li>Check that the Hero Section shows translated content</li>
                  <li>Verify the cookies are set correctly</li>
                  <li>Navigate to <a href="/landing" className="text-blue-600 underline">/landing</a> to see the actual landing page</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

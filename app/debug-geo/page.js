"use client";

import { useEffect, useState } from "react";
import { useTranslation, getCurrentLocale } from "../../lib/useTranslation";

export default function DebugGeoPage() {
  const { t, locale } = useTranslation();
  const [cookies, setCookies] = useState({});
  const [headers, setHeaders] = useState({});
  const [debugHeaders, setDebugHeaders] = useState({});

  useEffect(() => {
    // Get all cookies
    const parseCookies = () => {
      const cookieObj = {};
      document.cookie.split('; ').forEach(cookie => {
        const [name, value] = cookie.split('=');
        if (name) cookieObj[name] = value;
      });
      setCookies(cookieObj);
    };
    
    parseCookies();

    // Get some client info
    setHeaders({
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    // Fetch debug headers from a request
    fetch(window.location.href, { method: 'HEAD' })
      .then(response => {
        setDebugHeaders({
          country: response.headers.get('X-Debug-Country'),
          locale: response.headers.get('X-Debug-Locale'),
          geoCountry: response.headers.get('X-Debug-Geo-Country'),
          manual: response.headers.get('X-Debug-Manual'),
        });
      })
      .catch(err => console.log('Could not fetch debug headers:', err));
  }, []);

  const clearAllCookies = () => {
    // Clear all language-related cookies
    document.cookie = 'NEXT_LOCALE=;path=/;max-age=0';
    document.cookie = 'LOCALE_MANUAL=;path=/;max-age=0';
    document.cookie = 'DEBUG_COUNTRY=;path=/;max-age=0';
    alert('All language cookies cleared! Page will reload...');
    setTimeout(() => window.location.reload(), 500);
  };

  const simulateCountry = (countryCode) => {
    // Set a debug cookie to simulate country
    document.cookie = `DEBUG_COUNTRY=${countryCode};path=/;max-age=${60 * 60}`;
    alert(`Simulating country: ${countryCode}. Page will reload...`);
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🌍 Geo Detection Debug
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📊 Current Status
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Hook Locale:</span>
                <span className="text-lg font-bold text-blue-600">{locale}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">getCurrentLocale():</span>
                <span className="text-lg font-mono text-gray-900">{getCurrentLocale()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Sample Translation:</span>
                <span className="text-sm text-gray-600">{t('nav.home')}</span>
              </div>
            </div>
          </div>

          {/* Cookies */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🍪 Cookies
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">NEXT_LOCALE:</span>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {cookies.NEXT_LOCALE || '(not set)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">LOCALE_MANUAL:</span>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {cookies.LOCALE_MANUAL || '(not set)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">DEBUG_COUNTRY:</span>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {cookies.DEBUG_COUNTRY || '(not set)'}
                </span>
              </div>
            </div>
            <button
              onClick={clearAllCookies}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Clear All Language Cookies
            </button>
          </div>

          {/* Server Debug Info */}
          <div className="bg-purple-50 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🔍 Server Detection (Middleware)
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Detected Country:</span>
                <span className="text-lg font-bold text-purple-600">{debugHeaders.country || 'Loading...'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Detected Locale:</span>
                <span className="text-lg font-bold text-purple-600">{debugHeaders.locale || 'Loading...'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Vercel Geo Country:</span>
                <span className="text-sm font-mono bg-purple-100 px-2 py-1 rounded">{debugHeaders.geoCountry || 'Loading...'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Manual Override:</span>
                <span className="text-sm font-mono bg-purple-100 px-2 py-1 rounded">{debugHeaders.manual || 'Loading...'}</span>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              💻 Client Info
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">Browser Language:</span>
                <div className="text-gray-600 font-mono">{headers.language}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">All Languages:</span>
                <div className="text-gray-600 font-mono">{JSON.stringify(headers.languages)}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Timezone:</span>
                <div className="text-gray-600 font-mono">{headers.timezone}</div>
              </div>
            </div>
          </div>

          {/* Country Simulation */}
          <div className="bg-green-50 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🌍 Simulate Countries (Development)
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => simulateCountry('FR')}
                className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                🇫🇷 France (French)
              </button>
              <button
                onClick={() => simulateCountry('ES')}
                className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                🇪🇸 Spain (Spanish)
              </button>
              <button
                onClick={() => simulateCountry('CN')}
                className="px-3 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
              >
                🇨🇳 China (Chinese)
              </button>
              <button
                onClick={() => simulateCountry('US')}
                className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              >
                🇺🇸 USA (English)
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📋 Debug Steps
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Use the country simulation buttons above (for development)</li>
              <li>Check if LOCALE_MANUAL cookie is set (should be empty for IP detection)</li>
              <li>Clear cookies if needed using the button above</li>
              <li>Refresh the page to trigger middleware</li>
              <li>Check console for middleware debug logs</li>
            </ol>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            ⚠️ Troubleshooting
          </h3>
          <p className="text-yellow-700 text-sm">
            If you're using a VPN to France but still seeing English:
          </p>
          <ul className="list-disc list-inside mt-2 text-sm text-yellow-700 space-y-1">
            <li>Clear the LOCALE_MANUAL cookie (it overrides IP detection)</li>
            <li>Check if your VPN is actually routing through France</li>
            <li>Vercel's geo detection might take time to update</li>
            <li>Try opening in an incognito/private window</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
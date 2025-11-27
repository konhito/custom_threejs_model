"use client";
import { useLanguageDetection } from "../../hooks/useLanguageDetection";
import Navigation from "../../components/Navigation";

export default function TestLanguagePage() {
  const { 
    country, 
    suggestedLanguage, 
    currentLanguage, 
    isDetecting,
    shouldSuggestLanguage 
  } = useLanguageDetection();

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Language Detection Test
          </h1>

          {isDetecting ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Detecting your location...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Status */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Current Status
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Your Country:</span>
                    <span className="text-gray-900 font-mono text-lg">
                      {country || "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Suggested Language:</span>
                    <span className="text-gray-900 font-mono text-lg">
                      {suggestedLanguage.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Current Language:</span>
                    <span className="text-gray-900 font-mono text-lg">
                      {currentLanguage.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-700">Should Suggest Other Language:</span>
                    <span className={`text-lg font-semibold ${shouldSuggestLanguage ? 'text-orange-600' : 'text-green-600'}`}>
                      {shouldSuggestLanguage ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Language System Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  System Information
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div className="bg-white rounded p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Current Mode</h3>
                    <p>✅ English Only</p>
                    <p className="text-sm text-gray-600 mt-1">
                      All content is served in English. Multi-language support is ready but not activated.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">IP Detection</h3>
                    <p>✅ Active</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Your location is detected via IP address for analytics and future language suggestions.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Supported Countries</h3>
                    <p className="text-sm text-gray-600">
                      <strong>Spanish:</strong> ES, MX, AR, CO, CL, PE, VE, EC, GT, CU, BO, DO, HN, PY, SV, NI, CR, PA, UY
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>English:</strong> All other countries (default)
                    </p>
                  </div>
                </div>
              </div>

              {/* What Happens in Future */}
              {shouldSuggestLanguage && (
                <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-semibold text-orange-900 mb-4">
                    🌍 Future Multi-Language Support
                  </h2>
                  <p className="text-orange-800 mb-4">
                    Based on your location ({country}), we detected that you might prefer content in{" "}
                    <strong>{suggestedLanguage.toUpperCase()}</strong>.
                  </p>
                  <p className="text-orange-700 text-sm">
                    When multi-language support is activated, you'll see content in your preferred language automatically!
                  </p>
                </div>
              )}

              {/* Developer Info */}
              <div className="bg-gray-50 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  For Developers
                </h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Hook Usage:</h3>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
{`import { useLanguageDetection } from '../hooks/useLanguageDetection';

const { country, suggestedLanguage, currentLanguage } = useLanguageDetection();`}
                    </pre>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">API Endpoint:</h3>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
{`GET /api/detect-country

Response:
{
  "country": "${country || 'XX'}",
  "detected": ${!!country},
  "suggestedLanguage": "${suggestedLanguage}"
}`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Documentation Link */}
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                  📚 Documentation
                </h2>
                <p className="text-blue-800 mb-4">
                  For full documentation on the language system, see:
                </p>
                <ul className="list-disc list-inside text-blue-700 space-y-2">
                  <li><code className="bg-blue-100 px-2 py-1 rounded">frontend/LANGUAGE_SYSTEM_README.md</code></li>
                  <li><code className="bg-blue-100 px-2 py-1 rounded">backed/TRANSLATION_SYSTEM_GUIDE.md</code></li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


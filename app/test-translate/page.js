"use client";
import { useState, useEffect } from "react";
import Navigation from "../../components/Navigation";
import { Languages, Save, Check, AlertCircle, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Sample website content to translate
const SAMPLE_CONTENT = {
  common: {
    welcome: "Welcome to AquaMundi",
    about: "About Us",
    shop: "Shop",
    cart: "Cart",
    checkout: "Checkout",
    orderSuccess: "Order Successful",
    contactUs: "Contact Us",
    learnMore: "Learn More",
    viewDetails: "View Details",
  },
  navigation: {
    flowers: "National Flowers",
    pollinators: "Pollinators",
    guardians: "Guardians",
    education: "Education",
    impact: "Impact",
    livingArchive: "Living Archive",
    professionals: "Professionals",
  },
  shop: {
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    price: "Price",
    quantity: "Quantity",
    subtotal: "Subtotal",
    total: "Total",
    proceedToCheckout: "Proceed to Checkout",
  },
};

export default function TranslateTestPage() {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState(['en', 'es', 'fr', 'de', 'pt', 'ar', 'zh', 'ja']);
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  // Fetch supported languages on mount
  useEffect(() => {
    async function fetchLanguages() {
      try {
        const response = await fetch(`${API_URL}/api/translate/languages`);
        const data = await response.json();
        if (data.success) {
          setLanguages(data.languages);
        }
      } catch (error) {
        console.error('Failed to fetch languages:', error);
        setStatus({ type: 'error', message: 'Failed to load languages' });
      }
    }
    fetchLanguages();
  }, []);

  // Toggle language selection
  const toggleLanguage = (code) => {
    setSelectedLanguages(prev =>
      prev.includes(code)
        ? prev.filter(l => l !== code)
        : [...prev, code]
    );
  };

  // Translate content
  const handleTranslate = async () => {
    if (selectedLanguages.length === 0) {
      setStatus({ type: 'error', message: 'Please select at least one language' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });
    setProgress({ current: 0, total: selectedLanguages.length });
    
    const newTranslations = { en: SAMPLE_CONTENT };

    try {
      // Translate to each selected language
      for (let i = 0; i < selectedLanguages.length; i++) {
        const langCode = selectedLanguages[i];
        
        // Skip English (source language)
        if (langCode === 'en') {
          continue;
        }

        setProgress({ current: i + 1, total: selectedLanguages.length });
        setStatus({ type: 'info', message: `Translating to ${langCode.toUpperCase()}...` });

        const response = await fetch(`${API_URL}/api/translate/object`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            object: SAMPLE_CONTENT,
            targetLanguage: langCode,
            sourceLanguage: 'en',
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          newTranslations[langCode] = data.translated;
        } else {
          throw new Error(data.error || 'Translation failed');
        }
      }

      setTranslations(newTranslations);
      setStatus({ type: 'success', message: `Successfully translated to ${selectedLanguages.length} languages!` });
    } catch (error) {
      console.error('Translation error:', error);
      setStatus({ type: 'error', message: `Translation failed: ${error.message}` });
    } finally {
      setLoading(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  // Save translations to PostgreSQL
  const handleSave = async () => {
    if (Object.keys(translations).length === 0) {
      setStatus({ type: 'error', message: 'No translations to save. Translate first!' });
      return;
    }

    setSaving(true);
    setStatus({ type: '', message: '' });

    try {
      // Prepare data for batch save
      const items = [];
      
      // Flatten nested structure into individual keys
      Object.entries(SAMPLE_CONTENT).forEach(([namespace, content]) => {
        Object.entries(content).forEach(([key, _]) => {
          const translationSet = {};
          
          // Collect translations for this key across all languages
          Object.entries(translations).forEach(([lang, translatedContent]) => {
            if (translatedContent[namespace] && translatedContent[namespace][key]) {
              translationSet[lang] = translatedContent[namespace][key];
            }
          });

          items.push({
            key: `${namespace}.${key}`,
            translations: translationSet,
            metadata: {
              context: `${namespace} section`,
              source: 'Google Translate API',
              translatedAt: new Date().toISOString(),
            },
          });
        });
      });

      const response = await fetch(`${API_URL}/api/translate/save-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          namespace: 'website',
          items,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ 
          type: 'success', 
          message: `Saved ${data.saved} translation keys to database!` 
        });
      } else {
        throw new Error(data.error || 'Save failed');
      }
    } catch (error) {
      console.error('Save error:', error);
      setStatus({ type: 'error', message: `Save failed: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  // Most used languages
  const popularLanguages = [
    'en', 'es', 'zh', 'hi', 'ar', 'pt', 'bn', 'ru', 
    'ja', 'fr', 'de', 'it', 'ko', 'tr', 'vi', 'pl'
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <Languages className="w-12 h-12 text-blue-600" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Translation Test
              </h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Test Google Translate API integration and save translations to PostgreSQL
            </p>
          </div>

          {/* Status Message */}
          {status.message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              status.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
              status.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
              'bg-blue-50 border border-blue-200 text-blue-800'
            }`}>
              {status.type === 'success' ? <Check className="w-5 h-5" /> :
               status.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
               <Loader2 className="w-5 h-5 animate-spin" />}
              <span className="font-medium">{status.message}</span>
            </div>
          )}

          {/* Progress Bar */}
          {loading && progress.total > 0 && (
            <div className="mb-6">
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="flex justify-between mb-2 text-sm text-gray-600">
                  <span>Translating...</span>
                  <span>{progress.current} / {progress.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Language Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Languages</h2>
              
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => setSelectedLanguages(popularLanguages)}
                  className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Select Top 16
                </button>
                <button
                  onClick={() => setSelectedLanguages([])}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
                {popularLanguages.map((code) => {
                  const lang = languages.find(l => l.code === code) || { code, name: code.toUpperCase() };
                  return (
                    <button
                      key={code}
                      onClick={() => toggleLanguage(code)}
                      disabled={loading || saving}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedLanguages.includes(code)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${loading || saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="font-medium text-gray-900">{lang.name}</div>
                      <div className="text-sm text-gray-500">{code.toUpperCase()}</div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">
                  Selected: <strong>{selectedLanguages.length}</strong> languages
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleTranslate}
                    disabled={loading || saving || selectedLanguages.length === 0}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Translating...
                      </span>
                    ) : (
                      'Translate All'
                    )}
                  </button>
                  
                  <button
                    onClick={handleSave}
                    disabled={loading || saving || Object.keys(translations).length === 0}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    {saving ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" />
                        Save to DB
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Source Content */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Source Content (English)</h2>
              
              <div className="space-y-6 max-h-[650px] overflow-y-auto pr-2">
                {Object.entries(SAMPLE_CONTENT).map(([namespace, content]) => (
                  <div key={namespace} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3 capitalize">
                      {namespace}
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(content).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-start gap-3 text-sm">
                          <span className="font-mono text-gray-600">{key}:</span>
                          <span className="text-gray-900 text-right">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Translations Preview */}
          {Object.keys(translations).length > 0 && (
            <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Translations Preview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(translations).map(([langCode, content]) => (
                  <div key={langCode} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {langCode.toUpperCase()}
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        {languages.find(l => l.code === langCode)?.name || langCode}
                      </h3>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      {Object.entries(content).map(([namespace, items]) => (
                        <div key={namespace}>
                          <div className="font-medium text-gray-700 mb-1 capitalize">{namespace}:</div>
                          <div className="space-y-1 pl-3">
                            {Object.entries(items).slice(0, 3).map(([key, value]) => (
                              <div key={key} className="text-gray-600 truncate">
                                {value}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* API Info */}
          <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">API Endpoints</h2>
            <div className="space-y-3 font-mono text-sm">
              <div><strong className="text-blue-300">POST</strong> /api/translate/object - Translate full object</div>
              <div><strong className="text-green-300">POST</strong> /api/translate/save-batch - Save to PostgreSQL</div>
              <div><strong className="text-yellow-300">GET</strong> /api/translate/languages - Get supported languages</div>
              <div><strong className="text-purple-300">GET</strong> /api/translate/saved/website - View saved translations</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


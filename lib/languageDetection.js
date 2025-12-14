/**
 * Language Detection Utility
 * Detects user's country via IP and suggests appropriate language
 * Currently EN-only, but prepared for future multi-language implementation
 */

// Map of country codes to suggested languages
// Will be expanded when backend translation system is ready
const COUNTRY_TO_LANGUAGE = {
  // Spanish-speaking countries
  ES: 'es', // Spain
  MX: 'es', // Mexico
  AR: 'es', // Argentina
  CO: 'es', // Colombia
  CL: 'es', // Chile
  PE: 'es', // Peru
  VE: 'es', // Venezuela
  EC: 'es', // Ecuador
  GT: 'es', // Guatemala
  CU: 'es', // Cuba
  BO: 'es', // Bolivia
  DO: 'es', // Dominican Republic
  HN: 'es', // Honduras
  PY: 'es', // Paraguay
  SV: 'es', // El Salvador
  NI: 'es', // Nicaragua
  CR: 'es', // Costa Rica
  PA: 'es', // Panama
  UY: 'es', // Uruguay
  
  // Default to EN for all others
};

/**
 * Get suggested language based on user's country
 * @param {string} countryCode - ISO 3166-1 alpha-2 country code
 * @returns {string} - Suggested language code (e.g., 'en', 'es')
 */
export function getSuggestedLanguage(countryCode) {
  if (!countryCode) return 'en';
  return COUNTRY_TO_LANGUAGE[countryCode.toUpperCase()] || 'en';
}

/**
 * Detect user's country from various sources
 * Priority: Client-side IP detection > Server headers > Browser language
 * @returns {Promise<string>} - Country code or null
 */
export async function detectUserCountry() {
  try {
    // Try to get country from our API (which reads Vercel headers)
    const response = await fetch('/api/detect-country');
    if (response.ok) {
      const data = await response.json();
      return data.country;
    }
  } catch (error) {
    console.error('Failed to detect country:', error);
  }
  
  return null;
}

/**
 * Get language preference
 * Priority: User's saved preference > IP-based detection > Default EN
 * @returns {Promise<string>} - Language code
 */
export async function getLanguagePreference() {
  // Check if user has a saved preference (client-side only)
  if (typeof window !== 'undefined') {
    const savedLanguage = localStorage.getItem('preferred_language');
    if (savedLanguage) {
      return savedLanguage;
    }
  }
  
  // Detect based on IP
  const country = await detectUserCountry();
  const suggestedLanguage = getSuggestedLanguage(country);
  
  // For now, always return 'en' until translation system is ready
  // Future: return suggestedLanguage and load appropriate translations
  return 'en';
}

/**
 * Save user's language preference
 * @param {string} languageCode - Language code to save
 */
export function saveLanguagePreference(languageCode) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferred_language', languageCode);
  }
}

/**
 * Check if a language is available (for future use)
 * @param {string} languageCode - Language code to check
 * @returns {boolean} - Whether the language is available
 */
export function isLanguageAvailable(languageCode) {
  // For now, only EN is available
  const availableLanguages = ['en'];
  return availableLanguages.includes(languageCode);
}



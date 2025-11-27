import { defaultLocale } from './config';
import { getDictionary as getDictionaryFromAPI } from '../lib/translationClient';

// Keep fallback dictionaries for offline/error scenarios
// Currently English-only
const fallbackDictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
};

export const getDictionary = async (locale) => {
  // Validate locale
  const validLocale = fallbackDictionaries[locale] ? locale : defaultLocale;
  
  try {
    // Try to fetch from API first
    const dictionary = await getDictionaryFromAPI(validLocale);
    
    // Validate that we got data
    if (dictionary && Object.keys(dictionary).length > 0) {
      return dictionary;
    }
    
    // If API returned empty, fall back to local files
    console.warn(`API returned empty dictionary for "${validLocale}", using local fallback`);
    const loadDictionary = fallbackDictionaries[validLocale] || fallbackDictionaries[defaultLocale];
    return await loadDictionary();
  } catch (error) {
    console.error(`Failed to load dictionary for locale "${validLocale}" from API:`, error);
    
    // Fallback to local dictionary files
    try {
      const loadDictionary = fallbackDictionaries[validLocale] || fallbackDictionaries[defaultLocale];
      return await loadDictionary();
    } catch (fallbackError) {
      console.error(`Failed to load fallback dictionary for locale "${validLocale}":`, fallbackError);
      
      // Ultimate fallback: return empty object
      return {};
    }
  }
};

// For client-side use - synchronous access after initial load
let cachedDictionaries = {};

export const loadDictionary = async (locale) => {
  if (!cachedDictionaries[locale]) {
    cachedDictionaries[locale] = await getDictionary(locale);
  }
  return cachedDictionaries[locale];
};

export const getCachedDictionary = (locale) => {
  return cachedDictionaries[locale] || null;
};



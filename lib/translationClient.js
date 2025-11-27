/**
 * Translation Client
 * 
 * Fetches translations from the backend API with caching and fallback support
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const CACHE_DURATION = 3600 * 1000; // 1 hour in milliseconds
const STALE_WHILE_REVALIDATE = 86400 * 1000; // 24 hours

// In-memory cache for server-side and client-side
const translationCache = new Map();

// Fallback dictionaries (embedded for offline/error scenarios)
let fallbackDictionaries = null;

/**
 * Load fallback dictionaries dynamically
 */
async function loadFallbacks() {
  if (fallbackDictionaries) return fallbackDictionaries;
  
  try {
    const enDict = await import('../i18n/dictionaries/en.json');
    
    fallbackDictionaries = {
      en: enDict.default || enDict,
    };
    
    return fallbackDictionaries;
  } catch (error) {
    console.error('[TranslationClient] Failed to load fallback dictionaries:', error);
    return {};
  }
}

/**
 * Generate cache key
 */
function getCacheKey(locale, namespaces) {
  const ns = Array.isArray(namespaces) ? namespaces.sort().join(',') : namespaces || 'all';
  return `${locale}:${ns}`;
}

/**
 * Check if cached data is still valid
 */
function isCacheValid(cacheEntry) {
  if (!cacheEntry) return false;
  
  const now = Date.now();
  const age = now - cacheEntry.timestamp;
  
  // Fresh: still within cache duration
  if (age < CACHE_DURATION) {
    return true;
  }
  
  // Stale but revalidate: within stale-while-revalidate window
  if (age < CACHE_DURATION + STALE_WHILE_REVALIDATE) {
    // Trigger background revalidation but use stale data for now
    return 'stale';
  }
  
  return false;
}

/**
 * Fetch translations from API
 */
async function fetchFromAPI(locale, namespaces = null) {
  try {
    const params = new URLSearchParams({ lang: locale });
    if (namespaces) {
      const ns = Array.isArray(namespaces) ? namespaces.join(',') : namespaces;
      params.append('namespace', ns);
    }
    params.append('include_meta', 'true');
    
    const url = `${API_URL}/api/translations?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Enable Next.js fetch cache
      next: {
        revalidate: 3600, // 1 hour
      },
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch translations');
    }
    
    return {
      data: result.data,
      meta: result.meta,
      etag: response.headers.get('etag'),
    };
  } catch (error) {
    console.error(`[TranslationClient] API fetch error:`, error);
    throw error;
  }
}

/**
 * Get translations with caching and fallback
 */
export async function getTranslations(locale, namespaces = null) {
  const cacheKey = getCacheKey(locale, namespaces);
  
  // Check cache
  const cached = translationCache.get(cacheKey);
  const cacheStatus = isCacheValid(cached);
  
  if (cacheStatus === true) {
    // Fresh cache hit
    return cached.data;
  }
  
  if (cacheStatus === 'stale') {
    // Use stale data while revalidating in background
    // Note: In a production setup, you'd want to use a queue/worker for this
    fetchFromAPI(locale, namespaces)
      .then(result => {
        translationCache.set(cacheKey, {
          data: result.data,
          meta: result.meta,
          etag: result.etag,
          timestamp: Date.now(),
        });
      })
      .catch(error => {
        console.warn('[TranslationClient] Background revalidation failed:', error);
      });
    
    return cached.data;
  }
  
  // No valid cache, fetch fresh data
  try {
    const result = await fetchFromAPI(locale, namespaces);
    
    // Store in cache
    translationCache.set(cacheKey, {
      data: result.data,
      meta: result.meta,
      etag: result.etag,
      timestamp: Date.now(),
    });
    
    return result.data;
  } catch (error) {
    console.error(`[TranslationClient] Failed to fetch translations for ${locale}:`, error);
    
    // Fallback to embedded dictionaries
    console.warn('[TranslationClient] Using fallback dictionaries');
    const fallbacks = await loadFallbacks();
    
    if (fallbacks[locale]) {
      // If specific namespaces requested, filter them
      if (namespaces) {
        const ns = Array.isArray(namespaces) ? namespaces : [namespaces];
        const filtered = {};
        ns.forEach(namespace => {
          if (fallbacks[locale][namespace]) {
            filtered[namespace] = fallbacks[locale][namespace];
          }
        });
        return filtered;
      }
      
      return fallbacks[locale];
    }
    
    // Ultimate fallback: empty object
    console.error('[TranslationClient] No fallback available for locale:', locale);
    return {};
  }
}

/**
 * Get a single translation dictionary (flat structure)
 * Used by getDictionary for backward compatibility
 */
export async function getDictionary(locale) {
  try {
    const translations = await getTranslations(locale);
    
    // Flatten the namespace structure into a single object
    const flattened = {};
    Object.keys(translations).forEach(namespace => {
      flattened[namespace] = translations[namespace];
    });
    
    return flattened;
  } catch (error) {
    console.error(`[TranslationClient] getDictionary error for ${locale}:`, error);
    
    // Fallback
    const fallbacks = await loadFallbacks();
    return fallbacks[locale] || {};
  }
}

/**
 * Get content block by slug
 */
export async function getContentBlock(slug, locale) {
  try {
    const url = `${API_URL}/api/translations/content/${slug}?lang=${locale}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch content block');
    }
    
    return result.data.content;
  } catch (error) {
    console.error(`[TranslationClient] Failed to fetch content block ${slug}:`, error);
    return null;
  }
}

/**
 * Get available languages
 */
export async function getLanguages() {
  try {
    const url = `${API_URL}/api/translations/languages`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 86400, // 24 hours
      },
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch languages');
    }
    
    return result.data;
  } catch (error) {
    console.error('[TranslationClient] Failed to fetch languages:', error);
    return [
      { code: 'en', name: 'English', native_name: 'English', is_default: true },
    ];
  }
}

/**
 * Clear translation cache (useful for admin panel or dev tools)
 */
export function clearTranslationCache() {
  translationCache.clear();
  console.log('[TranslationClient] Cache cleared');
}

/**
 * Prefetch translations for multiple locales
 * Useful during build time for static generation
 */
export async function prefetchTranslations(locales, namespaces = null) {
  const promises = locales.map(locale => 
    getTranslations(locale, namespaces).catch(error => {
      console.warn(`[TranslationClient] Prefetch failed for ${locale}:`, error);
      return null;
    })
  );
  
  await Promise.all(promises);
  console.log(`[TranslationClient] Prefetched translations for: ${locales.join(', ')}`);
}


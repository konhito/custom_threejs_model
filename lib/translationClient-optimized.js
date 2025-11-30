/**
 * Optimized Translation Client
 * 
 * Multi-source loading with CloudFront CDN, parallel fetching, and lazy loading
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL; // CloudFront domain

// Priority namespaces - load immediately
const CRITICAL_NAMESPACES = ['common', 'navigation'];

// In-memory cache
const translationCache = new Map();
const pendingRequests = new Map(); // Prevent duplicate requests

/**
 * Fetch translations from CDN (fastest)
 */
async function fetchFromCDN(locale, namespace) {
  if (!CDN_URL) return null;
  
  try {
    // Get CDN URL from API first
    const cdnUrlResponse = await fetch(
      `${API_URL}/api/translations/cdn-urls?lang=${locale}`,
      { next: { revalidate: 86400 } } // Cache CDN URLs for 24h
    );
    
    if (!cdnUrlResponse.ok) return null;
    
    const { cdn_urls } = await cdnUrlResponse.json();
    const url = cdn_urls[namespace];
    
    if (!url) return null;
    
    // Fetch directly from CloudFront
    const response = await fetch(url, {
      headers: { 'Accept-Encoding': 'gzip' },
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    console.log(`[CDN] Loaded ${namespace} from CloudFront`);
    return data;
  } catch (error) {
    console.warn(`[CDN] Failed to load from CloudFront:`, error);
    return null;
  }
}

/**
 * Fetch translations from optimized API endpoint
 */
async function fetchFromAPI(locale, namespaces) {
  try {
    const ns = Array.isArray(namespaces) ? namespaces.join(',') : namespaces || '';
    const url = `${API_URL}/api/translations/optimized?lang=${locale}${ns ? `&namespace=${ns}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept-Encoding': 'gzip',
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch translations');
    }
    
    const cacheStatus = response.headers.get('x-cache-status');
    const responseTime = response.headers.get('x-response-time');
    
    console.log(`[API] Loaded from ${cacheStatus} in ${responseTime}`);
    
    return result.data;
  } catch (error) {
    console.error('[API] Fetch error:', error);
    throw error;
  }
}

/**
 * Fetch with deduplication
 */
async function fetchWithDedup(locale, namespaces, fetcher) {
  const cacheKey = `${locale}:${Array.isArray(namespaces) ? namespaces.sort().join(',') : namespaces || 'all'}`;
  
  // Check if request is already pending
  if (pendingRequests.has(cacheKey)) {
    console.log(`[DEDUP] Waiting for existing request: ${cacheKey}`);
    return pendingRequests.get(cacheKey);
  }
  
  // Create new request
  const request = fetcher(locale, namespaces);
  pendingRequests.set(cacheKey, request);
  
  try {
    const result = await request;
    return result;
  } finally {
    pendingRequests.delete(cacheKey);
  }
}

/**
 * Get translations with multi-source fallback
 */
export async function getTranslations(locale, namespaces = null) {
  const cacheKey = `${locale}:${Array.isArray(namespaces) ? namespaces.sort().join(',') : namespaces || 'all'}`;
  
  // Check memory cache
  if (translationCache.has(cacheKey)) {
    console.log(`[MEMORY] Cache hit: ${cacheKey}`);
    return translationCache.get(cacheKey);
  }
  
  try {
    // Try API (which will use Redis/S3/CloudFront internally)
    const data = await fetchWithDedup(locale, namespaces, fetchFromAPI);
    
    // Cache in memory
    translationCache.set(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error('[Translation] All sources failed, using fallback:', error);
    
    // Fallback to embedded dictionaries
    const fallback = await import(`../i18n/dictionaries/${locale}.json`);
    const fallbackData = fallback.default || fallback;
    
    if (namespaces && Array.isArray(namespaces)) {
      const filtered = {};
      namespaces.forEach(ns => {
        if (fallbackData[ns]) filtered[ns] = fallbackData[ns];
      });
      return filtered;
    }
    
    return fallbackData;
  }
}

/**
 * Batch load with priority and secondary namespaces
 * Perfect for page load optimization
 */
export async function batchLoadTranslations(locale, priorityNs = [], secondaryNs = []) {
  const startTime = Date.now();
  
  try {
    const url = `${API_URL}/api/translations/batch?lang=${locale}&priority=${priorityNs.join(',')}&secondary=${secondaryNs.join(',')}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept-Encoding': 'gzip',
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      throw new Error(`Batch API responded with status ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch batch translations');
    }
    
    // Cache both sets
    const priorityKey = `${locale}:${priorityNs.sort().join(',')}`;
    const secondaryKey = `${locale}:${secondaryNs.sort().join(',')}`;
    
    translationCache.set(priorityKey, result.data.priority);
    translationCache.set(secondaryKey, result.data.secondary);
    
    const totalTime = Date.now() - startTime;
    console.log(`[BATCH] Loaded priority + secondary in ${totalTime}ms`);
    console.log(`[BATCH] Sources: ${result.meta.priority_source} + ${result.meta.secondary_source}`);
    
    return {
      priority: result.data.priority,
      secondary: result.data.secondary,
      meta: result.meta,
    };
  } catch (error) {
    console.error('[BATCH] Fetch error:', error);
    
    // Fallback: load individually
    const [priority, secondary] = await Promise.all([
      priorityNs.length > 0 ? getTranslations(locale, priorityNs) : Promise.resolve({}),
      secondaryNs.length > 0 ? getTranslations(locale, secondaryNs) : Promise.resolve({}),
    ]);
    
    return { priority, secondary, meta: { fallback: true } };
  }
}

/**
 * Lazy load namespace - non-blocking, background fetch
 */
export async function lazyLoadNamespace(locale, namespace) {
  const cacheKey = `${locale}:${namespace}`;
  
  // Return immediately if cached
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  
  // Otherwise trigger background load and return empty for now
  getTranslations(locale, [namespace])
    .then(data => {
      console.log(`[LAZY] Loaded ${namespace} in background`);
    })
    .catch(err => {
      console.warn(`[LAZY] Failed to load ${namespace}:`, err);
    });
  
  return {};
}

/**
 * Prefetch translations for multiple locales
 * Call during build or on mount for critical paths
 */
export async function prefetchCritical(locales = ['en', 'es']) {
  const promises = [];
  
  for (const locale of locales) {
    // Prefetch critical namespaces for each locale
    promises.push(
      getTranslations(locale, CRITICAL_NAMESPACES)
        .catch(err => console.warn(`Prefetch failed for ${locale}:`, err))
    );
  }
  
  await Promise.all(promises);
  console.log(`[PREFETCH] Critical translations loaded for: ${locales.join(', ')}`);
}

/**
 * Parallel load multiple namespaces at once
 */
export async function parallelLoad(locale, namespaces) {
  const promises = namespaces.map(ns => 
    getTranslations(locale, [ns])
      .catch(err => {
        console.warn(`[PARALLEL] Failed to load ${ns}:`, err);
        return {};
      })
  );
  
  const results = await Promise.all(promises);
  
  // Merge all results
  return results.reduce((acc, data, index) => {
    acc[namespaces[index]] = data[namespaces[index]] || data;
    return acc;
  }, {});
}

/**
 * Get flattened dictionary for backward compatibility
 */
export async function getDictionary(locale) {
  try {
    const translations = await getTranslations(locale);
    return translations;
  } catch (error) {
    console.error(`getDictionary error for ${locale}:`, error);
    
    // Ultimate fallback
    const fallback = await import(`../i18n/dictionaries/${locale}.json`);
    return fallback.default || fallback;
  }
}

/**
 * Clear all caches
 */
export function clearCache() {
  translationCache.clear();
  pendingRequests.clear();
  console.log('[CACHE] All caches cleared');
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    cached_keys: translationCache.size,
    pending_requests: pendingRequests.size,
    memory_usage: Math.round(
      JSON.stringify([...translationCache.values()]).length / 1024
    ) + ' KB',
  };
}

const translationClient = {
  getTranslations,
  batchLoadTranslations,
  lazyLoadNamespace,
  prefetchCritical,
  parallelLoad,
  getDictionary,
  clearCache,
  getCacheStats,
};

export default translationClient;


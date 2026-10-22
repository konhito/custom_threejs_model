"use client";

import { useEffect, useState, useCallback, useRef } from 'react';

// List of supported locales
export const locales = ['en', 'es', 'zh', 'fr', 'de', 'it'];
export const defaultLocale = 'en';

// Get current locale from cookie
export function getCurrentLocale() {
  if (typeof window === 'undefined') return 'en';
  
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('NEXT_LOCALE='));
  
  const locale = cookie ? cookie.split('=')[1] : 'en';
  
  // Validate the locale
  return locales.includes(locale) ? locale : defaultLocale;
}

// Cache for loaded translations to avoid re-importing
const translationCache = {};

// Load translations for a locale (force reload if needed)
async function loadTranslations(locale, forceReload = false) {
  // Check cache first (unless force reload)
  if (!forceReload && translationCache[locale]) {
    return translationCache[locale];
  }
  
  try {
    // Dynamic import with cache busting for development
    const module = await import(`../messages/${locale}.json`);
    translationCache[locale] = module.default;
    return module.default;
  } catch (error) {
    console.error(`Failed to load translation for ${locale}:`, error);
    // Fallback to English
    if (locale !== 'en') {
      return loadTranslations('en', forceReload);
    }
    return {};
  }
}

// Hook to get translations
export function useTranslation() {
  const [locale, setLocale] = useState(() => translationCache[getCurrentLocale()] ? getCurrentLocale() : defaultLocale);
  const [messages, setMessages] = useState(() => translationCache[getCurrentLocale()] || null);
  const [isLoading, setIsLoading] = useState(() => !translationCache[getCurrentLocale()]);
  const initialLoadDone = useRef(false);

  // Load translations when locale changes
  const loadMessagesForLocale = useCallback(async (targetLocale, forceReload = false) => {
    setIsLoading(true);
    const validLocale = locales.includes(targetLocale) ? targetLocale : defaultLocale;
    
    try {
      const loadedMessages = await loadTranslations(validLocale, forceReload);
      setMessages(loadedMessages);
      setLocale(validLocale);
    } catch (error) {
      console.error('Failed to load messages:', error);
      // Fallback to English
      const fallbackMessages = await loadTranslations('en', forceReload);
      setMessages(fallbackMessages);
      setLocale('en');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load - only run once
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      const currentLocale = getCurrentLocale();
      if (!translationCache[currentLocale]) loadMessagesForLocale(currentLocale, true);
    }
  }, [loadMessagesForLocale]);
  
  // Separate effect to poll for locale changes
  useEffect(() => {
    if (!initialLoadDone.current) return;
    
    // Check for locale changes periodically (cookies don't have change events)
    const intervalId = setInterval(() => {
      const newLocale = getCurrentLocale();
      if (newLocale !== locale) {
        loadMessagesForLocale(newLocale, true);
      }
    }, 300);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [locale, loadMessagesForLocale]);

  // Translation function
  const t = useCallback((key, params = {}) => {
    if (!messages) return key;
    
    // Handle nested keys like "game.victory"
    const keys = key.split('.');
    let value = messages;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    // Replace placeholders like {name} with actual values
    if (typeof value === 'string') {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }
    
    return value;
  }, [messages]);

  return { t, locale, isLoading, messages };
}

// Clear the translation cache (useful when changing languages)
export function clearTranslationCache() {
  Object.keys(translationCache).forEach(key => {
    delete translationCache[key];
  });
}

// Change language function
export function changeLanguage(langCode) {
  // Clear cache to ensure fresh translations
  clearTranslationCache();
  
  // Set manual override cookie (short duration - 2 hours)
  // After this expires, IP-based detection will take over again
  document.cookie = `LOCALE_MANUAL=${langCode};path=/;max-age=${60 * 60 * 2};samesite=lax`;
  document.cookie = `NEXT_LOCALE=${langCode};path=/;max-age=${60 * 60 * 2};samesite=lax`;
  
  // Small delay to ensure cookies are set, then reload
  setTimeout(() => {
    window.location.reload();
  }, 100);
}

// Clear manual language selection to revert to IP-based detection
export function revertToIPDetection() {
  // Clear cache to ensure fresh translations
  clearTranslationCache();
  
  // Remove manual override cookie
  document.cookie = `LOCALE_MANUAL=;path=/;max-age=0;samesite=lax`;
  document.cookie = `NEXT_LOCALE=;path=/;max-age=0;samesite=lax`;
  
  // Small delay to ensure cookies are cleared, then reload
  setTimeout(() => {
    window.location.reload();
  }, 100);
}

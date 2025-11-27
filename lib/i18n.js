'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { locales, defaultLocale, isValidLocale } from '../i18n/config';

// Create context for translations
const I18nContext = createContext(null);

// Provider component
export function I18nProvider({ children, dictionary, locale }) {
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (newLocale) => {
    if (!isValidLocale(newLocale)) return;

    // Set cookie
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=${60 * 60 * 24 * 365}`;

    // Navigate to new locale
    const currentPath = pathname.replace(`/${locale}`, '') || '/';
    router.push(`/${newLocale}${currentPath}`);
  };

  const t = (key, replacements = {}) => {
    // Split key by dots to navigate nested objects
    const keys = key.split('.');
    let value = dictionary;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Return the key if translation not found
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }
    }

    // Handle string replacements like {count}
    if (typeof value === 'string') {
      return Object.entries(replacements).reduce((str, [key, val]) => {
        return str.replace(new RegExp(`\\{${key}\\}`, 'g'), String(val));
      }, value);
    }

    return value;
  };

  return (
    <I18nContext.Provider value={{ locale, t, changeLocale, locales }}>
      {children}
    </I18nContext.Provider>
  );
}

// Hook to use translations
export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}

// Language switcher component
export function LanguageSwitcher({ className = '' }) {
  const { locale, changeLocale, locales } = useTranslation();

  const localeNames = {
    en: 'EN',
    es: 'ES',
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => changeLocale(loc)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            locale === loc
              ? 'bg-green-500 text-white shadow-md'
              : 'text-gray-600 hover:text-green-500 hover:bg-green-50'
          }`}
          aria-label={`Switch to ${loc === 'en' ? 'English' : 'Español'}`}
        >
          {localeNames[loc]}
        </button>
      ))}
    </div>
  );
}

// Get current locale from pathname
export function getLocaleFromPathname(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment;
  }
  
  return defaultLocale;
}



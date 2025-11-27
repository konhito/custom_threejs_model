// i18n configuration - Currently EN only
// Future: Will load other languages from backend based on IP
export const locales = ['en'];
export const defaultLocale = 'en';

// Disabled for now - will use backend API for IP-based content
export const countryToLocale = {};

export function getLocaleFromCountry(countryCode) {
  // For now, always return English
  // Future: API will provide appropriate language based on IP
  return defaultLocale;
}

export function isValidLocale(locale) {
  return locale === 'en'; // Only EN for now
}


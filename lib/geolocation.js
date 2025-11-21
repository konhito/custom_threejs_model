// Geolocation and currency detection utilities

// Currency mapping by country code
const countryToCurrency = {
  // European Union countries - EUR
  'AT': 'eur', 'BE': 'eur', 'BG': 'eur', 'HR': 'eur', 'CY': 'eur',
  'CZ': 'eur', 'DK': 'eur', 'EE': 'eur', 'FI': 'eur', 'FR': 'eur',
  'DE': 'eur', 'GR': 'eur', 'HU': 'eur', 'IE': 'eur', 'IT': 'eur',
  'LV': 'eur', 'LT': 'eur', 'LU': 'eur', 'MT': 'eur', 'NL': 'eur',
  'PL': 'eur', 'PT': 'eur', 'RO': 'eur', 'SK': 'eur', 'SI': 'eur',
  'ES': 'eur', 'SE': 'eur',
  // Other European countries
  'IS': 'eur', 'NO': 'eur', 'CH': 'eur', 
  // United Kingdom - GBP
  'GB': 'gbp',
  // Americas - USD
  'US': 'usd', 'CA': 'usd', 'MX': 'usd', 'BR': 'usd', 'AR': 'usd',
  'CL': 'usd', 'CO': 'usd', 'PE': 'usd', 'VE': 'usd', 'CR': 'usd',
  'PA': 'usd', 'DO': 'usd', 'EC': 'usd', 'GT': 'usd', 'HN': 'usd',
  'NI': 'usd', 'PY': 'usd', 'SV': 'usd', 'UY': 'usd',
  // Asia Pacific
  'AU': 'usd', 'NZ': 'usd', 'SG': 'usd', 'HK': 'usd',
  'JP': 'jpy', // Japan - JPY
  'KR': 'usd', 'IN': 'usd', 'CN': 'usd', 'MY': 'usd', 'TH': 'usd',
  'PH': 'usd', 'ID': 'usd', 'VN': 'usd', 'TW': 'usd',
  // Middle East
  'AE': 'usd', 'SA': 'usd', 'IL': 'usd', 'TR': 'usd',
  // Africa
  'ZA': 'usd', 'EG': 'usd', 'NG': 'usd', 'KE': 'usd',
  // Default to EUR for unknown
};

// Supported currencies in the system
export const SUPPORTED_CURRENCIES = ['eur', 'usd', 'gbp', 'jpy'];

// Currency display names and symbols
export const CURRENCY_INFO = {
  eur: { symbol: '€', name: 'Euro', code: 'EUR' },
  usd: { symbol: '$', name: 'US Dollar', code: 'USD' },
  gbp: { symbol: '£', name: 'British Pound', code: 'GBP' },
  jpy: { symbol: '¥', name: 'Japanese Yen', code: 'JPY' },
};

// Default currency fallback
const DEFAULT_CURRENCY = 'eur';

/**
 * Detect user location from IP address
 */
export async function detectLocationFromIP() {
  try {
    // Try multiple free IP geolocation services
    const services = [
      async () => {
        const response = await fetch('https://ipapi.co/json/', {
          signal: AbortSignal.timeout(3000),
        });
        const data = await response.json();
        return {
          country: data.country_code,
          countryName: data.country_name,
          currency: data.currency,
          timezone: data.timezone,
        };
      },
      async () => {
        const response = await fetch('https://ip-api.com/json/?fields=status,countryCode,country,currency,timezone', {
          signal: AbortSignal.timeout(3000),
        });
        const data = await response.json();
        if (data.status === 'success') {
          return {
            country: data.countryCode,
            countryName: data.country,
            currency: data.currency,
            timezone: data.timezone,
          };
        }
        throw new Error('IP detection failed');
      },
    ];

    // Try each service until one works
    for (const service of services) {
      try {
        const location = await service();
        return location;
      } catch (error) {
        console.log('Location service failed, trying next...', error);
        continue;
      }
    }

    throw new Error('All location services failed');
  } catch (error) {
    console.error('Error detecting location:', error);
    return null;
  }
}

/**
 * Get currency based on country code
 */
export function getCurrencyFromCountry(countryCode) {
  if (!countryCode) return DEFAULT_CURRENCY;
  
  const currency = countryToCurrency[countryCode.toUpperCase()];
  return currency || DEFAULT_CURRENCY;
}

/**
 * Detect and set currency automatically
 */
export async function autoDetectCurrency() {
  try {
    // Check if currency is already set in localStorage
    const savedCurrency = localStorage.getItem('nahiara_currency');
    if (savedCurrency) {
      return savedCurrency;
    }

    // Detect location
    const location = await detectLocationFromIP();
    
    if (location) {
      // Try to use detected currency, fallback to country-based mapping
      let currency = location.currency?.toLowerCase();
      
      // Validate currency is supported
      if (!currency || !SUPPORTED_CURRENCIES.includes(currency)) {
        currency = getCurrencyFromCountry(location.country);
      }

      // Ensure currency is supported, fallback to EUR or USD
      if (!SUPPORTED_CURRENCIES.includes(currency)) {
        currency = DEFAULT_CURRENCY;
      }

      // Save to localStorage
      localStorage.setItem('nahiara_currency', currency);
      localStorage.setItem('nahiara_country', location.country || '');
      localStorage.setItem('nahiara_country_name', location.countryName || '');

      return currency;
    }
  } catch (error) {
    console.error('Error auto-detecting currency:', error);
  }

  // Fallback to default
  const defaultCurrency = DEFAULT_CURRENCY;
  localStorage.setItem('nahiara_currency', defaultCurrency);
  return defaultCurrency;
}

/**
 * Format currency with proper symbol
 */
export function formatCurrency(amount, currency = 'eur') {
  // Validate amount is a valid number
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || amount === null || amount === undefined) {
    console.warn('Invalid amount for formatCurrency:', amount);
    return `${CURRENCY_INFO.eur.symbol}0.00`;
  }
  
  const currencyInfo = CURRENCY_INFO[currency.toLowerCase()] || CURRENCY_INFO.eur;
  
  // JPY doesn't use decimals
  if (currency.toLowerCase() === 'jpy') {
    return `${currencyInfo.symbol}${Math.round(numAmount)}`;
  }
  
  return `${currencyInfo.symbol}${numAmount.toFixed(2)}`;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency = 'eur') {
  const currencyInfo = CURRENCY_INFO[currency.toLowerCase()] || CURRENCY_INFO.eur;
  return currencyInfo.symbol;
}

/**
 * Get currency name
 */
export function getCurrencyName(currency = 'eur') {
  const currencyInfo = CURRENCY_INFO[currency.toLowerCase()] || CURRENCY_INFO.eur;
  return currencyInfo.name;
}


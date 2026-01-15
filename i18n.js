import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const locales = ['en', 'es', 'zh', 'fr', 'de'];
export const defaultLocale = 'en';

// Country to language mapping
export const countryToLocale = {
  // Spanish speaking countries
  'ES': 'es', // Spain
  'MX': 'es', // Mexico
  'AR': 'es', // Argentina
  'CO': 'es', // Colombia
  'PE': 'es', // Peru
  'VE': 'es', // Venezuela
  'CL': 'es', // Chile
  'EC': 'es', // Ecuador
  'GT': 'es', // Guatemala
  'CU': 'es', // Cuba
  'BO': 'es', // Bolivia
  'DO': 'es', // Dominican Republic
  'HN': 'es', // Honduras
  'PY': 'es', // Paraguay
  'SV': 'es', // El Salvador
  'NI': 'es', // Nicaragua
  'CR': 'es', // Costa Rica
  'PA': 'es', // Panama
  'UY': 'es', // Uruguay
  'PR': 'es', // Puerto Rico
  
  // French speaking countries
  'FR': 'fr', // France
  'CA': 'fr', // Canada (Quebec) - could be 'en' too
  'BE': 'fr', // Belgium
  'LU': 'fr', // Luxembourg
  'MC': 'fr', // Monaco
  'SN': 'fr', // Senegal
  'CI': 'fr', // Ivory Coast
  'ML': 'fr', // Mali
  'BF': 'fr', // Burkina Faso
  'NE': 'fr', // Niger
  'TG': 'fr', // Togo
  'BJ': 'fr', // Benin
  'MG': 'fr', // Madagascar
  'CM': 'fr', // Cameroon
  'CD': 'fr', // DR Congo
  'GA': 'fr', // Gabon
  'HT': 'fr', // Haiti
  
  // Chinese speaking countries/regions
  'CN': 'zh', // China
  'TW': 'zh', // Taiwan
  'HK': 'zh', // Hong Kong
  'MO': 'zh', // Macau
  'SG': 'zh', // Singapore (could be 'en' too)
  
  // German speaking countries
  'DE': 'de', // Germany
  'AT': 'de', // Austria
  'LI': 'de', // Liechtenstein
  // Note: Switzerland (CH) is split - French regions use 'fr', German regions use 'de'
  // Defaulting CH to 'de' for now, can be refined based on region
  
  // Default to English for all other countries
};

export default getRequestConfig(async () => {
  // Try to get locale from cookie first
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  
  let locale = localeCookie?.value;
  
  // Validate locale
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }
  
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});

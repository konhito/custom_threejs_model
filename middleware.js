import { NextResponse } from 'next/server';

const locales = ['en', 'es', 'zh', 'fr'];
const defaultLocale = 'en';

// Country to language mapping
const countryToLocale = {
  // Spanish speaking countries
  'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'PE': 'es',
  'VE': 'es', 'CL': 'es', 'EC': 'es', 'GT': 'es', 'CU': 'es',
  'BO': 'es', 'DO': 'es', 'HN': 'es', 'PY': 'es', 'SV': 'es',
  'NI': 'es', 'CR': 'es', 'PA': 'es', 'UY': 'es', 'PR': 'es',
  
  // French speaking countries
  'FR': 'fr', 'BE': 'fr', 'CH': 'fr', 'LU': 'fr', 'MC': 'fr',
  'SN': 'fr', 'CI': 'fr', 'ML': 'fr', 'BF': 'fr', 'NE': 'fr',
  'TG': 'fr', 'BJ': 'fr', 'MG': 'fr', 'CM': 'fr', 'CD': 'fr',
  'GA': 'fr', 'HT': 'fr',
  
  // Chinese speaking countries/regions
  'CN': 'zh', 'TW': 'zh', 'HK': 'zh', 'MO': 'zh', 'SG': 'zh',
};

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files, API routes, and admin
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.') ||
    pathname.startsWith('/Digital') // Skip for game assets
  ) {
    return NextResponse.next();
  }

  // Get country from Vercel geo headers (production) or fallback methods
  let country = request.geo?.country;
  
  // Development: Check for debug country cookie
  const debugCountry = request.cookies.get('DEBUG_COUNTRY')?.value;
  if (debugCountry && !country) {
    country = debugCountry;
  }
  
  // If Vercel geo isn't working, try to get country from CF-IPCountry header (Cloudflare)
  if (!country) {
    country = request.headers.get('CF-IPCountry') || request.headers.get('X-Vercel-IP-Country');
  }
  
  // Fallback: Try to get timezone info from headers
  if (!country) {
    const timezone = request.headers.get('X-Vercel-IP-Timezone');
    if (timezone) {
      // Map some common timezones to countries
      const timezoneToCountry = {
        'Europe/Paris': 'FR',
        'Europe/Madrid': 'ES',
        'Asia/Shanghai': 'CN',
        'America/New_York': 'US',
        'Europe/London': 'GB'
      };
      country = timezoneToCountry[timezone];
    }
  }
  
  // Final fallback: Accept-Language header
  if (!country) {
    const acceptLanguage = request.headers.get('accept-language') || '';
    const browserLang = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase();
    
    // Map browser language to country (rough approximation)
    const langToCountry = {
      'es': 'ES',
      'fr': 'FR', 
      'zh': 'CN',
      'en': 'US'
    };
    
    country = langToCountry[browserLang] || 'US';
  }
  
  const detectedLocale = countryToLocale[country] || defaultLocale;
  
  // Check if user has manually selected a language (temporary override)
  const manualLocale = request.cookies.get('LOCALE_MANUAL')?.value;
  
  // Add debug info to response headers (visible in Network tab)
  const debugInfo = {
    country,
    detectedLocale,
    manualLocale: manualLocale || 'none',
    geoCountry: request.geo?.country || 'none',
    geoRegion: request.geo?.region || 'none',
    geoCity: request.geo?.city || 'none',
    cfCountry: request.headers.get('CF-IPCountry') || 'none',
    vercelCountry: request.headers.get('X-Vercel-IP-Country') || 'none',
    vercelTimezone: request.headers.get('X-Vercel-IP-Timezone') || 'none'
  };
  
  // Use manual selection only if it exists and is valid, otherwise use IP detection
  const finalLocale = (manualLocale && locales.includes(manualLocale)) ? manualLocale : detectedLocale;
  
  const response = NextResponse.next();
  
  // Add debug headers (visible in Network tab)
  response.headers.set('X-Debug-Country', debugInfo.country);
  response.headers.set('X-Debug-Locale', debugInfo.detectedLocale);
  response.headers.set('X-Debug-Geo-Country', debugInfo.geoCountry);
  response.headers.set('X-Debug-Manual', debugInfo.manualLocale);
  response.headers.set('X-Debug-CF-Country', debugInfo.cfCountry);
  response.headers.set('X-Debug-Vercel-Country', debugInfo.vercelCountry);
  response.headers.set('X-Debug-Timezone', debugInfo.vercelTimezone);
  
  // Always set NEXT_LOCALE (this is what the app reads)
  response.cookies.set('NEXT_LOCALE', finalLocale, {
    path: '/',
    maxAge: 60 * 60, // 1 hour - will refresh on next request
    sameSite: 'lax',
  });
  
  // If using manual selection, keep the LOCALE_MANUAL cookie but with shorter duration
  if (manualLocale && locales.includes(manualLocale)) {
    response.cookies.set('LOCALE_MANUAL', manualLocale, {
      path: '/',
      maxAge: 60 * 60 * 2, // 2 hours only - then revert to IP detection
      sameSite: 'lax',
    });
  } else if (manualLocale) {
    // Clear invalid or expired manual locale cookie
    response.cookies.set('LOCALE_MANUAL', '', {
      path: '/',
      maxAge: 0,
      sameSite: 'lax',
    });
  }
  
  return response;
}

export const config = {
  // Match all paths except static files
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)).*)',
  ],
};

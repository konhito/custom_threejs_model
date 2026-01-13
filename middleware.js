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

  // Always prioritize IP-based detection first
  const country = request.geo?.country || 'US';
  const detectedLocale = countryToLocale[country] || defaultLocale;
  
  // Check if user has manually selected a language (temporary override)
  const manualLocale = request.cookies.get('LOCALE_MANUAL')?.value;
  
  // Use manual selection only if it exists and is valid, otherwise use IP detection
  const finalLocale = (manualLocale && locales.includes(manualLocale)) ? manualLocale : detectedLocale;
  
  const response = NextResponse.next();
  
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
  }
  
  return response;
}

export const config = {
  // Match all paths except static files
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)).*)',
  ],
};

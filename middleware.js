import { NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const EXCLUDED_PATHS = [
  '/api',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.json',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip static assets and excluded paths
  if (
    PUBLIC_FILE.test(pathname) ||
    EXCLUDED_PATHS.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  // Get user's country for analytics/future language suggestions
  // Priority: Vercel geo > CloudFlare header
  const country = request.geo?.country || 
                  request.headers.get('x-vercel-ip-country') ||
                  request.headers.get('cf-ipcountry');
  
  // Store country in custom header for backend API requests
  const response = NextResponse.next();
  if (country) {
    response.headers.set('x-user-country', country);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};


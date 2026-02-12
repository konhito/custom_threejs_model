import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files, API routes, and admin
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.') ||
    pathname.startsWith('/Digital') || // Skip for game assets
    pathname.startsWith('/complete-flowers') // Skip for complete flower images
  ) {
    return NextResponse.next();
  }

  // Just pass through - all language detection is done client-side during loader
  // Cookies are cleared and fresh IP detection happens on every page load
  return NextResponse.next();
}

export const config = {
  // Match all paths except static files
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)).*)',
  ],
};

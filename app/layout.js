import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig, generateStructuredData } from "../lib/seo";
import { Analytics } from "@vercel/analytics/next";
import Navigation from "../components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords.join(", "),
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: siteConfig.robots,
  openGraph: siteConfig.openGraph,
  twitter: siteConfig.twitter,
  verification: siteConfig.verification,
  alternates: {
    canonical: siteConfig.url,
  },
  icons: {
    icon: [
      { url: '/logo1.png?v=3', type: 'image/png', sizes: 'any' },
      { url: '/logo1.png?v=3', type: 'image/png', sizes: '32x32' },
      { url: '/logo1.png?v=3', type: 'image/png', sizes: '16x16' },
      { url: '/logo1.png?v=3', type: 'image/png', sizes: '192x192' },
      { url: '/logo1.png?v=3', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/logo1.png?v=3',
    apple: '/logo1.png?v=3',
  },
  category: "environment",
  classification: "Educational",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": siteConfig.name,
    "application-name": siteConfig.name,
    "msapplication-TileColor": "#4a90e2",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#4a90e2",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }) {
  // Generate structured data for the homepage
  const structuredData = generateStructuredData({
    type: "WebSite",
    organization: true,
  });

  return (
    <html lang="en" className="light notranslate" translate="no" style={{ colorScheme: 'light' }}>
      <head>
        {/* Prevent browser translation */}
        <meta name="google" content="notranslate" />
        <meta httpEquiv="Content-Language" content="en" />
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Dancing+Script:wght@400;500;600;700&family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Orbitron:wght@400;500;600;700;800;900&family=Exo+2:wght@300;400;500;600;700;800&family=Josefin+Sans:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=Comfortaa:wght@300;400;500;600;700&family=Fredoka+One:wght@400&family=Righteous:wght@400&family=Bangers:wght@400&family=Creepster:wght@400&family=Rubik:wght@300;400;500;600;700;800&family=Karla:wght@300;400;500;600;700&family=Archivo:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Favicon and app icons - Multiple formats for browser compatibility */}
        <link rel="icon" href="/logo1.png?v=3" type="image/png" sizes="any" />
        <link rel="icon" href="/logo1.png?v=3" type="image/png" sizes="32x32" />
        <link rel="icon" href="/logo1.png?v=3" type="image/png" sizes="16x16" />
        <link rel="icon" href="/logo1.png?v=3" type="image/png" sizes="192x192" />
        <link rel="icon" href="/logo1.png?v=3" type="image/png" sizes="512x512" />
        <link rel="shortcut icon" href="/logo1.png?v=3" type="image/png" />
        <link rel="alternate icon" href="/logo1.png?v=3" type="image/png" />
        <link rel="icon" type="image/png" href="/logo1.png?v=3" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo1.png?v=3" />
        <link rel="apple-touch-icon" sizes="152x152" href="/logo1.png?v=3" />
        <link rel="apple-touch-icon" sizes="144x144" href="/logo1.png?v=3" />
        <link rel="apple-touch-icon" sizes="120x120" href="/logo1.png?v=3" />
        <link rel="apple-touch-icon" sizes="114x114" href="/logo1.png?v=3" />
        <link rel="apple-touch-icon" sizes="76x76" href="/logo1.png?v=3" />
        <link rel="apple-touch-icon" sizes="72x72" href="/logo1.png?v=3" />
        <link rel="apple-touch-icon" sizes="60x60" href="/logo1.png?v=3" />
        <link rel="apple-touch-icon" sizes="57x57" href="/logo1.png?v=3" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme and browser config - Force light theme */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="color-scheme" content="light only" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Force light theme - prevent dark mode
              (function() {
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
                document.documentElement.style.colorScheme = 'light only';
                // Watch for any attempts to add dark class
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                      if (document.documentElement.classList.contains('dark')) {
                        document.documentElement.classList.remove('dark');
                        document.documentElement.classList.add('light');
                      }
                    }
                  });
                });
                observer.observe(document.documentElement, {
                  attributes: true,
                  attributeFilter: ['class']
                });
              })();
            `,
          }}
        />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        
        {/* Google Analytics - Replace with your GA4 measurement ID */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'}', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

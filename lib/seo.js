/**
 * SEO Utilities for AquaMundi Project
 * Comprehensive SEO optimization utilities for metadata, structured data, and performance
 */

// Base site configuration
export const siteConfig = {
  name: "International Association for the Defense of Flowers Proveneya & Nahiara",
  title: "International Association for the Defense of Flowers Proveneya & Nahiara - Sacred Flowers & Biodiversity Guardians",
  description: "A cosmic journey through the world's most sacred flowers, connecting humanity with nature's wisdom and the pollinators that sustain life on Earth.",
  url: "https://www.aquamundi.org",
  ogImage: "https://www.aquamundi.org/og-image.jpg",
  twitterCard: "summary_large_image",
  twitterHandle: "@aquamundi",
  keywords: [
    "International Association for the Defense of Flowers",
    "Proveneya & Nahiara",
    "national flowers",
    "pollinators",
    "biodiversity",
    "environmental protection",
    "guardians",
    "sustainability",
    "sacred flowers",
    "3D globe",
    "interactive experience",
    "nature conservation",
    "floral heritage"
  ],
  authors: [{ name: "AquaMundi Team" }],
  creator: "International Association for the Defense of Flowers Proveneya & Nahiara",
  publisher: "International Association for the Defense of Flowers Proveneya & Nahiara",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.aquamundi.org",
    siteName: "International Association for the Defense of Flowers Proveneya & Nahiara",
    title: "International Association for the Defense of Flowers Proveneya & Nahiara - Sacred Flowers & Biodiversity Guardians",
    description: "A cosmic journey through the world's most sacred flowers, connecting humanity with nature's wisdom and the pollinators that sustain life on Earth.",
    images: [
      {
        url: "https://www.aquamundi.org/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "International Association for the Defense of Flowers Proveneya & Nahiara - Interactive 3D Globe of Sacred Flowers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aquamundi",
    creator: "@aquamundi",
    title: "International Association for the Defense of Flowers Proveneya & Nahiara - Sacred Flowers & Biodiversity Guardians",
    description: "A cosmic journey through the world's most sacred flowers, connecting humanity with nature's wisdom and the pollinators that sustain life on Earth.",
    images: ["https://www.aquamundi.org/og-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

/**
 * Generate page-specific metadata
 */
export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  authors = siteConfig.authors,
  noindex = false,
  nofollow = false,
}) {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const fullDescription = description || siteConfig.description;
  const fullUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const fullImage = image ? `${siteConfig.url}${image}` : `${siteConfig.url}${siteConfig.ogImage}`;
  const allKeywords = [...siteConfig.keywords, ...keywords].join(", ");

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: allKeywords,
    authors,
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type,
      locale: "en_US",
      url: fullUrl,
      siteName: siteConfig.name,
      title: fullTitle,
      description: fullDescription,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: siteConfig.twitter.card,
      site: siteConfig.twitter.site,
      creator: siteConfig.twitter.creator,
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
    },
    alternates: {
      canonical: fullUrl,
    },
    verification: siteConfig.verification,
  };
}

/**
 * Generate JSON-LD structured data
 */
export function generateStructuredData({
  type = "WebSite",
  name = siteConfig.name,
  description = siteConfig.description,
  url = siteConfig.url,
  image = siteConfig.ogImage,
  author,
  datePublished,
  dateModified,
  breadcrumbs,
  organization,
  article,
}) {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url,
    image: `${siteConfig.url}${image}`,
    sameAs: [
      "https://twitter.com/aquamundi",
      "https://facebook.com/aquamundi",
      "https://instagram.com/aquamundi",
    ],
  };

  // Add organization data
  if (organization || type === "Organization") {
    baseStructuredData["@type"] = "Organization";
    baseStructuredData.foundingDate = "2024";
    baseStructuredData.mission = "Connecting humanity with nature's wisdom through sacred flowers and biodiversity conservation";
    baseStructuredData.areaServed = "Worldwide";
    baseStructuredData.knowsAbout = [
      "Biodiversity Conservation",
      "Sacred Flowers",
      "Environmental Protection",
      "Pollinator Conservation",
      "Sustainable Development",
    ];
  }

  // Add article data
  if (article || type === "Article") {
    baseStructuredData["@type"] = "Article";
    baseStructuredData.headline = name;
    baseStructuredData.author = author || siteConfig.authors[0];
    baseStructuredData.datePublished = datePublished;
    baseStructuredData.dateModified = dateModified || datePublished;
    baseStructuredData.publisher = {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    };
  }

  // Add breadcrumbs
  if (breadcrumbs && breadcrumbs.length > 0) {
    baseStructuredData.breadcrumb = {
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: `${siteConfig.url}${crumb.url}`,
      })),
    };
  }

  return baseStructuredData;
}

/**
 * Generate sitemap data
 */
export function generateSitemapData() {
  const baseUrl = siteConfig.url;
  const currentDate = new Date().toISOString();

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/landing`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/flowers`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pollinators`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pollinators/gallery`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/dia-de-todos-los-polinizadores`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reloj-dia-de-todos-los-polinizadores`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.88,
    },
    {
      url: `${baseUrl}/guardians`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/impact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/education`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/living-archive`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/araihan-measure`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${siteConfig.url}/sitemap.xml

# Disallow admin or private areas (if any)
Disallow: /admin/
Disallow: /private/
Disallow: /api/

# Allow all other content
Allow: /landing
Allow: /flowers
Allow: /pollinators
Allow: /dia-de-todos-los-polinizadores
Allow: /reloj-dia-de-todos-los-polinizadores
Allow: /guardians
Allow: /impact
Allow: /education
Allow: /living-archive
Allow: /archive
Allow: /about
Allow: /araihan-measure`;
}

/**
 * Performance optimization utilities
 */
export const performanceConfig = {
  imageOptimization: {
    quality: 85,
    formats: ["image/webp", "image/avif"],
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  },
  lazyLoading: {
    threshold: 0.1,
    rootMargin: "50px",
  },
  prefetch: {
    domains: ["fonts.googleapis.com", "fonts.gstatic.com"],
  },
};

/**
 * Accessibility utilities
 */
export const accessibilityConfig = {
  headingLevels: {
    h1: "Main page title",
    h2: "Section titles",
    h3: "Subsection titles",
    h4: "Content group titles",
  },
  ariaLabels: {
    navigation: "Main navigation",
    globe: "Interactive 3D globe of sacred flowers",
    modal: "Flower detail modal",
    close: "Close dialog",
  },
};


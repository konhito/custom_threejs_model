/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['three', '@react-three/fiber', '@react-three/drei'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aquamundi-glb-models.s3.ap-south-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  
  // Compression
  compress: true,
  
  // Headers for SEO and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      // Redirect from non-www asociacionnahiara.org to www with /landing
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'asociacionnahiara.org',
          },
        ],
        destination: 'https://www.asociacionnahiara.org/landing',
        permanent: true,
      },
      // Ensure www.asociacionnahiara.org domain root redirects to /landing
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'www.asociacionnahiara.org',
          },
        ],
        destination: '/landing',
        permanent: true,
      },
      // No redirects for aquamundi.org - it should work normally
    ];
  },
  
  // Webpack configuration for better performance
  webpack: (config, { isServer }) => {
    // Optimize Three.js bundle
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'three/examples/jsm': 'three/examples/jsm',
      };
    }
    
    return config;
  },
  
  // Output configuration
  output: 'standalone',
  
  // SWC minification is enabled by default in Next.js 13+
  
  // Power by header
  poweredByHeader: false,
  
  // React strict mode
  reactStrictMode: true,
};

export default nextConfig;

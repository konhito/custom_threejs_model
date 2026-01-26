import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import createNextIntlPlugin from 'next-intl/plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const withNextIntl = createNextIntlPlugin('./i18n.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // Externalize packages that use browser globals (self, window) on server
  serverExternalPackages: ['three', 'ogl', '@react-three/fiber', '@react-three/drei'],
  
  // Optimize production builds
  reactStrictMode: true,
  
  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aquamundi-assets.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'aquamundi-glb-models.s3.ap-south-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'skiper-ui.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      ...(process.env.CLOUDFRONT_DOMAIN ? [{
        protocol: 'https',
        hostname: process.env.CLOUDFRONT_DOMAIN,
      }] : []),
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression
  compress: true,

  // Optimize compilation
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
    
    // Remove React properties in production
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // Experimental features for performance
  experimental: {
    // Optimize CSS
    optimizeCss: true,
    
    // Optimize package imports
    optimizePackageImports: [
      'lucide-react',
      '@stripe/stripe-js',
      '@stripe/react-stripe-js',
    ],
    
    // Server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer, webpack }) => {
    // Make webpack available for plugins
    if (!config.plugins) {
      config.plugins = [];
    }
    // Handle Node.js modules that don't exist in browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      fs: false,
      encoding: false,
      path: false,
      stream: false,
      crypto: false,
      util: false,
      net: false,
      tls: false,
      child_process: false,
    };

    if (isServer) {
      // Replace three.js and ogl with empty modules on server to prevent "self is not defined"
      config.resolve.alias = {
        ...config.resolve.alias,
        'three': false,
        'three/examples/jsm/loaders/GLTFLoader.js': false,
        'three/examples/jsm/controls/OrbitControls.js': false,
        'ogl': false,
        'face-api.js': false, // Don't bundle face-api.js on server
      };
    }
    
    // Ignore face-api.js server-side dependencies for client bundle
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
      };
      
      // Ignore problematic modules in face-api.js dependencies
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^(fs|path|encoding|stream|crypto|util|net|tls|child_process)$/,
        })
      );
    }
    
    // Production optimizations
    if (!dev && !isServer) {
      // Split chunks more aggressively - only for client
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Vendor chunks
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const match = module.context?.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                if (!match || !match[1]) {
                  return 'vendor.unknown';
                }
                const packageName = match[1];
                return `vendor.${packageName.replace('@', '')}`;
              },
              priority: 10,
            },
            // React & Next.js core
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              name: 'react',
              priority: 20,
            },
            // Three.js (large library)
            three: {
              test: /[\\/]node_modules[\\/]three[\\/]/,
              name: 'three',
              priority: 20,
            },
            // Stripe
            stripe: {
              test: /[\\/]node_modules[\\/]@stripe[\\/]/,
              name: 'stripe',
              priority: 20,
            },
            // Translation dictionaries
            translations: {
              test: /[\\/]i18n[\\/]dictionaries[\\/]/,
              name: 'translations',
              priority: 15,
            },
            // Common chunks
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };

      // Tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = true;

      // Minimize bundle size
      if (!isServer) {
        config.resolve.alias = {
          ...config.resolve.alias,
          // Use lightweight alternatives
          'moment': 'dayjs',
        };
      }
    }

    // Exclude large files from bundle
    config.module.rules.push({
      test: /\.glb$/,
      type: 'asset/resource',
    });

    // Analyzer plugin merged instead of overwriting
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        })
      );
    }

    return config;
  },

  // Environment variables exposed to browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
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
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache images
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache fonts
        source: '/:all*(.woff|.woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Rewrites for API proxy (optional)
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // Only add rewrite if API URL is configured
    if (!apiUrl) {
      return [];
    }
    
    return [
      {
        source: '/api-proxy/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      // Redirect old paths if needed
      {
        source: '/shop/products',
        destination: '/shop',
        permanent: true,
      },
    ];
  },

  // Output configuration
  output: 'standalone',
  
  // Disable x-powered-by header
  poweredByHeader: false,

  // Generate ETags for caching
  generateEtags: true,

  // Page extensions
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

  // Production source maps (disable for smaller builds)
  productionBrowserSourceMaps: false,
};

export default withNextIntl(nextConfig);

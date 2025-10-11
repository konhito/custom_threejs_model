/** @type {import('next').NextConfig} */
const nextConfig = {
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
      // No redirects for aquamundi.org - let it work normally
    ];
  },
};

export default nextConfig;

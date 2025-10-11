/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Redirect from non-www to www with /landing
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
      // Ensure www domain root redirects to /landing
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
    ];
  },
};

export default nextConfig;

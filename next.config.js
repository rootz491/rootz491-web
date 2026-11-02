const { buildContentSecurityPolicy } = require('./csp.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      { source: '/work', destination: '/projects', permanent: false },
      { source: '/work/:path*', destination: '/projects/:path*', permanent: false },
      { source: '/services', destination: '/projects', permanent: false },
      { source: '/services/:path*', destination: '/projects', permanent: false },
      { source: '/government', destination: '/about', permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=()',
          },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          {
            key: 'Content-Security-Policy',
            // Next.js App Router inlines its bootstrap scripts
            // (self.__next_f.push), so 'unsafe-inline' is required for
            // script-src. Using nonces instead would force every page to be
            // dynamically rendered. The dev variant also allows 'unsafe-eval'
            // and ws: so `next dev` HMR works.
            value: buildContentSecurityPolicy({
              dev: process.env.NODE_ENV !== 'production',
            }),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

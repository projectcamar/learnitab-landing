/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['od.lk', 'e7.pngegg.com'],
  },
  // Add this section to handle the landing page
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/index.html',
      },
    ];
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['od.lk', 'e7.pngegg.com'],
  },
  // Add this section for handling the landing page
  async redirects() {
    return [
      {
        source: '/',
        destination: '/index.html',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig

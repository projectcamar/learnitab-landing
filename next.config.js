/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['od.lk', 'e7.pngegg.com'], // Added the new domain
  },
  // If you're using rewrites/redirects:
  // assetPrefix: '/',
  // trailingSlash: true,
}

module.exports = nextConfig 
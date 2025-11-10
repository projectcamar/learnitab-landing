/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to support API routes
  images: {
    unoptimized: true,
    domains: ['od.lk', 'e7.pngegg.com'],
  },
  // Add this to handle script tags
  webpack: (config) => {
    config.externals = [...config.externals, 'three'];
    return config;
  },
}

module.exports = nextConfig

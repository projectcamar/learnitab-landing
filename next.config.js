/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable API routes for AI Jobs feature
  // If you need static export, you can re-enable it but API routes won't work
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

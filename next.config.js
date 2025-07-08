/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Vercel deployment
  output: 'standalone',

  // Ensure proper static optimization
  trailingSlash: false,

  // Image optimization
  images: {
    domains: ['localhost'],
    unoptimized: true
  },

  // Ensure proper ESLint configuration
  eslint: {
    ignoreDuringBuilds: true
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
}

module.exports = nextConfig

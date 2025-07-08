/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Ensure proper module resolution for barrel exports
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.jsx': ['.jsx', '.tsx'],
    }
    
    // Add fallbacks for better module resolution
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    }
    
    return config
  },
  // Ensure proper transpilation
  transpilePackages: ['lucide-react'],
  
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
  }
}

module.exports = nextConfig

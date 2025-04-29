/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable strict TypeScript checks
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable strict ESLint checks
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add image optimization configuration
  images: {
    domains: ['dulcet-cannoli-e7490f.netlify.app', 'v0.dev', 'v0.blob.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/webp'],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Optimize production builds
  swcMinify: true,
  // Add error handling for webpack
  webpack: (config, { isServer }) => {
    // Add source maps for better error debugging
    if (!isServer) {
      config.devtool = 'source-map'
    }
    return config
  },
}

export default nextConfig

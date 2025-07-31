import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Image optimization for performance
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.imdb.com',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // 24 hours
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Performance optimizations
  experimental: {
    // optimizeCss: true, // Temporarily disabled due to build issues
    optimizePackageImports: ['@/components', '@/lib', '@/types'],
  },

    // Bundle analysis (simplified to avoid conflicts)
  webpack: (config, { dev, isServer }) => {
    // Only add safe optimizations that don't conflict with Next.js caching
    if (!dev && !isServer) {
      // Tree shaking only in production client builds
      config.optimization.sideEffects = false;
    }

    return config;
  },

  // Compression and caching
  compress: true,
  poweredByHeader: false,

  // Progressive Web App optimizations
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        // Performance headers
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin'
        },
        // Cache static assets
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ],
    },
    {
      source: '/api/(.*)',
      headers: [
        // API caching
        {
          key: 'Cache-Control',
          value: 'public, max-age=300, stale-while-revalidate=60'
        }
      ],
    }
  ],
};

export default nextConfig;

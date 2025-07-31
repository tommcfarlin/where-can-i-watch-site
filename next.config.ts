import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Image optimization for performance
  images: {
    domains: ['image.tmdb.org', 'm.media-amazon.com', 'www.imdb.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // 24 hours
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components', '@/lib', '@/types'],
  },

  // Bundle analysis
  webpack: (config, { dev, isServer }) => {
    // Performance monitoring in development
    if (dev && !isServer) {
      config.optimization.providedExports = true;
      config.optimization.usedExports = true;
    }

    // Tree shaking optimizations
    if (!dev) {
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

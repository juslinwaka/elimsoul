import type { NextConfig } from 'next';
// @ts-ignore
import withPWA from 'next-pwa';

const nextConfig: NextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [
    /app-build-manifest\.json$/,
    /middleware-manifest\.json$/
  ],
  runtimeCaching: [
    {
      // AI API calls (Hugging Face)
      urlPattern: /^https:\/\/huggingface\.co\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'huggingface-api',
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      // Any CDN / video / static assets
      urlPattern: /^https:\/\/cdn\.elimsoul\.org\/.*$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'cdn-assets',
        expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },
  ],
})({
  reactStrictMode: true,
  experimental: {},
});

export default nextConfig;

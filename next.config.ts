import type { NextConfig } from 'next';
// @ts-ignore
import withPWA from 'next-pwa';

const nextConfig: NextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',

  // Exclude all Next.js dynamic runtime files
  buildExcludes: [
    /app-build-manifest\.json$/,
    /middleware-manifest\.json$/,
    /routes-manifest\.json$/,
    /react-loadable-manifest\.json$/,
    /_buildManifest\.js$/,
    /_reactLoadableManifest\.js$/,
    /_ssgManifest\.js$/,
    /_middlewareManifest\.js$/,
    /_flightManifest\.js$/,
  ],

  runtimeCaching: [
    {
      // AI API calls (Hugging Face)
      urlPattern: /^https:\/\/huggingface\.co\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'ai-api-cache',
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      // Videos (CacheFirst)
      urlPattern: /^https:\/\/cdn\.elimsoul\.org\/videos\/.*$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'videos-cache',
        expiration: { maxEntries: 20, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },
    {
      // Other CDN assets (images, fonts)
      urlPattern: /^https:\/\/cdn\.elimsoul\.org\/.*$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'cdn-assets',
        expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },
    {
      // Site pages (NetworkFirst for offline support)
      urlPattern: /^https:\/\/elimsoul\.vercel\.app\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages-cache',
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
  ],
})({
  reactStrictMode: true,
  experimental: {}, // keep clean, no invalid keys
});

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
headers() {
  return Promise.resolve([
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' https://*.daily.co; frame-src https://*.daily.co;",
        },
      ],
    },
  ]);
}
};
export default nextConfig;

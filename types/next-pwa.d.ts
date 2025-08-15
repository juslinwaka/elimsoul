declare module 'next-pwa' {
  import type { NextConfig } from 'next';
  type PWAOptions = {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    runtimeCaching?: any[];
    buildExcludes?: Array<string | RegExp>;
    [key: string]: any;
  };
  export default function withPWA(options?: PWAOptions): (nextConfig: NextConfig) => NextConfig;
}

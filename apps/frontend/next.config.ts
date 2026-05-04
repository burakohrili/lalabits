import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@resvg/resvg-js'],
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      // Cloudflare R2 public bucket
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
      // R2 custom public domain (set up after deployment)
      {
        protocol: "https",
        hostname: "cdn.lalabits.art",
      },
      // Railway-hosted backend assets
      {
        protocol: "https",
        hostname: "*.up.railway.app",
      },
    ],
  },
};

export default nextConfig;

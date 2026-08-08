import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.nismara.my.id',
      },
    ],
  },
};

export default nextConfig;

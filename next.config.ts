import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/fethron-ai",
        destination: "/fethron-agent",
        permanent: true,
      },
      {
        source: "/fethron-ai/:path*",
        destination: "/fethron-agent/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

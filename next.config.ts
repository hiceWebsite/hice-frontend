import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: "default", // use direct URLs
    unoptimized: true, // disable Next.js optimization
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;

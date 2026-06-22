import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

const withPWA = withPWAInit({
  dest: "public",
});

const config = process.env.NODE_ENV === "development" ? nextConfig : withPWA(nextConfig);

export default config;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  transpilePackages: ["@browser/ui"]
};

export default nextConfig;

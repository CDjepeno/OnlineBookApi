import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "my-uploadfilebucket.s3.eu-west-1.amazonaws.com",
          },
        ],
      },
};

export default nextConfig;

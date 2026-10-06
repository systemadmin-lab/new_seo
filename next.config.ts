import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "musecooldevstorage.blob.core.windows.net",
        port: "",
        pathname: "/files/**",
        search: "",
      },
    ],
    maximumRedirects: 0,
  },
};

export default nextConfig;

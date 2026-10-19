import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: [
        ...(process.env.NEXT_PUBLIC_SITE_URL
          ? [process.env.NEXT_PUBLIC_SITE_URL.replace(/^https?:\/\//, "")]
          : []),
        ...(process.env.VERCEL_URL ? [process.env.VERCEL_URL] : []),
        "localhost:3000",
        "127.0.0.1:3000",
        "localhost:3002",
        "127.0.0.1:3002",
      ],
    },
  },
}

export default nextConfig

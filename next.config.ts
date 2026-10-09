import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : undefined;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/clarity-check", destination: "/systems-score", permanent: true },
      { source: "/examples", destination: "https://examples.buildwithmosaic.co/examples", permanent: true },
      {
        // Homepage screenshots live in public/examples/*.webp. Redirects run before public files.
        source: "/examples/:path((?!.*\\.webp$).*)",
        destination: "https://examples.buildwithmosaic.co/examples/:path",
        permanent: true,
      },
      {
        source: "/free",
        destination: "/resources",
        permanent: true,
      },
      {
        source: "/free/:slug",
        destination: "/resources/:slug",
        permanent: true,
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
          },
        ]
      : [],
  },
};

export default nextConfig;

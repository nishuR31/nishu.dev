/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Tree-shake icon-heavy libraries
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;


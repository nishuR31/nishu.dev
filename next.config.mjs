/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Tree-shake icon-heavy libraries and animejs
    optimizePackageImports: ["lucide-react", "animejs", "framer-motion"],
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


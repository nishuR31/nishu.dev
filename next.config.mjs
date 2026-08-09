/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Tree-shake icon-heavy libraries and animejs
    optimizePackageImports: ["lucide-react", "animejs", "framer-motion"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;


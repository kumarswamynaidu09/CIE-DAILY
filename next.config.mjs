import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix for monorepo / multiple lockfiles warning
  outputFileTracingRoot: path.join(import.meta.dirname, "./"),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
};

export default nextConfig;

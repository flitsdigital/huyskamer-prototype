import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allows building into a throwaway dir (NEXT_DIST_DIR) without clobbering a running `next dev`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;

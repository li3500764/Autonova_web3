import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 添加 PostCSS 配置白名单
  experimental: {
    optimizePackageImports: [
      '@tailwindcss/postcss'
    ]
  },
  output: 'export'
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      appDir: true,
      transpilePackages: ["ui"],
      // runtime: "experimental-edge",
    },
  };
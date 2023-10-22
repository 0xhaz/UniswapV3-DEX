/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: true,
  transpilePackages: ["antd-mobile"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.moralis.io",
      },
      {
        protocol: "https",
        hostname: "assets-cdn.trustwallet.com",
      },
    ],
  },
};

module.exports = nextConfig;

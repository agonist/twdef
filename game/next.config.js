/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs.filebase.io",
      },
    ],
  },
};

module.exports = nextConfig;

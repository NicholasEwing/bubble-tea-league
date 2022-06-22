/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "cdn.discordapp.com",
      "tailwindui.com",
      "ddragon.leagueoflegends.com",
    ],
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;

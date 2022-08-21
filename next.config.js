/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "cdn.discordapp.com",
      "tailwindui.com",
      "ddragon.leagueoflegends.com",
      "www.fillmurray.com",
      "localhost",
    ],
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;

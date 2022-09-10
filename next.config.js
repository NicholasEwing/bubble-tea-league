/** @type {import('next').NextConfig} */

const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require("next/constants");

module.exports = async (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER; // npm run dev
  const isProd =
    phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== "1"; // npm run build
  const isStaging =
    phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === "1"; // npm run build

  // reach out to versions.json
  const response = await fetch(
    "https://ddragon.leagueoflegends.com/api/versions.json"
  );
  const body = await response.json();
  const patchNumber = body[0];

  return {
    reactStrictMode: true,
    env: {
      patchNumber,
    },
    images: {
      domains: [
        "cdn.discordapp.com",
        "tailwindui.com",
        "ddragon.leagueoflegends.com",
        "www.fillmurray.com",
        "localhost",
        "am-a.akamaihd.net",
      ],
      formats: ["image/avif", "image/webp"],
    },
  };
};

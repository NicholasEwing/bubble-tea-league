module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "champion-attributes": "url('/sprite-attribute-champion.png')",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

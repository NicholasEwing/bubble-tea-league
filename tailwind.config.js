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
        "home-hero": "url('/home-hero-bg.png')",
      },
      colors: {
        "teal-accent": "#00c8c8",
        "btl-blue": "#77cff6",
        "btl-pink": "#f391c0",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    function ({ addVariant }) {
      addVariant("not-first", "&:not(:nth-child(1))");
    },
    function ({ addVariant }) {
      addVariant("not-second", "&:not(:nth-child(2))");
    },
  ],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "calm-sky": "#87CEEB",
        "calm-mint": "#98FB98",
        "calm-sand": "#F4A460",
        "calm-white": "#FAFAF0",
      },
      fontFamily: {
        sans: ["Geist", "sans-serif"],
        serif: ["Lora", "serif"],
      },
      backgroundImage: {
        "calm-gradient": "linear-gradient(135deg, #87CEEB20 0%, #98FB9820 100%)",
      },
    },
  },
  plugins: [],
};

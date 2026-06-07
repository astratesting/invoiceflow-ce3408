/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          light: "#B0E0FF",
          DEFAULT: "#87CEEB",
          dark: "#5BA3D9",
        },
        mint: {
          light: "#C1FFC1",
          DEFAULT: "#98FB98",
          dark: "#6BE66B",
        },
        sand: {
          light: "#F8D8A4",
          DEFAULT: "#F4A460",
          dark: "#C87A30",
        },
        cream: "#FAFAF0",
      },
      fontFamily: {
        sans: ["Geist", "system-ui", "-apple-system", "sans-serif"],
        serif: ["Lora", "Georgia", "serif"],
      },
      backgroundImage: {
        "calm-gradient": "linear-gradient(135deg, #FAFAF0 0%, #B0E0FF 50%, #C1FFC1 100%)",
        "sky-gradient": "linear-gradient(180deg, #B0E0FF 0%, #87CEEB 100%)",
        "soft-card": "linear-gradient(145deg, rgba(250,250,240,0.9) 0%, rgba(176,224,255,0.3) 100%)",
      },
      boxShadow: {
        soft: "0 2px 15px rgba(135,206,235,0.15)",
        "soft-lg": "0 10px 40px rgba(135,206,235,0.12)",
      },
      borderRadius: {
        soft: "16px",
        "soft-lg": "24px",
      },
    },
  },
  plugins: [],
};

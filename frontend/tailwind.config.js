/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'calm-sky': '#87CEEB',
        'calm-mint': '#98FB98',
        'calm-sand': '#F4A460',
        'calm-white': '#FAFAF0',
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

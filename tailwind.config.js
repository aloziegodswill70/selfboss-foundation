// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
          gold: '#FFD700', // adjust based on actual logo tone
        black: '#000000',
      },
    },
  },
  plugins: [],
}

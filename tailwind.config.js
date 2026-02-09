/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
        qualitaGreen: '#4CAF50',
        qualitaOrange: '#FF9800',
        qualitaGray: '#F5F5F5',
      },
    },
  },
  plugins: [],
}


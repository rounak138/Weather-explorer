/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0a0b0d',
          card: '#16181c',
          cardMuted: '#242830',
          accent: '#3b82f6',
          accentHover: '#2563eb',
        }
      }
    },
  },
  plugins: [],
}

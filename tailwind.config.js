/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neo-bg': '#f3f6f2',
        'neo-dark': '#0a0f0d',
        'neo-lime': '#c9ff5c',
        'neo-cyan': '#7fd8ff',
        'neo-orange': '#ff9d6e',
        'neo-pink': '#ff8fb1',
        'neo-yellow': '#ffd23f',
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px 0px #0a0f0d',
        'neo-md': '4px 4px 0px 0px #0a0f0d',
        'neo-hover': '6px 6px 0px 0px #0a0f0d',
        'neo-active': '0px 0px 0px 0px #0a0f0d',
      },
      borderRadius: {
        'neo': '1rem',
      }
    },
  },
  plugins: [],
}
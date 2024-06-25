/** @type {import('tailwindcss').Config} */
const primeui = require("tailwindcss-primeui");

module.exports = {
  darkMode:'selector',
  content: ['./src/**/*.{html,js,ts,vue}'],
  theme: {
    extend: {
      colors: {
        blue: {
          light: '#3b82f6', // Light Blue
          DEFAULT: '#3d618f', // Blue
          dark: '#1f3047', // Dark Blue
        },
      },
    },
  },
  plugins: [primeui],
};

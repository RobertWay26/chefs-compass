/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#50808E', // Dark teal
        secondary: '#69A297', // Medium teal
        accent: '#84B59F', // Light teal
        background: '#DDD8C4', // Light beige
        highlight: '#A3C9A8', // Pale green
      },
    },
  },
  plugins: [],
};
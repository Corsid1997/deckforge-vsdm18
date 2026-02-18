/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'app-bg': '#0a0d14',
        'app-surface': '#1a1b26',
      },
      borderColor: {
        DEFAULT: 'rgba(255, 255, 255, 0.08)',
      },
    },
  },
  plugins: [],
};

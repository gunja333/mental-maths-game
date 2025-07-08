/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#4F46E5',
        'brand-secondary': '#10B981',
        'brand-light': '#F3F4F6',
        'brand-dark': '#1F2937',
        'gold': '#FFD700',
        'silver': '#C0C0C0',
        'bronze': '#CD7F32',
      },
      fontFamily: {
          sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

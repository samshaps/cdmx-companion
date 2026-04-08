/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: '#C2572B',
        teal: {
          DEFAULT: '#1A535C',
          light: '#4ECDC4',
        },
        cream: '#FFF5E6',
        marigold: '#E8A838',
        charcoal: '#2D2D2D',
        'warm-gray': '#F0EBE3',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

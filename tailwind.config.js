/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The three brand colours are CSS variables so a trip can wear the
        // colours of its destination's flag (see shared/skins.js). The names
        // describe the default skin: teal = primary, terracotta = accent,
        // marigold = highlight.
        terracotta: 'rgb(var(--c-accent) / <alpha-value>)',
        teal: {
          DEFAULT: 'rgb(var(--c-primary) / <alpha-value>)',
          light: 'rgb(var(--c-primary-light) / <alpha-value>)',
        },
        cream: '#FFF5E6',
        marigold: 'rgb(var(--c-highlight) / <alpha-value>)',
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

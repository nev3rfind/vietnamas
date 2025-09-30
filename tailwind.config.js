/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ivory-crepe': '#FFFFF8',
        'spring-poppy': '#FCB2A9',
        'english-pear': '#B0D5C0',
        'nimble': '#989CA0',
      },
      fontFamily: {
        'script': ['Great Vibes', 'cursive'],
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Montserrat', 'sans-serif'],
      },
      textShadow: {
        'sm': '1px 1px 2px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl-soft': '1rem',
      },
      backgroundImage: {
        'paper-texture': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"0.02\"%3E%3Ccircle cx=\"7\" cy=\"7\" r=\"1\"/%3E%3Ccircle cx=\"53\" cy=\"53\" r=\"1\"/%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/svg%3E')",
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-sm': {
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
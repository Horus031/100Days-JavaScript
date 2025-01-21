/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./projects/**/*.html"],
  theme: {
    extend: {
      animation: {
        'fadeout': 'fadeOut 0.3s ease',
      },
      keyframes: {
        fadeOut: {
          '0%': { opacity: '1'},
          '100%': { opacity: '0'},
        }
      }
    },
  },
  plugins: [],
}


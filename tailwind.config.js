/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/**/*.{html,js}",
    "./projects/**/*.js",
    "./projects/**/script.js",
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        translateTop: {
          '0%' : { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100px)'}
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        fadeSequence: 'translateTop 0.5s ease, fadeOut 0.5s ease forwards',
      },
      
    },
  },
  plugins: [],
}


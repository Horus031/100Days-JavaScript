/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/**/*.{html,js}",
    "./projects/**/*.js",
    "./projects/**/script.js",
  ],
  darkMode: 'class',
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
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1},
        },
        slideIn: {
          '0%': { transform: 'translateY(-50%)'},
          '100%': { transform: 'translateY(0)'},
        },
        translateTop: {
          '0%' : { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100px)'}
        },
        menuTransition: {
          '0%': { transform: 'translateX(-100%)'},
          '100%': { transform: 'translateX(0)'}
        },
        toastSlideOut: {
          '0%': { transform: 'translateX(0)'},
          '100%': { transform: 'translateX(-100%)'}
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        fadeSequence: 'translateTop 0.5s ease, fadeOut 0.5s ease forwards',
        menuTransition: 'menuTransition 0.8s ease',
        taskTransition: 'slideIn 0.5s ease, fadeIn 0.5s ease forwards',
        toastTransition: 'menuTransition 0.8s ease, fadeIn 0.5s ease forwards',
        toastSlideOut: 'toastSlideOut 0.8s ease, fadeOut 0.5s ease forwards',
      },
      
    },
  },
  plugins: [],
}


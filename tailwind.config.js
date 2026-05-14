/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
  extend: {
    keyframes: {
      fadeUp: {
        '0%': {
          opacity: '0',
          transform: 'translateY(30px)',
        },
        '100%': {
          opacity: '1',
          transform: 'translateY(0)',
        },
      },  
    },

    animation: {
      fadeUp: 'fadeUp 0.6s ease 0.3s forwards',
    },
  },
},
}



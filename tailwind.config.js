/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
  corePlugins: {
    preflight: false
  },
  important: '#__next',
  safelist: [
    {
      pattern: /^animate__/
    }
  ],
  plugins: [require('tailwindcss-logical'), require('./src/@core/tailwind/plugin')],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(118deg, #ff1d5c, #ff1d5cb3)'
      },
      boxShadow: {
        'pink-shadow': '0 0 10px 1px rgba(255, 29, 92, .7);' // Adjust as needed
      }
    }
  }
}

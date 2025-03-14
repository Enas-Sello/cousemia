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
      keyframes: {
        'padding-left': {
          '0%': { paddingLeft: '16px' },
          '100%': { paddingLeft: '20px' }
        }
      },
      animation: {
        'padding-left': 'padding-left 0.2s ease-in-out forwards'
      }
    }
  }
}

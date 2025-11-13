/**
 * Shared Tailwind CSS preset for the entire monorepo
 * This preset contains common theme configuration including fonts, colors, and spacing
 * that should be consistent across all applications and libraries.
 *
 * Usage:
 * In your tailwind.config.js:
 * module.exports = {
 *   presets: [require('../../tailwind.preset.js')],
 *   // Your app-specific configuration here
 * }
 */

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'gilroy-regular': ['GilroyRegular', 'sans-serif'],
        'gilroy-medium': ['GilroyMedium', 'sans-serif'],
        'gilroy-bold': ['GilroyBold', 'sans-serif'],
        'gilroy-semibold': ['GilroySemiBold', 'sans-serif'],
        'gilroy-black': ['GilroyBlack', 'sans-serif'],
        'gilroy-heavy': ['GilroyHeavy', 'sans-serif'],
        'gilroy-light': ['GilroyLight', 'sans-serif'],
        'helvetica': ['Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        // Primary brand color
        primary: {
          DEFAULT: '#D70127',
          200: '#FF7D7D',
          500: '#A8001E'
        },
        // Secondary colors
        blue: {
          DEFAULT: '#6558f5',
          100: '#7AD7FF',
        },
        green: {
          200: '#95CB51'
        },
        // Grayscale
        gray: {
          200: '#C3C3C3',
          300: '#D9D9D9',
          400: '#65696E',
          500: '#555555',
          700: '#373737'
        },
        // Accent colors
        orange: {
          300: '#FFF0D3',
          500: '#FFBA7A',
          600: '#E19500'
        }
      },
      borderRadius: {
        'xl': '14px',
        '3xl': '27.5px'
      },
      boxShadow: {
        'avatar': '0px 0px 8px 0px rgba(0, 0, 0, 0.25)'
      }
    },
  },
  plugins: [],
}

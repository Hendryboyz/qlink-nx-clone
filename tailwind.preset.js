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
        // Legacy Gilroy fonts (kept for backward compatibility)
        'gilroy-regular': ['GilroyRegular', 'sans-serif'],
        'gilroy-medium': ['GilroyMedium', 'sans-serif'],
        'gilroy-bold': ['GilroyBold', 'sans-serif'],
        'gilroy-semibold': ['GilroySemiBold', 'sans-serif'],
        'gilroy-black': ['GilroyBlack', 'sans-serif'],
        'gilroy-heavy': ['GilroyHeavy', 'sans-serif'],
        'gilroy-light': ['GilroyLight', 'sans-serif'],
        'helvetica': ['Helvetica', 'Arial', 'sans-serif'],

        // New design system fonts
        // Manrope - For UI elements
        'manrope': ['Manrope', 'sans-serif'],
        'manrope-regular': ['Manrope', 'sans-serif'], // weight: 400
        'manrope-medium': ['Manrope', 'sans-serif'],  // weight: 500
        'manrope-semibold': ['Manrope', 'sans-serif'], // weight: 600
        'manrope-bold': ['Manrope', 'sans-serif'],    // weight: 700

        // Poppins - For campaign/marketing content
        'poppins': ['Poppins', 'sans-serif'],
        'poppins-regular': ['Poppins', 'sans-serif'], // weight: 400
        'poppins-medium': ['Poppins', 'sans-serif'],  // weight: 500
        'poppins-semibold': ['Poppins', 'sans-serif'], // weight: 600
        'poppins-bold': ['Poppins', 'sans-serif'],    // weight: 700
      },
      colors: {
        // Brand Colors (Design System)
        primary: {
          DEFAULT: '#D70127',
          200: '#FF7D7D',    // Legacy
          500: '#A8001E'     // Legacy
        },
        secondary: {
          DEFAULT: '#F5F5F5'
        },
        tertiary: {
          DEFAULT: '#1A1A1A'
        },

        // Semantic Colors
        error: {
          DEFAULT: '#CA0000'
        },
        warning: {
          DEFAULT: '#FFB800'
        },
        success: {
          DEFAULT: '#10B700'
        },

        // Grayscale Colors (Design System)
        'text-str': '#1A1A1A',    // Text Strong
        'text-w': '#343434',      // Text Weak
        'stroke-s': '#777777',    // Stroke Strong
        'stroke-w': '#80BDBD',    // Stroke Weak
        bg: '#F5F5F5',            // Background
        fill: '#FFFFFF',          // Fill

        // Legacy grayscale (kept for backward compatibility)
        gray: {
          200: '#C3C3C3',
          300: '#D9D9D9',
          400: '#65696E',
          500: '#555555',
          700: '#373737'
        },

        // Legacy colors (kept for backward compatibility)
        blue: {
          DEFAULT: '#6558f5',
          100: '#7AD7FF',
        },
        green: {
          200: '#95CB51'
        },
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

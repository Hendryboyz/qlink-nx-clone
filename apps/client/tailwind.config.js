module.exports = {
    presets: [require('../../tailwind.preset.js')],
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './app/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
      '../../libs/components/src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.4' }],
        sm: ['0.875rem', { lineHeight: '1.4' }],
        base: ['1rem', { lineHeight: '1.25' }],
        lg: ['1.125rem', { lineHeight: '1.25' }],
        xl: ['1.25rem', { lineHeight: '1.25' }],
        '2xl': ['1.5rem', { lineHeight: '1.25' }],
        '3xl': ['1.875rem', { lineHeight: '1.25' }],
        '4xl': ['2.25rem', { lineHeight: '1.25' }],
        '5xl': ['3rem', { lineHeight: '1.25' }],
        '6xl': ['3.75rem', { lineHeight: '1.25' }],
        '7xl': ['4.5rem', { lineHeight: '1.25' }],
        '8xl': ['6rem', { lineHeight: '1.25' }],
        '9xl': ['8rem', { lineHeight: '1.25' }],
      },
      extend: {
        // Client-specific extensions can go here
      },
    },
    plugins: [],
  }

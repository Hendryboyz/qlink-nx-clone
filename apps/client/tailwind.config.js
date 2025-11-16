module.exports = {
    presets: [require('../../tailwind.preset.js')],
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './app/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        // Client-specific extensions can go here
      },
    },
    plugins: [],
  }

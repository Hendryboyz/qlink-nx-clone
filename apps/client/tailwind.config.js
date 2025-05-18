module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './app/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          'gilroy': ['Gilroy', 'sans-serif'],
          'gilroy-bold': ['GilroyBold', 'sans-serif'],
          'gilroy-black': ['GilroyBlack', 'sans-serif']
        },
        colors: {
          primary: {
            DEFAULT: '#D70127',
            200: '#FF7D7D',
            500: '#A8001E'
          },
          blue: {
            DEFAULT: '#6558f5',
            100: '#7AD7FF',
          },
          green: {
            200: '#95CB51'
          },
          gray: {
            200: '#C3C3C3',
            300: '#D9D9D9',
            400: '#65696E',
            500: '#555555',
            700: '#373737'
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
        }
      },
    },
    plugins: [],
  }

module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './app/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          'gilroy-regular': ['GilroyRegular', 'sans-serif'],
          'gilroy-medium': ['GilroyMedium', 'sans-serif'],
          'gilroy-bold': ['GilroyBold', 'sans-serif'],
          'gilroy-semibold': ['GilroySemiBold', 'sans-serif'],
          'gilroy-black': ['GilroyBlack', 'sans-serif'],
          'gilroy-heavy': ['GilroyHeavy', 'sans-serif'],
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
        },
        boxShadow: {
          'avatar': '0px 0px 8px 0px rgba(0, 0, 0, 0.25)'
        }
      },
    },
    plugins: [],
  }

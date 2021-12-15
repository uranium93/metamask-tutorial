module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      main: ['Cairo'],
    },
    extend: {
      container: {
        center: true,
      },
      colors: {
        primary: '#FD43FF',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Mulish', 'system-ui', 'sans-serif'],
      },
      colors: {
        ebs: {
          primary: '#00318D',
          primaryDark: '#0B1D3F',
          headerDark: '#0E1C36',
          heroBlue: '#163363',
          titleGold: '#D4AF37',
          formBg: '#F8F7F4',
          formBorder: '#333333',
          btnBeige: '#EADFC8',
          primaryLight: '#1F3C8E',
          accent: '#113088',
          muted: '#929FC2',
          muted2: '#9DA5B2',
          gold: '#B8965C',
          goldLight: '#C2B194',
          gray: '#4C5564',
          grayDark: '#31363C',
          grayDarker: '#2D2F31',
          grayLight: '#5F6266',
          cream: '#F8F4EF',
          creamLight: '#E8DECA',
          bg: '#F0F2F7',
          white: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
}

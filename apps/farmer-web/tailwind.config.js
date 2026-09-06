/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          950: '#07240E',
          900: '#0B3B18',
          800: '#14532D',
          700: '#15803D',
          600: '#16A34A',
          100: '#DCFCE7',
          50: '#F0FDF4',
        },
        harvest: {
          DEFAULT: '#C68A2C',
          light: '#E9B858',
          dark: '#926017',
          50: '#FEF9EE',
        },
        stonebg: {
          50: '#FBFBFA',
          100: '#F4F4F0',
          200: '#EBEBE5',
          300: '#D9D9CF',
        },
        charcoal: {
          900: '#1A201C',
          800: '#2D3732',
          700: '#3F4E46',
          600: '#526258',
          500: '#6C7E73',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        hindi: ['Mukta', 'Noto Sans Devanagari', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

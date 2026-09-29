/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#070709',
          900: '#0C0D10',
          850: '#121317',
          800: '#181920',
          700: '#232530',
          600: '#323545',
          500: '#4F536B',
        },
        acid: {
          DEFAULT: '#CCFF00',
          400: '#D8FF33',
          500: '#CCFF00',
          600: '#B0DC00',
          glow: 'rgba(204, 255, 0, 0.25)',
        },
        flame: {
          DEFAULT: '#FF5500',
          400: '#FF7326',
          500: '#FF5500',
          600: '#DE4500',
        },
        offwhite: '#F5F5F7',
        muted: '#8E92A4'
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Cabinet Grotesk', 'Impact', 'Plus Jakarta Sans', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        widest: '0.15em',
        ultra: '0.25em',
      },
      boxShadow: {
        'acid-glow': '0 0 25px -5px rgba(204, 255, 0, 0.35)',
        'acid-sm': '0 0 12px -2px rgba(204, 255, 0, 0.4)',
        'flame-glow': '0 0 25px -5px rgba(255, 85, 0, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};

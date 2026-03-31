/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          black: '#0a0a0a',
          dark: '#1a1a1a',
          gray: '#2d2d2d',
          accent: '#c8a96e',
          light: '#f5f0eb'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif']
      },
      keyframes: {
        'fade-up':    { '0%': { opacity:'0', transform:'translateY(40px)' }, '100%': { opacity:'1', transform:'translateY(0)' } },
        'fade-in':    { '0%': { opacity:'0' }, '100%': { opacity:'1' } },
        'scale-in':   { '0%': { opacity:'0', transform:'scale(0.85)' }, '100%': { opacity:'1', transform:'scale(1)' } },
        'float':      { '0%,100%': { transform:'translateY(0px)' }, '50%': { transform:'translateY(-12px)' } },
        'pulse-glow': { '0%,100%': { boxShadow:'0 0 20px #c8a96e33' }, '50%': { boxShadow:'0 0 50px #c8a96e88' } },
        'marquee':    { '0%': { transform:'translateX(0)' }, '100%': { transform:'translateX(-50%)' } },
        'spin-slow':  { '0%': { transform:'rotate(0deg)' }, '100%': { transform:'rotate(360deg)' } },
      },
      animation: {
        'fade-up':    'fade-up 0.7s ease forwards',
        'fade-in':    'fade-in 0.6s ease forwards',
        'scale-in':   'scale-in 0.6s ease forwards',
        'float':      'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'marquee':    'marquee 22s linear infinite',
        'spin-slow':  'spin-slow 12s linear infinite',
      }
    }
  },
  plugins: []
}

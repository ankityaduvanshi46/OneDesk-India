export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        saffron: { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', DEFAULT: '#FF6B35', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12' },
        india: { green: '#138808', white: '#ffffff', saffron: '#FF9933', blue: '#000080', navy: '#0F1B5E' },
        brand: { primary: '#FF6B35', secondary: '#1B4FD8', accent: '#138808', muted: '#6B7280' },
        gold: { 50: '#fffdf5', 100: '#fef9e7', 200: '#fcf0c3', 300: '#f9e396', 400: '#f5d15a', 500: '#D4AF37', 600: '#B8860B', 700: '#996515', 800: '#7B4A12', 900: '#5E340E' },
        royal: { 950: '#030712', 900: '#070B19', 850: '#0B132B', 800: '#101B3B', 750: '#161F38', 700: '#1C2541', 600: '#2A3663' }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-soft': 'bounceSoft 1.5s infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'glow': 'glow 3s ease-in-out infinite alternate'
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        bounceSoft: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        glow: { '0%': { boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)' }, '100%': { boxShadow: '0 0 30px rgba(255, 107, 53, 0.4)' } }
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(15, 27, 94, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 20px 35px -5px rgba(15, 27, 94, 0.12), 0 10px 15px -5px rgba(255, 107, 53, 0.08)',
        'luxury': '0 10px 40px -10px rgba(11, 19, 43, 0.1), 0 0 0 1px rgba(212, 175, 55, 0.15)',
        'luxury-dark': '0 10px 40px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.2)',
        'glow-gold': '0 0 25px rgba(212, 175, 55, 0.35)',
        'glow-saffron': '0 0 25px rgba(255, 107, 53, 0.35)'
      }
    }
  },
  plugins: []
}

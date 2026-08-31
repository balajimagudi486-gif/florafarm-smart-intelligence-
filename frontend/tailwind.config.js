/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        flora: {
          green: '#39FF88',
          emerald: '#10B981',
          'deep-emerald': '#047857',
          forest: '#064E3B',
          dark: '#022C22',
          light: '#ECFDF5',
          soft: '#F0FDF4',
          bg: '#FAFDF8',
          text: '#1a2e1a',
        },
        agri: {
          soil: '#5C4033',
          'soil-light': '#8B6F47',
          wheat: '#D4A843',
          'wheat-light': '#F5DEB3',
          harvest: '#C4722F',
          sky: '#87CEEB',
          'sky-deep': '#4A90D9',
          leaf: '#2D5016',
          'leaf-light': '#4A7C2E',
          cream: '#FFF8E7',
          earth: '#3E2723',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      animation: {
        'scan-line': 'scanLine 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-delay': 'float 3s ease-in-out 1s infinite',
        'float-delay2': 'float 3s ease-in-out 2s infinite',
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'progress': 'progress 1s ease-out forwards',
        'spin-slow': 'spin 4s linear infinite',
        'rotate3d': 'rotate3d 12s linear infinite',
        'tilt-in': 'tiltIn 0.6s ease-out forwards',
        'grain-wave': 'grainWave 3s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        scanLine: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: '0.8' },
          '50%': { transform: 'translateY(100%)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(57,255,136,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(57,255,136,0)' },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        progress: {
          from: { width: '0%' },
          to: { width: 'var(--progress-width)' },
        },
        rotate3d: {
          '0%': { transform: 'rotateY(0deg) rotateX(15deg)' },
          '100%': { transform: 'rotateY(360deg) rotateX(15deg)' },
        },
        tiltIn: {
          from: { transform: 'perspective(800px) rotateY(-15deg) scale(0.9)', opacity: '0' },
          to: { transform: 'perspective(800px) rotateY(0) scale(1)', opacity: '1' },
        },
        grainWave: {
          '0%, 100%': { transform: 'rotate(-2deg) translateY(0)' },
          '50%': { transform: 'rotate(2deg) translateY(-5px)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
        glowPulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 8px rgba(57,255,136,0.3))' },
          '50%': { filter: 'drop-shadow(0 0 20px rgba(57,255,136,0.6))' },
        },
      },
      boxShadow: {
        'flora': '0 4px 24px rgba(16,185,129,0.12)',
        'flora-lg': '0 8px 40px rgba(16,185,129,0.18)',
        'flora-green': '0 4px 20px rgba(57,255,136,0.25)',
        'card': '0 2px 16px rgba(6,78,59,0.06)',
        'agri': '0 8px 32px rgba(92,64,51,0.12)',
        'agri-lg': '0 12px 48px rgba(92,64,51,0.18)',
        '3d': '0 20px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(145deg, #FAFDF8 0%, #ECFDF5 35%, #f0f7e6 65%, #FFF8E7 100%)',
        'card-gradient': 'linear-gradient(135deg, #ffffff 0%, #F0FDF4 100%)',
        'green-shimmer': 'linear-gradient(90deg, transparent, rgba(57,255,136,0.15), transparent)',
        'earth-gradient': 'linear-gradient(135deg, #064E3B 0%, #2D5016 50%, #5C4033 100%)',
        'field-gradient': 'linear-gradient(180deg, #87CEEB 0%, #b8e6b8 40%, #4A7C2E 60%, #2D5016 100%)',
      },
    },
  },
  plugins: [],
}

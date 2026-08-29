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
          green: '#39FF88',       // Electric Green — primary accent
          emerald: '#10B981',     // Emerald
          'deep-emerald': '#047857',
          forest: '#064E3B',
          dark: '#022C22',
          light: '#ECFDF5',
          soft: '#F0FDF4',
          bg: '#F8FFFB',
          text: '#12372A',
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
      },
      boxShadow: {
        'flora': '0 4px 24px rgba(16,185,129,0.12)',
        'flora-lg': '0 8px 40px rgba(16,185,129,0.18)',
        'flora-green': '0 4px 20px rgba(57,255,136,0.25)',
        'card': '0 2px 16px rgba(6,78,59,0.06)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #F8FFFB 0%, #ECFDF5 50%, #F0FDF4 100%)',
        'card-gradient': 'linear-gradient(135deg, #ffffff 0%, #F0FDF4 100%)',
        'green-shimmer': 'linear-gradient(90deg, transparent, rgba(57,255,136,0.15), transparent)',
      },
    },
  },
  plugins: [],
}

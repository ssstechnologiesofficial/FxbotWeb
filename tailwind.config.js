/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        // FXBOT Brand Colors
        fxbot: {
          gold: {
            DEFAULT: '#C9A13B',
            light: '#FFD700',
            dark: '#B8941F',
          },
          blue: {
            DEFAULT: '#185a8e',
            light: '#2293D1', 
            dark: '#0F4266',
          }
        },
        // Extended color palette
        primary: {
          50: '#E6F1F9',
          100: '#CCE3F3',
          200: '#99C7E7',
          300: '#66ABDB',
          400: '#338FCF',
          500: '#185a8e',
          600: '#144872',
          700: '#103656',
          800: '#0C243A',
          900: '#08121D',
        },
        accent: {
          50: '#FDF7E6',
          100: '#FBEFCC',
          200: '#F7DF99',
          300: '#F3CF66',
          400: '#EFBF33',
          500: '#C9A13B',
          600: '#A1812F',
          700: '#796123',
          800: '#504017',
          900: '#28200C',
        },
        gray: {
          50: '#F8FCFF',
          100: '#E6F1F9',
          200: '#D1E7F0',
          300: '#9CA3AF',
          400: '#6B7280',
          500: '#4B5563',
          600: '#374151',
          700: '#1F2937',
          800: '#111827',
          900: '#0F172A',
        }
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #C9A13B, #FFD700)',
        'gradient-blue': 'linear-gradient(135deg, #185a8e, #2293D1)',
        'gradient-bg': 'linear-gradient(135deg, #FFFFFF 0%, #E6F1F9 100%)',
      },
      boxShadow: {
        'fxbot-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'fxbot-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'fxbot-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'fxbot-gold': '0 4px 12px rgba(201, 161, 59, 0.15)',
        'fxbot-blue': '0 4px 12px rgba(24, 90, 142, 0.15)',
        'fxbot-gold-lg': '0 8px 25px rgba(201, 161, 59, 0.25)',
        'fxbot-blue-lg': '0 8px 25px rgba(24, 90, 142, 0.25)',
      },
      borderRadius: {
        'fxbot': '12px',
        'fxbot-sm': '8px',
        'fxbot-lg': '16px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
      },
    },
  },
  plugins: [],
}
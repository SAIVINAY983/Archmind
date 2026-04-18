/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8', // Neon cyan
          500: '#0ea5e9',
          600: '#0284c7',
        },
        accent: {
          400: '#a78bfa', // Violet highlight
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        dark: {
          900: '#080c14', // Deeper base slate
          800: '#111827',
          700: '#1f2937',
        }
      },
      animation: {
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(56, 189, 248, 0.4)' },
          '100%': { boxShadow: '0 0 20px rgba(56, 189, 248, 0.8), 0 0 40px rgba(139, 92, 246, 0.4)' }
        }
      }
    },
  },
  plugins: [],
}

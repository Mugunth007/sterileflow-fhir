/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        neutral: {
          950: "#050505",
          900: "#0D0D11",
          850: "#13131A",
          800: "#1E1E26",
          700: "#2E2E38",
        },
        brand: {
          cyan: "#00F0FF",
          emerald: "#10B981",
          violet: "#8B5CF6",
          amber: "#F59E0B",
        }
      },
      boxShadow: {
        'aceternity': '0 0 0 1px rgba(255, 255, 255, 0.08), 0 8px 24px -4px rgba(0, 0, 0, 0.6)',
        'aceternity-glow': '0 0 35px -5px rgba(0, 240, 255, 0.15)',
        'aceternity-emerald': '0 0 35px -5px rgba(16, 185, 129, 0.2)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'spotlight': 'spotlight 2s ease .75s 1 forwards',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        spotlight: {
          '0%': { opacity: 0, transform: 'translate(-72%, -62%) scale(0.5)' },
          '100%': { opacity: 1, transform: 'translate(-50%,-40%) scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        shimmer: {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '-200% 0' }
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        enode: {
          bg: '#FAFBF9',
          surface: '#FFFFFF',
          muted: '#F4F6F2',
          subtle: '#ECEFEA',
          border: '#E2E6DF',
          charcoal: '#11181C',
          charcoalHover: '#1B242A',
          textMuted: '#5A636A',
          textSubtle: '#88929A',
          lime: '#B6F05C',
          limeHover: '#A4E841',
          limeSubtle: '#F1FCDA',
          limeDark: '#2D5E12',
          emerald: '#15803D',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'pill': '9999px',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        'enode-sm': '0 1px 2px rgba(17, 24, 28, 0.04)',
        'enode-card': '0 2px 8px -2px rgba(17, 24, 28, 0.05), 0 1px 2px rgba(17, 24, 28, 0.03)',
        'enode-float': '0 12px 32px -4px rgba(17, 24, 28, 0.08), 0 4px 12px -2px rgba(17, 24, 28, 0.04)',
      }
    },
  },
  plugins: [],
}

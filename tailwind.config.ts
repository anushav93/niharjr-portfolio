import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/content/**/*.{ts,tsx,md,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Global sans stack — required:
        sans: [
          'Inter var',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      // keep/merge any existing tokens (colors, radii, shadows) you already have
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'bounce-slow': 'bounce 1.2s infinite',
        marquee: 'marquee 15s linear infinite',
        marquee2: 'marquee2 15s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
          '100.1%': { transform: 'translateX(100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
          '100.1%': { transform: 'translateX(0%)' },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
    },
  },
  plugins: [
    function({ addComponents }: { addComponents: (components: Record<string, any>) => void }) {
      addComponents({
        '.bg-gradient': {
          'background-image': 'linear-gradient(to bottom right, rgb(239 246 255), rgb(250 245 255), rgb(253 242 248))',
          'border-bottom-width': '1px',
          'border-color': 'rgb(163 163 163)',
        },
        '.dark .bg-gradient': {
          'background-image': 'linear-gradient(to bottom right, rgb(23 37 84 / 0.2), rgb(59 7 100 / 0.2), rgb(131 24 67 / 0.2))',
          'border-color': 'rgb(82 82 82)',
        },
      })
    }
  ],
};

export default config;

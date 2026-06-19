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
        serif: ['var(--font-playfair)', 'serif'],
        // Global sans stack — required:
        sans: [
          'var(--font-inter)',
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
      // ========================================================================
      // SEMANTIC COLOR SYSTEM
      // All colors reference CSS variables from theme.css for easy customization
      // ========================================================================
      colors: {
        // Primary palette - main brand color
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          950: 'var(--color-primary-950)',
          DEFAULT: 'var(--color-primary-500)',
        },
        // Secondary palette - accent/complementary color
        secondary: {
          50: 'var(--color-secondary-50)',
          100: 'var(--color-secondary-100)',
          200: 'var(--color-secondary-200)',
          300: 'var(--color-secondary-300)',
          400: 'var(--color-secondary-400)',
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
          800: 'var(--color-secondary-800)',
          900: 'var(--color-secondary-900)',
          950: 'var(--color-secondary-950)',
          DEFAULT: 'var(--color-secondary-500)',
        },
        // Accent palette - highlights and special elements
        accent: {
          50: 'var(--color-accent-50)',
          100: 'var(--color-accent-100)',
          200: 'var(--color-accent-200)',
          300: 'var(--color-accent-300)',
          400: 'var(--color-accent-400)',
          500: 'var(--color-accent-500)',
          600: 'var(--color-accent-600)',
          700: 'var(--color-accent-700)',
          800: 'var(--color-accent-800)',
          900: 'var(--color-accent-900)',
          950: 'var(--color-accent-950)',
          DEFAULT: 'var(--color-accent-500)',
        },
        // Neutral palette - warm sepia tones (mapped to primary)
        neutral: {
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
          950: 'var(--color-neutral-950)',
          DEFAULT: 'var(--color-neutral-500)',
        },
        // Success palette - positive states
        success: {
          50: 'var(--color-success-50)',
          100: 'var(--color-success-100)',
          200: 'var(--color-success-200)',
          300: 'var(--color-success-300)',
          400: 'var(--color-success-400)',
          500: 'var(--color-success-500)',
          600: 'var(--color-success-600)',
          700: 'var(--color-success-700)',
          800: 'var(--color-success-800)',
          900: 'var(--color-success-900)',
          950: 'var(--color-success-950)',
          DEFAULT: 'var(--color-success-500)',
          light: 'var(--color-success-100)',
          dark: 'var(--color-success-700)',
        },
        // Error palette - negative states
        error: {
          50: 'var(--color-error-50)',
          100: 'var(--color-error-100)',
          200: 'var(--color-error-200)',
          300: 'var(--color-error-300)',
          400: 'var(--color-error-400)',
          500: 'var(--color-error-500)',
          600: 'var(--color-error-600)',
          700: 'var(--color-error-700)',
          800: 'var(--color-error-800)',
          900: 'var(--color-error-900)',
          950: 'var(--color-error-950)',
          DEFAULT: 'var(--color-error-500)',
          light: 'var(--color-error-100)',
          dark: 'var(--color-error-700)',
        },
        // Warning palette - caution states
        warning: {
          50: 'var(--color-warning-50)',
          100: 'var(--color-warning-100)',
          200: 'var(--color-warning-200)',
          300: 'var(--color-warning-300)',
          400: 'var(--color-warning-400)',
          500: 'var(--color-warning-500)',
          600: 'var(--color-warning-600)',
          700: 'var(--color-warning-700)',
          800: 'var(--color-warning-800)',
          900: 'var(--color-warning-900)',
          950: 'var(--color-warning-950)',
          DEFAULT: 'var(--color-warning-500)',
          light: 'var(--color-warning-100)',
          dark: 'var(--color-warning-700)',
        },
        // Info palette - informational states
        info: {
          50: 'var(--color-info-50)',
          100: 'var(--color-info-100)',
          200: 'var(--color-info-200)',
          300: 'var(--color-info-300)',
          400: 'var(--color-info-400)',
          500: 'var(--color-info-500)',
          600: 'var(--color-info-600)',
          700: 'var(--color-info-700)',
          800: 'var(--color-info-800)',
          900: 'var(--color-info-900)',
          950: 'var(--color-info-950)',
          DEFAULT: 'var(--color-info-500)',
          light: 'var(--color-info-100)',
          dark: 'var(--color-info-700)',
        },
        // Route-specific colors for navigation
        route: {
          home: 'var(--color-route-home)',
          gallery: 'var(--color-route-gallery)',
          about: 'var(--color-route-about)',
          contact: 'var(--color-route-contact)',
        },
        page: 'var(--color-bg-page)',
        'surface-muted': 'var(--color-surface-muted)',
        body: 'var(--color-text-body)',
        brand: {
          dark: 'var(--color-brand-dark)',
          'dark-hover': 'var(--color-brand-dark-hover)',
          light: 'var(--color-brand-light)',
        },
      },
      // Semantic text colors (named to avoid conflicting with primary-* scale)
      textColor: {
        foreground: 'var(--color-text-primary)',
        subtext: 'var(--color-text-secondary)',
        subtle: 'var(--color-text-muted)',
        inverted: 'var(--color-text-inverted)',
        body: 'var(--color-text-body)',
      },
      // Semantic background colors (named to avoid conflicting with primary-* scale)
      backgroundColor: {
        surface: 'var(--color-bg-primary)',
        'surface-secondary': 'var(--color-bg-secondary)',
        'surface-tertiary': 'var(--color-bg-tertiary)',
        inverted: 'var(--color-bg-inverted)',
        page: 'var(--color-bg-page)',
        'surface-muted': 'var(--color-surface-muted)',
      },
      // Semantic border colors
      borderColor: {
        default: 'var(--color-border-default)',
        strong: 'var(--color-border-strong)',
        focus: 'var(--color-border-focus)',
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

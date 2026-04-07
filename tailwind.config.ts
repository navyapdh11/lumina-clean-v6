import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        emerald: {
          primary: 'rgb(var(--emerald-primary) / <alpha-value>)',
          secondary: 'rgb(var(--emerald-secondary) / <alpha-value>)',
          background: 'rgb(var(--emerald-background) / <alpha-value>)',
          surface: 'rgb(var(--emerald-surface) / <alpha-value>)',
          surfaceLow: 'rgb(var(--emerald-surface-low) / <alpha-value>)',
          surfaceHigh: 'rgb(var(--emerald-surface-high) / <alpha-value>)',
          text: 'rgb(var(--emerald-text) / <alpha-value>)',
          textMuted: 'rgb(var(--emerald-text-muted) / <alpha-value>)',
          outline: 'rgb(var(--emerald-outline) / <alpha-value>)',
        },
      },
      fontFamily: {
        headline: ['var(--font-manrope)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'modal-pop': {
          from: { opacity: '0', transform: 'scale(0.96) translateY(6px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'modal-pop': 'modal-pop 0.24s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
export default config;

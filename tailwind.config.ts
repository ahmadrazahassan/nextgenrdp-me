// tailwind.config.ts
import type { Config } from 'tailwindcss';
const defaultTheme = require('tailwindcss/defaultTheme');

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-work-sans)', ...defaultTheme.fontFamily.sans],
        heading: ['var(--font-space-grotesk)', ...defaultTheme.fontFamily.sans],
      },
      colors: {
         'brand-orange': { DEFAULT: '#f97316', hover: '#ea580c', light: '#fff7ed', dark: '#9a3412' },
         'brand-sky': { DEFAULT: '#0ea5e9', hover: '#0284c7', light: '#f0f9ff', dark: '#0369a1' },
         'brand-green': { DEFAULT: '#22c55e', hover: '#16a34a', light: '#f0fdf4', dark: '#15803d' },
      },
      animation: {
        'subtle-pulse': 'subtle-pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'subtle-pulse': { '0%, 100%': { opacity: '0.8' , transform: 'scale(1)'}, '50%': { opacity: '1', transform: 'scale(1.04)' }, },
        'sparkle': { '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' }, '50%': { opacity: '1', transform: 'scale(1)' }, },
        'float': { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' }, }
      },
    },
  },
  plugins: [
     require('@tailwindcss/forms'), // Added for better default form styles
  ],
};
export default config;
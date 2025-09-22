import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#f8e2a4', // Light gold
          DEFAULT: '#d4af37', // Default gold
          dark: '#b89726' // Darker gold for accents
        },
        background: {
          dark: '#1a1a1a', // Dark background
        }
      },
      animation: {
        fade: 'fade 1s ease-in-out',
        bounce: 'bounce 1s infinite',
      },
      keyframes: {
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15%)' },
        },
      },
    },
  },
  variants: {},
  plugins: [],
}

export default config

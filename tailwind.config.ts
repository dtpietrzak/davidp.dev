import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'selector',
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/apps/**/*.{js,ts,jsx,tsx,mdx}',
    './src/os/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'pattern-light': 'url(\'/background-light.svg\')',
        'pattern-dark': 'url(\'/background-dark.svg\')',
      },
      animation: {
        'pulse': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      grayscale: {
        20: '20%',
      },
      dropShadow: {
        glow: [
          '0 0px 20px rgba(255,255, 255, 0.5)',
          '0 0px 65px rgba(255, 255,255, 0.2)'
        ]
      }
    },
    fontSize: {
      xxs: '0.5rem',
      xs: '0.7rem',
      sm: '0.8rem',
      md: '1rem',
      lg: '1.3rem',
      xl: '1.75rem',
      '2xl': '2.2rem',
      '3xl': '2.5rem',
      '4xl': '3rem',
      '5xl': '3.5rem',
    },
    zIndex: {
      '1': '1',
      '1000': '1000',
      '2000': '2000',
      '3000': '3000',
      '4000': '4000',
      '5000': '5000',
    },
  },
  plugins: [],
}
export default config
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: 'selector',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'pattern-light': "url('/background-light.svg')",
        'pattern-dark': "url('/background-dark.svg')",
      },
    },
  },
  plugins: [],
}
export default config
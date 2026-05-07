import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'custom-sky': '#8ecae6',
        'custom-teal': '#219ebc',
        'custom-navy': '#023047',
        'custom-amber': '#ffb703',
        'custom-orange': '#fb8500',
      },
    },
  },
  plugins: [],
}

export default config

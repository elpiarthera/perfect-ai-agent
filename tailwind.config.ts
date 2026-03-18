import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#141414',
        accent: '#f59e0b',
        muted: '#9ca3af',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#e5e7eb',
            a: { color: '#f59e0b' },
            h1: { color: '#ffffff' },
            h2: { color: '#ffffff' },
            h3: { color: '#e5e7eb' },
            blockquote: { borderLeftColor: '#f59e0b', color: '#9ca3af' },
            hr: { borderColor: '#1f2937' },
            strong: { color: '#ffffff' },
          },
        },
      },
    },
  },
  plugins: [typography],
}

export default config

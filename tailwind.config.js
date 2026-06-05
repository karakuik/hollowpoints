/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['InterVariable', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        hp: {
          // All colors reference CSS variables so themes swap at runtime.
          // Values are RGB channel triplets (e.g. "9 9 15") so Tailwind's
          // opacity modifier syntax (bg-hp-accent/20) keeps working.
          bg:       'rgb(var(--hp-bg)       / <alpha-value>)',
          surface:  'rgb(var(--hp-surface)  / <alpha-value>)',
          elevated: 'rgb(var(--hp-elevated) / <alpha-value>)',
          border:   'rgb(var(--hp-border)   / <alpha-value>)',
          text:     'rgb(var(--hp-text)     / <alpha-value>)',
          muted:    'rgb(var(--hp-muted)    / <alpha-value>)',
          accent:   'rgb(var(--hp-accent)   / <alpha-value>)',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            pre: false,
            code: false,
            'pre code': false,
            'code::before': { content: 'none' },
            'code::after':  { content: 'none' },
          },
        },
        invert: {
          css: {
            '--tw-prose-invert-links': 'rgb(var(--hp-accent))',
            '--tw-prose-invert-code': 'rgb(var(--hp-text))',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

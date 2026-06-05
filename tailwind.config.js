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
          bg:       '#09090f', // page background
          surface:  '#12141c', // nav, cards
          elevated: '#1c1f2a', // hover/raised state
          border:   '#252836', // thin borders
          text:     '#e8eaf0', // primary text
          muted:    '#6b7280', // secondary / placeholder text
          accent:   '#ff4500', // orange-red accent
        },
      },
      typography: {
        DEFAULT: {
          css: {
            // Let rehype-pretty-code own all code block styling
            pre: false,
            code: false,
            'pre code': false,
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
          },
        },
        invert: {
          css: {
            '--tw-prose-invert-links': '#ff4500',
            '--tw-prose-invert-code': '#e8eaf0',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Kolory wskazują na zmienne CSS z globals.css.
        // Motyw (data-theme na <html>) zmienia wartości zmiennych,
        // więc wszystkie klasy poker-* (też z /opacity) reagują same.
        'poker-bg': 'rgba(var(--pk-bg-rgb), <alpha-value>)',
        'poker-bg-light': 'rgba(var(--pk-bg-light-rgb), <alpha-value>)',
        'poker-felt-dark': 'var(--pk-felt-dark)',
        'poker-felt': 'var(--pk-felt)',
        'poker-felt-light': 'var(--pk-felt-light)',
        'poker-gold': 'rgba(var(--pk-gold-rgb), <alpha-value>)',
        'poker-gold-light': 'rgba(var(--pk-gold-light-rgb), <alpha-value>)',
        'poker-yellow': 'rgba(var(--pk-yellow-rgb), <alpha-value>)',
        'poker-coral': 'rgba(var(--pk-coral-rgb), <alpha-value>)',
        'poker-red-deep': 'var(--pk-felt-light)',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'table': 'inset 0 0 40px rgba(0,0,0,0.5), 0 0 12px rgba(var(--pk-gold-rgb),0.15)',
        'card': '0 2px 6px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
};

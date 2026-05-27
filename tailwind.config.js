/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Casino Classic palette
        'poker-bg': '#1F0808',          // very dark brown-red (page bg)
        'poker-bg-light': '#2A0E0E',    // slightly lighter (modals, sections)
        'poker-felt-dark': '#3A0808',   // table center darkest
        'poker-felt': '#5A0F0F',        // table center mid
        'poker-felt-light': '#8B0000',  // table center brightest
        'poker-gold': '#D4AF37',        // primary accent (was: poker-yellow)
        'poker-gold-light': '#E8C76B',  // hover state
        'poker-yellow': '#FFFDB7',      // kept for highlights/text (light cream)
        'poker-coral': '#FF6B6B',       // fold/warning button
        'poker-red-deep': '#8B0000',    // deep red accents
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'table': 'inset 0 0 40px rgba(0,0,0,0.5), 0 0 12px rgba(212,175,55,0.15)',
        'card': '0 2px 6px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
};

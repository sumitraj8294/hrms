/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        primary:   { DEFAULT: '#00b894', light: '#00cec9', dark: '#00a381' },
        accent:    { purple: '#6c5ce7', pink: '#e84393', orange: '#e17055', yellow: '#fdcb6e', blue: '#0984e3', teal: '#00cec9' },
        sidebar:   { DEFAULT: '#0f1117', surface: '#1a1d27', border: '#2a2d3e' },
        surface:   { DEFAULT: '#ffffff', secondary: '#f8fafc', tertiary: '#f1f5f9' },
        text:      { primary: '#0f172a', secondary: '#475569', muted: '#94a3b8' },
        border:    { DEFAULT: '#e2e8f0', dark: '#cbd5e1' },
        success:   '#00b894',
        warning:   '#fdcb6e',
        danger:    '#d63031',
        info:      '#0984e3',
      },
      borderRadius: {
        DEFAULT: '12px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.06)',
        glow: '0 0 20px rgba(0,184,148,0.3)',
      },
    },
  },
  plugins: [],
}

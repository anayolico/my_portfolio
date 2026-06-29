module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        'brand-navy': 'var(--color-brand-navy)',
        'accent-teal': 'var(--color-accent-teal)',
        'accent-purple': 'var(--color-accent-purple)',
        'bg-body': 'var(--bg-body)',
        'bg-surface': 'var(--bg-surface)',
        'text-main': 'var(--text-main)',
        'text-muted': 'var(--text-muted)',

        // Legacy neon mappings to preserve backward compatibility and allow gradual transition
        'bg-dark': 'var(--bg-body)',
        'panel': 'var(--bg-surface)',
        'neon-cyan': 'var(--color-accent-teal)',
        'neon-purple': 'var(--color-accent-purple)',
      },
      boxShadow: {
        'neon': '0 6px 20px rgba(23, 162, 184, 0.08), 0 0 12px rgba(106, 90, 205, 0.08)'
      }
    }
  },
  plugins: []
}

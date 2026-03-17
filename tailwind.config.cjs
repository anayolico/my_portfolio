module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0b0b0d',
        'panel': '#0f1720',
        'neon-cyan': '#00f0ff',
        'neon-purple': '#c084fc'
      },
      boxShadow: {
        'neon': '0 6px 20px rgba(0,240,255,0.06), 0 0 12px rgba(192,132,252,0.06)'
      }
    }
  },
  plugins: []
}

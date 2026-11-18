import React, { createContext, useContext, useEffect, useState } from 'react'

export const COLOR_THEMES = [
  {
    id: 'teal',
    name: 'Ocean Teal',
    accent: '#17A2B8',
    accentRgb: '23, 162, 184',
    secondary: '#6A5ACD',
    secondaryRgb: '106, 90, 205',
    bgBody: '#0c0f17',
    bgSurface: '#151923',
    cardBg: 'rgba(21, 25, 35, 0.72)',
    cardBorder: 'rgba(23, 162, 184, 0.16)',
  },
  {
    id: 'emerald',
    name: 'Royal Emerald',
    accent: '#10B981',
    accentRgb: '16, 185, 129',
    secondary: '#0EA5E9',
    secondaryRgb: '14, 165, 233',
    bgBody: '#09110f',
    bgSurface: '#101d19',
    cardBg: 'rgba(16, 29, 25, 0.74)',
    cardBorder: 'rgba(16, 185, 129, 0.18)',
  },
  {
    id: 'indigo',
    name: 'Electric Indigo',
    accent: '#6366F1',
    accentRgb: '99, 102, 241',
    secondary: '#A855F7',
    secondaryRgb: '168, 85, 247',
    bgBody: '#0b0c16',
    bgSurface: '#131526',
    cardBg: 'rgba(19, 21, 38, 0.74)',
    cardBorder: 'rgba(99, 102, 241, 0.18)',
  },
  {
    id: 'amber',
    name: 'Amber Gold',
    accent: '#F59E0B',
    accentRgb: '245, 158, 11',
    secondary: '#EA580C',
    secondaryRgb: '234, 88, 12',
    bgBody: '#120f0a',
    bgSurface: '#1d1710',
    cardBg: 'rgba(29, 23, 16, 0.74)',
    cardBorder: 'rgba(245, 158, 11, 0.18)',
  },
  {
    id: 'cobalt',
    name: 'Cobalt Blue',
    accent: '#3B82F6',
    accentRgb: '59, 130, 246',
    secondary: '#06B6D4',
    secondaryRgb: '6, 182, 212',
    bgBody: '#090f18',
    bgSurface: '#111a29',
    cardBg: 'rgba(17, 26, 41, 0.74)',
    cardBorder: 'rgba(59, 130, 246, 0.18)',
  },
  {
    id: 'rose',
    name: 'Crimson Rose',
    accent: '#F43F5E',
    accentRgb: '244, 63, 94',
    secondary: '#FB923C',
    secondaryRgb: '251, 146, 60',
    bgBody: '#130b0e',
    bgSurface: '#1e1217',
    cardBg: 'rgba(30, 18, 23, 0.74)',
    cardBorder: 'rgba(244, 63, 94, 0.18)',
  },
]

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme] = useState('dark')
  const [colorTheme, setColorTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_color_theme')
      if (saved && COLOR_THEMES.some(t => t.id === saved)) {
        return saved
      }
    } catch (e) {}
    return 'teal'
  })

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', 'dark')
    root.classList.add('dark')
    try {
      localStorage.setItem('theme', 'dark')
    } catch (e) {}
  }, [])

  useEffect(() => {
    const palette = COLOR_THEMES.find(t => t.id === colorTheme) || COLOR_THEMES[0]
    const root = document.documentElement
    root.style.setProperty('--color-accent-teal', palette.accent)
    root.style.setProperty('--color-accent-teal-rgb', palette.accentRgb)
    root.style.setProperty('--color-accent-purple', palette.secondary)
    root.style.setProperty('--color-accent-purple-rgb', palette.secondaryRgb)
    root.style.setProperty('--bg-body', palette.bgBody)
    root.style.setProperty('--bg-surface', palette.bgSurface)
    root.style.setProperty('--card-bg', palette.cardBg)
    root.style.setProperty('--card-border', palette.cardBorder)
    try {
      localStorage.setItem('portfolio_color_theme', palette.id)
    } catch (e) {}
  }, [colorTheme])

  const toggleTheme = () => {}

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colorTheme, setColorTheme, colorThemes: COLOR_THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

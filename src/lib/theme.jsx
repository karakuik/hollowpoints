import { createContext, useContext, useEffect, useState } from 'react'

export const THEMES = {
  dusk: {
    label: 'Dusk',
    dot:   '#ff4500',
  },
  'miami-vice': {
    label: 'Miami Vice',
    dot:   '#ff2d78',
  },
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem('hp-theme') || 'dusk'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [])

  function setTheme(next) {
    // Smooth crossfade between themes
    document.documentElement.classList.add('theme-transitioning')
    document.documentElement.setAttribute('data-theme', next)
    setThemeState(next)
    localStorage.setItem('hp-theme', next)
    setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 350)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}

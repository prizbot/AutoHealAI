'use client'
import { useState, useEffect, useCallback } from 'react'

type Theme = 'dark' | 'light'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const saved = (localStorage.getItem('autoheal-theme') as Theme) || 'dark'
    setTheme(saved)
    applyTheme(saved)
  }, [])

  const applyTheme = (t: Theme) => {
    const root = document.documentElement
    if (t === 'light') {
      root.classList.remove('dark')
      root.classList.add('light')
    } else {
      root.classList.remove('light')
      root.classList.add('dark')
    }
  }

  const toggle = useCallback(() => {
    setTheme(prev => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('autoheal-theme', next)
      applyTheme(next)
      return next
    })
  }, [])

  return { theme, toggle, isDark: theme === 'dark' }
}

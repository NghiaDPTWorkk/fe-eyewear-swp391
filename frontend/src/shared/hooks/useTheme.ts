import { useEffect } from 'react'
import { useThemeStore } from '@/store/theme.store'

/**
 * useTheme Hook
 * Manages theme state and applies 'dark' class to document root
 */
export const useTheme = () => {
  const { isDark, toggleTheme, setTheme } = useThemeStore()

  useEffect(() => {
    const root = window.document.documentElement
    const body = window.document.body

    if (isDark) {
      root.classList.add('dark')
      body.classList.add('dark')
    } else {
      root.classList.remove('dark')
      body.classList.remove('dark')
    }
  }, [isDark])

  return { isDark, toggleTheme, setTheme }
}

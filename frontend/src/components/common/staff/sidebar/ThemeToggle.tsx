import { FiMoon, FiSun } from 'react-icons/fi'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  // This is a mock implementation. In a real app, you'd use a theme context or hook
  const toggleTheme = () => {
    setIsDark(!isDark)
    // document.documentElement.classList.toggle('dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors',
        'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      )}
    >
      {isDark ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
      <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
      <div
        className={cn(
          'ml-auto w-9 h-5 rounded-full flex items-center transition-colors p-1',
          isDark ? 'bg-mint-500' : 'bg-gray-200'
        )}
      >
        <div
          className={cn(
            'bg-white w-3.5 h-3.5 rounded-full shadow-sm transform transition-transform',
            isDark ? 'translate-x-4' : 'translate-x-0'
          )}
        />
      </div>
    </button>
  )
}

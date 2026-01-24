import { FiMoon, FiSun } from 'react-icons/fi'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useLayoutStore } from '@/store/layout.store'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const { sidebarCollapsed } = useLayoutStore()

  // This is a mock implementation. In a real app, you'd use a theme context or hook
  const toggleTheme = () => {
    setIsDark(!isDark)
    // document.documentElement.classList.toggle('dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'flex items-center text-sm font-medium rounded-lg transition-all duration-300',
        sidebarCollapsed ? 'justify-center w-10 h-10 mx-auto px-0' : 'gap-3 w-full px-3 py-2',
        'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      )}
      title={sidebarCollapsed ? (isDark ? 'Light Mode' : 'Dark Mode') : undefined}
    >
      <span className="shrink-0 flex items-center justify-center">
        {isDark ? <FiSun className="text-xl shrink-0" /> : <FiMoon className="text-xl shrink-0" />}
      </span>

      {!sidebarCollapsed && (
        <>
          <span className="flex-1 text-left truncate">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          <div
            className={cn(
              'ml-auto w-9 h-5 rounded-full flex items-center transition-colors p-1 shrink-0',
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
        </>
      )}
    </button>
  )
}

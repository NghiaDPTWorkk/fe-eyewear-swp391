import { IoMoon, IoSunny } from 'react-icons/io5'
import { useState } from 'react'
import { useLayoutStore } from '@/store/layout.store'
import { cn } from '@/lib/utils'
import { Button } from '@/components'

interface ThemeToggleProps {
  label?: string
  defaultDark?: boolean
  onChange?: (isDark: boolean) => void
}

export function ThemeToggle({
  label = 'Dark Mode',
  defaultDark = false,
  onChange
}: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(defaultDark)
  const { sidebarCollapsed } = useLayoutStore()

  const handleToggle = () => {
    const newValue = !isDark
    setIsDark(newValue)
    onChange?.(newValue)
  }

  return (
    <Button
      onClick={handleToggle}
      className={cn(
        'w-full flex items-center transition-all duration-300 relative group overflow-hidden',
        sidebarCollapsed
          ? 'justify-center py-2 px-0'
          : 'justify-between px-3 py-2.5 rounded-lg text-neutral-500 hover:bg-neutral-50'
      )}
      title={sidebarCollapsed ? (isDark ? 'Light Mode' : 'Dark Mode') : undefined}
    >
      {sidebarCollapsed && (
        <div className="absolute inset-0 mx-auto w-10 h-10 group-hover:bg-neutral-50 rounded-xl -z-10 top-1/2 -translate-y-1/2 transition-colors" />
      )}
      <div className={cn('flex items-center', sidebarCollapsed ? 'justify-center' : 'gap-3')}>
        <span
          className={cn(
            'text-xl transition-colors',
            isDark ? 'text-neutral-400' : 'text-neutral-400',
            sidebarCollapsed && 'hover:text-primary-500'
          )}
        >
          {isDark ? <IoMoon /> : <IoSunny />}
        </span>
        {!sidebarCollapsed && <span className="text-sm font-medium">{label}</span>}
      </div>

      {!sidebarCollapsed && (
        <div
          className={cn(
            'w-10 h-5 rounded-full transition-colors shrink-0',
            isDark ? 'bg-primary-500' : 'bg-neutral-200'
          )}
        >
          <div
            className={cn(
              'w-4 h-4 bg-white rounded-full transition-transform mt-0.5',
              isDark ? 'ml-5' : 'ml-0.5'
            )}
          />
        </div>
      )}
    </Button>
  )
}

import { IoMoon, IoSunny } from 'react-icons/io5'
import { useState } from 'react'

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

  const handleToggle = () => {
    const newValue = !isDark
    setIsDark(newValue)
    onChange?.(newValue)
  }

  return (
    <button
      onClick={handleToggle}
      className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
    >
      <div className="flex items-center gap-3">
        {isDark ? (
          <IoMoon className="text-lg text-gray-500" />
        ) : (
          <IoSunny className="text-lg text-gray-500" />
        )}
        <span className="text-sm">{label}</span>
      </div>

      <div
        className={`w-10 h-5 rounded-full transition-colors ${isDark ? 'bg-mint-500' : 'bg-gray-300'}`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full transition-transform mt-0.5 ${
            isDark ? 'ml-5' : 'ml-0.5'
          }`}
        />
      </div>
    </button>
  )
}

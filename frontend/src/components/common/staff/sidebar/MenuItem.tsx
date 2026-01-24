import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { FiChevronDown } from 'react-icons/fi'

interface MenuItemProps {
  icon: ReactNode
  label: string
  active?: boolean
  hasDropdown?: boolean
  children?: ReactNode
  onClick?: () => void
  menuOpen?: boolean // For controlling dropdown state if needed, though usually handled internally or via context
}

export function MenuItem({ icon, label, active, hasDropdown, children, onClick }: MenuItemProps) {
  // Simplified for now, in a real app would handle open/close state for dropdown
  return (
    <div className="mb-1">
      <button
        onClick={onClick}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
          active ? 'bg-mint-50 text-mint-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        )}
      >
        <span className={cn('text-xl', active ? 'text-mint-500' : 'text-gray-400')}>{icon}</span>
        <span className="flex-1 text-left">{label}</span>
        {hasDropdown && (
          <FiChevronDown
            className={cn('text-gray-400 transition-transform', active && 'rotate-180')}
          />
        )}
      </button>
      {children && <div className="ml-9 mt-1 space-y-1">{children}</div>}
    </div>
  )
}

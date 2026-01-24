import { useState, type ReactNode, Children, isValidElement } from 'react'
import { cn } from '@/lib/utils'
import { FiChevronDown } from 'react-icons/fi'
import { useLayoutStore } from '@/store/layout.store'

interface MenuItemProps {
  icon: ReactNode
  label: string
  active?: boolean
  hasDropdown?: boolean
  children?: ReactNode
  onClick?: () => void
  menuOpen?: boolean
  isOpen?: boolean
}

export function MenuItem({
  icon,
  label,
  active,
  hasDropdown,
  children,
  onClick,
  isOpen: defaultIsOpen = false
}: MenuItemProps) {
  const { sidebarCollapsed } = useLayoutStore()
  const hasActiveChild = Children.toArray(children).some(
    (child) => isValidElement(child) && (child.props as any).active
  )

  const [isOpen, setIsOpen] = useState(defaultIsOpen || hasActiveChild)

  const handleClick = () => {
    if (hasDropdown) {
      setIsOpen(!isOpen)
    }
    onClick?.()
  }

  return (
    <div className="mb-1">
      <button
        onClick={handleClick}
        className={cn(
          'w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300',
          sidebarCollapsed ? 'justify-center gap-0' : 'justify-start gap-3',
          active
            ? 'bg-mint-50 text-mint-700'
            : hasDropdown && isOpen
              ? 'text-mint-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        )}
        title={sidebarCollapsed ? label : undefined}
      >
        <span
          className={cn(
            'text-xl transition-colors',
            active || (hasDropdown && isOpen) ? 'text-mint-500' : 'text-gray-400'
          )}
        >
          {icon}
        </span>
        {!sidebarCollapsed && (
          <>
            <span className="flex-1 text-left truncate transition-opacity duration-300">
              {label}
            </span>
            {hasDropdown && (
              <FiChevronDown
                className={cn(
                  'text-gray-400 transition-transform duration-200 shrink-0',
                  isOpen && 'rotate-180 text-mint-500'
                )}
              />
            )}
          </>
        )}
      </button>

      {hasDropdown && !sidebarCollapsed && (
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out',
            isOpen ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0 mt-0'
          )}
        >
          <div className="ml-9 space-y-1 pb-1">{children}</div>
        </div>
      )}
    </div>
  )
}

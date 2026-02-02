import { useState, type ReactNode, Children, isValidElement } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { FiChevronDown } from 'react-icons/fi'
import { useLayoutStore } from '@/store/layout.store'

interface MenuItemProps {
  icon: ReactNode
  label: string
  to?: string
  active?: boolean
  badge?: string
  badgeVariant?: 'default' | 'primary' | 'danger'
  hasDropdown?: boolean
  children?: ReactNode
  onClick?: () => void
  menuOpen?: boolean
  isOpen?: boolean
}

export function MenuItem({
  icon,
  label,
  to,
  active,
  badge,
  badgeVariant = 'primary',
  hasDropdown,
  children,
  onClick,
  isOpen: defaultIsOpen = false
}: MenuItemProps) {
  const { sidebarCollapsed } = useLayoutStore()
  const hasActiveChild = Children.toArray(children).some(
    (child) => isValidElement(child) && (child.props as { active?: boolean }).active
  )

  const [isOpen, setIsOpen] = useState(defaultIsOpen || hasActiveChild)

  const handleClick = (e: React.MouseEvent) => {
    if (hasDropdown) {
      e.preventDefault()
      setIsOpen(!isOpen)
    }
    onClick?.()
  }

  const commonClasses = cn(
    'w-full flex items-center transition-all duration-300 relative group',
    sidebarCollapsed ? 'justify-center py-2 px-0' : 'justify-start px-3 py-2.5 rounded-lg gap-3',
    !sidebarCollapsed && active
      ? 'bg-primary-50 text-primary-700'
      : !sidebarCollapsed && hasDropdown && isOpen
        ? 'text-neutral-900 bg-neutral-50'
        : !sidebarCollapsed && 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
  )

  const content = (
    <>
      {sidebarCollapsed && active && (
        <div className="absolute inset-0 mx-auto w-10 h-10 bg-primary-50 rounded-xl -z-10 top-1/2 -translate-y-1/2" />
      )}
      <span
        className={cn(
          'text-xl transition-colors relative z-10',
          active || (hasDropdown && isOpen) ? 'text-primary-500' : 'text-neutral-400',
          sidebarCollapsed && 'group-hover:text-primary-500'
        )}
      >
        {icon}
      </span>
      {!sidebarCollapsed && (
        <>
          <span className="flex-1 text-left truncate transition-opacity duration-300 font-medium">
            {label}
          </span>
          {badge && (
            <span
              className={cn(
                'px-2 py-0.5 text-xs rounded-full font-semibold shrink-0 min-w-[28px] text-center',
                badgeVariant === 'primary' && 'bg-primary-100 text-primary-700',
                badgeVariant === 'danger' && 'bg-red-100 text-red-700',
                badgeVariant === 'default' && 'bg-gray-100 text-gray-700'
              )}
            >
              {badge}
            </span>
          )}
          {hasDropdown && (
            <FiChevronDown
              className={cn(
                'text-neutral-400 transition-transform duration-200 shrink-0',
                isOpen && 'rotate-180 text-primary-500'
              )}
            />
          )}
        </>
      )}
    </>
  )

  return (
    <div className="mb-1">
      {hasDropdown || !to ? (
        <button
          onClick={handleClick}
          className={commonClasses}
          title={sidebarCollapsed ? label : undefined}
        >
          {content}
        </button>
      ) : (
        <Link
          to={to}
          onClick={onClick}
          className={commonClasses}
          title={sidebarCollapsed ? label : undefined}
        >
          {content}
        </Link>
      )}

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

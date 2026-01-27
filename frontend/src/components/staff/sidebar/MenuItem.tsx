import { useState, type ReactNode } from 'react'
import { IoChevronDown, IoChevronForward } from 'react-icons/io5'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import { useLayoutStore } from '@/store/layout.store'

const menuItemVariants = cva(
  [
    'w-full flex items-center gap-3',
    'px-4 py-2.5 rounded-lg',
    'transition-all duration-200',
    'text-sm font-normal',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1'
  ],
  {
    variants: {
      active: {
        true: 'bg-primary-200 text-primary-800 font-medium',
        false: 'text-gray-700 hover:bg-primary-100 hover:text-gray-900'
      },
      hasDropdown: {
        true: '',
        false: ''
      }
    },
    compoundVariants: [
      {
        active: true,
        hasDropdown: true,
        className: 'bg-transparent text-gray-700 font-normal hover:bg-primary-50'
      }
    ],
    defaultVariants: {
      active: false,
      hasDropdown: false
    }
  }
)

const menuItemIconVariants = cva('text-lg transition-colors', {
  variants: {
    active: {
      true: 'text-primary-600',
      false: 'text-gray-500'
    }
  },
  defaultVariants: {
    active: false
  }
})

export interface MenuItemProps {
  icon?: ReactNode
  label: string
  active?: boolean
  badge?: string
  badgeVariant?: 'default' | 'primary' | 'danger'
  hasDropdown?: boolean
  defaultOpen?: boolean
  children?: ReactNode
  onClick?: () => void
  className?: string
}

export function MenuItem({
  icon,
  label,
  active = false,
  badge,
  badgeVariant = 'default',
  hasDropdown = false,
  defaultOpen,
  children,
  onClick,
  className
}: MenuItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? (active && hasDropdown))

  const handleClick = () => {
    if (hasDropdown) {
      setIsOpen(!isOpen)
    }
    onClick?.()
  }

  const { sidebarCollapsed } = useLayoutStore()

  const badgeStyles = {
    default: 'bg-gray-100 text-gray-600',
    primary: 'bg-primary-100 text-primary-700',
    danger: 'bg-danger-100 text-danger-700'
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(menuItemVariants({ active: active && !hasDropdown, hasDropdown }), className)}
        aria-expanded={hasDropdown ? isOpen : undefined}
        title={sidebarCollapsed ? label : undefined}
      >
        {icon && (
          <span className={menuItemIconVariants({ active: active && !hasDropdown })}>{icon}</span>
        )}
        {!sidebarCollapsed && (
          <>
            <span className="flex-1 text-left">{label}</span>
            {badge && (
              <span
                className={cn('px-2 py-0.5 text-xs rounded font-medium', badgeStyles[badgeVariant])}
              >
                {badge}
              </span>
            )}
            {hasDropdown &&
              (isOpen ? (
                <IoChevronDown className="text-gray-400 transition-transform" />
              ) : (
                <IoChevronForward className="text-gray-400 transition-transform" />
              ))}
          </>
        )}
      </button>

      {hasDropdown && !sidebarCollapsed && isOpen && children && (
        <div className="ml-8 mt-1 space-y-0.5" role="group">
          {children}
        </div>
      )}
    </div>
  )
}

export { menuItemVariants }

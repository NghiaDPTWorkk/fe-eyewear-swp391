import { useState, type ReactNode } from 'react'
import { IoChevronDown, IoChevronForward } from 'react-icons/io5'

export interface MenuItemProps {
  icon?: ReactNode
  label: string
  active?: boolean
  badge?: string
  hasDropdown?: boolean
  children?: ReactNode
  onClick?: () => void
}

export function MenuItem({
  icon,
  label,
  active,
  badge,
  hasDropdown,
  children,
  onClick
}: MenuItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    if (hasDropdown) {
      setIsOpen(!isOpen)
    }
    onClick?.()
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
          active ? 'bg-mint-50 text-mint-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        {icon && (
          <span className={`text-lg ${active ? 'text-mint-600' : 'text-gray-500'}`}>{icon}</span>
        )}
        <span className="flex-1 text-left text-sm">{label}</span>
        {badge && (
          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">{badge}</span>
        )}
        {hasDropdown &&
          (isOpen ? (
            <IoChevronDown className="text-gray-400" />
          ) : (
            <IoChevronForward className="text-gray-400" />
          ))}
      </button>

      {hasDropdown && isOpen && children && <div className="ml-8 mt-1 space-y-0.5">{children}</div>}
    </div>
  )
}

export function SubMenuItem({
  label,
  active,
  onClick
}: {
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
        active ? 'bg-mint-50 text-mint-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  )
}

import type { ReactNode } from 'react'
import { IoChevronDown, IoChevronForward } from 'react-icons/io5'
import { menuItemIconVariants } from './variants'
import { Badge } from './Badge'

interface MenuItemContentProps {
  icon?: ReactNode
  label: string
  active: boolean
  badge?: string
  badgeVariant?: 'default' | 'primary' | 'danger'
  hasDropdown: boolean
  isOpen?: boolean
}

export function MenuItemContent({
  icon,
  label,
  active,
  badge,
  badgeVariant = 'default',
  hasDropdown,
  isOpen
}: MenuItemContentProps) {
  return (
    <>
      {icon && (
        <span className={menuItemIconVariants({ active: active && !hasDropdown })}>{icon}</span>
      )}
      <span className="flex-1 text-left">{label}</span>
      {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
      {hasDropdown &&
        (isOpen ? (
          <IoChevronDown className="text-gray-400 transition-transform" />
        ) : (
          <IoChevronForward className="text-gray-400 transition-transform" />
        ))}
    </>
  )
}

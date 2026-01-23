import type { ReactNode } from 'react'
import { LAYOUT } from '@/shared/constants/layout'
import { StoreDropdown, MenuSection, MenuItem, SubMenuItem } from '../../common/staff-core/sidebar'

interface SidebarStaffProps {
  logo?: ReactNode
  storeName?: string
  storeIcon?: ReactNode
  children: ReactNode
  userWidget?: ReactNode
  width?: number
  headerHeight?: number
}

export function SidebarStaff({
  logo,
  storeName,
  storeIcon,
  children,
  userWidget,
  width = LAYOUT.SIDEBAR.WIDTH,
  headerHeight = LAYOUT.HEADER.HEIGHT
}: SidebarStaffProps) {
  return (
    <aside
      className="fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col"
      style={{ width: `${width}px` }}
    >
      {logo && (
        <div
          className="flex items-center px-6 border-b border-gray-200"
          style={{ height: `${headerHeight}px` }}
        >
          {logo}
        </div>
      )}

      {storeName && <StoreDropdown storeName={storeName} icon={storeIcon} />}

      <nav className="flex-1 overflow-y-auto py-4">{children}</nav>

      {userWidget && <div className="p-4 border-t border-gray-200 bg-gray-50">{userWidget}</div>}
    </aside>
  )
}

SidebarStaff.MenuSection = MenuSection
SidebarStaff.MenuItem = MenuItem
SidebarStaff.SubMenuItem = SubMenuItem

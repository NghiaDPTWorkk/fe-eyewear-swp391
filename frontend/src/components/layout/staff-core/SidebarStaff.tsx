import type { ReactNode } from 'react'
import { StoreDropdown } from './sidebar/StoreDropdown'
import { MenuSection } from './sidebar/MenuSection'
import { MenuItem, SubMenuItem } from './sidebar/MenuItem'

interface SidebarStaffProps {
  logo?: ReactNode
  storeName?: string
  storeIcon?: ReactNode
  children: ReactNode
  userWidget?: ReactNode
}

export function SidebarStaff({
  logo,
  storeName,
  storeIcon,
  children,
  userWidget
}: SidebarStaffProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-gray-200 flex flex-col">
      {logo && <div className="h-16 flex items-center px-6 border-b border-gray-200">{logo}</div>}

      {storeName && <StoreDropdown storeName={storeName} icon={storeIcon} />}

      <nav className="flex-1 overflow-y-auto py-4">{children}</nav>

      {userWidget && <div className="p-4 border-t border-gray-200 bg-gray-50">{userWidget}</div>}
    </aside>
  )
}

SidebarStaff.MenuSection = MenuSection
SidebarStaff.MenuItem = MenuItem
SidebarStaff.SubMenuItem = SubMenuItem

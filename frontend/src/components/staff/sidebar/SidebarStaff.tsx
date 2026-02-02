import type { ReactNode } from 'react'
import { LAYOUT } from '@/shared/constants/layout'
import { MenuItem, MenuSection, StoreDropdown, SubMenuItem } from '@/components/staff'
import { useLayoutStore } from '@/store/layout.store'
import { HiMenuAlt2 } from 'react-icons/hi'
import { cn } from '@/lib/utils'
import { Button } from '@/components'

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
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-50',
        sidebarCollapsed ? 'w-20' : `w-[${width}px]`
      )}
    >
      <div
        className={cn(
          'flex items-center border-b border-gray-200 transition-all duration-300',
          sidebarCollapsed ? 'justify-center px-0 h-16' : 'justify-between px-6'
        )}
        style={{ height: sidebarCollapsed ? '64px' : `${headerHeight}px` }}
      >
        {!sidebarCollapsed && logo && <div className="transition-opacity duration-300">{logo}</div>}
        <Button
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Open Sidebar' : 'Close Sidebar'}
          className={cn(
            'p-2 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors',
            sidebarCollapsed && 'text-mint-500'
          )}
        >
          <HiMenuAlt2 className="text-xl" />
        </Button>
      </div>

      {!sidebarCollapsed && storeName && <StoreDropdown storeName={storeName} icon={storeIcon} />}

      <nav className="flex-1 overflow-y-auto py-4">{children}</nav>

      {userWidget && <div className="p-4 border-t border-gray-200 bg-gray-50">{userWidget}</div>}
    </aside>
  )
}

SidebarStaff.MenuSection = MenuSection
SidebarStaff.MenuItem = MenuItem
SidebarStaff.SubMenuItem = SubMenuItem

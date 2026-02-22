import type { ReactNode } from 'react'
import { HiMenuAlt2 } from 'react-icons/hi'

import { cn } from '@/lib/utils'
import { useLayoutStore } from '@/store/layout.store'

import { MenuItem } from './MenuItem'
import { MenuSection } from './MenuSection'
import { StoreDropdown } from './StoreDropdown'
import { SubMenuItem } from './SubMenuItem'

interface SidebarStaffProps {
  logo?: ReactNode
  storeName?: string
  storeIcon?: ReactNode
  children: ReactNode
  userWidget?: ReactNode
  headerHeight?: number
}

export function SidebarStaff({
  logo,
  storeName,
  storeIcon,
  children,
  userWidget
}: SidebarStaffProps) {
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-white border-r border-neutral-100 flex flex-col transition-all duration-300 z-50 overflow-x-hidden',
        sidebarCollapsed ? 'w-20 -translate-x-full lg:translate-x-0' : 'w-64 translate-x-0'
      )}
    >
      <div
        className={cn(
          'flex items-center border-b border-neutral-100 transition-all duration-300 overflow-hidden h-16',
          sidebarCollapsed ? 'justify-center px-0' : 'justify-between px-6'
        )}
      >
        {!sidebarCollapsed && logo && (
          <div className="transition-opacity duration-300 shrink-0">{logo}</div>
        )}
        <button
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Open Sidebar' : 'Close Sidebar'}
          className={cn(
            'p-2 rounded-lg text-neutral-400 hover:bg-neutral-50 transition-colors shrink-0',
            sidebarCollapsed && 'text-primary-500'
          )}
        >
          <HiMenuAlt2 className="text-xl" />
        </button>
      </div>

      {!sidebarCollapsed && storeName && <StoreDropdown storeName={storeName} icon={storeIcon} />}

      <nav
        className={cn(
          'flex-1 overflow-y-auto overflow-x-hidden py-4',
          sidebarCollapsed ? 'px-2' : 'px-0'
        )}
      >
        {children}
      </nav>

      {userWidget && (
        <div
          className={cn(
            'border-t border-neutral-100 bg-neutral-50 overflow-hidden',
            sidebarCollapsed ? 'p-2' : 'p-4'
          )}
        >
          {userWidget}
        </div>
      )}
    </aside>
  )
}

SidebarStaff.MenuSection = MenuSection
SidebarStaff.MenuItem = MenuItem
SidebarStaff.SubMenuItem = SubMenuItem

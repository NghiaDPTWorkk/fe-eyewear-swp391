import type { ReactNode } from 'react'
import { MenuItem } from '@/components/layout/staff/staff-core/sidebar/MenuItem'
import { MenuSection } from '@/components/layout/staff/staff-core/sidebar/MenuSection'
import { SubMenuItem } from '@/components/layout/staff/staff-core/sidebar/SubMenuItem'
import { StoreDropdown } from '@/components/layout/staff/staff-core/sidebar/StoreDropdown'
import { useLayoutStore } from '@/store/layout.store'
import { HiMenuAlt2 } from 'react-icons/hi'
import { cn } from '@/lib/utils'

interface SidebarAdminProps {
  logo?: ReactNode
  storeName?: string
  storeIcon?: ReactNode
  children: ReactNode
  userWidget?: ReactNode
}

export function SidebarAdmin({
  logo,
  storeName = 'OpticView HQ',
  storeIcon,
  children,
  userWidget
}: SidebarAdminProps) {
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
            'p-2 rounded-lg text-neutral-400 hover:bg-neutral-50 transition-colors shrink-0 cursor-pointer',
            sidebarCollapsed && 'text-blue-500 bg-blue-50'
          )}
        >
          <HiMenuAlt2 className="text-xl" />
        </button>
      </div>

      {!sidebarCollapsed && storeName && <StoreDropdown storeName={storeName} icon={storeIcon} />}

      <nav
        className={cn(
          'flex-1 overflow-y-auto overflow-x-hidden py-4 custom-scrollbar',
          sidebarCollapsed ? 'px-2' : 'px-0'
        )}
      >
        {children}
      </nav>

      {userWidget && (
        <div
          className={cn(
            'border-t border-neutral-100 bg-neutral-50 overflow-hidden shrink-0',
            sidebarCollapsed ? 'p-2' : 'p-4'
          )}
        >
          {userWidget}
        </div>
      )}
    </aside>
  )
}

SidebarAdmin.MenuSection = MenuSection
SidebarAdmin.MenuItem = MenuItem
SidebarAdmin.SubMenuItem = SubMenuItem

import type { ReactNode } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useLayoutStore } from '@/store/layout.store'
import { cn } from '@/lib/utils'
import { StaffHeader } from '@/components/layout/staff/staff-core/header'

interface StaffMainLayoutProps {
  sidebar: ReactNode
  headerLeft?: ReactNode
  headerRight?: ReactNode
  headerContainerWidth?: string
  mainClassName?: string
  headerClassName?: string
}

export function StaffMainLayout({
  sidebar,
  headerLeft,
  headerRight,
  headerContainerWidth = '100%',
  mainClassName = 'p-4 md:p-6 bg-neutral-50',
  headerClassName
}: StaffMainLayoutProps) {
  const location = useLocation()
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore()

  return (
    <div className="flex h-screen bg-white">
      {sidebar}

      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-neutral-900/40 z-40 lg:hidden animate-in fade-in duration-200"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300 overflow-x-hidden',
          'ml-0',
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        )}
      >
        <StaffHeader
          containerWidth={headerContainerWidth}
          left={headerLeft}
          right={headerRight}
          className={headerClassName}
        />

        <main
          className={cn('h-full overflow-auto animate-fade-in-up', mainClassName)}
          key={location.pathname}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

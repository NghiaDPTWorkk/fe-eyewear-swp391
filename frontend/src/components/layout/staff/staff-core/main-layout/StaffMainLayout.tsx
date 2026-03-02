import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
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
  headerContainerClassName?: string
  contentMaxWidth?: string
}

export function StaffMainLayout({
  sidebar,
  headerLeft,
  headerRight,
  mainClassName = 'p-4 md:p-6 bg-neutral-50',
  headerClassName,
  headerContainerClassName,
  headerContainerWidth = 'none'
}: StaffMainLayoutProps) {
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore()

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar - fixed and handles its own transitions */}
      {sidebar}

      {/* Overlay for mobile */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-neutral-900/40 z-40 lg:hidden backdrop-blur-sm transition-all duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content Area */}
      <div
        className={cn(
          'flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out relative',
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        <StaffHeader
          containerWidth={headerContainerWidth}
          left={headerLeft}
          right={headerRight}
          className={headerClassName}
          containerClassName={headerContainerClassName}
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

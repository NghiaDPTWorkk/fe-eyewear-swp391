import type { ReactNode } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useLayoutStore } from '@/store/layout.store'
import { cn } from '@/shared/utils'
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
  mainClassName = 'p-4 md:p-8 bg-mint-200',
  headerClassName,
  headerContainerClassName,
  headerContainerWidth = 'none',
  contentMaxWidth
}: StaffMainLayoutProps) {
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore()
  const location = useLocation()

  return (
    <div className="flex h-screen bg-white overflow-hidden w-full">
      {/* Sidebar - fixed and handles its own transitions */}
      {sidebar}

      {/* Placeholder to reserve space for the fixed sidebar on desktop */}
      <div
        className={cn(
          'hidden lg:block transition-all duration-300 ease-in-out shrink-0',
          sidebarCollapsed ? 'w-20' : 'w-64'
        )}
      />

      {/* Overlay for mobile */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-neutral-900/40 z-40 lg:hidden backdrop-blur-sm transition-all duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out relative min-w-0">
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
          <div className={cn('w-full mx-auto', contentMaxWidth)}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

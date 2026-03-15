import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { useLayoutStore } from '@/store/layout.store'
import { cn } from '@/lib/utils'
import { AdminHeader } from '../header/AdminHeader'

interface AdminMainLayoutProps {
  sidebar: ReactNode
  headerLeft?: ReactNode
  headerRight?: ReactNode
  headerContainerWidth?: string
  mainClassName?: string
  headerClassName?: string
  headerContainerClassName?: string
  contentMaxWidth?: string
}

export function AdminMainLayout({
  sidebar,
  headerLeft,
  headerRight,
  mainClassName = 'p-4 md:p-8 bg-neutral-50/50',
  headerClassName,
  headerContainerClassName,
  headerContainerWidth = 'none',
  contentMaxWidth
}: AdminMainLayoutProps) {
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore()

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      {/* Sidebar Component */}
      {sidebar}

      {/* Mobile Sidebar Overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-neutral-900/60 z-40 lg:hidden backdrop-blur-sm transition-all duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Container */}
      <div
        className={cn(
          'flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out relative',
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        <AdminHeader
          containerWidth={headerContainerWidth}
          left={headerLeft}
          right={headerRight}
          className={headerClassName}
          containerClassName={headerContainerClassName}
        />

        <main className={cn('flex-1 overflow-auto custom-scrollbar relative', mainClassName)}>
          {/* Subtle background element for premium feel */}
          <div className="absolute top-0 left-0 w-full h-64 bg-linear-to-b from-blue-50/30 to-transparent pointer-events-none" />

          <div className={cn('relative z-10 w-full mx-auto animate-fade-in-up', contentMaxWidth)}>
            <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-1">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

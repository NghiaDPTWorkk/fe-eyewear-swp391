import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { useLayoutStore } from '@/store/layout.store'
import { cn } from '@/lib/utils'
import { HeaderStaff } from '@/components/staff/header/HeaderStaff'
import { NavActions, NavSearch } from '@/components/staff/navbar/NavListStaff'

interface MainLayoutStaffProps {
  sidebar: ReactNode
  headerLeft?: ReactNode
  headerRight?: ReactNode
  headerContainerWidth?: string
  mainClassName?: string
}

export function MainLayoutStaff({
  sidebar,
  headerLeft = <NavSearch />,
  headerRight = <NavActions />,
  headerContainerWidth = '1200px',
  mainClassName = 'p-8 bg-neutral-50'
}: MainLayoutStaffProps) {
  const { sidebarCollapsed } = useLayoutStore()

  return (
    <div className="flex h-screen bg-white">
      {sidebar}

      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300 overflow-x-hidden',
          sidebarCollapsed ? 'ml-20' : 'ml-65'
        )}
      >
        <HeaderStaff containerWidth={headerContainerWidth} left={headerLeft} right={headerRight} />

        <main className={cn('h-full overflow-auto', mainClassName)}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

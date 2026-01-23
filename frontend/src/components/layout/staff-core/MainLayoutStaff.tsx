import type { ReactNode } from 'react'
import { HeaderStaff } from './HeaderStaff'
import { SidebarStaff } from './SidebarStaff'
import { LAYOUT } from '@/shared/constants/layout'

interface MainLayoutStaffProps {
  header: ReactNode
  sidebar: ReactNode
  children: ReactNode
  sidebarWidth?: number
  backgroundColor?: string
}

export function MainLayoutStaff({
  header,
  sidebar,
  children,
  sidebarWidth = LAYOUT.SIDEBAR.WIDTH,
  backgroundColor = '#F5F5F5'
}: MainLayoutStaffProps) {
  return (
    <div className="flex h-screen bg-white">
      {sidebar}

      <div className="flex-1 flex flex-col" style={{ marginLeft: `${sidebarWidth}px` }}>
        {header}

        <main
          className="flex-1 overflow-auto"
          style={{
            padding: LAYOUT.PAGE.PADDING_PX,
            backgroundColor
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

MainLayoutStaff.Header = HeaderStaff
MainLayoutStaff.Sidebar = SidebarStaff

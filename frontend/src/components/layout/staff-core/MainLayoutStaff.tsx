import type { ReactNode } from 'react'
import { HeaderStaff } from './HeaderStaff'
import { SidebarStaff } from './SidebarStaff'

interface MainLayoutStaffProps {
  header: ReactNode
  sidebar: ReactNode
  children: ReactNode
}

export function MainLayoutStaff({ header, sidebar, children }: MainLayoutStaffProps) {
  return (
    <div className="flex h-screen bg-white">
      {sidebar}

      <div className="flex-1 flex flex-col ml-[260px]">
        {header}

        <main className="flex-1 overflow-auto p-6 bg-[#F5F5F5]">{children}</main>
      </div>
    </div>
  )
}

MainLayoutStaff.Header = HeaderStaff
MainLayoutStaff.Sidebar = SidebarStaff

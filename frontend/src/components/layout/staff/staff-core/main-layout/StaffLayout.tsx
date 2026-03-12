import type { ReactNode } from 'react'
import { IoStorefront } from 'react-icons/io5'
import { StaffMainLayout } from './StaffMainLayout'
import {
  NavActions,
  NavSearch,
  SidebarStaff,
  ThemeToggle,
  UserWidgetWithLogout
} from '@/components/layout/staff/staff-core'
import { useStaffLayoutProfile } from '@/features/staff/hooks/useStaffLayoutProfile'
import { cn } from '@/lib/utils'

interface StaffLayoutProps {
  sidebarContent: ReactNode
  storeName?: string
  storeIcon?: ReactNode
  searchPlaceholder?: string
  mainClassName?: string
  contentMaxWidth?: string
}

export function StaffLayout({
  sidebarContent,
  storeName = 'OpticView',
  storeIcon = <IoStorefront />,
  searchPlaceholder = 'Search...',
  mainClassName,
  contentMaxWidth
}: StaffLayoutProps) {
  const { userName, userEmail, userRole, userInitials } = useStaffLayoutProfile()

  const sidebar = (
    <SidebarStaff
      logo={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-mint-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <span className="font-semibold text-gray-900">OpticView</span>
        </div>
      }
      storeName={storeName}
      storeIcon={storeIcon}
      userWidget={
        <UserWidgetWithLogout userInitials={userInitials} userName={userName} userRole={userRole} />
      }
    >
      {sidebarContent}
      <ThemeToggle />
    </SidebarStaff>
  )

  return (
    <StaffMainLayout
      sidebar={sidebar}
      headerLeft={
        <NavSearch
          styleVariant="operation"
          placeholder={searchPlaceholder}
          inputContainerClassName="lg:pl-0"
        />
      }
      headerRight={
        <NavActions
          userName={userName}
          userRole={userRole}
          userInitials={userInitials}
          userEmail={userEmail}
        />
      }
      mainClassName={cn('bg-mint-200', mainClassName)}
      headerContainerClassName="px-4 md:px-8 lg:pl-10 lg:pr-6"
      headerContainerWidth="none"
      contentMaxWidth={contentMaxWidth}
    />
  )
}

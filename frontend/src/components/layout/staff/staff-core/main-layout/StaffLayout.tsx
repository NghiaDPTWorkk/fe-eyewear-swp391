import type { ReactNode } from 'react'
import { IoStorefront } from 'react-icons/io5'
import { StaffMainLayout } from './StaffMainLayout'
import {
  NavActions,
  NavSearch,
  SidebarStaff,
  UserWidgetWithLogout
} from '@/components/layout/staff/staff-core'
import { useStaffLayoutProfile } from '@/features/staff/hooks/useStaffLayoutProfile'
import { cn } from '@/lib/utils'
import LogoEyewearIcon from '@/shared/components/ui/logoeyewear/LogoEyewearIcon'

interface StaffLayoutProps {
  sidebarContent: ReactNode
  storeName?: string
  storeIcon?: ReactNode
  searchPlaceholder?: string
  mainClassName?: string
  contentMaxWidth?: string
  styleVariant?: 'default' | 'operation' | 'manager'
}

export function StaffLayout({
  sidebarContent,
  storeName = 'Eyewear',
  storeIcon = <IoStorefront />,
  searchPlaceholder = 'Search...',
  mainClassName,
  contentMaxWidth,
  styleVariant = 'operation'
}: StaffLayoutProps) {
  const { userName, userEmail, userRole, userInitials } = useStaffLayoutProfile()

  const sidebar = (
    <SidebarStaff
      logo={
        <div className="flex items-center gap-2">
          <LogoEyewearIcon className="w-8 h-8" />
          <span className="font-semibold text-gray-900">Eyewear</span>
        </div>
      }
      storeName={storeName}
      storeIcon={storeIcon}
      userWidget={
        <UserWidgetWithLogout userInitials={userInitials} userName={userName} userRole={userRole} />
      }
    >
      {sidebarContent}
    </SidebarStaff>
  )

  return (
    <StaffMainLayout
      sidebar={sidebar}
      headerLeft={
        <NavSearch
          styleVariant={styleVariant}
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
      headerContainerClassName={cn('px-4 md:px-8 lg:px-10 mx-auto', contentMaxWidth)}
      headerContainerWidth="none"
      contentMaxWidth={contentMaxWidth}
    />
  )
}

import { useLocation } from 'react-router-dom'
import { StaffMainLayout } from '@/components/layout/staff/staff-core/main-layout/StaffMainLayout'
import {
  NavActions,
  NavSearch,
  SidebarStaff,
  ThemeToggle,
  UserWidgetWithLogout
} from '@/components/layout/staff/staff-core'
import {
  IoGrid,
  IoCube,
  IoReceipt,
  IoBarChart,
  IoSettings,
  IoHelpCircle,
  IoStorefront,
<<<<<<< HEAD
  IoPricetagOutline
=======
  IoArrowDown
>>>>>>> 9716e2ff054d57b91bf32ff5e31707fe17816b7d
} from 'react-icons/io5'

import { getInitials } from '@/shared/utils'
import { useProfile } from '@/features/staff/hooks/useProfile'

export default function ManagerLayout() {
  const location = useLocation()
  const { data: profileData } = useProfile()

  // Extract profile data
  const profile = profileData?.data
  const userName = profile?.name || 'Loading...'
  const userRole = profile?.role === 'MANAGER' ? 'Manager' : profile?.role || 'Loading...'
  const userInitials = profile?.name ? getInitials(profile.name) : '...'

  const sidebar = (
    <SidebarStaff
      logo={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-mint-500 rounded-lg flex items-center justify-center shadow-sm shadow-mint-100/30">
            <span className="text-white font-semibold text-lg leading-none">O</span>
          </div>
          <span className="font-semibold text-gray-900 tracking-tight">OpticView</span>
        </div>
      }
      storeName="Kanky Store"
      storeIcon={<IoStorefront />}
      userWidget={
        <UserWidgetWithLogout userInitials={userInitials} userName={userName} userRole={userRole} />
      }
    >
      <SidebarStaff.MenuSection label="GENERAL">
        <SidebarStaff.MenuItem
          icon={<IoGrid />}
          label="Dashboard"
          to="/manager/dashboard"
          active={location.pathname === '/manager/dashboard'}
        />
        <SidebarStaff.MenuItem
          icon={<IoReceipt />}
          label="Orders"
          to="/manager/orders"
          active={location.pathname === '/manager/orders'}
        />
        <SidebarStaff.MenuItem
          icon={<IoCube />}
          label="Product"
          to="/manager/products"
          active={location.pathname.startsWith('/manager/products')}
        />
        <SidebarStaff.MenuItem
<<<<<<< HEAD
          icon={<IoPricetagOutline />}
=======
          icon={<IoArrowDown />}
          label="Imports"
          to="/manager/imports"
          active={location.pathname === '/manager/imports'}
        />
        <SidebarStaff.MenuItem
          icon={<IoGrid />}
>>>>>>> 9716e2ff054d57b91bf32ff5e31707fe17816b7d
          label="Vouchers"
          to="/manager/vouchers"
          active={location.pathname === '/manager/vouchers'}
        />
        <SidebarStaff.MenuItem
          icon={<IoBarChart />}
          label="Sales Report"
          to="/manager/reports"
          active={location.pathname.startsWith('/manager/reports')}
        />
      </SidebarStaff.MenuSection>

      <SidebarStaff.MenuSection label="TOOLS">
        <SidebarStaff.MenuItem
          icon={<IoSettings />}
          label="Settings"
          to="/manager/settings"
          active={location.pathname.startsWith('/manager/settings')}
        />
        <SidebarStaff.MenuItem
          icon={<IoHelpCircle />}
          label="Support"
          to="/manager/support"
          active={location.pathname.startsWith('/manager/support')}
        />
        <ThemeToggle />
      </SidebarStaff.MenuSection>
    </SidebarStaff>
  )

  return (
    <StaffMainLayout
      sidebar={sidebar}
      headerLeft={
        <NavSearch
          styleVariant="manager"
          placeholder="Search products, orders..."
          inputContainerClassName="lg:pl-0"
        />
      }
      headerRight={
        <NavActions
          userName={userName}
          userRole={userRole}
          userInitials={userInitials}
          userEmail={profile?.email || ''}
        />
      }
      mainClassName="px-4 md:px-8 lg:px-10 py-6 md:py-8 bg-white"
      headerContainerClassName="pl-4 md:pl-8 lg:pl-10 pr-2 md:pr-4"
      headerContainerWidth="none"
      contentMaxWidth="max-w-[1600px]"
    />
  )
}

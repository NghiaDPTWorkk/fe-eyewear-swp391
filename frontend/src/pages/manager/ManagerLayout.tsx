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
  IoPricetagOutline
} from 'react-icons/io5'

import { useStaffLayoutProfile } from '@/features/staff/hooks/useStaffLayoutProfile'

export default function ManagerLayout() {
  const location = useLocation()
  const { userName, userRole, userInitials, userEmail } = useStaffLayoutProfile()

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
          label="Products"
          to="/manager/products"
          active={location.pathname.startsWith('/manager/products')}
        />
        <SidebarStaff.MenuItem
          icon={<IoPricetagOutline />}
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
          active={location.pathname === '/manager/settings'}
        />
        <SidebarStaff.MenuItem
          icon={<IoHelpCircle />}
          label="Support"
          to="/manager/support"
          active={location.pathname === '/manager/support'}
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
          styleVariant="operation"
          placeholder="Search products, orders..."
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
      mainClassName="px-4 md:px-8 lg:px-10 py-6 md:py-8 bg-mint-200"
      headerContainerClassName="pl-4 md:pl-8 lg:pl-10 pr-2 md:pr-4"
      headerContainerWidth="none"
      contentMaxWidth="max-w-[1600px]"
    />
  )
}

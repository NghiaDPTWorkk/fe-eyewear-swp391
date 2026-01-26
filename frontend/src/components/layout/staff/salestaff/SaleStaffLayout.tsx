import { useLocation } from 'react-router-dom'
import { StaffMainLayout } from '@/components/layout/staff/staff-core/main-layout/StaffMainLayout'
import { NavActions, NavSearch } from '@/components/layout/staff/staff-core/navbar/NavListStaff'
import {
  SidebarStaff,
  ThemeToggle,
  UserWidgetWithLogout
} from '@/components/layout/staff/staff-core/sidebar'
import {
  IoGrid,
  IoReceipt,
  IoCube,
  IoPeople,
  IoFlask,
  IoSettings,
  IoHelpCircle,
  IoStorefront
} from 'react-icons/io5'

export default function SaleStaffLayout() {
  const location = useLocation()

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
      storeName="Downtown Vision"
      storeIcon={<IoStorefront />}
      userWidget={
        <UserWidgetWithLogout
          userInitials="SL"
          userName="Dr. Sarah L."
          userRole="Head Optometrist"
        />
      }
    >
      <SidebarStaff.MenuSection label="GENERAL">
        <SidebarStaff.MenuItem
          icon={<IoGrid />}
          label="Dashboard"
          to="/salestaff/dashboard"
          active={location.pathname === '/salestaff/dashboard'}
        />
        <SidebarStaff.MenuItem
          icon={<IoReceipt />}
          label="Orders"
          hasDropdown
          active={location.pathname.startsWith('/salestaff/orders')}
        >
          <SidebarStaff.SubMenuItem
            label="All Orders"
            to="/salestaff/orders"
            active={location.pathname === '/salestaff/orders'}
          />
          <SidebarStaff.SubMenuItem
            label="Prescription"
            to="/salestaff/orders/rx-verification"
            badge={24}
            active={location.pathname === '/salestaff/orders/rx-verification'}
          />
          <SidebarStaff.SubMenuItem
            label="Pre-orders"
            to="/salestaff/orders/pre-orders"
            badge={15}
            active={location.pathname === '/salestaff/orders/pre-orders'}
          />
          <SidebarStaff.SubMenuItem
            label="Returns"
            to="/salestaff/orders/returns"
            badge={8}
            active={location.pathname === '/salestaff/orders/returns'}
          />
        </SidebarStaff.MenuItem>
        <SidebarStaff.MenuItem
          icon={<IoCube />}
          label="Products"
          to="/salestaff/products"
          active={location.pathname === '/salestaff/products'}
        />
        <SidebarStaff.MenuItem
          icon={<IoPeople />}
          label="Customers"
          to="/salestaff/customers"
          active={location.pathname === '/salestaff/customers'}
        />
        <SidebarStaff.MenuItem
          icon={<IoFlask />}
          label="Lab Status"
          to="/salestaff/lab-status"
          active={location.pathname === '/salestaff/lab-status'}
        />
      </SidebarStaff.MenuSection>

      <SidebarStaff.MenuSection label="TOOLS">
        <SidebarStaff.MenuItem icon={<IoSettings />} label="Settings" to="/salestaff/settings" />
        <SidebarStaff.MenuItem icon={<IoHelpCircle />} label="Support" to="/salestaff/support" />
        <ThemeToggle />
      </SidebarStaff.MenuSection>
    </SidebarStaff>
  )

  return (
    <StaffMainLayout
      sidebar={sidebar}
      headerLeft={<NavSearch />}
      headerRight={<NavActions />}
      mainClassName="p-4 md:p-8 bg-neutral-50"
    />
  )
}

import { useLocation } from 'react-router-dom'
import {
  IoGrid,
  IoCube,
  IoReceipt,
  IoSettings,
  IoHelpCircle,
  IoPricetagOutline
} from 'react-icons/io5'

import { SidebarStaff, StaffLayout } from '@/components/layout/staff/staff-core'

export default function ManagerLayout() {
  const location = useLocation()

  const sidebarContent = (
    <>
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
      </SidebarStaff.MenuSection>
    </>
  )

  return (
    <StaffLayout
      storeName="Downtown Vision"
      searchPlaceholder="Search products, orders..."
      sidebarContent={sidebarContent}
      styleVariant="manager"
      mainClassName="px-4 md:px-8 lg:px-10 py-8"
      contentMaxWidth="max-w-[1600px]"
    />
  )
}

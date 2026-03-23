import { IoGrid, IoReceipt, IoPeople, IoSettings, IoHelpCircle } from 'react-icons/io5'
import { useLocation } from 'react-router-dom'

import { SidebarStaff, StaffLayout } from '@/components/layout/staff/staff-core'
import { LAYOUT } from '@/features/sales/constants/saleStaffDesignSystem'
import { cn } from '@/lib/utils'

export default function SaleStaffLayout() {
  const location = useLocation()

  const sidebarContent = (
    <SidebarStaff.MenuSection label="GENERAL">
      <SidebarStaff.MenuItem
        icon={<IoGrid />}
        label="Dashboard"
        to="/sale-staff/dashboard"
        active={location.pathname === '/sale-staff/dashboard'}
      />
      <SidebarStaff.MenuItem
        icon={<IoReceipt />}
        label="Orders"
        to="/sale-staff/orders"
        active={location.pathname.startsWith('/sale-staff/orders')}
      />

      <SidebarStaff.MenuItem
        icon={<IoPeople />}
        label="Customers"
        to="/sale-staff/customers"
        active={location.pathname === '/sale-staff/customers'}
      />
      {/* <SidebarStaff.MenuItem
        icon={<IoFlask />}
        label="Lab Status"
        to="/sale-staff/lab-status"
        active={location.pathname === '/sale-staff/lab-status'}
      /> */}
    </SidebarStaff.MenuSection>
  )

  const toolsContent = (
    <SidebarStaff.MenuSection label="TOOLS">
      <SidebarStaff.MenuItem
        icon={<IoSettings />}
        label="Settings"
        to="/sale-staff/settings"
        active={location.pathname === '/sale-staff/settings'}
      />
      <SidebarStaff.MenuItem
        icon={<IoHelpCircle />}
        label="Support"
        to="/sale-staff/support"
        active={location.pathname === '/sale-staff/support'}
      />
    </SidebarStaff.MenuSection>
  )

  return (
    <StaffLayout
      storeName="Downtown Vision"
      sidebarContent={
        <>
          {sidebarContent}
          {toolsContent}
        </>
      }
      mainClassName={cn(LAYOUT.px, LAYOUT.py)}
      contentMaxWidth={LAYOUT.maxWidth}
    />
  )
}

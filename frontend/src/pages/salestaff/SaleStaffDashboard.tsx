import { SidebarStaff } from '@/components/layout/staff-core/SidebarStaff'
import { HeaderStaff } from '@/components/layout/staff-core/HeaderStaff'
import { NavSearch, NavActions } from '@/components/common/staff/NavListStaff'
import { UserWidgetWithLogout } from '@/components/layout/staff-core/sidebar/UserWidgetWithLogout'
import { ThemeToggle } from '@/components/layout/staff-core/sidebar/ThemeToggle'
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
import { Container } from '@/components'

export default function SaleStaffDashboard() {
  return (
    <div className="flex h-screen bg-white">
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
          <SidebarStaff.MenuItem icon={<IoGrid />} label="Dashboard" />

          <SidebarStaff.MenuItem icon={<IoReceipt />} label="Orders" hasDropdown>
            <SidebarStaff.SubMenuItem label="Order List" active />
            <SidebarStaff.SubMenuItem label="Create New Order" />
            <SidebarStaff.SubMenuItem label="Pre-orders" />
          </SidebarStaff.MenuItem>

          <SidebarStaff.MenuItem icon={<IoCube />} label="Products" />
          <SidebarStaff.MenuItem icon={<IoPeople />} label="Customers" />
          <SidebarStaff.MenuItem icon={<IoFlask />} label="Lab Status" />
        </SidebarStaff.MenuSection>

        <SidebarStaff.MenuSection label="TOOLS">
          <SidebarStaff.MenuItem icon={<IoSettings />} label="Settings" />
          <SidebarStaff.MenuItem icon={<IoHelpCircle />} label="Support" />
          <ThemeToggle />
        </SidebarStaff.MenuSection>
      </SidebarStaff>

      <div className="flex-1 flex flex-col ml-[260px]">
        <HeaderStaff left={<NavSearch />} right={<NavActions userInitials="SL" />} />

        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <Container>
            <div className="text-sm text-gray-600 mb-2">Dashboard / Order Management</div>
            <h1 className="text-2xl font-semibold mb-6">Order List</h1>
            <div className="bg-white p-6 rounded-lg shadow">
              <p>Content goes here...</p>
            </div>
          </Container>
        </main>
      </div>
    </div>
  )
}

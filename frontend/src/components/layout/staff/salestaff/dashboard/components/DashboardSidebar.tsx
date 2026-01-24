import {
  IoStorefront,
  IoGrid,
  IoReceipt,
  IoCube,
  IoPeople,
  IoFlask,
  IoSettings,
  IoHelpCircle
} from 'react-icons/io5'
import { SidebarStaff } from '@/components/templates/staff/sidebar/SidebarStaff'
import { UserWidgetWithLogout } from '@/components/common/staff/sidebar/UserWidgetWithLogout'
import { ThemeToggle } from '@/components/common/staff/sidebar/ThemeToggle'

export default function DashboardSidebar() {
  return (
    <SidebarStaff
      logo={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
            O
          </div>
          <span className="font-semibold text-gray-900">OpticView</span>
        </div>
      }
      storeName="Downtown Vision"
      storeIcon={<IoStorefront />}
      userWidget={
        <UserWidgetWithLogout userInitials="SJ" userName="Sarah Jenkins" userRole="Sales Manager" />
      }
    >
      <SidebarStaff.MenuSection label="GENERAL">
        <SidebarStaff.MenuItem icon={<IoGrid />} label="Dashboard" active />
        <SidebarStaff.MenuItem icon={<IoReceipt />} label="Orders" hasDropdown />
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
  )
}

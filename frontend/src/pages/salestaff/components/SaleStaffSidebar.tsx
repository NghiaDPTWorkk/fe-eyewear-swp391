import { SidebarStaff } from '@/components/templates/staff/sidebar/SidebarStaff'
import { ThemeToggle } from '@/components/common/staff/sidebar/ThemeToggle'
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
import { UserWidgetWithLogout } from '@/components/common/staff/sidebar/UserWidgetWithLogout'

export function SaleStaffSidebar() {
  return (
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
        <SidebarStaff.MenuItem icon={<IoReceipt />} label="Orders" hasDropdown isOpen>
          <SidebarStaff.SubMenuItem label="All Orders" active />
          <SidebarStaff.SubMenuItem label="Rx Verification" badge={24} />
          <SidebarStaff.SubMenuItem label="Pre-orders" badge={15} />
          <SidebarStaff.SubMenuItem label="Returns" badge={8} />
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
  )
}

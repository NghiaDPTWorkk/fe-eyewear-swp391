import { useNavigate, useLocation } from 'react-router-dom'
import { MainLayoutStaff } from '../MainLayoutStaff'
import { SidebarStaff } from '@/components/staff/sidebar/SidebarStaff'
import { ThemeToggle } from '@/components/staff/sidebar/ThemeToggle'
import { UserWidgetWithLogout } from '@/components/staff/sidebar/UserWidgetWithLogout'
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
  const navigate = useNavigate()
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
          active={location.pathname === '/salestaff/dashboard'}
          onClick={() => navigate('/salestaff/dashboard')}
        />
        <SidebarStaff.MenuItem icon={<IoReceipt />} label="Orders" hasDropdown>
          <SidebarStaff.SubMenuItem label="All Orders" />
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

  return <MainLayoutStaff sidebar={sidebar} />
}

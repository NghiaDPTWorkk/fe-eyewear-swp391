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
        <SidebarStaff.MenuItem
          icon={<IoReceipt />}
          label="Orders"
          hasDropdown
          active={location.pathname.startsWith('/salestaff/orders')}
        >
          <SidebarStaff.SubMenuItem
            label="All Orders"
            active={location.pathname === '/salestaff/orders'}
            onClick={() => navigate('/salestaff/orders')}
          />
          <SidebarStaff.SubMenuItem
            label="Rx Verification"
            badge={24}
            active={location.pathname === '/salestaff/orders/rx-verification'}
            onClick={() => navigate('/salestaff/orders/rx-verification')}
          />
          <SidebarStaff.SubMenuItem
            label="Pre-orders"
            badge={15}
            active={location.pathname === '/salestaff/orders/pre-orders'}
            onClick={() => navigate('/salestaff/orders/pre-orders')}
          />
          <SidebarStaff.SubMenuItem
            label="Returns"
            badge={8}
            active={location.pathname === '/salestaff/orders/returns'}
            onClick={() => navigate('/salestaff/orders/returns')}
          />
        </SidebarStaff.MenuItem>
        <SidebarStaff.MenuItem
          icon={<IoCube />}
          label="Products"
          active={location.pathname === '/salestaff/products'}
          onClick={() => navigate('/salestaff/products')}
        />
        <SidebarStaff.MenuItem
          icon={<IoPeople />}
          label="Customers"
          active={location.pathname === '/salestaff/customers'}
          onClick={() => navigate('/salestaff/customers')}
        />
        <SidebarStaff.MenuItem
          icon={<IoFlask />}
          label="Lab Status"
          active={location.pathname === '/salestaff/lab-status'}
          onClick={() => navigate('/salestaff/lab-status')}
        />
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

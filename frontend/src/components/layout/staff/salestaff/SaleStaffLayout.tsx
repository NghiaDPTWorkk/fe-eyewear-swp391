import { useNavigate, useLocation } from 'react-router-dom'
import { SaleMainLayoutStaff } from './SaleMainLayoutStaff'
import { SaleSidebarStaff, ThemeToggle, UserWidgetWithLogout } from '@/components/staff'
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
    <SaleSidebarStaff
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
      <SaleSidebarStaff.MenuSection label="GENERAL">
        <SaleSidebarStaff.MenuItem
          icon={<IoGrid />}
          label="Dashboard"
          active={location.pathname === '/salestaff/dashboard'}
          onClick={() => navigate('/salestaff/dashboard')}
        />
        <SaleSidebarStaff.MenuItem
          icon={<IoReceipt />}
          label="Orders"
          hasDropdown
          active={location.pathname.startsWith('/salestaff/orders')}
        >
          <SaleSidebarStaff.SubMenuItem
            label="All Orders"
            active={location.pathname === '/salestaff/orders'}
            onClick={() => navigate('/salestaff/orders')}
          />
          <SaleSidebarStaff.SubMenuItem
            label="Prescription"
            badge={24}
            active={location.pathname === '/salestaff/orders/rx-verification'}
            onClick={() => navigate('/salestaff/orders/rx-verification')}
          />
          <SaleSidebarStaff.SubMenuItem
            label="Pre-orders"
            badge={15}
            active={location.pathname === '/salestaff/orders/pre-orders'}
            onClick={() => navigate('/salestaff/orders/pre-orders')}
          />
          <SaleSidebarStaff.SubMenuItem
            label="Returns"
            badge={8}
            active={location.pathname === '/salestaff/orders/returns'}
            onClick={() => navigate('/salestaff/orders/returns')}
          />
        </SaleSidebarStaff.MenuItem>
        <SaleSidebarStaff.MenuItem
          icon={<IoCube />}
          label="Products"
          active={location.pathname === '/salestaff/products'}
          onClick={() => navigate('/salestaff/products')}
        />
        <SaleSidebarStaff.MenuItem
          icon={<IoPeople />}
          label="Customers"
          active={location.pathname === '/salestaff/customers'}
          onClick={() => navigate('/salestaff/customers')}
        />
        <SaleSidebarStaff.MenuItem
          icon={<IoFlask />}
          label="Lab Status"
          active={location.pathname === '/salestaff/lab-status'}
          onClick={() => navigate('/salestaff/lab-status')}
        />
      </SaleSidebarStaff.MenuSection>

      <SaleSidebarStaff.MenuSection label="TOOLS">
        <SaleSidebarStaff.MenuItem icon={<IoSettings />} label="Settings" />
        <SaleSidebarStaff.MenuItem icon={<IoHelpCircle />} label="Support" />
        <ThemeToggle />
      </SaleSidebarStaff.MenuSection>
    </SaleSidebarStaff>
  )

  return <SaleMainLayoutStaff sidebar={sidebar} />
}

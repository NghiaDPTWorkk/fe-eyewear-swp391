import { useLocation, useNavigate } from 'react-router-dom'
import { StaffMainLayout } from '@/components/layout/staff/staff-core/main-layout/StaffMainLayout'
import {
  SidebarStaff,
  UserWidgetWithLogout,
  ThemeToggle,
  NavActions,
  NavSearch
} from '@/components/staff'
import {
  IoGrid,
  IoCube,
  IoReceipt,
  IoBarChart,
  IoSettings,
  IoHelpCircle,
  IoStorefront,
  IoReader,
  IoAddCircle
} from 'react-icons/io5'

export default function ManagerLayout() {
  const location = useLocation()
  const navigate = useNavigate()

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
        <UserWidgetWithLogout
          userInitials="GH"
          userName="Guy Hawkins"
          userRole="Admin"
          onLogout={() => navigate('/login')}
        />
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
          label="Product"
          to="/manager/products"
          active={location.pathname.startsWith('/manager/products')}
        />
        <SidebarStaff.MenuItem
          icon={<IoAddCircle />}
          label="Add Product"
          to="/manager/products/add"
          active={location.pathname === '/manager/products/add'}
        />
        <SidebarStaff.MenuItem
          icon={<IoAddCircle />}
          label="Add Attribute"
          to="/manager/attributes/add"
          active={location.pathname === '/manager/attributes/add'}
        />
        <SidebarStaff.MenuItem
          icon={<IoReader />}
          label="Transaction"
          to="/manager/transactions"
          active={location.pathname.startsWith('/manager/transactions')}
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
          active={location.pathname.startsWith('/manager/settings')}
        />
        <SidebarStaff.MenuItem
          icon={<IoHelpCircle />}
          label="Support"
          to="/manager/help"
          active={location.pathname.startsWith('/manager/help')}
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
          styleVariant="manager"
          placeholder="Search products, orders..."
          inputContainerClassName="lg:pl-0"
        />
      }
      headerRight={<NavActions />}
      mainClassName="p-4 md:p-6 bg-neutral-50"
      headerClassName="px-4 md:px-6"
    />
  )
}

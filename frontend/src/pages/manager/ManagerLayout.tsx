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
  IoGridOutline,
  IoReceipt,
  IoDocumentTextOutline,
  IoSettingsOutline,
  IoHelpCircleOutline,
  IoAnalyticsOutline
} from 'react-icons/io5'

export default function ManagerLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const sidebar = (
    <SidebarStaff
      logo={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="font-semibold text-gray-900">Manager Portal</span>
        </div>
      }
      userWidget={
        <UserWidgetWithLogout userInitials="MN" userName="Manager Name" userRole="Store Manager" />
      }
    >
      <SidebarStaff.MenuSection label="DASHBOARD">
        <SidebarStaff.MenuItem
          icon={<IoGridOutline />}
          label="Overview"
          active={location.pathname === '/manager'}
          onClick={() => navigate('/manager')}
        />
      </SidebarStaff.MenuSection>

      <SidebarStaff.MenuSection label="FINANCE">
        <SidebarStaff.MenuItem
          icon={<IoReceipt />}
          label="Invoices"
          active={location.pathname === '/manager/invoices'}
          onClick={() => navigate('/manager/invoices')}
        />
        <SidebarStaff.MenuItem
          icon={<IoDocumentTextOutline />}
          label="Reports"
          active={location.pathname === '/manager/reports'}
          onClick={() => navigate('/manager/reports')}
        />
        <SidebarStaff.MenuItem
          icon={<IoAnalyticsOutline />}
          label="Analytics"
          active={location.pathname === '/manager/analytics'}
          onClick={() => navigate('/manager/analytics')}
        />
      </SidebarStaff.MenuSection>

      <SidebarStaff.MenuSection label="TOOLS">
        <SidebarStaff.MenuItem
          icon={<IoSettingsOutline />}
          label="Settings"
          onClick={() => navigate('/manager/settings')}
        />
        <SidebarStaff.MenuItem
          icon={<IoHelpCircleOutline />}
          label="Support"
          onClick={() => navigate('/manager/support')}
        />
        <ThemeToggle />
      </SidebarStaff.MenuSection>
    </SidebarStaff>
  )

  return (
    <StaffMainLayout
      sidebar={sidebar}
      headerLeft={<NavSearch placeholder="Search invoices, reports..." styleVariant="manager" />}
      headerRight={<NavActions />}
      mainClassName="p-6 bg-gray-50"
    />
  )
}

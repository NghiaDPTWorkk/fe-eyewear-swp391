import { useLocation, useNavigate } from 'react-router-dom'
import {
  StaffMainLayout,
  SidebarStaff,
  UserWidgetWithLogout,
  NavActions,
  NavSearch,
  ThemeToggle
} from '@/components/layout/staff/staff-core'
import {
  IoGridOutline,
  IoPeopleOutline,
  IoPersonAddOutline,
  IoSettingsOutline,
  IoHelpCircleOutline,
  IoShieldCheckmarkOutline,
  IoStatsChartOutline,
  IoDocumentTextOutline
} from 'react-icons/io5'

import { useStaffLayoutProfile } from '@/features/staff/hooks/useStaffLayoutProfile'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { userName, userRole, userInitials, userEmail } = useStaffLayoutProfile()

  const sidebar = (
    <SidebarStaff
      logo={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-mint-500 rounded-lg flex items-center justify-center">
            <IoShieldCheckmarkOutline className="text-white text-lg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 tracking-tight leading-none text-sm">
              OpticView
            </span>
            <span className="text-[10px] font-extrabold text-mint-600 uppercase tracking-widest mt-0.5">
              HQ / Admin
            </span>
          </div>
        </div>
      }
      userWidget={
        <UserWidgetWithLogout
          userInitials={userInitials}
          userName={userName}
          userRole={userRole}
          onLogout={() => navigate('/admin/login')}
        />
      }
    >
      <SidebarStaff.MenuSection label="OVERVIEW">
        <SidebarStaff.MenuItem
          icon={<IoGridOutline />}
          label="Dashboard"
          to="/admin/dashboard"
          active={location.pathname === '/admin/dashboard'}
        />
        <SidebarStaff.MenuItem
          icon={<IoStatsChartOutline />}
          label="Analytics"
          to="/admin/analytics"
          active={location.pathname === '/admin/analytics'}
        />
      </SidebarStaff.MenuSection>

      <SidebarStaff.MenuSection label="MANAGEMENT">
        <SidebarStaff.MenuItem
          icon={<IoPeopleOutline />}
          label="User Directory"
          to="/admin/users"
          active={location.pathname.startsWith('/admin/users')}
        />
        <SidebarStaff.MenuItem
          icon={<IoPersonAddOutline />}
          label="Staff Accounts"
          to="/admin/staff"
          active={location.pathname.startsWith('/admin/staff')}
        />
      </SidebarStaff.MenuSection>

      <SidebarStaff.MenuSection label="SYSTEM & UTILS">
        <SidebarStaff.MenuItem
          icon={<IoDocumentTextOutline />}
          label="System Logs"
          to="/admin/logs"
          active={location.pathname.startsWith('/admin/logs')}
        />
        <SidebarStaff.MenuItem
          icon={<IoSettingsOutline />}
          label="Global Settings"
          to="/admin/settings"
          active={location.pathname.startsWith('/admin/settings')}
        />
        <SidebarStaff.MenuItem
          icon={<IoHelpCircleOutline />}
          label="Technical Support"
          to="/admin/support"
          active={location.pathname.startsWith('/admin/support')}
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
          styleVariant="operation"
          placeholder="Quick search user, staff or setting..."
          inputContainerClassName="lg:pl-0"
        />
      }
      headerRight={
        <NavActions
          userName={userName}
          userRole={userRole}
          userInitials={userInitials}
          userEmail={userEmail}
        />
      }
      mainClassName="px-4 md:px-8 lg:px-10 py-8 bg-mint-200"
      headerContainerClassName="px-4 md:px-8 lg:px-10"
      headerContainerWidth="none"
    />
  )
}

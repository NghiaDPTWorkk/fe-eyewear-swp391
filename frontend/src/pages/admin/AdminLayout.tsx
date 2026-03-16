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
  IoDocumentTextOutline
} from 'react-icons/io5'

import { useStaffLayoutProfile } from '@/features/staff/hooks/useStaffLayoutProfile'
import { STORAGE_KEYS } from '@/shared/constants/storage'
import { useAuthStore } from '@/store'
import LogoEyewearIcon from '@/shared/components/ui-core/logoeyewear/LogoEyewearIcon'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { userName, userRole, userInitials, userEmail } = useStaffLayoutProfile()

  const handleLogout = () => {
    navigate('/admin/login')
    const { logout } = useAuthStore.getState()
    logout()
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_INFO)
  }
  const sidebar = (
    <SidebarStaff
      logo={
        <div className="flex items-center gap-2">
          <LogoEyewearIcon className='w-8 h-8'/>
          <span className="font-semibold text-gray-900">OpticView</span>
        </div>
      }
      userWidget={
        <UserWidgetWithLogout
          userInitials={userInitials}
          userName={userName}
          userRole={userRole}
          onLogout={handleLogout}
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

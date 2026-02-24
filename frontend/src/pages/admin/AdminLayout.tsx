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
  IoPeople,
  IoPersonAdd,
  IoSettings,
  IoHelpCircle,
  IoStorefront
} from 'react-icons/io5'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const sidebar = (
    <SidebarStaff
      logo={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-100/30">
            <span className="text-white font-semibold text-lg leading-none">A</span>
          </div>
          <span className="font-semibold text-gray-900 tracking-tight">Admin Panel</span>
        </div>
      }
      storeName="OpticView HQ"
      storeIcon={<IoStorefront />}
      userWidget={
        <UserWidgetWithLogout
          userInitials="AD"
          userName="Administrator"
          userRole="Super Admin"
          onLogout={() => navigate('/admin/login')}
        />
      }
    >
      <SidebarStaff.MenuSection label="GENERAL">
        <SidebarStaff.MenuItem
          icon={<IoGrid />}
          label="Dashboard"
          to="/admin/dashboard"
          active={location.pathname === '/admin/dashboard'}
        />
        <SidebarStaff.MenuItem
          icon={<IoPeople />}
          label="Users"
          to="/admin/users"
          active={location.pathname.startsWith('/admin/users')}
        />
        <SidebarStaff.MenuItem
          icon={<IoPersonAdd />}
          label="Staff Accounts"
          to="/admin/staff"
          active={location.pathname.startsWith('/admin/staff')}
        />
      </SidebarStaff.MenuSection>

      <SidebarStaff.MenuSection label="TOOLS">
        <SidebarStaff.MenuItem
          icon={<IoSettings />}
          label="Settings"
          to="/admin/settings"
          active={location.pathname.startsWith('/admin/settings')}
        />
        <SidebarStaff.MenuItem
          icon={<IoHelpCircle />}
          label="Support"
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
          styleVariant="manager"
          placeholder="Search users, staff..."
          inputContainerClassName="lg:pl-0"
        />
      }
      headerRight={<NavActions />}
      mainClassName="p-4 md:p-6 bg-neutral-50"
      headerClassName="px-4 md:px-6"
    />
  )
}

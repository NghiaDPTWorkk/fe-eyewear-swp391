import {
  IoGrid,
  IoReceipt,
  IoPeople,
  IoFlask,
  IoSettings,
  IoHelpCircle,
  IoStorefront
} from 'react-icons/io5'
import { useLocation } from 'react-router-dom'

import {
  NavActions,
  NavSearch,
  SidebarStaff,
  ThemeToggle,
  UserWidgetWithLogout
} from '@/components/layout/staff/staff-core'
import { StaffMainLayout } from '@/components/layout/staff/staff-core/main-layout/StaffMainLayout'
import { useProfile } from '@/features/staff/hooks/useProfile'

// Helper function to get initials from name
const getInitials = (name: string): string => {
  if (!name) return '...'
  const words = name.trim().split(' ')
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

export default function SaleStaffLayout() {
  const location = useLocation()
  const { data: profileData } = useProfile()

  // Extract profile data
  const profile = profileData?.data
  const userName = profile?.name || 'Loading...'
  const userEmail = profile?.email || 'loading@example.com'
  const userRole = profile?.role === 'SALE_STAFF' ? 'Sales Staff' : profile?.role || 'Loading...'
  const userInitials = profile?.name ? getInitials(profile.name) : '...'

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
        <UserWidgetWithLogout userInitials={userInitials} userName={userName} userRole={userRole} />
      }
    >
      <SidebarStaff.MenuSection label="GENERAL">
        <SidebarStaff.MenuItem
          icon={<IoGrid />}
          label="Dashboard"
          to="/salestaff/dashboard"
          active={location.pathname === '/salestaff/dashboard'}
        />
        <SidebarStaff.MenuItem
          icon={<IoReceipt />}
          label="Orders"
          to="/salestaff/orders"
          active={location.pathname.startsWith('/salestaff/orders')}
        />

        <SidebarStaff.MenuItem
          icon={<IoPeople />}
          label="Customers"
          to="/salestaff/customers"
          active={location.pathname === '/salestaff/customers'}
        />
        <SidebarStaff.MenuItem
          icon={<IoFlask />}
          label="Lab Status"
          to="/salestaff/lab-status"
          active={location.pathname === '/salestaff/lab-status'}
        />
      </SidebarStaff.MenuSection>

      <SidebarStaff.MenuSection label="TOOLS">
        <SidebarStaff.MenuItem
          icon={<IoSettings />}
          label="Settings"
          to="/salestaff/settings"
          active={location.pathname === '/salestaff/settings'}
        />
        <SidebarStaff.MenuItem
          icon={<IoHelpCircle />}
          label="Support"
          to="/salestaff/support"
          active={location.pathname === '/salestaff/support'}
        />
        <ThemeToggle />
      </SidebarStaff.MenuSection>
    </SidebarStaff>
  )

  return (
    <StaffMainLayout
      sidebar={sidebar}
      headerLeft={<NavSearch inputContainerClassName="lg:pl-0" />}
      headerRight={
        <NavActions
          userName={userName}
          userRole={userRole}
          userInitials={userInitials}
          userEmail={userEmail}
        />
      }
      mainClassName="bg-neutral-50"
      headerClassName=""
    />
  )
}

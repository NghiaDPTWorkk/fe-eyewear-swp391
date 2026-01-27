import { useLocation } from 'react-router-dom'
import { StaffMainLayout } from '@/components/layout/staff/staff-core/main-layout/StaffMainLayout'
import {
  SidebarStaff,
  UserWidgetWithLogout,
  ThemeToggle,
  NavSearch,
  NavActions
} from '@/components/staff'
import {
  IoGridOutline,
  IoReceipt,
  IoCarOutline,
  IoSettingsOutline,
  IoHelpCircleOutline,
  IoBuildOutline
} from 'react-icons/io5'
import { FaBoxesPacking } from 'react-icons/fa6'

export default function OperationLayout() {
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
      userWidget={
        <UserWidgetWithLogout
          userInitials="SL"
          userName="Dr. Sarah L."
          userRole="Head Optometrist"
        />
      }
    >
      <SidebarStaff.MenuSection label="WORK STATIONS">
        <SidebarStaff.MenuItem
          icon={<IoGridOutline />}
          label="Dashboard"
          to="/operationstaff/dashboard"
          active={location.pathname === '/operationstaff/dashboard'}
        />
        <SidebarStaff.MenuItem
          icon={<IoReceipt />}
          label="All Orders"
          to="/operationstaff/all"
          active={location.pathname === '/operationstaff/all'}
        />
        <SidebarStaff.MenuItem
          icon={<IoBuildOutline />}
          label="Technical Stations"
          to="/operationstaff/prescription-orders"
          active={location.pathname === '/operationstaff/prescription-orders'}
        />
        <SidebarStaff.MenuItem
          icon={<IoCarOutline />}
          label="Logistics Waiting Station"
          to="/operationstaff/pre-orders"
          active={location.pathname === '/operationstaff/pre-orders'}
        />
        <SidebarStaff.MenuItem
          icon={<FaBoxesPacking />}
          label="Packing Station"
          to="/operationstaff/packing"
          active={location.pathname === '/operationstaff/packing'}
        />
      </SidebarStaff.MenuSection>

      <SidebarStaff.MenuSection label="TOOLS">
        <SidebarStaff.MenuItem
          icon={<IoSettingsOutline />}
          label="Settings"
          to="/operationstaff/settings"
        />
        <SidebarStaff.MenuItem
          icon={<IoHelpCircleOutline />}
          label="Support"
          to="/operationstaff/support"
        />
        <ThemeToggle />
      </SidebarStaff.MenuSection>
    </SidebarStaff>
  )

  return (
    <StaffMainLayout
      sidebar={sidebar}
      headerLeft={<NavSearch placeholder="Search orders..." styleVariant="operation" />}
      headerRight={<NavActions />}
      mainClassName="p-4 md:p-8 bg-mint-200"
    />
  )
}

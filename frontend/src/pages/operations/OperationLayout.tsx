import { useEffect } from 'react'
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
  IoCarOutline,
  IoSettingsOutline,
  IoHelpCircleOutline,
  IoBuildOutline
} from 'react-icons/io5'
import { FaBoxesPacking } from 'react-icons/fa6'
import { useOrderCountStore } from '@/store'

export default function OperationLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { counts, initializeCounts } = useOrderCountStore()

  // Mock orders data (giống trong OrderTable)
  const mockOrders = [
    { orderType: 'Đơn Thường' },
    { orderType: 'Pre-order' },
    { orderType: 'Pre-order' },
    { orderType: 'Prescription' },
    { orderType: 'Đơn Thường' }
  ]

  // Initialize counts khi component mount
  useEffect(() => {
    initializeCounts(mockOrders)
  }, [initializeCounts])

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
          active={location.pathname === '/operationstaff/dashboard'}
          onClick={() => navigate('/operationstaff/dashboard')}
        />
        <SidebarStaff.MenuItem
          icon={<IoReceipt />}
          label="All Orders"
          active={location.pathname === '/operationstaff/all'}
          onClick={() => navigate('/operationstaff/all')}
          badge={counts.packing > 0 ? counts.packing.toString() : undefined}
        />
        <SidebarStaff.MenuItem
          icon={<IoBuildOutline />}
          label="Technical Stations"
          active={location.pathname === '/operationstaff/prescription-orders'}
          onClick={() => navigate('/operationstaff/prescription-orders')}
          badge={counts.technical > 0 ? counts.technical.toString() : undefined}
        />
        <SidebarStaff.MenuItem
          icon={<IoCarOutline />}
          label="Logistics Waiting Station"
          active={location.pathname === '/operationstaff/pre-orders'}
          onClick={() => navigate('/operationstaff/pre-orders')}
          badge={counts.logistics > 0 ? counts.logistics.toString() : undefined}
        />
        <SidebarStaff.MenuItem
          icon={<FaBoxesPacking />}
          label="Packing Station"
          active={location.pathname === '/operationstaff/packing'}
          onClick={() => navigate('/operationstaff/packing')}
          badge={counts.packing > 0 ? counts.packing.toString() : undefined}
        />
      </SidebarStaff.MenuSection>

      <SidebarStaff.MenuSection label="TOOLS">
        <SidebarStaff.MenuItem
          icon={<IoSettingsOutline />}
          label="Settings"
          active={location.pathname === '/operationstaff/settings'}
          onClick={() => navigate('/operationstaff/settings')}
        />
        <SidebarStaff.MenuItem
          icon={<IoHelpCircleOutline />}
          label="Support"
          active={location.pathname === '/operationstaff/support'}
          onClick={() => navigate('/operationstaff/support')}
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

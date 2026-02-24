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
import { TbTruckDelivery } from 'react-icons/tb'
import { FaBoxesPacking } from 'react-icons/fa6'
import { useOrderCountStore } from '@/store/orderCount.store'

export default function OperationLayout() {
  const location = useLocation()
  const { counts } = useOrderCountStore()

  // Hiện "0" ngay khi load, sau đó cập nhật từ API
  const allBadge = String(counts.all)
  const technicalBadge = String(counts.technical)
  const logisticsBadge = String(counts.logistics)
  const packingBadge = String(counts.packing)
  const completedBadge = String(counts.completed)

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
          badge={allBadge}
          badgeVariant="primary"
        />
        <SidebarStaff.MenuItem
          icon={<IoBuildOutline />}
          label="Technical Stati..."
          to="/operationstaff/prescription-orders"
          active={location.pathname === '/operationstaff/prescription-orders'}
          badge={technicalBadge}
          badgeVariant="primary"
        />
        <SidebarStaff.MenuItem
          icon={<IoCarOutline />}
          label="Logistics Waiti..."
          to="/operationstaff/pre-orders"
          active={location.pathname === '/operationstaff/pre-orders'}
          badge={logisticsBadge}
          badgeVariant="primary"
        />
        <SidebarStaff.MenuItem
          icon={<FaBoxesPacking />}
          label="Packing Station"
          to="/operationstaff/packing"
          active={location.pathname === '/operationstaff/packing'}
          badge={packingBadge}
          badgeVariant="primary"
        />
        <SidebarStaff.MenuItem
          icon={<TbTruckDelivery />}
          label="Complete Ord..."
          to="/operationstaff/delivery-orders"
          active={location.pathname === '/operationstaff/delivery-orders'}
          badge={completedBadge}
          badgeVariant="primary"
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

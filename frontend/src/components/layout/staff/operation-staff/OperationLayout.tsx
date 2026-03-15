import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { STORAGE_KEYS } from '@/shared/constants/storage'
import { StaffMainLayout } from '@/components/layout/staff/staff-core/main-layout/StaffMainLayout'
import { SidebarStaff, UserWidgetWithLogout, ThemeToggle, NavActions } from '@/components/staff'
import OperationNavSearch from '@/components/layout/staff/operation-staff/OperationNavSearch'
import {
  IoGridOutline,
  IoReceipt,
  IoCarOutline,
  IoSettingsOutline,
  IoHelpCircleOutline,
  IoBuildOutline,
  IoAirplaneOutline,
  IoArchiveOutline
} from 'react-icons/io5'
import { FaBoxesPacking } from 'react-icons/fa6'
import { useOrderCountStore } from '@/store'
import { AiOutlineFileDone } from 'react-icons/ai'
import { useAllOrders, useCompletedOrders } from '@/features/staff/hooks/orders/useOrders'
import { transformApiOrderToTableOrder } from '@/shared/components/staff/staff-core/order-table/order-utils'
import { useAuthStore } from '@/store/auth.store'
import { useStaffLayoutProfile } from '@/features/staff/hooks/useStaffLayoutProfile'
import { OrderType } from '@/shared/utils/enums/order.enum'

export default function OperationLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const {
    counts,
    initializeCounts,
    setOrders,
    setLoadingState,
    setCount,
    setCompletedLoadingState
  } = useOrderCountStore()

  const { setUser } = useAuthStore()
  const { userName, userRole, userInitials, userEmail, profile } = useStaffLayoutProfile()

  useEffect(() => {
    if (profile) {
      setUser(profile)
    }
  }, [profile, setUser])

  const { data: ordersData, isLoading, isError, error } = useAllOrders()

  const { data: completedData, isLoading: isLoadingCompleted } = useCompletedOrders()

  useEffect(() => {
    setLoadingState(isLoading, isError)

    if (ordersData) {
      const apiOrders = ordersData?.data?.orders?.data || []

      const transformedOrders = apiOrders.map(transformApiOrderToTableOrder)

      const filteredOrders = transformedOrders.filter(
        (o) => !(o.orderType === OrderType.PRE_ORDER && o.currentStatus === 'WAITING_STOCK')
      )

      setOrders(filteredOrders)

      initializeCounts(filteredOrders)
    }
    if (isError) {
      console.error('Error when calling API:', error)
    }
  }, [ordersData, isLoading, isError, error, initializeCounts, setOrders, setLoadingState])

  useEffect(() => {
    setCompletedLoadingState(isLoadingCompleted)

    if (completedData) {
      const completedOrders = completedData?.data?.orders?.data || []

      setCount('completed', completedOrders.length)
    }
  }, [completedData, isLoadingCompleted, setCount, setCompletedLoadingState])

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
          <div className="w-8 h-8 bg-mint-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">O</span>
          </div>
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
      <SidebarStaff.MenuSection label="WORK STATIONS">
        <SidebarStaff.MenuItem
          icon={<IoGridOutline />}
          label="Dashboard"
          active={location.pathname === '/operation-staff/dashboard'}
          onClick={() => navigate('/operation-staff/dashboard')}
        />
        <SidebarStaff.MenuItem
          icon={<IoReceipt />}
          label="All Orders"
          active={location.pathname === '/operation-staff/all'}
          onClick={() => navigate('/operation-staff/all')}
          badge={counts.all.toString()}
          isLoading={isLoading}
        />
        <SidebarStaff.MenuItem
          icon={<IoBuildOutline />}
          label="Technical Stations"
          active={location.pathname === '/operation-staff/prescription-orders'}
          onClick={() => navigate('/operation-staff/prescription-orders')}
          badge={counts.technical.toString()}
          isLoading={isLoading}
        />
        <SidebarStaff.MenuItem
          icon={<IoCarOutline />}
          label="Logistics Waiting Station"
          active={location.pathname === '/operation-staff/pre-orders'}
          onClick={() => navigate('/operation-staff/pre-orders')}
          badge={counts.logistics.toString()}
          isLoading={isLoading}
        />
        <SidebarStaff.MenuItem
          icon={<FaBoxesPacking />}
          label="Packing Station"
          active={location.pathname === '/operation-staff/packing'}
          onClick={() => navigate('/operation-staff/packing')}
          badge={counts.packing.toString()}
          isLoading={isLoading}
        />
        <SidebarStaff.MenuItem
          icon={<AiOutlineFileDone />}
          label="Complete Orders"
          active={location.pathname === '/operation-staff/packed-success'}
          onClick={() => navigate('/operation-staff/packed-success')}
          badge={counts.completed.toString()}
          isLoading={isLoadingCompleted}
        />
        <SidebarStaff.MenuItem
          icon={<IoAirplaneOutline />}
          label="Shipping Handover"
          active={location.pathname === '/operation-staff/shipping-handover'}
          onClick={() => navigate('/operation-staff/shipping-handover')}
        />
        <SidebarStaff.MenuItem
          icon={<IoArchiveOutline />}
          label="Inventory Receiving"
          active={location.pathname.startsWith('/operation-staff/inventory-receiving')}
          onClick={() => navigate('/operation-staff/inventory-receiving')}
        />
      </SidebarStaff.MenuSection>

      <SidebarStaff.MenuSection label="TOOLS">
        <SidebarStaff.MenuItem
          icon={<IoSettingsOutline />}
          label="Settings"
          active={location.pathname === '/operation-staff/settings'}
          onClick={() => navigate('/operation-staff/settings')}
        />
        <SidebarStaff.MenuItem
          icon={<IoHelpCircleOutline />}
          label="Support"
          active={location.pathname === '/operation-staff/support'}
          onClick={() => navigate('/operation-staff/support')}
        />
        <ThemeToggle />
      </SidebarStaff.MenuSection>
    </SidebarStaff>
  )

  return (
    <StaffMainLayout
      sidebar={sidebar}
      headerLeft={<OperationNavSearch />}
      headerRight={
        <NavActions
          userName={userName}
          userRole={userRole}
          userInitials={userInitials}
          userEmail={userEmail}
        />
      }
      mainClassName="px-4 md:px-8 lg:px-10 py-8 bg-mint-200 relative overflow-x-hidden"
      headerContainerClassName="px-4 md:px-8 lg:pl-10 lg:pr-6"
      headerContainerWidth="none"
    />
  )
}

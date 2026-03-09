import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { STORAGE_KEYS } from '@/shared/constants/storage'
import { StaffMainLayout } from '@/components/layout/staff/staff-core/main-layout/StaffMainLayout'
import { SidebarStaff, UserWidgetWithLogout, ThemeToggle, NavActions } from '@/components/staff'
import OperationNavSearch from '@/components/layout/staff/operationstaff/OperationNavSearch'
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
import { transformApiOrderToTableOrder } from '@/features/staff/components/OrderTable/orderTransformers'
import { useAuthStore } from '@/store/auth.store'
import { useStaffLayoutProfile } from '@/features/staff/hooks/useStaffLayoutProfile'

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

  // Gọi API để lấy số lượng đơn hàng để xíu lọc theo từng trạng thái
  const { data: ordersData, isLoading, isError, error } = useAllOrders()

  // Gọi API riêng để lấy số đơn hàng COMPLETED
  const { data: completedData, isLoading: isLoadingCompleted } = useCompletedOrders()

  useEffect(() => {
    // Set loading và error states vào store
    setLoadingState(isLoading, isError)

    if (ordersData) {
      // Transform data từ API sang format UI
      const apiOrders = ordersData?.data?.orders?.data || []

      // Transform order để nhét vô OrderTable á
      const transformedOrders = apiOrders.map(transformApiOrderToTableOrder)

      // Lưu orders vào Zustand store để các trang khác dùng
      setOrders(transformedOrders)

      // Initialize counts vào Zustand store
      initializeCounts(transformedOrders)
    }
    if (isError) {
      console.error('Error when calling API:', error)
    }
  }, [ordersData, isLoading, isError, error, initializeCounts, setOrders, setLoadingState])

  useEffect(() => {
    // Set loading state cho completed
    setCompletedLoadingState(isLoadingCompleted)

    if (completedData) {
      const completedOrders = completedData?.data?.orders?.data || []
      // Set count cho completed orders
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

  // (using hook values instead of manual computation)

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
          active={location.pathname === '/operationstaff/dashboard'}
          onClick={() => navigate('/operationstaff/dashboard')}
        />
        <SidebarStaff.MenuItem
          icon={<IoReceipt />}
          label="All Orders"
          active={location.pathname === '/operationstaff/all'}
          onClick={() => navigate('/operationstaff/all')}
          badge={counts.all.toString()}
          isLoading={isLoading}
        />
        <SidebarStaff.MenuItem
          icon={<IoBuildOutline />}
          label="Technical Stations"
          active={location.pathname === '/operationstaff/prescription-orders'}
          onClick={() => navigate('/operationstaff/prescription-orders')}
          badge={counts.technical.toString()}
          isLoading={isLoading}
        />
        <SidebarStaff.MenuItem
          icon={<IoCarOutline />}
          label="Logistics Waiting Station"
          active={location.pathname === '/operationstaff/pre-orders'}
          onClick={() => navigate('/operationstaff/pre-orders')}
          badge={counts.logistics.toString()}
          isLoading={isLoading}
        />
        <SidebarStaff.MenuItem
          icon={<FaBoxesPacking />}
          label="Packing Station"
          active={location.pathname === '/operationstaff/packing'}
          onClick={() => navigate('/operationstaff/packing')}
          badge={counts.packing.toString()}
          isLoading={isLoading}
        />
        <SidebarStaff.MenuItem
          icon={<AiOutlineFileDone />}
          label="Complete Orders"
          active={location.pathname === '/operationstaff/packed-success'}
          onClick={() => navigate('/operationstaff/packed-success')}
          badge={counts.completed.toString()}
          isLoading={isLoadingCompleted}
        />
        <SidebarStaff.MenuItem
          icon={<IoAirplaneOutline />}
          label="Shipping Handover"
          active={location.pathname === '/operationstaff/shipping-handover'}
          onClick={() => navigate('/operationstaff/shipping-handover')}
        />
        <SidebarStaff.MenuItem
          icon={<IoArchiveOutline />}
          label="Inventory Receiving"
          active={location.pathname.startsWith('/operationstaff/inventory-receiving')}
          onClick={() => navigate('/operationstaff/inventory-receiving')}
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
      headerLeft={<OperationNavSearch />}
      headerRight={
        <NavActions
          userName={userName}
          userRole={userRole}
          userInitials={userInitials}
          userEmail={userEmail}
        />
      }
      mainClassName="p-4 md:p-8 bg-mint-200 relative overflow-x-hidden"
    />
  )
}

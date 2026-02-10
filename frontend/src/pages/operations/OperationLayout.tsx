import { useEffect } from 'react'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { STORAGE_KEYS } from '@/shared/constants/storage'
import { useLayoutStore } from '@/store/layout.store'
import { cn } from '@/lib/utils'
import { StaffHeader } from '@/components/layout/staff/staff-core/header'
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
  IoBuildOutline,
  IoAirplaneOutline
} from 'react-icons/io5'
import { FaBoxesPacking } from 'react-icons/fa6'
import { useOrderCountStore } from '@/store'
import { AiOutlineFileDone } from 'react-icons/ai'
import { useAllOrders, useCompletedOrders } from '@/features/staff/hooks/orders/useOrders'
import { transformApiOrderToTableOrder } from '@/features/staff/components/OrderTable/orderTransformers'

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

  // Gọi API để lấy số lượng đơn hàng cho từng trạng thái
  const { data, isLoading, isError, error } = useAllOrders()

  // Gọi API riêng để lấy số đơn hàng COMPLETED
  const { data: completedData, isLoading: isLoadingCompleted } = useCompletedOrders()

  useEffect(() => {
    // Set loading và error states vào store
    setLoadingState(isLoading, isError)

    if (data) {
      console.log('Lấy thông tin từ order thành công:')
      // Transform data từ API sang format UI
      const apiOrders = data?.data?.orders?.data || []

      // Transform order để nhét vô OrderTable á
      const transformedOrders = apiOrders.map(transformApiOrderToTableOrder)

      // Lưu orders vào Zustand store để các trang khác dùng
      setOrders(transformedOrders)

      // Initialize counts vào Zustand store
      initializeCounts(transformedOrders)
    }
    if (isError) {
      console.error('Lỗi API:', error)
    }
  }, [data, isLoading, isError, error, initializeCounts, setOrders, setLoadingState])

  // Effect riêng để xử lý completed orders
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
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_INFO)
    navigate('/admin/login')
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
          userInitials="SL"
          userName="Dr. Sarah L."
          userRole="Head Optometrist"
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
          badge={counts.all > 0 ? counts.all.toString() : undefined}
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
          badge={counts.logistics > 0 ? counts.logistics.toString() : undefined}
          isLoading={isLoading}
        />
        <SidebarStaff.MenuItem
          icon={<FaBoxesPacking />}
          label="Packing Station"
          active={location.pathname === '/operationstaff/packing'}
          onClick={() => navigate('/operationstaff/packing')}
          badge={counts.packing > 0 ? counts.packing.toString() : undefined}
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
          active={location.pathname === '/operationstaff/packed-success'}
          onClick={() => navigate('/operationstaff/support')}
        />
        <ThemeToggle />
      </SidebarStaff.MenuSection>
    </SidebarStaff>
  )

  // Inline StaffMainLayout interactions
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore()

  return (
    <div className="flex h-screen bg-white">
      {sidebar}

      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-neutral-900/40 z-40 lg:hidden animate-in fade-in duration-200"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300 overflow-x-hidden',
          'ml-0',
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        )}
      >
        <StaffHeader
          left={<NavSearch placeholder="Search orders..." styleVariant="operation" />}
          right={<NavActions />}
          containerWidth="100%"
        />

        <main className="h-full overflow-auto p-4 md:p-8 bg-mint-200 relative overflow-x-hidden">
          <div key={location.pathname} className="animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
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
  IoBuildOutline,
  IoAirplaneOutline
} from 'react-icons/io5'
import { FaBoxesPacking } from 'react-icons/fa6'
import { useOrderCountStore } from '@/store'
import { AiOutlineFileDone } from 'react-icons/ai'
import { useAllOrders, useCompletedOrders } from '@/features/staff/hooks/orders/useOrders'
import { transformApiOrderToTableOrder } from '@/features/staff/components/OrderTable/orderTransformers'
import { useAuthStore } from '@/store/auth.store'
import { useProfile } from '@/features/staff/hooks/useProfile'
import type { AdminAccount } from '@/shared/types'

export default function OperationLayout() {
  const location = useLocation()

  const {
    counts,
    initializeCounts,
    setOrders,
    setLoadingState,
    setCount,
    setCompletedLoadingState
  } = useOrderCountStore()

  // Gọi API để hiển thị avt thông qua Zustand store
  const { user, setUser } = useAuthStore()
  const { data: profileData } = useProfile()
  const profile = user as AdminAccount | null

  useEffect(() => {
    // Sync data from React Query to Zustand Store
    if (profileData?.data) {
      setUser(profileData.data)
    }
  }, [profileData, setUser])

  // Gọi API để lấy số lượng đơn hàng cho từng trạng thái
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
      console.error('Lỗi API:', error)
    }
  }, [ordersData, isLoading, isError, error, initializeCounts, setOrders, setLoadingState])

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

  // Lấy thông tin profile từ store
  const userInitials = profile?.name
    ? profile.name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'OP'
  const userName = profile?.name || 'Loading...'
  const userRole = profile?.role || 'Staff'

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
        <UserWidgetWithLogout userInitials={userInitials} userName={userName} userRole={userRole} />
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
          badge={counts.all > 0 ? counts.all.toString() : undefined}
          isLoading={isLoading}
        />
        <SidebarStaff.MenuItem
          icon={<IoBuildOutline />}
          label="Technical Stations"
          to="/operationstaff/prescription-orders"
          active={location.pathname === '/operationstaff/prescription-orders'}
          badge={counts.technical.toString()}
          isLoading={isLoading}
        />
        <SidebarStaff.MenuItem
          icon={<IoCarOutline />}
          label="Logistics Waiting Station"
          to="/operationstaff/pre-orders"
          active={location.pathname === '/operationstaff/pre-orders'}
          badge={counts.logistics > 0 ? counts.logistics.toString() : undefined}
          isLoading={isLoading}
        />
        <SidebarStaff.MenuItem
          icon={<FaBoxesPacking />}
          label="Packing Station"
          to="/operationstaff/packing"
          active={location.pathname === '/operationstaff/packing'}
          badge={counts.packing > 0 ? counts.packing.toString() : undefined}
          isLoading={isLoading}
        />
        <SidebarStaff.MenuItem
          icon={<AiOutlineFileDone />}
          label="Complete Orders"
          to="/operationstaff/packed-success"
          active={location.pathname === '/operationstaff/packed-success'}
          badge={counts.completed.toString()}
          isLoading={isLoadingCompleted}
        />
        <SidebarStaff.MenuItem
          icon={<IoAirplaneOutline />}
          label="Shipping Handover"
          to="/operationstaff/shipping-handover"
          active={location.pathname === '/operationstaff/shipping-handover'}
        />
      </SidebarStaff.MenuSection>

      <SidebarStaff.MenuSection label="TOOLS">
        <SidebarStaff.MenuItem
          icon={<IoSettingsOutline />}
          label="Settings"
          to="/operationstaff/settings"
          active={location.pathname === '/operationstaff/settings'}
        />
        <SidebarStaff.MenuItem
          icon={<IoHelpCircleOutline />}
          label="Support"
          to="/operationstaff/support"
          active={location.pathname === '/operationstaff/support'}
        />
        <ThemeToggle />
      </SidebarStaff.MenuSection>
    </SidebarStaff>
  )

  return (
    <StaffMainLayout
      sidebar={sidebar}
      headerLeft={<NavSearch placeholder="Search orders..." styleVariant="operation" />}
      headerRight={
        <NavActions
          userName={userName}
          userRole={userRole}
          userInitials={userInitials}
          userEmail={profile?.email || ''}
        />
      }
      mainClassName="px-4 md:px-8 lg:px-10 py-6 md:py-8 bg-white"
      headerContainerClassName="px-4 md:px-8 lg:px-10"
      headerContainerWidth="max-w-[1600px]"
      contentMaxWidth="max-w-[1600px]"
    />
  )
}

import { create } from 'zustand'
import type { Order } from '@/features/staff/components/OrderTable/OrderTable'
import { OrderType, OrderStatus } from '@/shared/utils/enums/order.enum'

interface OrderCountStore {
  counts: {
    technical: number // Số đơn Manufacturing
    logistics: number // Số đơn Pre-order
    packing: number // Số đơn đang PACKING
    all: number
    completed: number
  }
  orders: Order[] // Lưu toàn bộ orders từ API
  setOrders: (orders: Order[]) => void // Action để set orders
  isLoading: boolean // Trạng thái đang fetch data
  isError: boolean // Trạng thái lỗi khi fetch
  isLoadingCompleted: boolean // Trạng thái đang fetch completed orders
  setLoadingState: (isLoading: boolean, isError: boolean) => void // Set loading/error states
  setCompletedLoadingState: (isLoading: boolean) => void // Set loading state cho completed
  setCount: (
    type: 'technical' | 'logistics' | 'packing' | 'all' | 'completed',
    count: number
  ) => void
  initializeCounts: (orders: { orderType: string; currentStatus: string }[]) => void
  resetCounts: () => void
}

export const useOrderCountStore = create<OrderCountStore>((set) => ({
  counts: {
    technical: 0,
    logistics: 0,
    packing: 0,
    all: 0,
    completed: 0
  },

  orders: [],
  isLoading: false,
  isError: false,
  isLoadingCompleted: false,

  setOrders: (orders) => set({ orders }), // Action để set orders

  setLoadingState: (isLoading, isError) => set({ isLoading, isError }),

  setCompletedLoadingState: (isLoading) => set({ isLoadingCompleted: isLoading }),

  setCount: (type, count) =>
    set((state) => ({
      counts: {
        ...state.counts,
        [type]: count
      }
    })),
  initializeCounts: (orders) => {
    // Technical Station: chỉ đếm đơn có type = MANUFACTURING VÀ status = MAKING
    const technical = orders.filter(
      (o) => o.orderType === OrderType.MANUFACTURING && o.currentStatus === OrderStatus.MAKING
    ).length
    const logistics = orders.filter((o) => o.orderType === OrderType.PRE_ORDER).length
    // const all = orders.length
    // const completed = orders.filter((o) => o.currentStatus === OrderStatus.COMPLETED).length
    const packing = orders.filter((o) => o.currentStatus === OrderStatus.PACKAGING).length

    set((state) => ({
      counts: {
        technical,
        logistics,
        packing,
        all: orders.length,
        completed: state.counts.completed //  Giữ nguyên giá trị completed hiện tại
      }
    }))
  },
  resetCounts: () =>
    set({
      counts: {
        technical: 0,
        logistics: 0,
        packing: 0,
        all: 0,
        completed: 0
      }
    })
}))

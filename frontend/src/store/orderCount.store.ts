import { create } from 'zustand'
// ========== START NEW CODE ==========
import type { Order } from '@/features/staff/components/OrderTable/OrderTable'
import { OrderType, OrderStatus } from '@/shared/utils/enums/order.enum'
// ========== END NEW CODE ==========

interface OrderCountStore {
  counts: {
    technical: number // Số đơn Manufacturing
    logistics: number // Số đơn Pre-order
    packing: number // Số đơn có status packing
    all: number
    completed: number
  }
  orders: Order[] // Lưu toàn bộ orders từ API
  setOrders: (orders: Order[]) => void // Action để set orders
  isLoading: boolean // Trạng thái đang fetch data
  isError: boolean // Trạng thái lỗi khi fetch
  setLoadingState: (isLoading: boolean, isError: boolean) => void // Set loading/error states
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

  orders: [], // Khởi tạo empty array
  isLoading: false, // Mặc định không loading
  isError: false, // Mặc định không có lỗi

  setOrders: (orders) => set({ orders }), // Action để set orders

  setLoadingState: (isLoading, isError) => set({ isLoading, isError }),

  setCount: (type, count) =>
    set((state) => ({
      counts: {
        ...state.counts,
        [type]: count
      }
    })),
  initializeCounts: (orders) => {
    const technical = orders.filter((o) => o.orderType === OrderType.MANUFACTURING).length
    const logistics = orders.filter((o) => o.orderType === OrderType.PRE_ORDER).length
    // const all = orders.length
    // const completed = orders.filter((o) => o.currentStatus === OrderStatus.COMPLETED).length
    const packing = orders.filter((o) => o.currentStatus === OrderStatus.PACKAGING).length

    set({
      counts: {
        technical,
        logistics,
        packing,
        all: orders.length,
        completed: 0
      }
    })
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

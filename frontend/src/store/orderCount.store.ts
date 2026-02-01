import { create } from 'zustand'
// ========== START NEW CODE ==========
import type { Order } from '@/features/staff/components/OrderTable/OrderTable'
// ========== END NEW CODE ==========

interface OrderCountStore {
  counts: {
    technical: number // Số đơn Prescription
    logistics: number // Số đơn Pre-order
    packing: number // Số đơn có status packing
    all: number
    completed: number
  }
  // ========== START NEW CODE ==========
  orders: Order[] // Lưu toàn bộ orders từ API
  setOrders: (orders: Order[]) => void // Action để set orders
  // ========== END NEW CODE ==========
  setCount: (
    type: 'technical' | 'logistics' | 'packing' | 'all' | 'completed',
    count: number
  ) => void
  initializeCounts: (orders: { orderType: string }[]) => void
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
  // ========== START NEW CODE ==========
  orders: [], // Khởi tạo empty array
  setOrders: (orders) => set({ orders }), // Action để set orders
  // ========== END NEW CODE ==========
  setCount: (type, count) =>
    set((state) => ({
      counts: {
        ...state.counts,
        [type]: count
      }
    })),
  initializeCounts: (orders) => {
    const technical = orders.filter((o) => o.orderType === 'Manufacturing').length
    const logistics = orders.filter((o) => o.orderType === 'Pre-order').length
    const all = orders.length
    const completed = orders.filter((o) => o.orderType === 'Completed').length
    const packing = orders.filter((o) => o.orderType === 'Packing').length

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

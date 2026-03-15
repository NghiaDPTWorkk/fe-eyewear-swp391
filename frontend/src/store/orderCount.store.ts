import { create } from 'zustand'
import type { Order } from '@/shared/components/staff/staff-core/order-table/order-utils'
import { OrderType, OrderStatus } from '@/shared/utils/enums/order.enum'

interface OrderCountStore {
  counts: {
    technical: number
    logistics: number
    packing: number
    all: number
    completed: number
    assigned: number
    normal: number
  }
  orders: Order[]
  setOrders: (orders: Order[]) => void
  isLoading: boolean
  isError: boolean
  isLoadingCompleted: boolean
  setLoadingState: (isLoading: boolean, isError: boolean) => void
  setCompletedLoadingState: (isLoading: boolean) => void
  setCount: (
    type: 'technical' | 'logistics' | 'packing' | 'all' | 'completed' | 'assigned',
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
    completed: 0,
    assigned: 0,
    normal: 0
  },

  orders: [],
  isLoading: false,
  isError: false,
  isLoadingCompleted: false,

  setOrders: (orders) => set({ orders }),

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
    const technical = orders.filter(
      (o) => o.orderType === OrderType.MANUFACTURING && o.currentStatus === OrderStatus.MAKING
    ).length
    const logistics = orders.filter(
      (o) => o.orderType === OrderType.PRE_ORDER && o.currentStatus !== 'WAITING_STOCK'
    ).length

    const packing = orders.filter((o) => o.currentStatus === OrderStatus.PACKAGING).length
    const assigned = orders.filter((o) => o.currentStatus === OrderStatus.ASSIGNED).length
    const normal = orders.filter((o) => o.orderType === OrderType.NORMAL).length

    set((state) => ({
      counts: {
        technical,
        logistics,
        packing,
        all: orders.length,
        completed: state.counts.completed,
        assigned,
        normal
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
        completed: 0,
        assigned: 0,
        normal: 0
      }
    })
}))

import { create } from 'zustand'

interface OrderCountStore {
  counts: {
    technical: number // Số đơn Prescription
    logistics: number // Số đơn Pre-order
    packing: number // Số đơn có status packing
  }
  setCount: (type: 'technical' | 'logistics' | 'packing', count: number) => void
  initializeCounts: (orders: { orderType: string }[]) => void
  resetCounts: () => void
}

export const useOrderCountStore = create<OrderCountStore>((set) => ({
  counts: {
    technical: 0,
    logistics: 0,
    packing: 0
  },
  setCount: (type, count) =>
    set((state) => ({
      counts: {
        ...state.counts,
        [type]: count
      }
    })),
  initializeCounts: (orders) => {
    const technical = orders.filter((o) => o.orderType === 'Prescription').length
    const logistics = orders.filter((o) => o.orderType === 'Pre-order').length
    const packing = orders.length // Tất cả đơn

    set({
      counts: {
        technical,
        logistics,
        packing
      }
    })
  },
  resetCounts: () =>
    set({
      counts: {
        technical: 0,
        logistics: 0,
        packing: 0
      }
    })
}))

import { useCallback } from 'react'

export interface SimpleStatus {
  label: 'REJECTED' | 'ACCEPTED' | 'NEED VERIFY'
  className: string
}

export const useOrderStatus = () => {
  const getSimplifiedStatus = useCallback((statusStr: string): SimpleStatus => {
    const status = (statusStr || 'PENDING').toUpperCase()

    // List of rejected states
    const isRejected = ['REJECT', 'REJECTED', 'CANCELED'].includes(status)

    if (isRejected) {
      return {
        label: 'REJECTED',
        className: 'bg-rose-50 text-rose-600 border-rose-100'
      }
    }

    // List of accepted/verified states
    const isAccepted = [
      'VERIFIED',
      'APPROVE',
      'APPROVED',
      'WAITING_ASSIGN',
      'ASSIGNED',
      'MAKING',
      'PACKAGING',
      'COMPLETED',
      'ONBOARD',
      'DELIVERED',
      'DELIVERING',
      'SHIPPED',
      'PROCESSING'
    ].includes(status)

    if (isAccepted) {
      return {
        label: 'ACCEPTED',
        className: 'bg-emerald-50 text-emerald-600 border-emerald-100'
      }
    }

    // Default: Needs manual verification
    return {
      label: 'NEED VERIFY',
      className: 'bg-amber-50 text-amber-600 border-amber-100'
    }
  }, [])

  return { getSimplifiedStatus }
}

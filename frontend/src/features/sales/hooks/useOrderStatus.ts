import { useCallback } from 'react'
import { OrderStatus } from '@/shared/utils/enums/order.enum'

export interface SimpleStatus {
  label: 'REJECTED' | 'ACCEPTED' | 'NEED VERIFY'
  className: string
}

export const useOrderStatus = () => {
  const getSimplifiedStatus = useCallback((statusStr: string): SimpleStatus => {
    const status = (statusStr || OrderStatus.PENDING).toUpperCase()

    const isRejected = [OrderStatus.REJECT, OrderStatus.REJECTED, OrderStatus.CANCELED].includes(
      status as OrderStatus
    )

    if (isRejected) {
      return {
        label: 'REJECTED',
        className: 'bg-rose-50 text-rose-600 border-rose-100'
      }
    }

    const isAccepted = [
      OrderStatus.VERIFIED,
      OrderStatus.APPROVE,
      OrderStatus.APPROVED,
      OrderStatus.WAITING_ASSIGN,
      OrderStatus.ASSIGNED,
      OrderStatus.MAKING,
      OrderStatus.PACKAGING,
      OrderStatus.COMPLETED,
      OrderStatus.ONBOARD,
      OrderStatus.DELIVERED,
      OrderStatus.DELIVERING,
      OrderStatus.SHIPPED,
      OrderStatus.PROCESSING
    ].includes(status as OrderStatus)

    if (isAccepted) {
      return {
        label: 'ACCEPTED',
        className: 'bg-emerald-50 text-emerald-600 border-emerald-100'
      }
    }

    return {
      label: 'NEED VERIFY',
      className: 'bg-amber-50 text-amber-600 border-amber-100'
    }
  }, [])

  return { getSimplifiedStatus }
}

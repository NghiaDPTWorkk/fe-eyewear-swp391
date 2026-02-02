import React from 'react'
import { Button } from '@/components'
import type { Order } from '../../types'

interface SalesStaffRxActionsProps {
  order: Order
  onVerify: () => void
  onReject: () => void
}

export const SalesStaffRxActions: React.FC<SalesStaffRxActionsProps> = ({
  order,
  onVerify,
  onReject
}) => {
  if (order.status !== 'WAITING_ASSIGNED') {
    return (
      <span className="px-3 py-1 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
        Verified
      </span>
    )
  }

  return (
    <div className="flex gap-2 justify-center">
      <Button
        size="sm"
        className="bg-primary-500 hover:bg-primary-600 text-white text-[11px] font-bold px-3 py-1 rounded-lg"
        onClick={(e) => {
          e.stopPropagation()
          onVerify()
        }}
      >
        Verify
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-red-100 text-red-500 hover:bg-red-50 text-[11px] font-bold px-3 py-1 rounded-lg"
        onClick={(e) => {
          e.stopPropagation()
          onReject()
        }}
      >
        Reject
      </Button>
    </div>
  )
}

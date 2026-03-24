import React, { useState } from 'react'
import { IoConstructOutline, IoMailOutline } from 'react-icons/io5'
import { Button, Card } from '@/shared/components/ui-core'
import { cn } from '@/lib/utils'
import { ExpediteRequestModal } from '../lab/ExpediteRequestModal'

interface LabOperationsTimelineProps {
  order?: any
}

export const LabOperationsTimeline: React.FC<LabOperationsTimelineProps> = ({ order }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const status = order?.status?.toUpperCase() || 'PENDING'

  const formatTime = (date?: string | Date) => {
    if (!date) return null
    try {
      return new Date(date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    } catch {
      return null
    }
  }

  const stages = [
    {
      key: 'ORDERED',
      label: 'Order Created',
      desc: order.createdAt ? `Placed at ${formatTime(order.createdAt)}` : 'New order initialized',
      isCompleted: status !== 'PENDING' && status !== 'CANCELED',
      isActive: status === 'PENDING',
      color: 'bg-slate-500'
    },
    {
      key: 'PAID',
      label: 'Payment Confirmed',
      desc: order.depositedAt ? `Paid at ${formatTime(order.depositedAt)}` : 'Deposit verified',
      isCompleted: !['PENDING', 'DEPOSITED', 'CANCELED'].includes(status),
      isActive:
        status === 'DEPOSITED' && !['WAITING_VERIFY', 'VERIFIED', 'APPROVED'].includes(status),
      color: 'bg-amber-500'
    },
    {
      key: 'VERIFIED',
      label: 'Sales Verified',
      desc: order.approvedAt
        ? `Verified at ${formatTime(order.approvedAt)}`
        : 'Checking prescription',
      isCompleted: !['PENDING', 'DEPOSITED', 'WAITING_VERIFY', 'CANCELED'].includes(status),
      isActive: ['WAITING_VERIFY', 'VERIFIED', 'APPROVED', 'DEPOSITED'].includes(status),
      color: 'bg-indigo-500'
    },
    {
      key: 'MAKING',
      label: 'Lens Production',
      desc: order.startedAt ? `Started at ${formatTime(order.startedAt)}` : 'Surfacing and coating',
      isCompleted: ![
        'PENDING',
        'DEPOSITED',
        'WAITING_VERIFY',
        'ASSIGNED',
        'WAITING_ASSIGN',
        'VERIFIED',
        'APPROVED',
        'CANCELED'
      ].includes(status),
      isActive: ['ASSIGNED', 'MAKING', 'WAITING_ASSIGN'].includes(status),
      color: 'bg-blue-500'
    },
    {
      key: 'PACKAGING',
      label: 'Quality Control',
      desc: order.packagingAt
        ? `Inspected at ${formatTime(order.packagingAt)}`
        : 'Finalizing order',
      isCompleted: ['COMPLETED', 'ONBOARD', 'SHIPPED', 'DELIVERED'].includes(status),
      isActive: status === 'PACKAGING',
      color: 'bg-purple-500'
    },
    {
      key: 'SHIPPING',
      label: 'Ready for Pickup',
      desc: order.completedAt ? `Completed at ${formatTime(order.completedAt)}` : 'Order ready',
      isCompleted: ['ONBOARD', 'SHIPPED', 'DELIVERED'].includes(status),
      isActive: status === 'COMPLETED',
      color: 'bg-emerald-500'
    }
  ]

  const mappedOrder = {
    ...(order || {}),
    orderCode: order?.orderCode || `#${order?._id?.slice(-6) || 'N/A'}`,
    station: stages.find((s) => s.isActive)?.label || 'Completed',
    stationColor:
      stages.find((s) => s.isActive)?.color.replace('bg-', 'text-') || 'text-emerald-600'
  }

  return (
    <>
      <Card className="p-0 border border-gray-200 shadow-sm overflow-hidden rounded-xl bg-white animate-in fade-in duration-500">
        <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <IoConstructOutline className="text-slate-400" /> Lab Operations
          </h3>
          <span
            className={cn(
              'w-2 h-2 rounded-full animate-pulse',
              status === 'CANCELED' || status === 'REJECTED' ? 'bg-rose-500' : 'bg-mint-500'
            )}
          ></span>
        </div>

        <div className="p-5 space-y-5">
          {}
          <div className="relative border-l border-slate-100 ml-2 space-y-6 py-1">
            {stages.map((stage, index) => {
              const isDone = stage.isCompleted
              const isCurrent = stage.isActive

              return (
                <div key={index} className="pl-6 relative">
                  <div
                    className={cn(
                      'absolute -left-[5.5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white transition-all duration-500',
                      isDone
                        ? 'bg-emerald-500 shadow-sm ring-4 ring-emerald-50'
                        : isCurrent
                          ? `${stage.color} shadow-sm ring-4 ring-slate-50`
                          : 'bg-slate-200'
                    )}
                  />
                  <div>
                    <p
                      className={cn(
                        'text-[11px] font-semibold tracking-tight transition-colors duration-300',
                        isDone
                          ? 'text-emerald-600'
                          : isCurrent
                            ? 'text-slate-800'
                            : 'text-slate-400'
                      )}
                    >
                      {stage.label}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium leading-relaxed">
                      {isCurrent ? 'Currently in progress' : stage.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="p-4 bg-slate-50/30 border-t border-slate-50 flex flex-col gap-3">
          <Button
            variant="ghost"
            onClick={() => setIsModalOpen(true)}
            className="w-full text-[10px] font-bold text-slate-400 hover:text-amber-600 hover:bg-amber-50/50 transition-all uppercase tracking-[0.15em] py-2.5 flex items-center justify-center gap-2 rounded-xl group border-none"
          >
            <IoMailOutline
              size={16}
              className="text-slate-300 group-hover:text-amber-500 transition-colors"
            />
            Contact Lab Manager
          </Button>

          <div className="flex items-center justify-center gap-1.5 opacity-50">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
              Request lab priority ticket
            </span>
          </div>
        </div>
      </Card>

      <ExpediteRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={mappedOrder}
      />
    </>
  )
}

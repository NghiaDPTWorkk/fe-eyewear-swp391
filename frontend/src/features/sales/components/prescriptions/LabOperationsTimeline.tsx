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

  const getStatusRank = (s: string) => {
    switch (s) {
      case 'PENDING':
        return 1
      case 'DEPOSITED':
      case 'WAITING_VERIFY':
      case 'VERIFIED':
      case 'APPROVED':
        return 3
      case 'WAITING_ASSIGN':
      case 'ASSIGNED':
      case 'MAKING':
        return 4
      case 'PACKAGING':
        return 5
      case 'COMPLETED':
      case 'ONBOARD':
      case 'SHIPPED':
      case 'DELIVERED':
        return 6
      default:
        return 0
    }
  }

  const currentRank = getStatusRank(status)

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
      desc: order.createdAt
        ? `Placed at ${formatTime(order.createdAt)}`
        : 'Initial request received',
      rank: 1,
      color: 'bg-slate-500'
    },
    {
      key: 'PAID',
      label: 'Payment Confirmed',
      desc: order.depositedAt
        ? `Paid at ${formatTime(order.depositedAt)}`
        : 'Awaiting payment/deposit',
      rank: 2,
      color: 'bg-amber-500'
    },
    {
      key: 'VERIFIED',
      label: 'Sales Verified',
      desc: order.approvedAt
        ? `Verified at ${formatTime(order.approvedAt)}`
        : 'Prescription assessment',
      rank: 3,
      color: 'bg-indigo-500'
    },
    {
      key: 'MAKING',
      label: 'Lens Production',
      desc: order.startedAt ? `Started at ${formatTime(order.startedAt)}` : 'Manufacturing in lab',
      rank: 4,
      color: 'bg-blue-500'
    },
    {
      key: 'PACKAGING',
      label: 'Quality Control',
      desc: order.packagingAt
        ? `Inspected at ${formatTime(order.packagingAt)}`
        : 'Finalizing order',
      rank: 5,
      color: 'bg-purple-500'
    },
    {
      key: 'SHIPPING',
      label: 'Ready for Pickup',
      desc: order.completedAt ? `Completed at ${formatTime(order.completedAt)}` : 'Order ready',
      rank: 6,
      color: 'bg-emerald-500'
    }
  ]

  const mappedOrder = {
    ...(order || {}),
    orderCode: order?.orderCode || `#${order?._id?.slice(-6) || 'N/A'}`,
    station: stages.find((s) => s.rank === currentRank)?.label || 'Order Received',
    stationColor:
      stages.find((s) => s.rank === currentRank)?.color.replace('bg-', 'text-') || 'text-slate-600'
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
              const isDone = currentRank > stage.rank
              const isCurrent = currentRank === stage.rank

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

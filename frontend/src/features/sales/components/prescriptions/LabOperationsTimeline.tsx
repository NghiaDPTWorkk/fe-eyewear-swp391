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

  const stages = [
    {
      key: 'REVIEW',
      label: 'Technician Review',
      desc: 'Checking lens specifications',
      isCompleted: [
        'WAITING_ASSIGN',
        'ASSIGNED',
        'MAKING',
        'PACKAGING',
        'COMPLETED',
        'ONBOARD',
        'SHIPPED',
        'DELIVERED'
      ].includes(status),
      isActive: ['WAITING_VERIFY', 'PENDING', 'DEPOSITED', 'APPROVED', 'VERIFIED'].includes(status),
      color: 'bg-amber-500'
    },
    {
      key: 'ASSIGNMENT',
      label: 'Staff Assignment',
      desc: 'Assigning to production team',
      isCompleted: [
        'ASSIGNED',
        'MAKING',
        'PACKAGING',
        'COMPLETED',
        'ONBOARD',
        'SHIPPED',
        'DELIVERED'
      ].includes(status),
      isActive: status === 'WAITING_ASSIGN',
      color: 'bg-purple-500'
    },
    {
      key: 'PRODUCTION',
      label: 'Lens Production',
      desc: 'Surfacing and coating process',
      isCompleted: ['PACKAGING', 'COMPLETED', 'ONBOARD', 'SHIPPED', 'DELIVERED'].includes(status),
      isActive: ['ASSIGNED', 'MAKING'].includes(status),
      color: 'bg-blue-500'
    },
    {
      key: 'FINISHED',
      label: 'Quality Control',
      desc: 'Final inspection and packaging',
      isCompleted: ['COMPLETED', 'ONBOARD', 'SHIPPED', 'DELIVERED'].includes(status),
      isActive: status === 'PACKAGING',
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
                      {isDone
                        ? 'Stage completed'
                        : isCurrent
                          ? 'Currently in progress'
                          : stage.desc}
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

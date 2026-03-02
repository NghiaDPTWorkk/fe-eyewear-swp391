import React from 'react'
import { IoFlaskOutline, IoWarningOutline, IoCheckmarkCircleOutline } from 'react-icons/io5'
import { Card } from '@/shared/components/ui-core'

interface LabStatusMetricsProps {
  orders: any[]
}

export const LabStatusMetrics: React.FC<LabStatusMetricsProps> = ({ orders }) => {
  const inProduction = orders.filter(
    (o) => o.station === 'Production' || o.station === 'Assigned'
  ).length
  const urgent = orders.filter((o) => o.urgency === 'High').length
  const readyForQC = orders.filter((o) => o.station === 'Packaging').length

  return (
    <div className="col-span-12 lg:col-span-3 space-y-4">
      <Card className="p-4 border border-neutral-100 flex items-center justify-between bg-white shadow-sm rounded-xl">
        <div>
          <p className="text-[11px] font-semibold text-neutral-400 tracking-wider">In Production</p>
          <h3 className="text-2xl font-semibold text-neutral-900 mt-1">{inProduction}</h3>
        </div>
        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
          <IoFlaskOutline size={20} />
        </div>
      </Card>
      <Card className="p-4 border border-neutral-100 flex items-center justify-between bg-white shadow-sm rounded-xl">
        <div>
          <p className="text-[11px] font-semibold text-neutral-400 tracking-wider">Urgent / High</p>
          <h3 className="text-2xl font-semibold text-neutral-900 mt-1">{urgent}</h3>
        </div>
        <div className="p-2 bg-red-50 text-red-500 rounded-lg">
          <IoWarningOutline size={20} />
        </div>
      </Card>
      <Card className="p-4 border border-neutral-100 flex items-center justify-between bg-white shadow-sm rounded-xl">
        <div>
          <p className="text-[11px] font-semibold text-neutral-400 tracking-wider">
            Packaging / QC
          </p>
          <h3 className="text-2xl font-semibold text-neutral-900 mt-1">{readyForQC}</h3>
        </div>
        <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
          <IoCheckmarkCircleOutline size={20} />
        </div>
      </Card>
    </div>
  )
}

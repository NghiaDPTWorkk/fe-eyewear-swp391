import React from 'react'
import { IoCheckmarkCircleOutline } from 'react-icons/io5'
import { Card } from '@/shared/components/ui'
import { cn } from '@/lib/utils'

interface LensSpecificationsCardProps {
  selectedOrder: any | null
}

export const LensSpecificationsCard: React.FC<LensSpecificationsCardProps> = ({
  selectedOrder
}) => {
  if (!selectedOrder) {
    return (
      <Card className="col-span-12 lg:col-span-9 p-6 border border-neutral-100 bg-white shadow-sm rounded-xl flex items-center justify-center text-neutral-400 italic text-sm">
        Select an order from the table to view specifications
      </Card>
    )
  }

  const formatValue = (val: any) => {
    if (val === undefined || val === null) return '0.00'
    const num = parseFloat(val)
    if (isNaN(num)) return '0.00'
    const sign = num > 0 ? '+' : ''
    return `${sign}${num.toFixed(2)}`
  }

  const orderData = selectedOrder.order
  const firstProduct = orderData?.products?.[0]

  const parameters = firstProduct?.parameters || firstProduct?.lens?.parameters || {}

  const productSku = firstProduct?.product?.sku
  const lensSku = firstProduct?.lens?.sku

  const isLensOrder = productSku?.startsWith('LENS')
  const displayFrame = isLensOrder ? 'N/A' : productSku || 'N/A'
  const displayLens = isLensOrder ? productSku : lensSku || 'N/A'

  return (
    <Card className="col-span-12 lg:col-span-9 p-6 border border-neutral-100 bg-white shadow-sm rounded-xl">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-emerald-100 text-emerald-600 rounded">
            <IoCheckmarkCircleOutline size={16} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Order Quick View{' '}
            <span className="ml-2 px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] rounded uppercase tracking-wider">
              {selectedOrder.orderCode}
            </span>
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
              selectedOrder.stationColor
            )}
          >
            {selectedOrder.station}
          </span>
          <span className="text-[11px] font-semibold text-neutral-400 tracking-wider italic">
            ID: {selectedOrder.fullId.slice(-8)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2 space-y-4">
          <div>
            <p className="text-[11px] font-medium text-neutral-400 tracking-wider mb-2">
              Frame SKU
            </p>
            <div className="px-3 py-2 bg-neutral-50 rounded-lg text-sm font-semibold text-neutral-800 border border-neutral-100/30">
              {displayFrame}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium text-neutral-400 tracking-wider mb-2">Lens SKU</p>
            <div className="px-3 py-2 bg-neutral-50 rounded-lg text-sm font-semibold text-neutral-800 border border-neutral-100/30">
              {displayLens}
            </div>
          </div>
        </div>

        <div className="col-span-1 border-x border-neutral-100 px-6 space-y-4">
          <div>
            <p className="text-[11px] font-medium text-neutral-400 tracking-wider mb-2 text-center">
              Sphere (SPH)
            </p>
            <div className="flex gap-4 justify-center">
              <div className="text-center">
                <span className="text-[10px] text-neutral-400 font-medium tracking-wider">OD</span>
                <div className="text-sm font-semibold text-neutral-900">
                  {formatValue(parameters.right?.SPH)}
                </div>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-neutral-400 font-medium tracking-wider">OS</span>
                <div className="text-sm font-semibold text-neutral-900">
                  {formatValue(parameters.left?.SPH)}
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium text-neutral-400 tracking-wider mb-2 text-center">
              Cylinder (CYL)
            </p>
            <div className="flex gap-4 justify-center">
              <div className="text-center">
                <span className="text-[10px] text-neutral-400 uppercase font-medium tracking-wider">
                  OD
                </span>
                <div className="text-sm font-semibold text-neutral-900">
                  {formatValue(parameters.right?.CYL)}
                </div>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-neutral-400 font-medium tracking-wider">OS</span>
                <div className="text-sm font-semibold text-neutral-900">
                  {formatValue(parameters.left?.CYL)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 space-y-4">
          <div>
            <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-2">
              Pupillary Distance
            </p>
            <div className="p-3 bg-blue-50/50 rounded-lg text-sm font-semibold text-blue-700 text-center border border-blue-100/50">
              {parameters.PD || '64'}mm
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-2">
              Axis
            </p>
            <div className="flex justify-between items-center px-3 py-2 bg-neutral-50 rounded-lg">
              <div className="text-xs font-medium text-neutral-500">
                OD:{' '}
                <span className="text-neutral-900 font-semibold">
                  {parameters.right?.AXIS || '0'}°
                </span>
              </div>
              <div className="text-xs font-medium text-neutral-500">
                OS:{' '}
                <span className="text-neutral-900 font-semibold">
                  {parameters.left?.AXIS || '0'}°
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

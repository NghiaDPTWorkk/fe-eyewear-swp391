import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@/components'
import { PATHS } from '@/routes/paths'
import { IoArrowBack, IoCubeOutline } from 'react-icons/io5'
import { ProcessTracker } from '@/components/layout/staff/staff-core/processtracker'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { ScanSection } from '@/shared/components/ui/scansection'
import ShippingLabel from '@/shared/components/ui/shippinglabel/ShippingLabel'
import OrderSumary from '@/shared/components/ui/ordersummary/OrderSumary'
import CheckListSection from '@/shared/components/ui/packingchecklist/CheckListSection'

const PACKING_ITEMS = [
  'Lenses (pair)',
  'Frames',
  'Glasses Case',
  'Cleaning Cloth',
  'Documents & Invoices'
]

export default function OperationOrderPackingProcess() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    new Array(PACKING_ITEMS.length).fill(false)
  )

  const allChecked = checkedItems.every(Boolean)

  const handleCheck = (index: number) => {
    const newCheckedItems = [...checkedItems]
    newCheckedItems[index] = !newCheckedItems[index]
    setCheckedItems(newCheckedItems)
  }

  const handleFinish = () => {
    if (allChecked) {
      navigate(PATHS.OPERATIONSTAFF.ORDER_DETAIL(orderId || ''), { replace: true })
    }
  }

  return (
    <Container>
      {/* Breadcrumb Path */}
      <BreadcrumbPath paths={['Dashboard', 'Packing Station']} />
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white hover:bg-neutral-50 rounded-xl shadow-sm transition-all border border-neutral-100"
          >
            <IoArrowBack size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <IoCubeOutline className="text-primary-500" /> Packing Station
            </h1>
            <p className="text-sm text-neutral-500 mt-1 font-medium italic opacity-80 uppercase tracking-widest text-[10px]">
              CHECKLIST & PACKAGING WORKFLOW
            </p>
          </div>
        </div>
        <span className="px-6 py-2 bg-amber-100 text-amber-700 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-widest">
          In Progress
        </span>
      </div>

      {/* Progress Tracker */}
      <ProcessTracker />

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* Scan Section */}
          <ScanSection orderId={orderId} />

          {/* Checklist Section */}
          <CheckListSection
            PACKING_ITEMS={PACKING_ITEMS}
            checkedItems={checkedItems}
            handleCheck={handleCheck}
          />
        </div>

        {/* Right Column - Shipping Info (Conditional Appearance) */}
        <div
          className={`col-span-12 lg:col-span-5 space-y-6 transition-all duration-500 ease-in-out ${allChecked ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4 pointer-events-none grayscale'}`}
        >
          {/* Shipping Info */}
          <ShippingLabel />

          {/* Order Summary */}
          <OrderSumary orderId={orderId} />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end items-center mt-8 pt-4 border-t border-gray-200">
        <button
          onClick={handleFinish}
          disabled={!allChecked}
          className={`px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-mint-200 ${
            allChecked
              ? 'bg-mint-900 text-white hover:bg-mint-600 transform hover:-translate-y-1'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Complete Packing
        </button>
      </div>
    </Container>
  )
}

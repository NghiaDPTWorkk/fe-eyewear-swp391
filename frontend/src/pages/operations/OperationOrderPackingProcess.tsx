import { useState, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Container } from '@/components'
import { PATHS } from '@/routes/paths'
import { IoArrowBack, IoCubeOutline } from 'react-icons/io5'
import { ProcessTracker } from '@/components/layout/staff/staff-core/processtracker'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { ScanSection } from '@/shared/components/ui/scansection'
import ShippingLabel from '@/shared/components/ui/shippinglabel/ShippingLabel'
import OrderSumary from '@/shared/components/ui/ordersummary/OrderSumary'
import CheckListSection from '@/shared/components/ui/packingchecklist/CheckListSection'
import CheckItem from '@/shared/components/ui/packingchecklist/CheckItem'
import type { OrderProductItem } from '@/shared/types'

export default function OperationOrderPackingProcess() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  // Lấy data từ trang trước
  const { status, products } = (location.state as {
    status?: string
    products?: OrderProductItem[]
  }) || { status: 'PACKAGING', products: [] }

  // Define dynamic checklist items
  const checklistItems = useMemo(() => {
    const items = [
      { id: 'glasses_case', label: 'Glasses Case', required: true },
      { id: 'cleaning_cloth', label: 'Cleaning Cloth', required: true },
      { id: 'documents', label: 'Documents & Invoices', required: true }
    ]

    // Thêm dynamic items dựa trên products
    if (products && products.length > 0) {
      products.forEach((p) => {
        const sku = p.product?.sku || ''
        if (sku.startsWith('FRAME')) {
          items.push({
            id: `frame_${sku}`,
            label: `Frame Check: ${sku}`,
            required: true
          })
        } else if (sku.startsWith('LENS')) {
          items.push({
            id: `lens_${sku}`,
            label: `Lens Check: ${sku}`,
            required: true
          })
        } else if (p.product?.sku) {
          // Fallback for other products if needed or just use product name
          items.push({
            id: `prod_${sku}`,
            label: `Item Check: ${sku}`,
            required: true
          })
        }
      })
    }

    return items
  }, [products])

  // State lưu trạng thái checked của từng item (theo ID)
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({})

  // Kiểm tra tất cả đã check chưa
  const allChecked = checklistItems.every((item) => checkedState[item.id])

  const handleCheck = (id: string) => {
    setCheckedState((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleFinish = () => {
    if (allChecked) {
      navigate(PATHS.OPERATIONSTAFF.ORDER_DETAIL(orderId || ''), { replace: true })
    }
  }

  return (
    <Container className="animate-fade-in-up">
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
          {status || 'In Progress'}
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
          <CheckListSection>
            {checklistItems.map((item) => (
              <CheckItem
                key={item.id}
                label={item.label}
                checked={!!checkedState[item.id]}
                onToggle={() => handleCheck(item.id)}
                required={item.required}
              />
            ))}
          </CheckListSection>
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

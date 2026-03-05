import { useState, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Container } from '@/components'
import { IoArrowBack, IoCheckmarkCircle, IoCubeOutline, IoReload } from 'react-icons/io5'
import { ProcessTracker } from '@/components/layout/staff/staff-core/processtracker'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { ScanSection } from '@/shared/components/ui/scansection'
import ShippingLabel from '@/shared/components/ui/shippinglabel/ShippingLabel'
import OrderSumary from '@/shared/components/ui/ordersummary/OrderSumary'
import CheckListSection from '@/shared/components/ui/packingchecklist/CheckListSection'
import CheckItem from '@/shared/components/ui/packingchecklist/CheckItem'
import ConfirmationModal from '@/shared/components/ui/ConfirmationModal'
import type { OrderProductItem } from '@/shared/types'
import { useOrderDetail, useUpdateStatusToCompleted } from '@/features/staff/hooks/orders/useOrders'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import { useOperationInvoiceDetail } from '@/features/operations/hooks/useOperationInvoiceDetail'
import { getOrderProgressStep } from '@/shared/utils/order-status.utils'

export default function OperationOrderPackingProcess() {
  const { orderId } = useParams<{ orderId: string }>()
  const { data: orderApiResponse } = useOrderDetail(orderId!)
  const orderDetail = (orderApiResponse as any)?.data?.order
  const invoiceId = orderDetail?.invoiceId
  const { data: invoice } = useOperationInvoiceDetail(invoiceId || '')

  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  // Lấy data từ trang trước
  const { status, products } = useMemo(() => {
    const state = location.state as { status?: string; products?: OrderProductItem[] } | null
    return state || { status: 'PACKAGING', products: [] }
  }, [location.state])

  const [isCompleted, setIsCompleted] = useState(status === 'COMPLETED')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const updateStatus = useUpdateStatusToCompleted()

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
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>(() => {
    if (status === 'COMPLETED') {
      const allCheckedState: Record<string, boolean> = {}
      checklistItems.forEach((item) => {
        allCheckedState[item.id] = true
      })
      return allCheckedState
    }
    return {}
  })

  // Kiểm tra tất cả đã check chưa
  const allChecked = checklistItems.every((item) => checkedState[item.id])

  const handleCheck = (id: string) => {
    if (isCompleted) return // Disable checking when completed
    setCheckedState((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleFinish = () => {
    if (allChecked && !isCompleted && orderId) {
      setIsModalOpen(true)
    }
  }

  const confirmFinish = () => {
    if (orderId) {
      updateStatus.mutate(orderId, {
        onSuccess: () => {
          setIsCompleted(true)
          toast.success('Order packing completed successfully!')
          // Invalidate orders list to trigger refresh on other pages
          queryClient.invalidateQueries({ queryKey: ['orders'] })
          queryClient.invalidateQueries({ queryKey: ['order', orderId] })
          setIsModalOpen(false)
        },
        onError: () => {
          toast.error('Failed to update order status')
          setIsModalOpen(false)
        }
      })
    }
  }

  const handleBack = () => {
    if (isCompleted) {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
    }
    navigate(-1)
  }

  const handleCheckAll = () => {
    if (isCompleted) return

    if (allChecked) {
      // Clear all
      setCheckedState({})
    } else {
      // Check all
      const allCheckedState: Record<string, boolean> = {}
      checklistItems.forEach((item) => {
        allCheckedState[item.id] = true
      })
      setCheckedState(allCheckedState)
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
            onClick={handleBack}
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
        <span
          className={`px-6 py-2 border rounded-full text-xs font-bold uppercase tracking-widest ${isCompleted ? 'bg-mint-100 text-mint-700 border-mint-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}
        >
          {isCompleted ? 'COMPLETED' : status || 'In Progress'}
        </span>
      </div>
      {/* Progress Tracker */}
      {(() => {
        const invStatus = invoice?.status
        const activeStep = getOrderProgressStep(
          isCompleted ? 'PACKAGING' : status,
          undefined,
          invStatus
        )

        return <ProcessTracker title="Invoice Progress" activeStep={activeStep} />
      })()}
      {/* : Trạng thái từ API + Loại đơn hàng = Vị trí nút xanh trên thanh. */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* Scan Section */}
          <ScanSection orderId={orderId} />

          {/* Checklist Section */}
          <CheckListSection
            onCheckAll={isCompleted ? undefined : handleCheckAll}
            allChecked={allChecked}
          >
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
          className={`col-span-12 lg:col-span-5 space-y-6 transition-all duration-500 ease-in-out ${allChecked || isCompleted ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4 pointer-events-none grayscale'}`}
        >
          {/* Shipping Info */}
          <ShippingLabel orderId={orderId} />

          {/* Order Summary */}
          <OrderSumary orderId={orderId} />
        </div>
      </div>
      {/* Footer Actions */}
      <div className="flex justify-end items-center mt-8 pt-4 border-t border-gray-200">
        <button
          onClick={handleFinish}
          disabled={!allChecked || isCompleted || updateStatus.isPending}
          className={`px-8 py-3 rounded-lg font-medium transition-all shadow-lg flex items-center gap-2 border-2 ${
            isCompleted
              ? 'bg-white text-mint-600 border-mint-200 cursor-default'
              : allChecked
                ? 'bg-mint-900 text-white border-mint-900 hover:bg-mint-700 hover:border-mint-700 transform hover:-translate-y-1 shadow-mint-200'
                : 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
          }`}
        >
          {updateStatus.isPending ? (
            <>
              <IoReload className="animate-spin text-white" size={20} />
              Processing...
            </>
          ) : isCompleted ? (
            <>
              <IoCheckmarkCircle size={22} />
              COMPLETED PACKING
            </>
          ) : (
            'Complete Packing'
          )}
        </button>
      </div>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmFinish}
        title="Confirm Packing Completion"
        message="Are you sure you want to mark this order as packed? This action cannot be undone."
        confirmText="Yes, Complete Order"
        cancelText="Cancel"
        isLoading={updateStatus.isPending}
        type="info"
      />
    </Container>
  )
}

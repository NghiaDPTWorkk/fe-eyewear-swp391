import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@/components'
import { JobTechnicalDetails } from '@/components/layout/staff/staff-core/technicaldetail'
import { PATHS } from '@/routes/paths'
import { IoArrowBack } from 'react-icons/io5'

import { Button } from '@/shared/components/ui/button'
import { ProcessTracker } from '@/components/layout/staff/staff-core/processtracker'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { useOrderDetail } from '@/features/staff/hooks/useOrders'
import type { OrderResponse } from '@/shared/types'

export default function OperationOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  // Gọi API lấy chi tiết đơn hàng theo orderId
  const { data: orderData, isLoading, isError } = useOrderDetail(orderId!)

  // Loading state
  if (isLoading) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-500"></div>
          <p className="mt-4 text-gray-500">Đang tải thông tin đơn hàng...</p>
        </div>
      </Container>
    )
  }

  if (isError || !orderData) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-600 font-semibold">Không thể tải thông tin đơn hàng</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Quay lại
          </Button>
        </div>
      </Container>
    )
  }

  // Extract order data từ API response
  const order = (orderData as OrderResponse)?.data?.order
  console.log('Order Detail from API:', order)

  // Nếu không có order data, return error
  if (!order) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-red-500 text-5xl mb-4"></div>
          <p className="text-red-600 font-semibold">Dữ liệu đơn hàng không hợp lệ</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Quay lại
          </Button>
        </div>
      </Container>
    )
  }

  // TODO: Transform order data thành lensData và frameData format
  const lensData = {
    // KHÔNG có parameters → Hiển thị LensNormalOrder
    productDetail: {
      nameBase: 'Rodenstock Anti-Scratch Lens 1',
      skuBase: 'LENS-001',
      brand: 'Rodenstock',
      categories: ['Premium Lenses', 'Anti-Scratch'],
      spec: {
        feature: ['Anti-Scratch', 'UV Protection'],
        origin: 'Germany'
      },
      variants: []
    },
    variantDetail: {
      sku: 'LENS-001-01',
      name: 'Rodenstock Anti-Scratch Lens 1 - 1.50 - Premium',
      options: [
        {
          attributeName: 'Thickness',
          label: '1.50',
          value: '1.50'
        },
        {
          attributeName: 'Coating',
          label: 'Premium',
          value: 'Premium'
        }
      ],
      price: 132,
      imgs: ['https://picsum.photos/seed/lens1v0a/400/400']
    },
    quantity: 2,
    pricePerUnit: 132
  }

  const frameData = [
    { label: 'Frame Code', value: 'RB-AV-001' },
    { label: 'Brand', value: 'Ray-Ban' },
    { label: 'Material', value: 'Metal Titanium' },
    { label: 'Color', value: 'Gold' }
  ]
  return (
    <Container>
      {/* Breadcrumb Path */}
      <BreadcrumbPath paths={['Dashboard', 'Details']} />

      {/* Header */}
      <div className="flex items-center gap-5 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-white hover:bg-neutral-50 rounded-xl shadow-sm transition-all border border-neutral-100"
        >
          <IoArrowBack size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Order #{order._id}</h1>
          <p className="text-sm text-neutral-500 mt-1 font-medium tracking-wide italic opacity-80 uppercase tracking-widest text-[10px]">
            DETAILED ORDER INFORMATION
          </p>
        </div>
        <div className="ml-auto">
          <span className="px-6 py-2 bg-mint-100 text-mint-700 border border-mint-200 rounded-full text-xs font-bold uppercase tracking-widest">
            Pending
          </span>
        </div>
      </div>

      {/* Progress Tracker */}
      <ProcessTracker />

      {/* Technical Details - Lens & Frame Specifications */}
      <JobTechnicalDetails lensData={lensData} frameData={frameData} />

      {/* Action Button */}
      <div className="flex justify-end gap-3 mt-4">
        <Button
          className="px-6 py-3 bg-mint-900 hover:bg-mint-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          onClick={() => navigate(PATHS.OPERATIONSTAFF.PACKING_PROCESS(orderId || ''))}
        >
          Start Processing
        </Button>
      </div>
    </Container>
  )
}

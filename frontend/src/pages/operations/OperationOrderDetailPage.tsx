import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@/components'
import { Button } from '@/shared/components/ui/button'
import { BreadcrumbPath } from '@/components/layout/staff/operation-staff/breadcrumb-path'
import {
  useOrderDetail,
  useUpdateStatusToPackaging,
  useUpdateStatusToMaking
} from '@/features/staff/hooks/orders/useOrders'
import toast from 'react-hot-toast'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { productsService } from '@/features/staff/services/products.service'
import type { OrderResponse, OrderProductItem, LensParameters } from '@/shared/types'
import LensNormalOrder from '@/components/layout/staff/staff-core/technical-detail/LensNormalOrder'
import LensSpecifications from '@/components/layout/staff/staff-core/technical-detail/LensSpecifications'
import FrameSpecifications from '@/components/layout/staff/staff-core/technical-detail/FrameSpecifications'
import { PATHS } from '@/routes/paths'
import { ProcessTracker } from '@/components/layout/staff/staff-core/process-tracker'
import { IoArrowBack } from 'react-icons/io5'
import { getOrderProgressStep } from '@/shared/utils/order-status.utils'
import type React from 'react'

export default function OperationOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  // Gọi API để xem chi tiết đơn hàng nè he — GET /orders/:id
  const { data: orderDetailApiResponse, isLoading, isError } = useOrderDetail(orderId!)

  if (isLoading) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-500"></div>
          <p className="mt-4 text-gray-500">Loading order information...</p>
        </div>
      </Container>
    )
  }

  if (isError || !orderDetailApiResponse) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-600 font-semibold">Unable to load order information</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </Container>
    )
  }

  // Extract order object từ response của API
  const orderDetailData = (orderDetailApiResponse as OrderResponse)?.data?.order

  if (!orderDetailData) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-600 font-semibold">Invalid order data</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </Container>
    )
  }

  // Lấy orderCode từ order — ưu tiên orderCode của BE
  const orderCode =
    (orderDetailData as any).orderCode ?? (orderDetailData as any).code ?? orderDetailData._id

  return (
    <OrderDetailContent
      orderDetailData={orderDetailData}
      orderCode={orderCode}
      navigate={navigate}
    />
  )
}

// Component xử lý transform data và render UI
interface OrderDetailContentProps {
  orderDetailData: any
  navigate: any
  orderCode: string
}

function OrderDetailContent({ orderDetailData, orderCode, navigate }: OrderDetailContentProps) {
  const updatePackaging = useUpdateStatusToPackaging()
  const updateMaking = useUpdateStatusToMaking()

  const queryClient = useQueryClient()

  const handleStartProcessing = () => {
    // BE có thể trả về type là mảng ['PRE-ORDER', 'MANUFACTURING'] hoặc chuỗi 'MANUFACTURING'
    const orderTypes = Array.isArray(orderDetailData?.type)
      ? (orderDetailData.type as string[])
      : [orderDetailData?.type as string]

    const isManufacturingStyle = orderTypes.includes('MANUFACTURING')

    // Bước 1: Nếu đơn đang PACKAGING → navigate thẳng vào trang packing, KHÔNG gọi API
    if (orderDetailData.status === 'PACKAGING') {
      navigate(PATHS.OPERATIONSTAFF.PACKING_PROCESS(orderDetailData._id), {
        state: {
          status: 'PACKAGING',
          products: orderDetailData.products || []
        }
      })
      return
    }

    // Bước 2: Nếu đơn đang MAKING → navigate thẳng vào trang manufacturing, KHÔNG gọi API
    if (orderDetailData.status === 'MAKING') {
      navigate(PATHS.OPERATIONSTAFF.MANUFACTURING_PROCESS(orderDetailData._id), {
        state: {
          status: 'MAKING',
          products: orderDetailData.products || [],
          orderType: 'MANUFACTURING'
        }
      })
      return
    }

    // Đơn MANUFACTURING style (bao gồm PRE-ORDER + MANUFACTURING) status ASSIGNED
    // gọi API PATCH /status/making để đổi sang MAKING, sau đó navigate
    if (isManufacturingStyle) {
      updateMaking.mutate(orderDetailData._id, {
        onSuccess: () => {
          toast.success('Order status updated to MAKING')
          queryClient.invalidateQueries({ queryKey: ['orders'] })
          queryClient.invalidateQueries({ queryKey: ['order', orderDetailData._id] })

          navigate(PATHS.OPERATIONSTAFF.MANUFACTURING_PROCESS(orderDetailData._id), {
            state: {
              status: 'MAKING',
              products: orderDetailData.products || [],
              orderType: 'MANUFACTURING'
            }
          })
        },
        onError: () => {
          toast.error('Failed to update order status')
        }
      })
      return
    }

    // NORMAL style (bao gồm PRE-ORDER + NORMAL hoặc NORMAL)
    // → gọi API PATCH /status/packaging để đổi sang PACKAGING, sau đó navigate vào packing
    updatePackaging.mutate(orderDetailData._id, {
      onSuccess: () => {
        toast.success('Order status updated to PACKAGING')
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        queryClient.invalidateQueries({ queryKey: ['order', orderDetailData._id] })

        navigate(PATHS.OPERATIONSTAFF.PACKING_PROCESS(orderDetailData._id), {
          state: {
            status: 'PACKAGING',
            products: orderDetailData.products || []
          }
        })
      },
      onError: () => {
        toast.error('Failed to update order status')
      }
    })
  }

  // List sản phẩm lấy từ orderDetailData (từ API GET /orders/:id)
  const orderProductItems: OrderProductItem[] = orderDetailData?.products || []
  const orderTypes = Array.isArray(orderDetailData?.type)
    ? (orderDetailData.type as string[])
    : [orderDetailData?.type as string]

  // Xác định style của đơn hàng để hiển thị UI
  const isManufacturingStyle = orderTypes.includes('MANUFACTURING')
  const isNormalStyle = !isManufacturingStyle

  // ── Xử lý MANUFACTURING style (bao gồm PRE-ORDER + MANUFACTURING) ────────────────
  let manufacturingOrderFrameItem: {
    product_id: string
    sku: string
    pricePerUnit: number
    quantity: number
  } | null = null
  let manufacturingOrderLensParams: {
    lens_id: string
    sku: string
    parameters: LensParameters
    pricePerUnit: number
  } | null = null

  if (isManufacturingStyle) {
    const mainProduct = orderProductItems[0]
    if (mainProduct) {
      manufacturingOrderFrameItem = {
        product_id: mainProduct.product.product_id,
        sku: mainProduct.product.sku,
        pricePerUnit: mainProduct.product.pricePerUnit,
        quantity: mainProduct.quantity
      }

      if (mainProduct.lens) {
        manufacturingOrderLensParams = {
          lens_id: mainProduct.lens.lens_id,
          sku: mainProduct.lens.sku,
          parameters: mainProduct.lens.parameters,
          pricePerUnit: mainProduct.lens.pricePerUnit
        }
      }
    }
  }

  // Chọn item để gọi API variant (ưu tiên frame/sản phẩm chính)
  let variantApiProductId: string | undefined
  let variantApiProductSku: string | undefined

  if (isNormalStyle && orderProductItems[0]) {
    variantApiProductId = orderProductItems[0].product.product_id
    variantApiProductSku = orderProductItems[0].product.sku
  } else if (isManufacturingStyle && manufacturingOrderFrameItem) {
    variantApiProductId = manufacturingOrderFrameItem.product_id
    variantApiProductSku = manufacturingOrderFrameItem.sku
  }

  // Gọi API: GET /products/:id/variants/:sku
  const { data: productVariantApiResponse, isLoading: isProductVariantApiLoading } = useQuery({
    queryKey: ['productVariant', variantApiProductId, variantApiProductSku],
    queryFn: () =>
      productsService.getProductVariant(
        variantApiProductId!,
        encodeURIComponent(variantApiProductSku!)
      ),
    enabled: !!variantApiProductId && !!variantApiProductSku
  })

  if (isProductVariantApiLoading) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-500"></div>
          <p className="mt-4 text-gray-500">Loading product details...</p>
        </div>
      </Container>
    )
  }

  // Lấy data từ response
  const productType = (productVariantApiResponse as any)?.data?.productDetail?.type as
    | 'frame'
    | 'sunglass'
    | 'lens'
    | undefined
  const variantOptions = (productVariantApiResponse as any)?.data?.variantDetail?.options || []
  const variantImg = (productVariantApiResponse as any)?.data?.variantDetail?.imgs?.[0]

  let renderedLensComponent: React.ReactNode = null
  let renderedFrameComponent: React.ReactNode = null

  // UI cho NORMAL style (hoặc PRE-ORDER không lens)
  if (isNormalStyle && orderProductItems[0]) {
    const totalQty = orderProductItems.reduce((sum, item) => sum + (item.quantity || 1), 0)
    const mappedOptions = variantOptions.map((attr: any) => ({
      key: attr.attributeName,
      value: attr.label
    }))

    if (productType === 'lens') {
      renderedLensComponent = (
        <LensNormalOrder
          data={mappedOptions}
          imageSrc={variantImg}
          quantity={totalQty}
          sku={orderProductItems[0].product.sku}
        />
      )
    } else {
      renderedFrameComponent = (
        <FrameSpecifications
          data={mappedOptions}
          imageSrc={variantImg}
          quantity={totalQty}
          sku={orderProductItems[0].product.sku}
        />
      )
    }
  }

  // UI cho MANUFACTURING style (hoặc PRE-ORDER có lens)
  if (isManufacturingStyle) {
    // 1. Render Lens Specifications (nếu có thông số)
    if (manufacturingOrderLensParams) {
      const { parameters } = manufacturingOrderLensParams
      const lensComponentProps = {
        prescription: [
          {
            eye: 'Right Eye (OD)',
            sph: parameters.right.SPH.toString(),
            cyl: parameters.right.CYL.toString(),
            axis: `${parameters.right.AXIS}°`,
            prism: '-',
            add: parameters.right.ADD?.toString() || '-'
          },
          {
            eye: 'Left Eye (OS)',
            sph: parameters.left.SPH.toString(),
            cyl: parameters.left.CYL.toString(),
            axis: `${parameters.left.AXIS}°`,
            prism: '-',
            add: parameters.left.ADD?.toString() || '-'
          }
        ],
        details: [
          { label: 'PD (Pupillary Distance)', value: `${parameters.PD} mm` },
          { label: 'Lens SKU', value: manufacturingOrderLensParams.sku },
          { label: 'Price Per Unit', value: `${manufacturingOrderLensParams.pricePerUnit}` }
        ]
      }
      renderedLensComponent = <LensSpecifications {...lensComponentProps} />
    }

    // 2. Render Frame Specifications
    if (manufacturingOrderFrameItem) {
      const frameOptions = productVariantApiResponse?.data?.variantDetail?.options || []
      const frameImg = productVariantApiResponse?.data?.variantDetail?.imgs?.[0]
      renderedFrameComponent = (
        <FrameSpecifications
          data={frameOptions.map((attr: any) => ({
            key: attr.attributeName,
            value: attr.label
          }))}
          imageSrc={frameImg}
          sku={manufacturingOrderFrameItem.sku}
          quantity={manufacturingOrderFrameItem.quantity}
        />
      )
    }
  }

  return (
    <Container className="animate-fade-in-up">
      {/* Breadcrumb Path */}
      <BreadcrumbPath paths={['Dashboard', 'Details']} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white hover:bg-neutral-50 rounded-xl shadow-sm transition-all border border-neutral-100 shrink-0"
          >
            <IoArrowBack size={20} className="text-gray-600" />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight truncate">Order #{orderCode}</h1>
            <p className="text-[10px] text-neutral-500 mt-1 font-medium tracking-widest uppercase opacity-80 italic">
              DETAILED ORDER INFORMATION
            </p>
          </div>
        </div>
        <div className="sm:ml-auto">
          <span className="inline-block px-6 py-2 bg-mint-100 text-mint-700 border border-mint-200 rounded-full text-xs font-bold uppercase tracking-widest text-center">
            {orderDetailData.status || 'Pending'}
          </span>
        </div>
      </div>

      {/* Progress Tracker */}
      {(() => {
        const orderStatus = orderDetailData.status
        const orderType = orderDetailData.type?.[0] || orderDetailData.type
        const invoiceStatus = orderDetailData.invoice?.status

        const activeStep = getOrderProgressStep(orderStatus, orderType, invoiceStatus)

        return <ProcessTracker title="Order Progress" activeStep={activeStep} />
      })()}

      {/* Technical Details - Lens Specifications */}
      {renderedLensComponent && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-mint-900 mb-6">Lens Specification</h2>
          {renderedLensComponent}
        </div>
      )}

      {/* Frame Specifications */}
      {renderedFrameComponent && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-mint-900 mb-6">Frame Specification</h2>
          {renderedFrameComponent}
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-end gap-3 mt-4">
        {orderDetailData.status === 'COMPLETED' ? (
          <Button
            className="px-6 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-lg font-medium cursor-not-allowed"
            disabled
          >
            Order Completed
          </Button>
        ) : (
          <Button
            className="px-6 py-3 bg-mint-900 hover:bg-mint-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleStartProcessing}
            disabled={updatePackaging.isPending || orderDetailData.status === 'WAITING_STOCK'}
          >
            {updatePackaging.isPending
              ? 'Processing...'
              : orderDetailData.status === 'WAITING_STOCK'
                ? 'Waiting for Stock'
                : 'Start Processing'}
          </Button>
        )}
      </div>
    </Container>
  )
}

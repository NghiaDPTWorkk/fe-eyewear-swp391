/* eslint-disable */
import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@/components'
import { Button } from '@/shared/components/ui/button'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import {
  useOrderDetail,
  useUpdateStatusToPackaging,
  useUpdateStatusToMaking
} from '@/features/staff/hooks/orders/useOrders'
import toast from 'react-hot-toast'
import { useProductDetails } from '@/features/staff/hooks/products/useProductDetails'
import { useQueryClient } from '@tanstack/react-query'
import type { OrderResponse, OrderProductItem } from '@/shared/types'
import LensNormalOrder from '@/components/layout/staff/staff-core/technicaldetail/LensNormalOrder'
import LensSpecifications from '@/components/layout/staff/staff-core/technicaldetail/LensSpecifications'
import FrameSpecifications from '@/components/layout/staff/staff-core/technicaldetail/FrameSpecifications'
import { PATHS } from '@/routes/paths'
import { ProcessTracker } from '@/components/layout/staff/staff-core/processtracker'
import { IoArrowBack } from 'react-icons/io5'

export default function OperationOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  // Bước 1: Fetch Order Data
  const { data: orderData, isLoading, isError } = useOrderDetail(orderId!)

  // Loading state
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

  if (isError || !orderData) {
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

  // Extract order data
  const order = (orderData as OrderResponse)?.data?.order
  console.log('📦 Order Detail:', JSON.stringify(order, null, 2))

  if (!order) {
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

  // Extract orderCode from order (use type assertion since API returns OperationOrder)
  const orderCode = (order as any).orderCode || order._id

  // Render với order data
  return <OrderDetailContent order={order} orderCode={orderCode} navigate={navigate} />
}

// Component xử lý transform data và render UI
interface OrderDetailContentProps {
  order: any
  navigate: any
  orderCode: string
}

function OrderDetailContent({ order, orderCode, navigate }: OrderDetailContentProps) {
  const updatePackaging = useUpdateStatusToPackaging()
  const updateMaking = useUpdateStatusToMaking()

  const queryClient = useQueryClient()

  const handleStartProcessing = () => {
    // Get order type (handle both array and string)
    const orderType = order?.type?.[0] || order?.type

    // Check if redundant status update
    if (order.status === 'PACKAGING') {
      navigate(PATHS.OPERATIONSTAFF.PACKING_PROCESS(order._id), {
        state: {
          status: 'PACKAGING',
          products: order.products || []
        }
      })
      return
    }

    // For MANUFACTURING orders, update status to MAKING and navigate to Manufacturing Process
    if (orderType === 'MANUFACTURING') {
      updateMaking.mutate(order._id, {
        onSuccess: () => {
          toast.success('Order status updated to MAKING')
          // Invalidate queries to refresh lists and details
          queryClient.invalidateQueries({ queryKey: ['orders'] })
          queryClient.invalidateQueries({ queryKey: ['order', order._id] })

          navigate(PATHS.OPERATIONSTAFF.MANUFACTURING_PROCESS(order._id), {
            state: {
              status: 'MAKING',
              products: order.products || [],
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

    // For other order types (NORMAL, PRE_ORDER), update status and go to Packing
    updatePackaging.mutate(order._id, {
      onSuccess: () => {
        toast.success('Order status updated to PACKAGING')
        // Invalidate queries to refresh lists and details
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        queryClient.invalidateQueries({ queryKey: ['order', order._id] })

        navigate(PATHS.OPERATIONSTAFF.PACKING_PROCESS(order._id), {
          state: {
            status: 'PACKAGING', // Optimistic update
            products: order.products || []
          }
        })
      },
      onError: () => {
        toast.error('Failed to update order status')
      }
    })
  }
  const products: OrderProductItem[] = order?.products || []
  const orderType = order?.type?.[0] || order?.type // Handle both array and string

  // Phân loại products và chuẩn bị data
  let framesList: any[] = []
  let lensList: any[] = []
  let frameObject: any = null
  let lensParametersObject: any = null

  if (orderType === 'NORMAL') {
    // NORMAL Order: Phân loại products thành framesList và lensList
    products.forEach((item: OrderProductItem) => {
      const sku = item.product?.sku || ''

      if (sku.startsWith('FRAME')) {
        framesList.push({
          product_id: item.product.product_id,
          sku: item.product.sku,
          pricePerUnit: item.product.pricePerUnit,
          quantity: item.quantity
        })
      } else if (sku.startsWith('LENS')) {
        lensList.push({
          product_id: item.product.product_id,
          sku: item.product.sku,
          pricePerUnit: item.product.pricePerUnit,
          quantity: item.quantity
        })
      }
    })
  } else if (orderType === 'MANUFACTURING') {
    // MANUFACTURING Order: Lấy products[0]
    const firstProduct = products[0]

    if (firstProduct) {
      frameObject = {
        product_id: firstProduct.product.product_id,
        sku: firstProduct.product.sku,
        pricePerUnit: firstProduct.product.pricePerUnit,
        quantity: firstProduct.quantity
      }

      if (firstProduct.lens) {
        lensParametersObject = {
          lens_id: firstProduct.lens.lens_id,
          sku: firstProduct.lens.sku,
          parameters: firstProduct.lens.parameters,
          pricePerUnit: firstProduct.lens.pricePerUnit
        }
      }
    }
  }

  // Fetch product details
  const productIdsToFetch =
    orderType === 'NORMAL'
      ? [...framesList.map((f) => f.product_id), ...lensList.map((l) => l.product_id)]
      : frameObject
        ? [frameObject.product_id]
        : []

  const productQueries = useProductDetails(productIdsToFetch)
  const productsLoading = productQueries.some((q: any) => q.isLoading)
  const productsError = productQueries.some((q: any) => q.isError)

  // Loading state cho product details
  if (productsLoading) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-500"></div>
          <p className="mt-4 text-gray-500">Loading product details...</p>
        </div>
      </Container>
    )
  }

  // Error state cho product details
  if (productsError) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-600 font-semibold">Unable to load product details</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </Container>
    )
  }

  // Transform data theo order type
  let lensComponent = null
  let frameComponent = null

  // NORMAL Order - Lens
  if (orderType === 'NORMAL' && lensList.length > 0) {
    const lensItem = lensList[0]
    const lensIndex = productIdsToFetch.indexOf(lensItem.product_id)
    const lensProductDetail = (productQueries[lensIndex]?.data as any)?.data

    if (lensProductDetail) {
      const variantDetail = lensProductDetail?.variants?.find((v: any) => v.sku === lensItem.sku)
      const finalVariant = variantDetail || lensProductDetail?.variants?.[0]

      // Chỉ render nếu có variant detail
      if (finalVariant) {
        const lensData = {
          productDetail: lensProductDetail,
          variantDetail: finalVariant,
          quantity: lensItem.quantity,
          pricePerUnit: lensItem.pricePerUnit
        }
        lensComponent = <LensNormalOrder {...lensData} />
      } else {
        console.warn('⚠️ No variant found for lens SKU:', lensItem.sku)
      }
    }
  }

  // NORMAL Order - Frame
  if (orderType === 'NORMAL' && framesList.length > 0) {
    const frameItem = framesList[0]
    const frameIndex = productIdsToFetch.indexOf(frameItem.product_id)
    const frameProductDetail = (productQueries[frameIndex]?.data as any)?.data

    if (frameProductDetail) {
      const frameVariant = frameProductDetail?.variants?.find((v: any) => v.sku === frameItem.sku)
      const frameSpec = frameProductDetail?.spec || {}

      const frameData = {
        data: [
          { label: 'Frame Code', value: frameItem.sku },
          { label: 'Brand', value: frameProductDetail.brand || 'N/A' },
          { label: 'Material', value: frameSpec.material || 'N/A' },
          { label: 'Shape', value: frameSpec.shape || 'N/A' },
          {
            label: 'Color',
            value:
              frameVariant?.options?.find((o: any) => o.attributeName === 'Color')?.value || 'N/A'
          },
          { label: 'Price', value: `$${frameItem.pricePerUnit}` }
        ],
        imageSrc: frameVariant?.imgs?.[0] || frameProductDetail?.variants?.[0]?.imgs?.[0]
      }

      frameComponent = <FrameSpecifications {...frameData} />
    }
  }

  // MANUFACTURING Order - Lens
  if (orderType === 'MANUFACTURING' && lensParametersObject) {
    const { parameters } = lensParametersObject

    const lensData = {
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
        { label: 'Lens SKU', value: lensParametersObject.sku },
        { label: 'Price Per Unit', value: `$${lensParametersObject.pricePerUnit}` }
      ]
    }

    lensComponent = <LensSpecifications {...lensData} />
  }

  // MANUFACTURING Order - Frame
  if (orderType === 'MANUFACTURING' && frameObject) {
    const frameProductDetail = (productQueries[0]?.data as any)?.data

    if (frameProductDetail) {
      const frameVariant = frameProductDetail?.variants?.find((v: any) => v.sku === frameObject.sku)
      const frameSpec = frameProductDetail?.spec || {}

      const frameData = {
        data: [
          { label: 'Frame Code', value: frameObject.sku },
          { label: 'Brand', value: frameProductDetail.brand || 'N/A' },
          { label: 'Material', value: frameSpec.material || 'N/A' },
          { label: 'Shape', value: frameSpec.shape || 'N/A' },
          {
            label: 'Color',
            value:
              frameVariant?.options?.find((o: any) => o.attributeName === 'Color')?.value || 'N/A'
          },
          { label: 'Price', value: `$${frameObject.pricePerUnit}` }
        ],
        imageSrc: frameVariant?.imgs?.[0] || frameProductDetail?.variants?.[0]?.imgs?.[0]
      }

      frameComponent = <FrameSpecifications {...frameData} />
    }
  }

  return (
    <Container className="animate-fade-in-up">
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Order #{orderCode}</h1>
          <p className="text-sm text-neutral-500 mt-1 font-medium tracking-wide italic opacity-80 uppercase tracking-widest text-[10px]">
            DETAILED ORDER INFORMATION
          </p>
        </div>
        <div className="ml-auto">
          <span className="px-6 py-2 bg-mint-100 text-mint-700 border border-mint-200 rounded-full text-xs font-bold uppercase tracking-widest">
            {order.status || 'Pending'}
          </span>
        </div>
      </div>

      {/* Progress Tracker */}
      <ProcessTracker />

      {/* Technical Details - Lens Specifications */}
      {lensComponent && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-mint-900 mb-6">Lens Specification</h2>
          {lensComponent}
        </div>
      )}

      {/* Frame Specifications */}
      {frameComponent && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Frame Specification</h2>
          {frameComponent}
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-end gap-3 mt-4">
        {order.status === 'COMPLETED' ? (
          <Button
            className="px-6 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-lg font-medium cursor-not-allowed"
            disabled
          >
            Order Completed
          </Button>
        ) : (
          <Button
            className="px-6 py-3 bg-mint-900 hover:bg-mint-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            onClick={handleStartProcessing}
            disabled={updatePackaging.isPending}
          >
            {updatePackaging.isPending ? 'Processing...' : 'Start Processing'}
          </Button>
        )}
      </div>
    </Container>
  )
}

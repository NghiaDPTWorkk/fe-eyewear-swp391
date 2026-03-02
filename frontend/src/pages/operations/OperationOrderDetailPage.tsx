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
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { productsService } from '@/features/staff/services/products.service'
import type { OrderResponse, OrderProductItem, LensParameters } from '@/shared/types'
import LensNormalOrder from '@/components/layout/staff/staff-core/technicaldetail/LensNormalOrder'
import LensSpecifications from '@/components/layout/staff/staff-core/technicaldetail/LensSpecifications'
import FrameSpecifications from '@/components/layout/staff/staff-core/technicaldetail/FrameSpecifications'
import { PATHS } from '@/routes/paths'
import { ProcessTracker } from '@/components/layout/staff/staff-core/processtracker'
import { IoArrowBack } from 'react-icons/io5'
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
    // orderTypeFromApi: lấy type của đơn hàng ('NORMAL' | 'MANUFACTURING'...)
    // BE có thể trả về type là mảng ['MANUFACTURING'] hoặc chuỗi 'MANUFACTURING'
    const orderTypeFromApi = orderDetailData?.type?.[0] || orderDetailData?.type

    // Bước 1: Nếu đơn đang PACKAGING → navigate thẳng vào trang packing, KHÔNG gọi API
    // (đơn đã được chuyển sang PACKAGING trước đó rồi, chỉ cần vào xem tiếp)
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
    // Lý do: gọi API updateMaking khi status đã là MAKING sẽ bị lỗi 400/409 từ BE
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

    //  Đơn MANUFACTURING status ASSIGNED
    // gọi API PATCH /status/making để đổi sang MAKING, sau đó navigate
    if (orderTypeFromApi === 'MANUFACTURING') {
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

    //  NORMAL order (hoặc các loại còn lại)
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
  const orderTypeFromApi = orderDetailData?.type?.[0] || orderDetailData?.type

  // ── Xử lý MANUFACTURING order ──────────────────────────────────
  // Khai báo 2 biến để lưu data frame & lens params của đơn MANUFACTURING.
  let manufacturingOrderFrameItem: {
    product_id: string
    sku: string
    pricePerUnit: number
    quantity: number
  } | null = null
  let manufacturingOrderLensParams: {
    lens_id: string
    sku: string
    parameters: LensParameters // Thông số kính: SPH, CYL, AXIS, ADD, PD
    pricePerUnit: number
  } | null = null

  if (orderTypeFromApi === 'MANUFACTURING') {
    // MANUFACTURING order luôn có đúng 1 sản phẩm trong products[]
    const manufacturingFirstProduct = orderProductItems[0]
    if (manufacturingFirstProduct) {
      manufacturingOrderFrameItem = {
        product_id: manufacturingFirstProduct.product.product_id,
        sku: manufacturingFirstProduct.product.sku,
        pricePerUnit: manufacturingFirstProduct.product.pricePerUnit,
        quantity: manufacturingFirstProduct.quantity
      }

      // lens là optional (có thể chưa có nếu chưa được assign thông số)
      if (manufacturingFirstProduct.lens) {
        manufacturingOrderLensParams = {
          lens_id: manufacturingFirstProduct.lens.lens_id,
          sku: manufacturingFirstProduct.lens.sku,
          parameters: manufacturingFirstProduct.lens.parameters,
          pricePerUnit: manufacturingFirstProduct.lens.pricePerUnit
        }
      }
    }
  }

  // ──  Chọn item để gọi variant API ────────────────────────────────
  // Variant API: GET /products/:product_id/variants/:sku
  //Trả về productDetail (có .type: 'frame'|'sunglass'|'lens') + variantDetail (options, imgs)
  //
  // NORMAL:        dùng products[0] — loại sản phẩm sẽ xác định qua productDetail.type
  // MANUFACTURING: dùng products[0] — luôn là frame
  let variantApiProductId: string | undefined
  let variantApiProductSku: string | undefined

  if (orderTypeFromApi === 'NORMAL' && orderProductItems[0]) {
    variantApiProductId = orderProductItems[0].product.product_id
    variantApiProductSku = orderProductItems[0].product.sku
  } else if (orderTypeFromApi === 'MANUFACTURING' && manufacturingOrderFrameItem) {
    variantApiProductId = manufacturingOrderFrameItem.product_id
    variantApiProductSku = manufacturingOrderFrameItem.sku
  }

  // Gọi API: GET /products/:id/variants/:sku
  // Toàn bộ data hiển thị frame/lens đều lấy từ response.data.variantDetail
  const { data: productVariantApiResponse, isLoading: isProductVariantApiLoading } = useQuery({
    queryKey: ['productVariant', variantApiProductId, variantApiProductSku],
    queryFn: () => productsService.getProductVariant(variantApiProductId!, variantApiProductSku!),
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

  // Lấy type từ productDetail để quyết định render component ────
  //   'frame'     render FrameSpecifications
  //   'sunglass'  render FrameSpecifications (cùng UI với frame)
  //   'lens'      render LensNormalOrder
  const productType = (productVariantApiResponse as any)?.data?.productDetail?.type as
    | 'frame'
    | 'sunglass'
    | 'lens'
    | undefined

  // options & ảnh từ variantDetail để truyền vào component hiển thị
  const variantOptions = (productVariantApiResponse as any)?.data?.variantDetail?.options || []
  const variantImg = (productVariantApiResponse as any)?.data?.variantDetail?.imgs?.[0]

  // Khai báo trước null, sẽ được gán bên dưới theo từng loại đơn
  let renderedLensComponent: React.ReactNode = null
  let renderedFrameComponent: React.ReactNode = null

  if (orderTypeFromApi === 'NORMAL' && orderProductItems[0]) {
    // Cộng tổng quantity của tất cả items trong order
    const totalQty = orderProductItems.reduce((sum, item) => sum + (item.quantity || 1), 0)

    // Map options về dạng { key: attributeName, value: label } cho component hiển thị
    const mappedOptions = variantOptions.map((attr: any) => ({
      key: attr.attributeName,
      value: attr.label
    }))

    if (productType === 'lens') {
      // Đơn mua mỗi tròng á -> hiển thị LensNormalOrder
      renderedLensComponent = (
        <div className="space-y-8">
          <LensNormalOrder data={mappedOptions} imageSrc={variantImg} quantity={totalQty} />
        </div>
      )
    } else {
      // 'frame' | 'sunglass' | other → hiển thị FrameSpecifications
      renderedFrameComponent = (
        <div className="space-y-8">
          <FrameSpecifications data={mappedOptions} imageSrc={variantImg} quantity={totalQty} />
        </div>
      )
    }
  }

  // MANUFACTURING Order - Lens (thông số kính cận từ order.products[0].lens)
  if (orderTypeFromApi === 'MANUFACTURING' && manufacturingOrderLensParams) {
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

  // MANUFACTURING Order - Frame (options/ảnh lấy từ variantDetail của API /products/:id/variants/:sku)
  if (orderTypeFromApi === 'MANUFACTURING' && manufacturingOrderFrameItem) {
    const frameOptionsFromVariantDetail =
      productVariantApiResponse?.data?.variantDetail?.options || []
    const frameImgFromVariantDetail = productVariantApiResponse?.data?.variantDetail?.imgs?.[0]
    const frameComponentProps = {
      data:
        frameOptionsFromVariantDetail?.map((attr: any) => ({
          key: attr.attributeName,
          value: attr.label
        })) || [],
      imageSrc: frameImgFromVariantDetail
    }

    renderedFrameComponent = <FrameSpecifications {...frameComponentProps} />
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
            {orderDetailData.status || 'Pending'}
          </span>
        </div>
      </div>

      {/* Progress Tracker */}
      <ProcessTracker />

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

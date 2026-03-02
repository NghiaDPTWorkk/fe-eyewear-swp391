import type {
  OrderProductItem,
  OrderLensData,
  TransformedLensData,
  TransformedFrameData
} from '@/shared/types'

/**
 * Chuyển đổi dữ liệu tròng kính (lens)  của đơn hàng
 * sang định dạng cho component LensSpecifications để hiển thị ui nha
 */
export const transformLensData = (lensData: OrderLensData): TransformedLensData => {
  const { parameters } = lensData

  const prescription = [
    {
      eye: 'Right Eye (OD)',
      sph: parameters.right.SPH.toString(),
      cyl: parameters.right.CYL.toString(),
      axis: `${parameters.right.AXIS}°`,
      prism: '-', // Không có trong phản hồi API này tui bày
      add: '-'
    },
    {
      eye: 'Left Eye (OS)',
      sph: parameters.left.SPH.toString(),
      cyl: parameters.left.CYL.toString(),
      axis: `${parameters.left.AXIS}°`,
      prism: '-',
      add: '-'
    }
  ]

  const details = [
    { label: 'PD (Pupillary Distance)', value: `${parameters.PD} mm` },
    { label: 'Lens SKU', value: lensData.sku },
    { label: 'Price Per Unit', value: `$${lensData.pricePerUnit}` }
  ]

  return { prescription, details }
}

/**
 * Chuyển đổi dữ liệu gọng kính (frame)
 */
export const transformFrameDataFromOrder = (
  productItem: OrderProductItem
): TransformedFrameData => {
  return [
    { label: 'Frame SKU', value: productItem.product.sku },
    { label: 'Price Per Unit', value: `$${productItem.product.pricePerUnit}` },
    { label: 'Quantity', value: productItem.quantity.toString() }
  ]
}

/**
 * Trích xuất danh sách gọng kính và tròng kính từ các sản phẩm trong đơn hàng
 */
export const extractFramesAndLensesFromOrder = (
  products: OrderProductItem[],
  orderTypes: string[]
) => {
  const frames: OrderProductItem[] = []
  const lenses: OrderLensData[] = []

  const isManufacturing = orderTypes.includes('MANUFACTURING')

  products.forEach((productItem) => {
    // Luôn thêm sản phẩm vào danh sách gọng
    frames.push(productItem)

    // Nếu là đơn hàng sản xuất và có dữ liệu tròng kính
    if (isManufacturing && productItem.lens) {
      lenses.push(productItem.lens)
    }
  })

  return { frames, lenses }
}

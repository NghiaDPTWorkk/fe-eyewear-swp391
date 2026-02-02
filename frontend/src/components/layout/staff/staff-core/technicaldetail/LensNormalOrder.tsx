/**
 * LensNormalOrder Component
 * Component hiển thị thông tin tròng kính cho đơn hàng THƯỜNG (NORMAL ORDER)
 * Nhận nguyên productDetail và variantDetail từ API, tự destructure bên trong
 */

interface LensSpec {
  feature?: string[]
  origin?: string
}

interface VariantOption {
  attributeName: string
  label: string
  value: string
}

interface Variant {
  sku: string
  name: string
  options: VariantOption[]
  price: number
  imgs: string[]
}

interface ProductDetail {
  nameBase: string
  skuBase: string
  brand: string
  categories: string[]
  spec: LensSpec
  variants: Variant[]
}

interface LensNormalOrderProps {
  productDetail: ProductDetail
  variantDetail: Variant
  quantity: number // Số lượng từ order
  pricePerUnit: number // Giá từ order snapshot
}

const LensNormalOrder = ({ productDetail, variantDetail }: LensNormalOrderProps) => {
  // Destructure data từ productDetail
  const { nameBase, skuBase, brand, categories, spec } = productDetail

  // Destructure data từ variantDetail
  const { sku, name, imgs } = variantDetail

  const origin = spec.origin || 'N/A'

  // Lấy hình ảnh đầu tiên
  const imageSrc = imgs[0] || 'https://via.placeholder.com/400x300?text=Lens'

  return (
    <div className="space-y-4">
      {/* Product Header Info */}
      <div className="bg-mint-50 rounded-lg p-4 border border-mint-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-mint-600 uppercase tracking-wide font-medium mb-1">
              Lens SKU
            </p>
            <p className="text-sm font-bold text-mint-900">{sku}</p>
          </div>
          <div>
            <p className="text-xs text-mint-600 uppercase tracking-wide font-medium mb-1">
              Product Name
            </p>
            <p className="text-sm font-bold text-mint-900">{nameBase}</p>
          </div>
          <div>
            <p className="text-xs text-mint-600 uppercase tracking-wide font-medium mb-1">
              Categories
            </p>
            <p className="text-sm font-bold text-mint-900">
              {categories.length > 0 ? categories.join(', ') : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - giống FrameSpecifications */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Lens Image Section */}
        <div className="w-55 h-55 md:w-1/3 bg-gray-50 rounded-lg p-4 flex justify-center">
          <img src={imageSrc} alt="Lens" className="max-w-full h-auto" />
        </div>

        {/* Lens Details Grid */}
        <div className="w-55 h-55 md:w-fit grid grid-cols-2 gap-x-12 gap-y-4">
          <div className="min-w-[120px] py-7 px-8">
            <p className="text-xs text-gray-500">Variant Name</p>
            <p className="text-sm font-semibold text-gray-900">{name}</p>
          </div>

          <div className="min-w-[120px] py-7 px-8">
            <p className="text-xs text-gray-500">Brand</p>
            <p className="text-sm font-semibold text-gray-900">{brand}</p>
          </div>

          <div className="min-w-[120px] py-7 px-8">
            <p className="text-xs text-gray-500">SKU Base</p>
            <p className="text-sm font-semibold text-gray-900">{skuBase}</p>
          </div>

          <div className="min-w-[120px] py-7 px-8">
            <p className="text-xs text-gray-500">Origin</p>
            <p className="text-sm font-semibold text-gray-900">{origin}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LensNormalOrder

/**
 * LensNormalOrder Component
 * Component hiển thị thông tin tròng kính cho đơn hàng THƯỜNG (NORMAL ORDER)
 * Layout đồng bộ với FrameSpecifications
 */

interface LensItem {
  label: string
  value: string
}

interface LensNormalOrderProps {
  data: LensItem[]
  nameBase?: string // Tên sản phẩm lens
}

const LensNormalOrder = ({ data, nameBase }: LensNormalOrderProps) => {
  return (
    <div className="space-y-4">
      {/* Product Name Header - nếu có */}
      {nameBase && (
        <div className="bg-mint-50 rounded-lg p-4 border border-mint-100">
          <p className="text-xs text-mint-600 uppercase tracking-wide font-medium mb-1">
            Product Name
          </p>
          <p className="text-base font-bold text-mint-900">{nameBase}</p>
        </div>
      )}

      {/* Lens Details Grid - giống FrameSpecifications */}
      <div className="grid grid-cols-2 gap-x-12 gap-y-4">
        {data.map((item, idx) => (
          <div key={idx} className="min-w-[120px] py-7 px-8">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="text-sm font-semibold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Helper Note */}
      <div className="flex items-start gap-2 bg-mint-50 rounded-lg p-3 border border-mint-200 mt-4">
        <svg
          className="w-5 h-5 text-mint-600 flex-shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-xs text-mint-700">
          <span className="font-semibold">Note:</span> Use the SKU to locate the correct lens in the
          warehouse. Verify all specifications before packing.
        </p>
      </div>
    </div>
  )
}

export default LensNormalOrder

import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminProducts } from '@/features/manager/hooks'
import { formatPrice, toTitleCase } from '@/shared/utils'
import { IoCubeOutline } from 'react-icons/io5'

export const PopularProducts: React.FC = () => {
  const navigate = useNavigate()
  const { data: productsData, isLoading } = useAdminProducts(1, 5)

  const productList = useMemo(() => {
    return productsData?.data.productList || []
  }, [productsData])

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-slate-100 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-mint-200 border-t-mint-600 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-slate-100 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Popular Products</h3>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Top performing items</p>
        </div>
        <button
          onClick={() => navigate('/manager/products')}
          className="text-xs font-bold text-mint-600 hover:text-mint-700 bg-mint-50 px-4 py-2 rounded-xl transition-all"
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
              <th className="pb-4 font-bold">Product</th>
              <th className="pb-4 font-bold">Price</th>
              <th className="pb-4 font-bold text-center">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50/50">
            {productList.map((product, idx) => (
              <tr
                key={idx}
                onClick={() => navigate(`/manager/products/${product.id}`)}
                className="group hover:bg-neutral-50/50 transition-colors cursor-pointer"
              >
                <td className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-neutral-100 group-hover:bg-white transition-colors">
                      <IoCubeOutline size={20} className="text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate leading-snug">
                        {product.nameBase}
                      </p>
                      <p className="text-[11px] font-semibold text-slate-400 mt-0.5 uppercase tracking-tighter">
                        SKU: {product.skuBase}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-sm font-semibold text-slate-800">
                  {formatPrice(product.defaultVariantFinalPrice)}
                </td>
                <td className="py-4 text-xs font-bold text-gray-400 tracking-widest text-center">
                  {toTitleCase(product.type)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

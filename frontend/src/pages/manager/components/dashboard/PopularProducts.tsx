import React, { useMemo } from 'react'
import { useAdminProducts } from '@/features/manager/hooks'
import { formatPrice } from '@/shared/utils'
import { IoCubeOutline } from 'react-icons/io5'

export const PopularProducts: React.FC = () => {
  const { data: productsData, isLoading } = useAdminProducts(1, 5)

  const productList = useMemo(() => {
    return productsData?.data.productList || []
  }, [productsData])

  if (isLoading) {
    return (
      <div className="p-8 bg-white rounded-3xl border border-neutral-100 shadow-sm flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-mint-200 border-t-mint-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8 bg-white rounded-3xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-base font-semibold text-gray-900 font-heading tracking-tight">
          Product Popular
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-50/10">
              <th className="pb-4 text-[10px] font-semibold text-gray-400 uppercase tracking-[0.1em]">
                Product
              </th>
              <th className="pb-4 text-[10px] font-semibold text-gray-400 uppercase tracking-[0.1em]">
                Price
              </th>
              <th className="pb-4 text-[10px] font-semibold text-gray-400 uppercase tracking-[0.1em] text-center">
                Type
              </th>
              <th className="pb-4 text-[10px] font-semibold text-gray-400 uppercase tracking-[0.1em] text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50/50">
            {productList.map((product, idx) => (
              <tr key={idx} className="group hover:bg-neutral-50/50 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-neutral-100 group-hover:bg-white transition-colors">
                      {product.defaultVariantImage ? (
                        <img
                          src={product.defaultVariantImage}
                          alt={product.nameBase}
                          className="w-full h-full object-contain p-2 transition-transform group-hover:scale-110"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = 'fallback-image-url'
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center text-neutral-300">
                          <IoCubeOutline size={24} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-0.5">
                        {product.skuBase}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {product.nameBase}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-sm font-semibold text-slate-800">
                  {formatPrice(product.defaultVariantFinalPrice)}
                </td>
                <td className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                  {product.type}
                </td>
                <td className="py-4 text-right">
                  <span className="inline-flex items-center px-3 py-1 bg-mint-50 text-mint-600 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-mint-100/50">
                    In Stock
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '@/shared/utils'
import { IoCubeOutline, IoStatsChartOutline } from 'react-icons/io5'
import type { TopSalesStats, ProductSale } from '@/shared/types/report.types'
import { useAdminProductDetail } from '@/features/manager/hooks'

interface PopularProductsProps {
  stats?: TopSalesStats
  isLoading?: boolean
}

const ProductInfoCell: React.FC<{ productId: string; sku: string }> = ({ productId, sku }) => {
  const { data: detailRes, isLoading } = useAdminProductDetail(productId)

  const product = detailRes?.data?.product
  const variant = useMemo(() => {
    return product?.variants.find((v) => v.sku === sku) || product?.variants[0]
  }, [product, sku])

  const name = product?.nameBase || 'Loading...'
  const imageUrl = variant?.imgs[0]

  return (
    <div className="flex items-center gap-5 pl-2">
      <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:border-mint-200 transition-all duration-300">
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-mint-200 border-t-mint-600 rounded-full animate-spin" />
        ) : imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <IoCubeOutline size={20} className="text-slate-400 group-hover:text-mint-500" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-slate-700 truncate leading-snug group-hover:text-mint-600 transition-colors">
          {product ? product.nameBase : '—'}
        </p>
        <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-widest font-mono">
          {sku}
        </p>
      </div>
    </div>
  )
}

export const PopularProducts: React.FC<PopularProductsProps> = ({ stats, isLoading }) => {
  const navigate = useNavigate()
  const topProducts = stats?.topProducts || []

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-slate-100 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-mint-200 border-t-mint-600 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400">Loading top products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm ring-1 ring-slate-100 h-full overflow-hidden border border-neutral-50 font-sans">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-mint-50 text-mint-600">
            <IoStatsChartOutline size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Best Performing Products
            </h3>
            <p className="text-[12px] text-slate-500 font-medium mt-0.5">
              Monthly sales performance rank
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/manager/products')}
          className="text-[10px] font-bold text-mint-600 hover:text-white hover:bg-mint-600 bg-mint-50/50 border border-mint-100/50 px-4 py-2 rounded-xl transition-all uppercase tracking-widest"
        >
          Inventory Manager
        </button>
      </div>

      <div className="overflow-x-auto scroller-hide">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
              <th className="pb-5 font-bold pl-2">Product Info</th>
              <th className="pb-5 font-bold text-center">Units Sold</th>
              <th className="pb-5 font-bold text-right pr-2">Total Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50/50 text-slate-600">
            {topProducts.map((product: ProductSale, idx: number) => (
              <tr
                key={idx}
                onClick={() => navigate(`/manager/products/${product.productId}`)}
                className="group hover:bg-slate-50/30 transition-all cursor-pointer"
              >
                <td className="py-4">
                  <ProductInfoCell productId={product.productId} sku={product.sku} />
                </td>
                <td className="py-4">
                  <div className="flex items-center justify-center">
                    <span className="px-3 py-1 bg-slate-50 text-slate-600 text-[12px] font-semibold rounded-lg border border-slate-100 group-hover:bg-mint-50 group-hover:text-mint-600 group-hover:border-mint-200 transition-all">
                      {product.totalQuantity}{' '}
                      <span className="text-[9px] font-medium text-slate-400 ml-0.5">items</span>
                    </span>
                  </div>
                </td>
                <td className="py-4 text-right pr-2">
                  <span className="text-[14px] font-bold text-slate-800 font-mono tracking-tight">
                    {formatPrice(product.totalRevenue)}
                  </span>
                </td>
              </tr>
            ))}
            {topProducts.length === 0 && (
              <tr>
                <td colSpan={3} className="py-20 text-center text-slate-300 italic font-medium">
                  No sales performance data available for this month.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

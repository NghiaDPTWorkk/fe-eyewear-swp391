import React, { useState } from 'react'
import { Container } from '@/components'
import { PageHeader } from '@/features/sales/components/common'
import { useNavigate } from 'react-router-dom'
import { useAdminProducts } from '@/features/manager/hooks/useAdminProducts'
import {
  IoSearchOutline,
  IoRefreshOutline,
  IoAddOutline,
  IoCubeOutline,
  IoShirtOutline,
  IoSparklesOutline,
  IoAlertCircleOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoEyeOutline
} from 'react-icons/io5'

// ─── Summary Card ───
const SummaryCard: React.FC<{
  label: string
  value: string | number
  percent: string
  isUp: boolean
  icon: React.ReactNode
  iconBg: string
}> = ({ label, value, percent, isUp, icon, iconBg }) => (
  <div className="bg-white p-6 rounded-3xl border-none shadow-sm ring-1 ring-neutral-100/50 hover:shadow-md transition-all group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[12px] font-bold text-slate-400 tracking-wider uppercase whitespace-nowrap">
          {label}
        </p>
        <h3 className="text-2xl font-bold mt-1.5 text-slate-900 tracking-tight">{value}</h3>
      </div>
      <div
        className={`p-3.5 rounded-2xl shadow-sm transition-transform group-hover:scale-105 ${iconBg}`}
      >
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2 text-sm">
      <span className={`font-bold flex items-center ${isUp ? 'text-emerald-600' : 'text-red-600'}`}>
        {isUp ? '↗' : '↘'} {percent}
      </span>
      <span className="text-gray-500">from last period</span>
    </div>
  </div>
)

// ─── Format price ───
function formatPrice(price: number) {
  if (price >= 1_000_000) {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫'
  }
  return '$' + price.toFixed(2)
}

export default function ManagerProductsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined)
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, refetch } = useAdminProducts(
    page,
    limit,
    typeFilter,
    undefined,
    searchQuery || undefined
  )

  const products = data?.data?.productList ?? []
  const pagination = data?.data?.pagination

  // Compute summary counts from data
  const totalProducts = pagination?.total ?? 0
  const frameCount = products.filter((p) => p.type === 'frame').length
  const sunglassCount = products.filter((p) => p.type === 'sunglass').length
  const lowStockCount = products.filter((p) => p.totalVariants <= 1).length

  const typeTabs = [
    { label: 'All', value: undefined },
    { label: 'Frame', value: 'frame' },
    { label: 'Sunglasses', value: 'sunglass' },
    { label: 'Lens', value: 'lens' }
  ]

  return (
    <Container className="max-w-none space-y-8">
      <PageHeader
        title="Inventory"
        subtitle="Manage and track all store product inventory."
        breadcrumbs={[{ label: 'Dashboard', path: '/manager/dashboard' }, { label: 'Products' }]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <SummaryCard
          label="Total Products"
          value={totalProducts}
          percent="—"
          isUp={true}
          icon={<IoCubeOutline className="text-xl" />}
          iconBg="bg-mint-50 text-mint-700"
        />
        <SummaryCard
          label="Frames"
          value={frameCount}
          percent={totalProducts ? Math.round((frameCount / totalProducts) * 100) + '%' : '0%'}
          isUp={true}
          icon={<IoShirtOutline className="text-xl" />}
          iconBg="bg-purple-50 text-purple-600"
        />
        <SummaryCard
          label="Sunglasses"
          value={sunglassCount}
          percent={totalProducts ? Math.round((sunglassCount / totalProducts) * 100) + '%' : '0%'}
          isUp={false}
          icon={<IoSparklesOutline className="text-xl" />}
          iconBg="bg-sky-50 text-sky-600"
        />
        <SummaryCard
          label="Low Variant"
          value={lowStockCount}
          percent="—"
          isUp={false}
          icon={<IoAlertCircleOutline className="text-xl" />}
          iconBg="bg-orange-50 text-orange-600"
        />
      </div>

      {/* Type Filter Tabs */}
      <div className="flex items-center gap-2">
        {typeTabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setTypeFilter(tab.value)
              setPage(1)
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              typeFilter === tab.value
                ? 'bg-mint-500 text-white shadow-lg shadow-mint-100/50'
                : 'bg-white text-slate-500 ring-1 ring-neutral-100 hover:bg-neutral-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-[32px] border-none shadow-sm ring-1 ring-neutral-100/50 overflow-hidden">
        <div className="p-6 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
              Product List
            </p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {pagination?.total ?? '—'}
              </h2>
              <span className="text-[11px] font-medium text-slate-400">products</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <IoSearchOutline
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search product..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
                className="w-full md:w-64 pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all h-10"
              />
            </div>
            <button
              onClick={() => refetch()}
              className="flex items-center justify-center gap-2 px-4 h-10 bg-neutral-50 rounded-xl border border-neutral-100 text-neutral-400 hover:text-mint-600 transition-colors"
            >
              <IoRefreshOutline />
            </button>
            <button
              onClick={() => navigate('/manager/products/add')}
              className="hidden md:flex items-center gap-2 px-5 h-10 bg-mint-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-mint-100/50 hover:bg-mint-700 transition-all active:scale-95"
            >
              <IoAddOutline size={16} />
              Add Product
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-mint-200 border-t-mint-600 rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <IoCubeOutline size={48} className="mb-4 opacity-30" />
            <p className="text-sm font-medium">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50/50 text-[11px] text-slate-400 font-semibold tracking-wider uppercase border-b border-neutral-100">
                <tr>
                  <th className="px-6 py-4 w-[35%]">Product</th>
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-center">Variants</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="group hover:bg-neutral-50/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/manager/products/${p.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center shrink-0">
                          {p.defaultVariantImage ? (
                            <img
                              src={p.defaultVariantImage}
                              alt={p.nameBase}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          ) : (
                            <IoCubeOutline className="text-neutral-400" size={20} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-700 truncate group-hover:text-mint-600 transition-colors">
                            {p.nameBase}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">{p.skuBase}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-500">{p.brand}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-50 text-slate-600 ring-1 ring-slate-100 capitalize">
                        {p.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          {formatPrice(p.defaultVariantFinalPrice)}
                        </p>
                        {p.defaultVariantPrice !== p.defaultVariantFinalPrice && (
                          <p className="text-[10px] text-slate-400 line-through">
                            {formatPrice(p.defaultVariantPrice)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-mint-50 text-mint-700 text-xs font-bold">
                        {p.totalVariants}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/manager/products/${p.id}`)
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-mint-600 bg-mint-50 hover:bg-mint-100 transition-colors"
                      >
                        <IoEyeOutline size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-6 border-t border-neutral-50 flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} products)
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-neutral-100 text-neutral-400 hover:text-mint-600 transition-all disabled:opacity-30"
              >
                <IoChevronBackOutline />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        page === p
                          ? 'bg-mint-500 text-white shadow-lg shadow-mint-100'
                          : 'bg-white text-neutral-400 hover:bg-neutral-50'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-neutral-100 text-neutral-400 hover:text-mint-600 transition-all disabled:opacity-30"
              >
                <IoChevronForwardOutline />
              </button>
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}

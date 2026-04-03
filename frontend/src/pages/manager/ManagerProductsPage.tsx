import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  IoFilterOutline,
  IoTrashOutline
} from 'react-icons/io5'

import { Container, ConfirmationModal } from '@/shared/components/ui-core'
import { PageHeader } from '@/features/sales/components/common'
import { useAdminProducts } from '@/features/manager/hooks'
import { toast } from 'react-hot-toast'
import { VNDPrice } from '@/shared/components/ui/vnd-price/VNDPrice'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'

const SummaryCard: React.FC<{
  label: string
  value: string | number
  percent: string
  isUp: boolean
  icon: React.ReactNode
  iconBg: string
  isActive?: boolean
  onClick?: () => void
}> = ({ label, value, percent, isUp, icon, iconBg, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm transition-all cursor-pointer active:scale-95 ${
      isActive ? 'ring-2 ring-mint-500 ring-offset-2' : 'hover:border-mint-200 hover:shadow-md'
    }`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{label}</p>
        <h3 className="text-xl font-bold mt-1 text-slate-800 tracking-tight">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl transition-transform ${iconBg}`}>{icon}</div>
    </div>
    <div className="mt-4 flex items-center gap-2 text-xs">
      <span className={`font-bold ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
        {isUp ? '↑' : '↓'} {percent}
      </span>
      <span className="text-slate-400">vs last month</span>
    </div>
  </div>
)

export default function ManagerProductsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined)
  const [page, setPage] = useState(1)
  const limit = 10
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null)

  const { data, isLoading, refetch } = useAdminProducts(
    page,
    limit,
    typeFilter,
    undefined,
    searchQuery || undefined
  )

  const products = data?.data?.productList ?? []
  const pagination = data?.data?.pagination

  const { data: allData } = useAdminProducts(1, 1, undefined)
  const { data: frameData } = useAdminProducts(1, 1, 'frame')
  const { data: sunglassData } = useAdminProducts(1, 1, 'sunglass')
  const { data: lensData } = useAdminProducts(1, 1, 'lens')

  const totalProducts = allData?.data?.pagination?.total ?? 0
  const frameCount = frameData?.data?.pagination?.total ?? 0
  const sunglassCount = sunglassData?.data?.pagination?.total ?? 0
  const lensCount = lensData?.data?.pagination?.total ?? 0

  const typeTabs = [
    { label: 'All Products', value: undefined },
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

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <SummaryCard
          label="Total Products"
          value={totalProducts}
          percent="100%"
          isUp={true}
          icon={<IoCubeOutline className="text-xl" />}
          iconBg="bg-mint-50 text-mint-700"
          isActive={typeFilter === undefined}
          onClick={() => {
            setTypeFilter(undefined)
            setPage(1)
          }}
        />
        <SummaryCard
          label="Frames"
          value={frameCount}
          percent={totalProducts ? Math.round((frameCount / totalProducts) * 100) + '%' : '0%'}
          isUp={true}
          icon={<IoShirtOutline className="text-xl" />}
          iconBg="bg-purple-50 text-purple-600"
          isActive={typeFilter === 'frame'}
          onClick={() => {
            setTypeFilter('frame')
            setPage(1)
          }}
        />
        <SummaryCard
          label="Sunglasses"
          value={sunglassCount}
          percent={totalProducts ? Math.round((sunglassCount / totalProducts) * 100) + '%' : '0%'}
          isUp={false}
          icon={<IoSparklesOutline className="text-xl" />}
          iconBg="bg-sky-50 text-sky-600"
          isActive={typeFilter === 'sunglass'}
          onClick={() => {
            setTypeFilter('sunglass')
            setPage(1)
          }}
        />
        <SummaryCard
          label="Lens"
          value={lensCount}
          percent={totalProducts ? Math.round((lensCount / totalProducts) * 100) + '%' : '0%'}
          isUp={true}
          icon={<IoAlertCircleOutline className="text-xl" />}
          iconBg="bg-orange-50 text-orange-600"
          isActive={typeFilter === 'lens'}
          onClick={() => {
            setTypeFilter('lens')
            setPage(1)
          }}
        />
      </div>

      {}
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-neutral-50/50 shadow-sm relative">
          <div className="p-6 border-b border-neutral-50/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1 max-w-md relative">
              <IoSearchOutline
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
                className="w-full pl-11 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all font-sans"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-semibold transition-all min-w-[160px] justify-between h-[42px] ${
                    isFilterOpen || typeFilter !== undefined
                      ? 'border-mint-500 bg-mint-50 text-mint-600 ring-4 ring-mint-500/10'
                      : 'border-neutral-100 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <IoFilterOutline
                      className={
                        isFilterOpen || typeFilter !== undefined
                          ? 'text-mint-600'
                          : 'text-neutral-400'
                      }
                      size={16}
                    />
                    <span className="capitalize">
                      {typeFilter === undefined ? 'All Types' : typeFilter}
                    </span>
                  </div>
                  <IoChevronBackOutline
                    className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-90' : '-rotate-90'}`}
                    size={12}
                  />
                </button>
                {isFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                    <div className="absolute top-full mt-2 right-0 w-56 z-20 p-2 bg-white rounded-2xl shadow-xl shadow-mint-900/5 border border-neutral-100 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="space-y-1">
                        {typeTabs.map((tab) => (
                          <button
                            key={tab.label}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                              typeFilter === tab.value
                                ? 'bg-mint-50 text-mint-600 font-bold'
                                : 'text-neutral-600 hover:bg-neutral-50 hover:pl-4'
                            }`}
                            onClick={() => {
                              setTypeFilter(tab.value)
                              setPage(1)
                              setIsFilterOpen(false)
                            }}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <button
                disabled={isLoading}
                onClick={() => refetch()}
                className="flex items-center justify-center h-11 w-11 bg-white border border-neutral-200 rounded-xl text-neutral-400 hover:text-mint-600 hover:border-mint-200 transition-all active:scale-95 disabled:opacity-50"
              >
                <IoRefreshOutline className={isLoading ? 'animate-spin' : ''} size={20} />
              </button>
              <button
                onClick={() => navigate('/manager/products/add')}
                className="flex items-center gap-2 px-6 h-11 bg-mint-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-mint-100/50 hover:bg-mint-700 transition-all active:scale-95"
              >
                <IoAddOutline size={18} />
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
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
            <table className="w-full text-left border-collapse">
              <thead className="bg-white text-[11px] text-neutral-400 font-semibold tracking-widest uppercase border-b border-neutral-50/50">
                <tr>
                  <th className="px-6 py-5 w-[35%]">Product</th>
                  <th className="px-6 py-5">Brand</th>
                  <th className="px-6 py-5">Type</th>
                  <th className="px-6 py-5 text-right">Price</th>
                  <th className="px-6 py-5 text-center">Variants</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {products.map((p) => {
                  const productId = (p as any).id || (p as any)._id

                  return (
                  <tr
                    key={productId}
                    className="group hover:bg-neutral-50 transition-colors cursor-pointer"
                    onClick={() => {
                      if (!productId) return
                      navigate(`/manager/products/${productId}`)
                    }}
                  >
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 border border-neutral-100 shadow-sm shrink-0 overflow-hidden">
                          {p.defaultVariantImage ? (
                            <img
                              src={p.defaultVariantImage}
                              alt={p.nameBase}
                              className="w-full h-full object-contain p-2 transition-transform group-hover:scale-110"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          ) : (
                            <IoCubeOutline size={24} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 leading-none mb-1.5 truncate group-hover:text-mint-600 transition-colors">
                            {p.nameBase}
                          </p>
                          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider truncate">
                            {p.skuBase}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-primary">
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-tight">
                        {p.brand}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-100 font-primary">
                        {p.type}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right font-primary">
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                          <VNDPrice amount={p.defaultVariantFinalPrice} />
                        </p>
                        {p.defaultVariantPrice !== p.defaultVariantFinalPrice && (
                          <p className="text-[10px] font-semibold text-neutral-400 line-through">
                            <VNDPrice amount={p.defaultVariantPrice} />
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-mint-50 text-mint-700 text-xs font-bold ring-1 ring-mint-100">
                        {p.totalVariants}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (!productId) return
                            navigate(`/manager/products/${productId}/edit`)
                          }}
                          className="p-2.5 bg-mint-50 text-mint-600 rounded-xl hover:bg-mint-100 transition-all active:scale-90"
                          title="Edit Product"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="w-4 h-4 fill-none stroke-current stroke-2"
                          >
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (!productId) return
                            setProductToDelete({ id: productId, name: p.nameBase })
                            setIsDeleteModalOpen(true)
                          }}
                          className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all active:scale-90"
                          title="Delete Product"
                        >
                          <IoTrashOutline size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {}
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

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setProductToDelete(null)
        }}
        onConfirm={async () => {
          if (!productToDelete) return
          try {
            await httpClient.delete(ENDPOINTS.ADMIN.PRODUCT_DETAIL(productToDelete.id))
            toast.success(`Product "${productToDelete.name}" deleted successfully`)
            refetch()
          } catch (error: any) {
            console.error('Delete product failed:', error)
            toast.error(error.message || 'Failed to delete product')
          } finally {
            setIsDeleteModalOpen(false)
            setProductToDelete(null)
          }
        }}
        title="Delete Product"
        message={`Are you sure you want to delete the product "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Product"
        cancelText="Cancel"
        type="danger"
      />
    </Container>
  )
}

import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@/components'
import { PageHeader } from '@/features/sales/components/common'
import { useAdminProductDetail } from '@/features/manager/hooks'
import {
  IoArrowBackOutline,
  IoCubeOutline,
  IoLayersOutline,
  IoResizeOutline,
  IoColorPaletteOutline,
  IoPricetagOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoChevronForwardOutline,
  IoChevronBackOutline,
  IoPencilOutline,
  IoTrashOutline
} from 'react-icons/io5'
import type { AdminProductVariant } from '@/shared/types'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import { toast } from 'react-hot-toast'
import { ConfirmationModal } from '@/shared/components/ui-core'

const formatter = new Intl.NumberFormat('vi-VN')

function formatPrice(price: number) {
  if (price >= 1_000_000) {
    return formatter.format(price) + '₫'
  }
  return '$' + price.toFixed(2)
}

function genderLabel(g: string) {
  switch (g) {
    case 'M':
      return 'Male'
    case 'F':
      return 'Female'
    case 'U':
      return 'Unisex'
    default:
      return g
  }
}

function capitalize(str: string) {
  if (!str) return '—'
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export default function ManagerProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useAdminProductDetail(id ?? '')

  const product = data?.data?.product
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0)
  const [imgIdx, setImgIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const handleDeleteClick = () => {
    setIsConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!id) return
    setIsConfirmOpen(false)
    setIsDeleting(true)
    try {
      await httpClient.delete(ENDPOINTS.ADMIN.PRODUCT_DETAIL(id))
      toast.success('Product deleted successfully!')
      navigate('/manager/products')
    } catch (error: unknown) {
      console.error('Delete product failed:', error)
      const message = error instanceof Error ? error.message : 'Failed to delete product'
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <Container className="max-w-none">
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 border-4 border-mint-200 border-t-mint-600 rounded-full animate-spin" />
        </div>
      </Container>
    )
  }

  if (isError || !product) {
    return (
      <Container className="max-w-none">
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
          <IoCubeOutline size={56} className="mb-4 opacity-30" />
          <p className="text-lg font-semibold mb-2">Product not found</p>
          <button
            onClick={() => navigate('/manager/products')}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-mint-600 text-white rounded-xl text-sm font-semibold hover:bg-mint-700 transition-all"
          >
            <IoArrowBackOutline size={16} />
            Back to Products
          </button>
        </div>
      </Container>
    )
  }

  const selectedVariant: AdminProductVariant =
    product.variants[selectedVariantIdx] ?? product.variants[0]
  const images = selectedVariant?.imgs ?? []
  const currentImg = images[imgIdx] ?? ''
  const defaultVariant = product.variants.find((v) => v.isDefault) ?? product.variants[0]
  const spec = product.spec

  return (
    <>
      <Container className="max-w-none space-y-8">
        <PageHeader
          title={product.nameBase || 'Unnamed Product'}
          subtitle={`SKU: ${product.skuBase} · ${product.brand || 'No Brand'} · ${capitalize(product.type)}`}
          breadcrumbs={[
            { label: 'Dashboard', path: '/manager/dashboard' },
            { label: 'Products', path: '/manager/products' },
            { label: product.nameBase || 'Unnamed Product' }
          ]}
        />

        {}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/manager/products')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-mint-600 transition-colors"
          >
            <IoArrowBackOutline size={16} />
            Back to Products
          </button>
          <button
            onClick={() => navigate(`/manager/products/${id}/edit`)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-mint-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-mint-100/50 hover:bg-mint-700 transition-all active:scale-95"
          >
            <IoPencilOutline size={16} />
            Edit Product
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-semibold ring-1 ring-red-100 hover:bg-red-100 transition-all active:scale-95 disabled:opacity-50"
          >
            <IoTrashOutline size={16} />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl ring-1 ring-neutral-100/50 shadow-sm overflow-hidden">
              {}
              <div className="relative aspect-square bg-neutral-50 flex items-center justify-center overflow-hidden">
                {currentImg ? (
                  <img
                    src={currentImg}
                    alt={selectedVariant.name}
                    className="w-full h-full object-contain p-4 transition-opacity duration-300"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = ''
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                ) : (
                  <IoCubeOutline size={80} className="text-neutral-200" />
                )}

                {}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-500 hover:text-mint-600 shadow-lg transition-all"
                    >
                      <IoChevronBackOutline size={16} />
                    </button>
                    <button
                      onClick={() => setImgIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-500 hover:text-mint-600 shadow-lg transition-all"
                    >
                      <IoChevronForwardOutline size={16} />
                    </button>
                  </>
                )}

                {}
                {images.length > 1 && (
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-[10px] font-semibold text-white">
                    {imgIdx + 1} / {images.length}
                  </div>
                )}
              </div>

              {}
              {images.length > 1 && (
                <div className="flex gap-2 p-4">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setImgIdx(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        imgIdx === idx
                          ? 'border-mint-500 shadow-lg'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {}
          <div className="lg:col-span-7 space-y-6">
            {}
            <div className="bg-white rounded-3xl ring-1 ring-neutral-100/50 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[12px] font-bold text-slate-400 tracking-wider uppercase">
                    Default Price
                  </p>
                  <div className="flex items-baseline gap-3 mt-1">
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                      {formatPrice(defaultVariant.finalPrice)}
                    </h3>
                    {defaultVariant.price !== defaultVariant.finalPrice && (
                      <span className="text-lg text-slate-400 line-through">
                        {formatPrice(defaultVariant.price)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex px-3 py-1.5 rounded-xl text-xs font-semibold bg-mint-50 text-mint-700 ring-1 ring-mint-100">
                    {capitalize(product.type)}
                  </span>
                  <span className="inline-flex px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 text-purple-600 ring-1 ring-purple-100">
                    {product.brand || 'No Brand'}
                  </span>
                </div>
              </div>

              {}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-neutral-50">
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Total Variants</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {product.variants.length}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Total Stock</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {product.variants.reduce((sum, v) => sum + v.stock, 0)}
                  </p>
                </div>
                {product.type === 'lens' ? (
                  <>
                    <div>
                      <p className="text-[11px] font-medium text-slate-400">Origin</p>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">
                        {spec?.origin || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-400">Features</p>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">
                        {spec?.feature?.length ?? 0}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-[11px] font-medium text-slate-400">Shape</p>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">
                        {spec?.shape || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-400">Gender</p>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">
                        {spec?.gender ? genderLabel(spec.gender) : '—'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {}
            {spec && (
              <div className="bg-white rounded-3xl ring-1 ring-neutral-100/50 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                    <IoResizeOutline size={18} />
                  </div>
                  <h4 className="text-[13px] font-bold text-slate-700">Specifications</h4>
                </div>

                {product.type === 'lens' ? (
                  <div className="space-y-5">
                    {spec.feature && spec.feature.length > 0 && (
                      <div>
                        <p className="text-[11px] font-medium text-slate-400 mb-2">Features</p>
                        <div className="flex flex-wrap gap-2">
                          {spec.feature.map((f) => (
                            <span
                              key={f}
                              className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 ring-1 ring-sky-100"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <SpecItem label="Origin" value={spec.origin || '—'} />
                      <SpecItem label="Brand" value={product.brand || 'No Brand'} />
                      <SpecItem label="Type" value={capitalize(product.type)} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <SpecItem label="Material" value={spec.material?.join(', ') || '—'} />
                    <SpecItem label="Shape" value={spec.shape || '—'} />
                    <SpecItem label="Style" value={spec.style || '—'} />
                    <SpecItem label="Gender" value={genderLabel(spec.gender || '—')} />
                    <SpecItem label="Weight" value={spec.weight ? `${spec.weight}g` : '—'} />
                    {spec.dimensions && (
                      <>
                        <SpecItem label="Width" value={`${spec.dimensions.width}mm`} />
                        <SpecItem label="Height" value={`${spec.dimensions.height}mm`} />
                        <SpecItem label="Depth" value={`${spec.dimensions.depth}mm`} />
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {}
            <div className="bg-white rounded-3xl ring-1 ring-neutral-100/50 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <IoLayersOutline size={18} />
                </div>
                <h4 className="text-[13px] font-bold text-slate-700">
                  Variants ({product.variants.length})
                </h4>
              </div>

              <div className="space-y-3">
                {product.variants.map((v, idx) => (
                  <VariantItem
                    key={v.sku}
                    variant={v}
                    isActive={selectedVariantIdx === idx}
                    onClick={() => {
                      setSelectedVariantIdx(idx)
                      setImgIdx(0)
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.nameBase || 'this product'}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  )
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
      <p className="text-[10px] font-medium text-slate-400 mb-0.5">{label}</p>
      <p className="text-xs font-semibold text-slate-700">{value}</p>
    </div>
  )
}

const VariantItem = React.memo(
  ({
    variant,
    isActive,
    onClick
  }: {
    variant: AdminProductVariant
    isActive: boolean
    onClick: () => void
  }) => {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left p-4 rounded-2xl border transition-all ${
          isActive
            ? 'border-mint-300 bg-mint-50/30 ring-2 ring-mint-200 shadow-sm'
            : 'border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {variant.options.some((o) => o.showType === 'color') ? (
              <div className="flex items-center gap-1.5">
                {variant.options
                  .filter((o) => o.showType === 'color')
                  .map((o) => (
                    <div
                      key={o.attributeId}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: o.value }}
                      title={o.label}
                    />
                  ))}
              </div>
            ) : (
              <IoColorPaletteOutline className="text-slate-400" size={18} />
            )}

            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-700 truncate">
                {variant.options.map((o) => o.label).join(' · ')}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">{variant.sku}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 ml-4">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-800">{formatPrice(variant.finalPrice)}</p>
              {variant.price !== variant.finalPrice && (
                <p className="text-[10px] text-slate-400 line-through">
                  {formatPrice(variant.price)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <IoPricetagOutline className="text-slate-400" size={12} />
              <span className="text-[11px] font-medium text-slate-500">Stock: {variant.stock}</span>
            </div>
            {variant.mode === 'AVAILABLE' ? (
              <IoCheckmarkCircle className="text-emerald-500" size={18} />
            ) : (
              <IoCloseCircle className="text-red-400" size={18} />
            )}
            {variant.isDefault && (
              <span className="px-2 py-0.5 rounded-md bg-mint-100 text-mint-700 text-[9px] font-bold uppercase">
                Default
              </span>
            )}
          </div>
        </div>
      </button>
    )
  }
)

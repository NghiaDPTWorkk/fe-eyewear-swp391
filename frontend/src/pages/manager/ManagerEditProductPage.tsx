import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { IoChevronBackOutline, IoSaveOutline } from 'react-icons/io5'
import { PageHeader } from '@/features/sales/components/common'
import { Container } from '@/components'

import { ProductBaseFields } from './add-product/components/ProductBaseFields'
import { FrameSpecFields } from './add-product/components/FrameSpecFields'
import { LensSpecFields } from './add-product/components/LensSpecFields'
import { VariantsEditor } from './add-product/components/VariantsEditor'
import { OptionsConfigEditor } from './add-product/components/OptionsConfigEditor'
import type { ProductCreateFormState } from './add-product/types/product-create.types'

import type { ProductEditFormState } from './edit-product/types/product-edit.types'
import { mapProductToFormState, buildUpdatePayload } from './edit-product/utils/product-edit.utils'

import { useAdminProductDetail } from '@/features/manager/hooks'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import { toast } from 'react-hot-toast'

export default function ManagerEditProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useAdminProductDetail(id ?? '')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const [state, setState] = useState<ProductEditFormState>({
    type: 'frame',
    nameBase: '',
    brand: '',
    categoriesText: '',
    specFrame: {
      materialText: '',
      shape: '',
      style: '',
      gender: 'N',
      weightText: '',
      dimensionsEnabled: false,
      dimensions: { widthText: '', heightText: '', depthText: '' }
    },
    specLens: {
      featureText: '',
      origin: ''
    },
    variants: [
      {
        sku: '',
        name: '',
        slug: '',
        priceText: '',
        finalPriceText: '',
        stockText: '',
        imgs: [],
        isDefault: true,
        mode: 'AVAILABLE',
        virTryOnUrl: '',
        options: []
      }
    ],
    optionsConfig: []
  })

  useEffect(() => {
    const product = data?.data?.product
    if (product && !isInitialized) {
      setState(mapProductToFormState(product))
      setIsInitialized(true)
    }
  }, [data, isInitialized])

  const handleBaseChange = (patch: Record<string, any>) => {
    setState((prev) => ({ ...prev, ...patch }))
  }

  const handleSpecFrameChange = (specFrame: ProductCreateFormState['specFrame']) => {
    setState((prev) => ({ ...prev, specFrame }))
  }

  const handleSpecLensChange = (specLens: ProductCreateFormState['specLens']) => {
    setState((prev) => ({ ...prev, specLens }))
  }

  const handleVariantsChange = (variants: any[]) => {
    setState((prev) => ({
      ...prev,
      variants: variants.map((v, i) => ({
        ...v,
        mode: prev.variants[i]?.mode ?? 'AVAILABLE'
      }))
    }))
  }

  const handleVariantModeChange = (idx: number, mode: 'AVAILABLE' | 'PRE_ORDER') => {
    setState((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => (i === idx ? { ...v, mode } : v))
    }))
  }

  const validateForm = () => {
    if (!state.nameBase.trim()) {
      toast.error('Product name is required')
      return false
    }
    if (!state.brand) {
      toast.error('Brand is required')
      return false
    }
    if (!state.categoriesText || state.categoriesText.trim() === '') {
      toast.error('At least one category is required')
      return false
    }
    if (state.variants.length === 0) {
      toast.error('At least one variant is required')
      return false
    }
    for (const v of state.variants) {
      if (!v.priceText || isNaN(Number(v.priceText))) {
        toast.error('All variants must have a valid price')
        return false
      }
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const payload = buildUpdatePayload(state)
      await httpClient.patch(ENDPOINTS.ADMIN.PRODUCT_DETAIL(id!), payload)
      toast.success('Product updated successfully!')
      navigate(`/manager/products/${id}`)
    } catch (error: unknown) {
      console.error('Update product failed:', error)
      const message = error instanceof Error ? error.message : 'Failed to update product'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
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

  if (isError || !data?.data?.product) {
    return (
      <Container className="max-w-none">
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
          <p className="text-lg font-semibold mb-2">Product not found</p>
          <button
            onClick={() => navigate('/manager/products')}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-mint-600 text-white rounded-xl text-sm font-semibold hover:bg-mint-700 transition-all"
          >
            Back to Products
          </button>
        </div>
      </Container>
    )
  }

  const createCompatibleState = {
    ...state,
    type: (state.type === 'sunglass' ? 'frame' : state.type) as ProductCreateFormState['type'],
    slugBase: '',
    skuBase: ''
  } as ProductCreateFormState

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {}
      <div className="lg:col-span-12 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 hover:bg-neutral-100 rounded-2xl transition-colors shrink-0"
        >
          <IoChevronBackOutline size={24} />
        </button>
        <PageHeader
          title="Edit Product"
          subtitle={`Modified details for: ${data.data.product.nameBase}`}
          breadcrumbs={[
            { label: 'Dashboard', path: '/manager/dashboard' },
            { label: 'Products', path: '/manager/products' },
            { label: data.data.product.nameBase, path: `/manager/products/${id}` },
            { label: 'Edit' }
          ]}
        />
      </div>

      <form
        className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        {}
        <div className="space-y-5">
          <section className="bg-white rounded-2xl border border-neutral-100/50 shadow-sm p-4 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-neutral-50 pb-3">
              <div className="w-8 h-8 rounded-lg bg-mint-50 flex items-center justify-center text-mint-600">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-700">General Information</h3>
            </div>
            <ProductBaseFields state={createCompatibleState} onChange={handleBaseChange} />
          </section>

          <section className="bg-white rounded-2xl border border-neutral-100/50 shadow-sm p-4 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-neutral-50 pb-3">
              <div className="w-8 h-8 rounded-lg bg-mint-50 flex items-center justify-center text-mint-600">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-700">Specifications</h3>
            </div>
            {state.type === 'frame' || state.type === 'sunglass' ? (
              <FrameSpecFields specFrame={state.specFrame} onChange={handleSpecFrameChange} />
            ) : (
              <LensSpecFields specLens={state.specLens} onChange={handleSpecLensChange} />
            )}
          </section>
        </div>

        {}
        <div className="space-y-5">
          <section className="bg-white rounded-2xl border border-neutral-100/50 shadow-sm p-4 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-neutral-50 pb-3">
              <div className="w-8 h-8 rounded-lg bg-mint-50 flex items-center justify-center text-mint-600">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2">
                  <path d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-700">Options & Configurations</h3>
            </div>
            <OptionsConfigEditor
              optionsConfig={state.optionsConfig}
              onChange={(optionsConfig) => setState((prev) => ({ ...prev, optionsConfig }))}
            />
          </section>

          <section className="bg-white rounded-2xl border border-neutral-100/50 shadow-sm p-4 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-neutral-50 pb-3">
              <div className="w-8 h-8 rounded-lg bg-mint-50 flex items-center justify-center text-mint-600">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-700">Product Variants</h3>
            </div>
            <VariantsEditor
              variants={state.variants}
              optionsConfig={state.optionsConfig}
              nameBase={state.nameBase}
              onChange={handleVariantsChange}
            />
          </section>

          <div className="bg-neutral-50/50 rounded-2xl p-4 space-y-4 border border-neutral-100/50 shadow-sm">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-700 tracking-wide">
                Variant Availability Mode
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {state.variants.map((v, idx) => {
                  const variantLabel =
                    v.options.map((o) => o.label).join(' · ') || `Variant #${idx + 1}`
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border transition-all ${
                        v.mode === 'PRE_ORDER'
                          ? 'border-amber-200 bg-amber-50/30'
                          : 'border-emerald-200 bg-emerald-50/30'
                      }`}
                    >
                      <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider truncate">
                        {variantLabel}
                      </p>
                      <select
                        value={v.mode}
                        onChange={(e) =>
                          handleVariantModeChange(idx, e.target.value as 'AVAILABLE' | 'PRE_ORDER')
                        }
                        className="w-full px-2 py-1.5 bg-white border border-neutral-100 rounded-lg text-[11px] font-semibold focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all cursor-pointer"
                      >
                        <option value="AVAILABLE">✅ Available</option>
                        <option value="PRE_ORDER">📦 Pre-order</option>
                      </select>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="pt-4 flex gap-3 border-t border-neutral-200/50">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="px-6 py-3 border border-neutral-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-white hover:shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-8 py-3 bg-mint-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-mint-100/50 hover:bg-mint-700 hover:shadow-mint-200/50 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <IoSaveOutline size={18} />
                {isSubmitting ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

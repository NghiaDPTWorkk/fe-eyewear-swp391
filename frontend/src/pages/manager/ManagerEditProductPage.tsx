import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { IoSaveOutline } from 'react-icons/io5'
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
    <div className="max-w-4xl mx-auto space-y-8 pb-48">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <PageHeader
          title="Edit Product"
          subtitle={`Modify details for: ${data.data.product.nameBase}`}
          breadcrumbs={[
            { label: 'Dashboard', path: '/manager/dashboard' },
            { label: 'Products', path: '/manager/products' },
            { label: data.data.product.nameBase, path: `/manager/products/${id}` },
            { label: 'Edit' }
          ]}
        />
      </div>

      <form
        className="space-y-8"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        {/* Section 1 & 2: General & Specifications combined */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <section className="bg-white rounded-[32px] border border-neutral-100/50 shadow-sm p-8 space-y-6 h-full">
            <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
              <div className="w-10 h-10 rounded-2xl bg-mint-50 flex items-center justify-center text-mint-600">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                  <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                  <path d="M13 2v7h7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">General</h3>
                <p className="text-xs font-bold text-slate-400">Core identity</p>
              </div>
            </div>
            <ProductBaseFields state={createCompatibleState} onChange={handleBaseChange} />
          </section>

          <section className="bg-white rounded-[32px] border border-neutral-100/50 shadow-sm p-8 space-y-6 h-full">
            <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
              <div className="w-10 h-10 rounded-2xl bg-mint-50 flex items-center justify-center text-mint-600">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                  Specifications
                </h3>
                <p className="text-xs font-bold text-slate-400">Materials & Style</p>
              </div>
            </div>
            {state.type === 'frame' || state.type === 'sunglass' ? (
              <FrameSpecFields specFrame={state.specFrame} onChange={handleSpecFrameChange} />
            ) : (
              <LensSpecFields specLens={state.specLens} onChange={handleSpecLensChange} />
            )}
          </section>
        </div>

        {/* Section 3: Options & Variants */}
        <section className="bg-white rounded-[32px] border border-neutral-100/50 shadow-sm p-8 space-y-8">
          <div className="space-y-8">
            <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
              <div className="w-10 h-10 rounded-2xl bg-mint-50 flex items-center justify-center text-mint-600">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                  <path d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                  Configurations
                </h3>
                <p className="text-xs font-bold text-slate-400">Attributes and variant system</p>
              </div>
            </div>

            <div className="space-y-12">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                  Custom Attributes
                </h4>
                <OptionsConfigEditor
                  optionsConfig={state.optionsConfig}
                  onChange={(optionsConfig) => setState((prev) => ({ ...prev, optionsConfig }))}
                />
              </div>

              <div className="space-y-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                  Product Variants
                </h4>
                <VariantsEditor
                  variants={state.variants}
                  optionsConfig={state.optionsConfig}
                  nameBase={state.nameBase}
                  onChange={handleVariantsChange}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Availability Mode */}
        <section className="bg-white rounded-[32px] border border-neutral-100/50 shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                Availability Settings
              </h3>
              <p className="text-xs font-bold text-slate-400">
                Manage Pre-order status per variant
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {state.variants.map((v, idx) => {
              const variantLabel =
                v.options.map((o) => o.label).join(' · ') || `Variant #${idx + 1}`
              const isPreOrder = v.mode === 'PRE_ORDER'

              return (
                <div
                  key={idx}
                  className={`p-5 rounded-[24px] border transition-all duration-300 ${
                    isPreOrder
                      ? 'border-amber-200 bg-amber-50/20 shadow-sm shadow-amber-100/20'
                      : 'border-emerald-100 bg-emerald-50/20 shadow-sm shadow-emerald-100/20'
                  }`}
                >
                  <label className="block space-y-3 cursor-pointer">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate px-1">
                      {variantLabel}
                    </p>
                    <select
                      value={v.mode}
                      onChange={(e) =>
                        handleVariantModeChange(idx, e.target.value as 'AVAILABLE' | 'PRE_ORDER')
                      }
                      className="w-full px-4 py-3 bg-white border border-neutral-200/50 rounded-2xl text-[13px] font-extrabold focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all cursor-pointer shadow-sm"
                    >
                      <option value="AVAILABLE"> Available Now</option>
                      <option value="PRE_ORDER"> Pre-order Mode</option>
                    </select>
                  </label>
                </div>
              )
            })}
          </div>
        </section>

        {/* Integrated Action Bar - Bottom flow */}
        <div className="mt-16 flex justify-center pb-12">
          <div className="w-full max-w-2xl border border-white/10 rounded-[40px] p-3 shadow-2xl flex items-center justify-between px-10 transition-all ring-1 ring-white/5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="px-8 py-3 text-neutral-400 hover:text-slate-950 transition-colors text-sm font-extrabold active:scale-95 disabled:opacity-50"
            >
              Discard Changes
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-12 py-4 bg-mint-400 text-slate-950 hover:bg-mint-500 rounded-3xl text-sm font-black shadow-xl active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <IoSaveOutline size={20} />
              )}
              {isSubmitting ? 'Syncing...' : 'Update Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

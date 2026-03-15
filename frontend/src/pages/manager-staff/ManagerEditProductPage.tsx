import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { IoChevronBackOutline, IoSaveOutline } from 'react-icons/io5'
import { PageHeader } from '@/features/sale-staff/components/common'
import { Container } from '@/components'

import { ProductBaseFields } from './add-product/components/ProductBaseFields'
import { FrameSpecFields } from './add-product/components/FrameSpecFields'
import { LensSpecFields } from './add-product/components/LensSpecFields'
import { VariantsEditor } from './add-product/components/VariantsEditor'
import { OptionsConfigEditor } from './add-product/components/OptionsConfigEditor'
import type { ProductCreateFormState } from './add-product/types/product-create.types'

import type { ProductEditFormState } from './edit-product/types/product-edit.types'
import { mapProductToFormState, buildUpdatePayload } from './edit-product/utils/product-edit.utils'

import { useAdminProductDetail } from '@/features/manager-staff/hooks/useAdminProducts'
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

  const handleSubmit = async () => {
    if (!state.nameBase) {
      toast.error('Name is required')
      return
    }

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
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-neutral-100 rounded-xl transition-colors shrink-0"
        >
          <IoChevronBackOutline size={24} />
        </button>
        <PageHeader
          title="Edit Product"
          subtitle={`Editing: ${data.data.product.nameBase}`}
          breadcrumbs={[
            { label: 'Dashboard', path: '/manager/dashboard' },
            { label: 'Products', path: '/manager/products' },
            { label: data.data.product.nameBase, path: `/manager/products/${id}` },
            { label: 'Edit' }
          ]}
        />
      </div>

      <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm overflow-hidden p-6 md:p-8 lg:p-10">
        <form
          className="space-y-10"
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          {}
          <ProductBaseFields state={createCompatibleState} onChange={handleBaseChange} />

          {}
          {state.type === 'frame' || state.type === 'sunglass' ? (
            <FrameSpecFields specFrame={state.specFrame} onChange={handleSpecFrameChange} />
          ) : (
            <LensSpecFields specLens={state.specLens} onChange={handleSpecLensChange} />
          )}

          {}
          <OptionsConfigEditor
            optionsConfig={state.optionsConfig}
            onChange={(optionsConfig) => setState((prev) => ({ ...prev, optionsConfig }))}
          />

          {}
          <VariantsEditor
            variants={state.variants}
            optionsConfig={state.optionsConfig}
            nameBase={state.nameBase}
            onChange={handleVariantsChange}
          />

          {}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <h3 className="text-sm font-extrabold text-gray-900 tracking-wide">
              Variant Availability Mode
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {state.variants.map((v, idx) => {
                const variantLabel =
                  v.options.map((o) => o.label).join(' · ') || `Variant #${idx + 1}`
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      v.mode === 'PRE_ORDER'
                        ? 'border-amber-200 bg-amber-50/30'
                        : 'border-emerald-200 bg-emerald-50/30'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-700 mb-2 truncate">{variantLabel}</p>
                    <select
                      value={v.mode}
                      onChange={(e) =>
                        handleVariantModeChange(idx, e.target.value as 'AVAILABLE' | 'PRE_ORDER')
                      }
                      className="w-full px-3 py-2 bg-white border border-neutral-100 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all"
                    >
                      <option value="AVAILABLE">✅ Available (Có sẵn)</option>
                      <option value="PRE_ORDER">📦 Pre-order (Đặt trước)</option>
                    </select>
                  </div>
                )
              })}
            </div>
          </div>

          {}
          <div className="pt-6 flex gap-4 border-t border-neutral-50">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="px-8 py-4 border border-neutral-200 text-gray-700 rounded-2xl text-sm font-bold hover:bg-neutral-50 transition-all active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-8 py-4 bg-mint-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-mint-100/30 hover:bg-mint-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <IoSaveOutline size={20} />
              {isSubmitting ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoSaveOutline } from 'react-icons/io5'
import { PageHeader } from '@/features/staff/components/common'

import { ProductBaseFields } from './add-product/components/ProductBaseFields'
import { FrameSpecFields } from './add-product/components/FrameSpecFields'
import { LensSpecFields } from './add-product/components/LensSpecFields'
import { VariantsEditor } from './add-product/components/VariantsEditor'
import { OptionsConfigEditor } from './add-product/components/OptionsConfigEditor'
import { VoiceDatePicker } from './add-product/components/VoiceDatePicker'
import type { ProductCreateFormState } from './add-product/types/product-create.types'
import { httpClient } from '@/api/apiClients'
import { toast } from 'react-hot-toast'

export default function ManagerAddProductPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [state, setState] = useState<ProductCreateFormState>({
    type: 'frame',
    nameBase: '',
    slugBase: '',
    skuBase: '',
    brand: '',
    categoriesText: '',
    specFrame: {
      materialText: '',
      shape: '',
      style: '',
      gender: 'N',
      weightText: '',
      dimensionsEnabled: false,
      dimensions: {
        widthText: '',
        heightText: '',
        depthText: ''
      }
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
        options: []
      }
    ],
    optionsConfig: [],
    isPreOrder: false,
    preOrderConfig: {
      description: '',
      targetDate: '',
      targetQuantity: '',
      startedDate: '',
      endedDate: ''
    }
  })

  const handleBaseChange = (patch: Partial<ProductCreateFormState>) => {
    setState((prev) => ({ ...prev, ...patch }))
  }

  const handleSpecFrameChange = (specFrame: ProductCreateFormState['specFrame']) => {
    setState((prev) => ({ ...prev, specFrame }))
  }

  const handleSpecLensChange = (specLens: ProductCreateFormState['specLens']) => {
    setState((prev) => ({ ...prev, specLens }))
  }

  const handleVariantsChange = (variants: ProductCreateFormState['variants']) => {
    setState((prev) => ({ ...prev, variants }))
  }

  const handleSubmit = async () => {
    if (!state.nameBase) {
      toast.error('Name is required')
      return
    }

    setIsSubmitting(true)
    try {
      const categories = state.categoriesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const payload: Record<string, unknown> = {
        nameBase: state.nameBase,
        type: state.type,
        brand: state.brand || null,
        categories,
        variants: state.variants.map((v) => ({
          name: v.name || undefined,
          sku: v.sku || undefined,
          slug: v.slug || undefined,
          price: Number(v.priceText),
          finalPrice: Number(v.finalPriceText),
          stock: Number(v.stockText),
          imgs: v.imgs,
          isDefault: v.isDefault,
          options: v.options.map((o) => ({
            attributeId: o.attributeId,
            attributeName: o.attributeName,
            label: o.label,
            showType: o.showType,
            value: o.value
          }))
        }))
      }

      if (state.type === 'frame') {
        payload.spec = {
          material: state.specFrame.materialText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          shape: state.specFrame.shape || undefined,
          style: state.specFrame.style || undefined,
          gender: state.specFrame.gender,
          weight: state.specFrame.weightText ? Number(state.specFrame.weightText) : undefined,
          dimensions: state.specFrame.dimensionsEnabled
            ? {
                width: Number(state.specFrame.dimensions.widthText),
                height: Number(state.specFrame.dimensions.heightText),
                depth: Number(state.specFrame.dimensions.depthText)
              }
            : undefined
        }
      } else {
        payload.spec = {
          feature: state.specLens.featureText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          origin: state.specLens.origin || undefined
        }
      }

      const endpoint = state.isPreOrder ? '/admin/products/pre-order' : '/admin/products'
      console.warn('Creating product at:', endpoint, 'Payload:', payload)
      const response = (await httpClient.post(endpoint, payload)) as any
      console.warn('Create product response (Object):', response)
      console.warn('Create product response (JSON):', JSON.stringify(response))

      if (state.isPreOrder && response.success) {
        let variantSkus: string[] = []

        if (Array.isArray(response.data?.variantSkus)) {
          variantSkus = response.data.variantSkus
        } else if (Array.isArray(response.variantSkus)) {
          variantSkus = response.variantSkus
        } else if (Array.isArray(response.data)) {
          variantSkus = response.data.filter((item: any) => typeof item === 'string')
        } else if (response.data && typeof response.data === 'object') {
          const possibleArray = Object.values(response.data).find((val) => Array.isArray(val))
          if (Array.isArray(possibleArray)) {
            variantSkus = possibleArray.filter((item) => typeof item === 'string')
          }
        }

        console.warn('Discovered variant SKUs:', variantSkus)

        const config = state.preOrderConfig!
        console.warn('Initializing pre-order imports for skus:', variantSkus)

        const importPromises = variantSkus.map((sku: string) => {
          const formatDate = (d: string) => {
            if (!d) return ''
            const date = new Date(d)
            if (isNaN(date.getTime())) return d
            const day = String(date.getDate()).padStart(2, '0')
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const year = date.getFullYear()
            return `${day}-${month}-${year}`
          }

          return httpClient.post('/admin/pre-order-imports', {
            sku,
            description: config.description || `Import product ${sku}`,
            targetDate: formatDate(config.targetDate),
            targetQuantity: Number(config.targetQuantity) || 1,
            startedDate: formatDate(config.startedDate),
            endedDate: formatDate(config.endedDate)
          })
        })

        try {
          if (importPromises.length > 0) {
            await Promise.all(importPromises)
            toast.success('Product and Pre-order imports created successfully!')
          } else {
            console.warn('No variant SKUs returned for pre-order import.')
            toast.success('Product created, but no variants were found for pre-order.')
          }
        } catch (importError) {
          console.error('Pre-order imports failed:', importError)
          toast.error('Product created but some pre-order imports failed to initialize.')
        }
      } else if (state.isPreOrder && !response.success) {
        console.error('Product creation returned failure:', response)
        toast.error(response.message || 'Failed to create pre-order product')
        return
      } else {
        toast.success(
          state.isPreOrder ? 'Pre-order product created!' : 'Product created successfully!'
        )
      }

      navigate('/manager/products')
    } catch (error: unknown) {
      console.error('Create product failed:', error)
      const message = error instanceof Error ? error.message : 'Failed to create product'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Add Product"
        subtitle="Configure base fields, specifications, and variants."
        breadcrumbs={[
          { label: 'Dashboard', path: '/manager/dashboard' },
          { label: 'Products', path: '/manager/products' },
          { label: 'Add Product' }
        ]}
      />

      <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm overflow-hidden p-6 md:p-8 lg:p-10">
        <form
          className="space-y-10"
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          {}
          <ProductBaseFields state={state} onChange={handleBaseChange} />

          {}
          {state.type === 'frame' ? (
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
          <div className="border-t border-neutral-100 pt-10 space-y-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={state.isPreOrder}
                  onChange={(e) => handleBaseChange({ isPreOrder: e.target.checked })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mint-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mint-600 group-hover:opacity-90 transition-opacity"></div>
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-gray-900 group-hover:text-mint-700 transition-colors">
                  Create as Pre-order
                </h3>
                <p className="text-xs text-neutral-500">
                  Enable this if you want to allow pre-ordering for this product.
                </p>
              </div>
            </label>

            {state.isPreOrder && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-mint-50/30 rounded-[24px] border border-mint-100/50 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-700 ml-1">
                    Pre-order Description
                  </label>
                  <textarea
                    value={state.preOrderConfig?.description}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        preOrderConfig: { ...prev.preOrderConfig!, description: e.target.value }
                      }))
                    }
                    placeholder="e.g. Pre-order 100 units for summer collection"
                    className="w-full px-4 py-3 bg-white border border-neutral-100 rounded-2xl text-[14px] focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 ml-1">Target Quantity</label>
                  <input
                    type="number"
                    value={state.preOrderConfig?.targetQuantity}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        preOrderConfig: { ...prev.preOrderConfig!, targetQuantity: e.target.value }
                      }))
                    }
                    placeholder="100"
                    className="w-full px-4 py-3 bg-white border border-neutral-100 rounded-2xl text-[14px] focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all"
                  />
                </div>

                <VoiceDatePicker
                  label="Target Date"
                  value={state.preOrderConfig?.targetDate || ''}
                  onChange={(val) =>
                    setState((prev) => ({
                      ...prev,
                      preOrderConfig: { ...prev.preOrderConfig!, targetDate: val }
                    }))
                  }
                  helperText="Speak: 'Ngày 20 tháng 3'"
                />

                <VoiceDatePicker
                  label="Start Date"
                  value={state.preOrderConfig?.startedDate || ''}
                  onChange={(val) =>
                    setState((prev) => ({
                      ...prev,
                      preOrderConfig: { ...prev.preOrderConfig!, startedDate: val }
                    }))
                  }
                  helperText="Speak: 'Hôm nay'"
                />

                <VoiceDatePicker
                  label="End Date"
                  value={state.preOrderConfig?.endedDate || ''}
                  onChange={(val) =>
                    setState((prev) => ({
                      ...prev,
                      preOrderConfig: { ...prev.preOrderConfig!, endedDate: val }
                    }))
                  }
                  helperText="Speak: 'Ngày mai'"
                />
              </div>
            )}
          </div>

          {}
          <div className="pt-6 flex gap-4 border-t border-neutral-50">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="px-8 py-4 border border-neutral-200 text-gray-700 rounded-2xl text-sm font-bold hover:bg-neutral-50 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-8 py-4 bg-mint-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-mint-100/30 hover:bg-mint-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <IoSaveOutline size={20} />
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

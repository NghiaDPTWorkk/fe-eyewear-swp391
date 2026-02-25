import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoChevronBackOutline, IoSaveOutline } from 'react-icons/io5'
import { Container } from '@/components'
import { PageHeader } from '@/features/sales/components/common'

import { ProductBaseFields } from './add-product/components/ProductBaseFields'
import { FrameSpecFields } from './add-product/components/FrameSpecFields'
import { LensSpecFields } from './add-product/components/LensSpecFields'
import { VariantsEditor } from './add-product/components/VariantsEditor'
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
    ]
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

      const payload: Record<string, any> = {
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

      await httpClient.post('/admin/products', payload)
      toast.success('Product created successfully!')
      navigate('/manager/products')
    } catch (error: any) {
      console.error('Create product failed:', error)
      toast.error(error?.message || 'Failed to create product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container className="pt-2 pb-8 px-2 max-w-[1200px] mx-auto space-y-8">
      <div className="px-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
          >
            <IoChevronBackOutline size={24} />
          </button>
          <PageHeader
            title="Add Product"
            subtitle="SOLID Structure - Phân nhánh theo schema (frame/lens)."
            breadcrumbs={[
              { label: 'Dashboard', path: '/manager/dashboard' },
              { label: 'Products', path: '/manager/products' },
              { label: 'Add Product' }
            ]}
          />
        </div>

        <div className="max-w-[1000px] mx-auto">
          <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm overflow-hidden p-8">
            <form
              className="space-y-8"
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
              }}
            >
              {/* 1. Base Fields */}
              <ProductBaseFields state={state} onChange={handleBaseChange} />

              {/* 2. Spec Fields based on type */}
              {state.type === 'frame' ? (
                <FrameSpecFields specFrame={state.specFrame} onChange={handleSpecFrameChange} />
              ) : (
                <LensSpecFields specLens={state.specLens} onChange={handleSpecLensChange} />
              )}

              {/* 3. Variants Editor */}
              <VariantsEditor variants={state.variants} onChange={handleVariantsChange} />

              {/* 4. Action Buttons */}
              <div className="pt-2 flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-4 border border-neutral-200 text-gray-700 rounded-2xl text-sm font-bold hover:bg-neutral-50 transition-all active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-2 px-6 py-4 bg-mint-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-mint-100/50 hover:bg-mint-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <IoSaveOutline size={20} />
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  )
}

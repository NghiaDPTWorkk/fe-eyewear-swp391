import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoChevronBackOutline, IoSaveOutline } from 'react-icons/io5'
import { Container } from '@/components'
import { PageHeader } from '@/features/sales/components/common'

import { ProductBaseFields } from './add-product/components/ProductBaseFields'
import { SunglassSpecFields } from './add-product/components/SunglassSpecFields'
import { LensSpecFields } from './add-product/components/LensSpecFields'
import { VariantsEditor } from './add-product/components/VariantsEditor'
import type { ProductCreateFormState } from './add-product/types/product-create.types'

export default function ManagerAddProductPage() {
  const navigate = useNavigate()

  const [state, setState] = useState<ProductCreateFormState>({
    type: 'sunglass',
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
      dimensionsEnabled: true,
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
            subtitle="SOLID Structure - Phân nhánh theo schema (sunglass/lens)."
            breadcrumbs={[
              { label: 'Dashboard', path: '/manager/dashboard' },
              { label: 'Products', path: '/manager/products' },
              { label: 'Add Product' }
            ]}
          />
        </div>

        <div className="max-w-[1000px] mx-auto">
          <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm overflow-hidden p-8">
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              {/* 1. Base Fields */}
              <ProductBaseFields state={state} onChange={handleBaseChange} />

              {/* 2. Spec Fields based on type */}
              {state.type === 'sunglass' ? (
                <SunglassSpecFields specFrame={state.specFrame} onChange={handleSpecFrameChange} />
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
                  className="flex-1 px-6 py-4 border border-neutral-200 text-gray-700 rounded-2xl text-sm font-bold hover:bg-neutral-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex-[2] px-6 py-4 bg-mint-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-mint-100/50 hover:bg-mint-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <IoSaveOutline size={20} />
                  Save (API later)
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  )
}

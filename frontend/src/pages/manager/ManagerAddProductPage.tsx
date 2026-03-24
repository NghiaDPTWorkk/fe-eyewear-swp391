import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { IoSaveOutline } from 'react-icons/io5'
import { httpClient } from '@/api/apiClients'
import { PageHeader } from '@/features/staff/components/common'
import { ProductBaseFields } from './add-product/components/ProductBaseFields'
import { FrameSpecFields } from './add-product/components/FrameSpecFields'
import { LensSpecFields } from './add-product/components/LensSpecFields'
import { OptionsConfigEditor } from './add-product/components/OptionsConfigEditor'
import { VariantsEditor } from './add-product/components/VariantsEditor'
import { Button } from '@/shared/components/ui/button'
import { VoiceDatePicker } from './add-product/components/VoiceDatePicker'
import type { ProductCreateFormState } from './add-product/types/product-create.types'

export default function ManagerAddProductPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

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
        virTryOnUrl: '',
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

  // Handlers
  const handleBaseChange = (patch: Partial<ProductCreateFormState>) => {
    setState((prev: ProductCreateFormState) => ({ ...prev, ...patch }))
  }

  const handleSpecFrameChange = (specFrame: ProductCreateFormState['specFrame']) => {
    setState((prev: ProductCreateFormState) => ({ ...prev, specFrame }))
  }

  const handleSpecLensChange = (specLens: ProductCreateFormState['specLens']) => {
    setState((prev: ProductCreateFormState) => ({ ...prev, specLens }))
  }

  const handleVariantsChange = (variants: ProductCreateFormState['variants']) => {
    setState((prev: ProductCreateFormState) => ({ ...prev, variants }))
  }

  const validateStep = (step: number) => {
    if (step === 1) {
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
    }
    if (step === 2) {
      if (state.type === 'frame' && !state.specFrame.shape) {
        toast.error('Frame shape is required')
        return false
      }
    }
    if (step === 3) {
      if (state.variants.length === 0) {
        toast.error('At least one variant is required')
        return false
      }
      for (let i = 0; i < state.variants.length; i++) {
        const v = state.variants[i]
        if (!v.priceText || isNaN(Number(v.priceText))) {
          toast.error(`Variant #${i + 1} must have a valid price`)
          return false
        }
      }
    }
    return true
  }

  const handleSubmit = async () => {
    if (state.isPreOrder) {
      if (!state.preOrderConfig?.targetDate) {
        toast.error('Pre-order target date is required')
        return false
      }
      if (
        !state.preOrderConfig?.targetQuantity ||
        Number(state.preOrderConfig.targetQuantity) <= 0
      ) {
        toast.error('Pre-order target quantity must be greater than 0')
        return false
      }
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
          price: Number(v.priceText),
          finalPrice: Number(v.finalPriceText),
          stock: Number(v.stockText),
          imgs: v.imgs,
          isDefault: v.isDefault,
          virTryOnUrl: v.virTryOnUrl || undefined,
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
      const response = (await httpClient.post(endpoint, payload)) as any

      if (state.isPreOrder && response.success) {
        const variantSkus = Array.isArray(response.data?.variantSkus)
          ? response.data.variantSkus
          : []
        const config = state.preOrderConfig!
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

        if (importPromises.length > 0) {
          await Promise.all(importPromises)
          toast.success('Product and Pre-order imports created successfully!')
        }
      } else {
        toast.success('Product created successfully!')
      }
      navigate('/manager/products')
    } catch (error: any) {
      console.error('Create product failed:', error)
      toast.error(error.message || 'Failed to create product')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev: number) => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev: number) => Math.max(prev - 1, 1))
  }

  const STEPS = [
    {
      id: 1,
      title: 'General Info',
      subtitle: 'Core identity',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
          <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
          <path d="M13 2v7h7" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Specifications',
      subtitle: 'Technical details',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Variant Config',
      subtitle: 'Options & variants',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      )
    },
    {
      id: 4,
      title: 'Finalize',
      subtitle: 'Review & saved',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
          <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
          <path d="M17 21v-8H7v8" />
          <path d="M7 3v5h8" />
        </svg>
      )
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-48">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Create New Product"
          subtitle="Follow the steps below to systematically add a new product."
          breadcrumbs={[
            { label: 'Dashboard', path: '/manager/dashboard' },
            { label: 'Products', path: '/manager/products' },
            { label: 'Add Product' }
          ]}
        />

        {/* Professional Stepper */}
        <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm p-4 overflow-x-auto scroller-hide">
          <div className="flex items-center justify-between min-w-[600px] px-4">
            {STEPS.map((step, idx) => {
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              return (
                <React.Fragment key={step.id}>
                  <div
                    className={`flex items-center gap-4 transition-all duration-500 ${
                      isActive ? 'scale-105 select-none' : 'opacity-60 grayscale'
                    }`}
                  >
                    <div
                      className={`
                        w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                        ${
                          isActive
                            ? 'bg-mint-600 text-white shadow-lg shadow-mint-100 ring-4 ring-mint-500/10 scale-110'
                            : isCompleted
                              ? 'bg-mint-100 text-mint-600'
                              : 'bg-neutral-50 text-neutral-400'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <svg
                          viewBox="0 0 24 24"
                          className="w-6 h-6 fill-none stroke-current stroke-3"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.icon
                      )}
                    </div>
                    <div>
                      <h4 className="text-[13px] font-extrabold text-slate-800 leading-none mb-1">
                        {step.title}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 leading-none">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className="flex-1 max-w-[80px] h-0.5 bg-neutral-100 mx-4 relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-mint-500 transition-all duration-1000 transform origin-left scale-x-0"
                        style={{ transform: isCompleted ? 'scaleX(1)' : 'scaleX(0)' }}
                      />
                    </div>
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </div>

      <div className="relative min-h-[500px]">
        {/* STEP 1: General Info */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <section className="bg-white rounded-[32px] border border-neutral-100/50 shadow-sm p-8 space-y-6">
              <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
                <div className="w-10 h-10 rounded-2xl bg-mint-50 flex items-center justify-center text-mint-600">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                    <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                    <path d="M13 2v7h7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                    General Information
                  </h3>
                  <p className="text-xs font-bold text-slate-400">Define core product identity</p>
                </div>
              </div>
              <ProductBaseFields state={state} onChange={handleBaseChange} />
            </section>
          </div>
        )}

        {/* STEP 2: Technical Specifications */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <section className="bg-white rounded-[32px] border border-neutral-100/50 shadow-sm p-8 space-y-6">
              <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
                <div className="w-10 h-10 rounded-2xl bg-mint-50 flex items-center justify-center text-mint-600">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                    Technical Specifications
                  </h3>
                  <p className="text-xs font-bold text-slate-400">Materials, dimensions & style</p>
                </div>
              </div>
              {state.type === 'frame' ? (
                <FrameSpecFields specFrame={state.specFrame} onChange={handleSpecFrameChange} />
              ) : (
                <LensSpecFields specLens={state.specLens} onChange={handleSpecLensChange} />
              )}
            </section>
          </div>
        )}

        {/* STEP 3: Options & Variants */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <section className="bg-white rounded-[32px] border border-neutral-100/50 shadow-sm p-8 space-y-6">
              <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
                <div className="w-10 h-10 rounded-2xl bg-mint-50 flex items-center justify-center text-mint-600">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                    <path d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                    Custom Attributes
                  </h3>
                  <p className="text-xs font-bold text-slate-400">Configure colors or materials</p>
                </div>
              </div>
              <OptionsConfigEditor
                optionsConfig={state.optionsConfig}
                onChange={(optionsConfig: ProductCreateFormState['optionsConfig']) =>
                  setState((prev: ProductCreateFormState) => ({ ...prev, optionsConfig }))
                }
              />
            </section>

            <section className="bg-white rounded-[32px] border border-neutral-100/50 shadow-sm p-8 space-y-6">
              <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
                <div className="w-10 h-10 rounded-2xl bg-mint-50 flex items-center justify-center text-mint-600">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                    System Variants
                  </h3>
                  <p className="text-xs font-bold text-slate-400">Fine-tune each variation</p>
                </div>
              </div>
              <VariantsEditor
                variants={state.variants}
                optionsConfig={state.optionsConfig}
                nameBase={state.nameBase}
                onChange={handleVariantsChange}
              />
            </section>
          </div>
        )}

        {/* STEP 4: Finalize */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <section className="bg-white rounded-[32px] border border-neutral-100/50 shadow-sm p-12 text-center max-w-2xl mx-auto space-y-8">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-[28px] bg-mint-50 flex items-center justify-center text-mint-600 ring-8 ring-mint-500/5">
                  <IoSaveOutline size={36} />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                    Ready to launch?
                  </h3>
                  <p className="text-sm font-bold text-slate-400 mt-1">
                    Review your configuration one last time
                  </p>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-100/50">
                <label className="flex items-center justify-between gap-6 cursor-pointer group">
                  <div className="text-left">
                    <h4 className="text-base font-extrabold text-slate-700 group-hover:text-mint-700 transition-colors">
                      Enable Pre-order Mode
                    </h4>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                      Accept orders for future release
                    </p>
                  </div>
                  <div className="relative inline-flex items-center scale-125">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={state.isPreOrder}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleBaseChange({ isPreOrder: e.target.checked })
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mint-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mint-600"></div>
                  </div>
                </label>
              </div>
            </section>

            {state.isPreOrder && (
              <section className="bg-white rounded-[32px] border border-amber-100/50 shadow-sm p-8 space-y-6 max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center gap-4 border-b border-amber-50 pb-6">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-amber-800 tracking-tight">
                      Pre-order Details
                    </h3>
                    <p className="text-xs font-bold text-amber-400">Setup timeline and quantity</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[11px] font-extrabold text-slate-500 ml-1">
                      Description
                    </label>
                    <textarea
                      value={state.preOrderConfig?.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setState((prev: ProductCreateFormState) => ({
                          ...prev,
                          preOrderConfig: { ...prev.preOrderConfig!, description: e.target.value }
                        }))
                      }
                      className="w-full px-6 py-4 bg-neutral-50/50 border border-neutral-100 rounded-2xl text-[14px] focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all min-h-[120px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-slate-500 ml-1">
                      Target Quantity
                    </label>
                    <input
                      type="number"
                      value={state.preOrderConfig?.targetQuantity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setState((prev: ProductCreateFormState) => ({
                          ...prev,
                          preOrderConfig: {
                            ...prev.preOrderConfig!,
                            targetQuantity: e.target.value
                          }
                        }))
                      }
                      className="w-full px-6 py-4 bg-neutral-50/50 border border-neutral-100 rounded-2xl text-[14px] focus:outline-none"
                    />
                  </div>
                  <VoiceDatePicker
                    label="Target Date"
                    value={state.preOrderConfig?.targetDate || ''}
                    onChange={(val: string) =>
                      setState((prev: ProductCreateFormState) => ({
                        ...prev,
                        preOrderConfig: { ...prev.preOrderConfig!, targetDate: val }
                      }))
                    }
                  />
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Floating Pill Navigation Bar - Inline flow */}
      <div className="mt-16 flex justify-center pb-12">
        <div className="w-full max-w-4xl bg-slate-950/95 border border-white/10 rounded-[40px] p-3 shadow-2xl flex items-center justify-between px-10 transition-all ring-1 ring-white/5">
          <Button
            variant="ghost"
            onClick={() => (currentStep === 1 ? navigate(-1) : prevStep())}
            className="px-8 text-neutral-400 hover:text-white hover:bg-white/5 active:scale-95 rounded-3xl h-14"
          >
            {currentStep === 1 ? 'Cancel' : 'Previous Step'}
          </Button>

          <div className="flex items-center gap-10">
            <div className="hidden lg:flex items-center gap-2">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                    s.id <= currentStep ? 'bg-mint-400 ring-4 ring-mint-400/20' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <div className="h-8 w-px bg-white/10 hidden lg:block" />

            <div className="flex items-center gap-6">
              <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] hidden sm:inline select-none">
                STEP {currentStep} / {totalSteps}
              </span>

              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  className="px-12 bg-white text-slate-950 hover:bg-neutral-100 rounded-3xl h-14 shadow-xl active:scale-95 group font-extrabold"
                  rightIcon={
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5 fill-none stroke-current stroke-3 group-hover:translate-x-1 transition-transform"
                    >
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  }
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  className="px-14 bg-mint-500 text-slate-950 hover:bg-mint-400 rounded-3xl h-14 shadow-xl active:scale-95 shadow-mint-500/20 font-extrabold"
                  leftIcon={<IoSaveOutline size={22} />}
                >
                  Launch Product
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

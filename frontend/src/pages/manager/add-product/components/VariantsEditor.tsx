import { IoAddOutline, IoTrashOutline } from 'react-icons/io5'
import { Button } from '@/shared/components/ui/button'
import type { ProductCreateFormState } from '../types/product-create.types'
import { ImageUpload } from './ImageUpload'
import { Model3DUpload } from './Model3DUpload'
import { DynamicSelectField } from './DynamicSelectField'
import { useAttributes } from '../../../../features/staff/hooks/useAttributes'
import { cn } from '@/lib/utils'

const inputClassName =
  'w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-[14px] focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all'

export function VariantsEditor(props: {
  variants: ProductCreateFormState['variants']
  optionsConfig: ProductCreateFormState['optionsConfig']
  nameBase: string
  onChange: (variants: ProductCreateFormState['variants']) => void
}) {
  const { variants, optionsConfig, nameBase, onChange } = props
  const { data: attributeList = [] } = useAttributes()

  const attributeOptions = attributeList.map((attr: any) => ({
    id: attr.id,
    name: attr.name,
    showType: attr.showType
  }))

  const addVariant = () => {
    onChange([
      ...variants,
      {
        sku: '',
        name: '',
        slug: '',
        priceText: '',
        finalPriceText: '',
        stockText: '',
        imgs: [],
        isDefault: false,
        virTryOnUrl: '',
        options: []
      }
    ])
  }

  const generateVariants = () => {
    if (!optionsConfig.length) return

    const getCombinations = (configs: ProductCreateFormState['optionsConfig']) => {
      const results: any[][] = [[]]
      for (const config of configs) {
        const nextResults: any[][] = []
        for (const res of results) {
          for (const value of config.values) {
            nextResults.push([
              ...res,
              {
                ...value,
                attributeId: config.attributeId,
                attributeName: config.attributeName,
                showType: config.showType
              }
            ])
          }
        }
        results.length = 0
        results.push(...nextResults)
      }
      return results
    }

    const combinations = getCombinations(optionsConfig)

    const newVariants = combinations.map((combo) => {
      const variantName = nameBase
        ? `${nameBase} - ${combo.map((c) => c.label).join(' - ')}`
        : combo.map((c) => c.label).join(' - ')

      return {
        sku: '',
        name: variantName,
        slug: '',
        priceText: '',
        finalPriceText: '',
        stockText: '',
        imgs: [],
        isDefault: false,
        virTryOnUrl: '',
        options: combo.map((c) => ({
          attributeId: c.attributeId,
          attributeName: c.attributeName,
          label: c.label,
          showType: c.showType,
          value: c.value
        }))
      }
    })

    if (variants.length > 0 && variants[0].options.length === 0 && !variants[0].name) {
      onChange(newVariants.map((v, i) => (i === 0 ? { ...v, isDefault: true } : v)))
    } else {
      onChange([...variants, ...newVariants])
    }
  }

  const removeVariant = (idx: number) => {
    if (variants.length === 1) return
    onChange(variants.filter((_, i) => i !== idx))
  }

  const setDefaultVariant = (idx: number) => {
    onChange(variants.map((v, i) => ({ ...v, isDefault: i === idx })))
  }

  const addOption = (variantIdx: number) => {
    onChange(
      variants.map((v, i) =>
        i !== variantIdx
          ? v
          : {
              ...v,
              options: [
                ...v.options,
                {
                  attributeId: '',
                  attributeName: '',
                  label: '',
                  showType: 'text',
                  value: ''
                }
              ]
            }
      )
    )
  }

  const removeOption = (variantIdx: number, optionIdx: number) => {
    onChange(
      variants.map((v, i) =>
        i !== variantIdx
          ? v
          : {
              ...v,
              options: v.options.filter((_, oi) => oi !== optionIdx)
            }
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-mint-600 rounded-full" />
          <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
            Product Variants
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={generateVariants}
            isDisabled={!optionsConfig.length || optionsConfig.every((c) => !c.values.length)}
            className="text-mint-600 border-mint-200"
            leftIcon={<div className="w-2 h-2 bg-mint-500 rounded-full animate-pulse" />}
          >
            Auto-Generate Variants
          </Button>
          <Button
            onClick={addVariant}
            leftIcon={<IoAddOutline size={20} />}
            className="bg-mint-600 hover:bg-mint-700 shadow-lg shadow-mint-100/50"
          >
            Add New Variant
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {variants.map((v, variantIdx) => {
          const price = Number(v.priceText || 0)
          const finalPrice = Number(v.finalPriceText || 0)
          const badFinal =
            v.priceText.trim().length && v.finalPriceText.trim().length && finalPrice > price

          return (
            <div
              key={variantIdx}
              className="group relative border border-neutral-100 rounded-[32px] p-6 md:p-8 bg-white shadow-sm hover:shadow-xl hover:shadow-neutral-200/40 hover:border-mint-100 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
            >
              <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-neutral-50 text-neutral-400 font-extrabold text-sm border border-neutral-100 group-hover:bg-mint-50 group-hover:text-mint-600 group-hover:border-mint-100 transition-colors">
                    {variantIdx + 1}
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-3 cursor-pointer group/radio">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="defaultVariant"
                          className="sr-only peer"
                          checked={v.isDefault}
                          onChange={() => setDefaultVariant(variantIdx)}
                        />
                        <div className="w-5 h-5 border-2 border-neutral-200 rounded-full peer-checked:border-mint-500 transition-all" />
                        <div className="absolute w-2.5 h-2.5 bg-mint-500 rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                      </div>
                      <span className="text-sm font-bold text-gray-700 group-hover/radio:text-mint-600 transition-colors">
                        Primary Variant
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeVariant(variantIdx)}
                  className="p-3 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                  disabled={variants.length === 1}
                  title={variants.length === 1 ? 'Must have at least 1 variant' : 'Remove variant'}
                >
                  <IoTrashOutline size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={v.name}
                  onChange={(e) =>
                    onChange(
                      variants.map((vv, i) =>
                        i === variantIdx ? { ...vv, name: e.target.value } : vv
                      )
                    )
                  }
                  placeholder="name (optional)"
                  className={inputClassName + ' md:col-span-2'}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                  <div className="space-y-1">
                    <input
                      value={v.priceText}
                      onChange={(e) =>
                        onChange(
                          variants.map((vv, i) =>
                            i === variantIdx ? { ...vv, priceText: e.target.value } : vv
                          )
                        )
                      }
                      type="number"
                      placeholder="price"
                      className={inputClassName}
                    />
                  </div>
                  <div className="space-y-1">
                    <input
                      value={v.finalPriceText}
                      onChange={(e) =>
                        onChange(
                          variants.map((vv, i) =>
                            i === variantIdx ? { ...vv, finalPriceText: e.target.value } : vv
                          )
                        )
                      }
                      type="number"
                      placeholder="finalPrice"
                      className={`${inputClassName} ${badFinal ? 'border-red-300 focus:border-red-400' : ''}`}
                    />
                    {badFinal ? (
                      <p className="text-[11px] font-bold text-red-500 ml-1">
                        finalPrice must be &lt;= price
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-1">
                    <input
                      value={v.stockText}
                      onChange={(e) =>
                        onChange(
                          variants.map((vv, i) =>
                            i === variantIdx ? { ...vv, stockText: e.target.value } : vv
                          )
                        )
                      }
                      type="number"
                      placeholder="stock"
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-neutral-500 ml-1">Images</label>
                  <ImageUpload
                    images={v.imgs}
                    onChange={(imgs) =>
                      onChange(variants.map((vv, i) => (i === variantIdx ? { ...vv, imgs } : vv)))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Model3DUpload
                    value={v.virTryOnUrl}
                    onChange={(val) =>
                      onChange(
                        variants.map((vv, i) =>
                          i === variantIdx ? { ...vv, virTryOnUrl: val } : vv
                        )
                      )
                    }
                  />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-mint-500 rounded-full" />
                      <h4 className="text-[13px] font-extrabold text-gray-900">Options</h4>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(variantIdx)}
                      leftIcon={<IoAddOutline size={16} />}
                      className="rounded-full border-mint-200 text-mint-600 bg-white"
                    >
                      Add Option
                    </Button>
                  </div>

                  {v.options.length ? (
                    <div className="grid grid-cols-1 gap-3">
                      {v.options.map((o, optionIdx) => (
                        <div
                          key={optionIdx}
                          className="group relative grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-white border border-neutral-100 rounded-[20px] shadow-sm hover:border-mint-200 hover:shadow-md transition-all animate-in fade-in slide-in-from-top-2 duration-300"
                        >
                          <div className="md:col-span-4">
                            <DynamicSelectField
                              label="Attribute"
                              value={o.attributeName}
                              options={attributeOptions}
                              onChange={(val: string) => {
                                const selectedAttr = attributeList.find(
                                  (a: any) => a.name === val || a.id === val
                                )
                                onChange(
                                  variants.map((vv, i) =>
                                    i !== variantIdx
                                      ? vv
                                      : {
                                          ...vv,
                                          options: vv.options.map((oo, oi) =>
                                            oi === optionIdx
                                              ? {
                                                  ...oo,
                                                  attributeName: selectedAttr
                                                    ? selectedAttr.name
                                                    : val,
                                                  attributeId: selectedAttr ? selectedAttr.id : val,
                                                  showType: selectedAttr
                                                    ? selectedAttr.showType
                                                    : oo.showType
                                                }
                                              : oo
                                          )
                                        }
                                  )
                                )
                              }}
                              placeholder="Select attribute..."
                            />
                          </div>

                          <div className="md:col-span-3 space-y-2">
                            <label className="text-xs font-bold text-gray-700 ml-1">Label</label>
                            <input
                              value={o.label}
                              onChange={(e) =>
                                onChange(
                                  variants.map((vv, i) =>
                                    i !== variantIdx
                                      ? vv
                                      : {
                                          ...vv,
                                          options: vv.options.map((oo, oi) =>
                                            oi === optionIdx ? { ...oo, label: e.target.value } : oo
                                          )
                                        }
                                  )
                                )
                              }
                              placeholder="e.g. Red, XL, 52mm"
                              className={inputClassName}
                            />
                          </div>

                          <div className="md:col-span-4 space-y-2">
                            <label className="text-xs font-bold text-gray-700 ml-1">
                              {o.showType === 'color' ? 'Hex Code' : 'Value'}
                            </label>
                            <div className="relative">
                              <input
                                value={o.value}
                                onChange={(e) =>
                                  onChange(
                                    variants.map((vv, i) =>
                                      i !== variantIdx
                                        ? vv
                                        : {
                                            ...vv,
                                            options: vv.options.map((oo, oi) =>
                                              oi === optionIdx
                                                ? { ...oo, value: e.target.value }
                                                : oo
                                            )
                                          }
                                    )
                                  )
                                }
                                placeholder={o.showType === 'color' ? '#000000' : 'Value'}
                                className={cn(inputClassName, o.showType === 'color' && 'pl-11')}
                              />
                              {o.showType === 'color' && (
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                                  <div
                                    className="w-6 h-6 rounded-full border border-neutral-200 shadow-sm"
                                    style={{ backgroundColor: o.value || '#000000' }}
                                  />
                                  <input
                                    type="color"
                                    value={o.value?.startsWith('#') ? o.value : '#000000'}
                                    onChange={(e) =>
                                      onChange(
                                        variants.map((vv, i) =>
                                          i !== variantIdx
                                            ? vv
                                            : {
                                                ...vv,
                                                options: vv.options.map((oo, oi) =>
                                                  oi === optionIdx
                                                    ? { ...oo, value: e.target.value }
                                                    : oo
                                                )
                                              }
                                        )
                                      )
                                    }
                                    className="absolute inset-0 opacity-0 cursor-pointer w-6 h-6"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="md:col-span-1 flex items-end pb-1 justify-end">
                            <button
                              type="button"
                              onClick={() => removeOption(variantIdx, optionIdx)}
                              className="p-3 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group-hover:bg-neutral-50"
                            >
                              <IoTrashOutline size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 border-2 border-dashed border-neutral-100 rounded-[24px] flex flex-col items-center justify-center gap-2 bg-neutral-50/30">
                      <p className="text-xs font-bold text-neutral-400">No options added yet</p>
                      <button
                        type="button"
                        onClick={() => addOption(variantIdx)}
                        className="text-[11px] font-bold text-mint-600 hover:underline"
                      >
                        Click here to add your first option
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

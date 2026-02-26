import { IoAddOutline, IoTrashOutline } from 'react-icons/io5'
import type { ProductCreateFormState } from '../types/product-create.types'
import { ImageUpload } from './ImageUpload'
import { DynamicSelectField } from './DynamicSelectField'

const inputClassName =
  'w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-[14px] focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all'

export function VariantsEditor(props: {
  variants: ProductCreateFormState['variants']
  onChange: (variants: ProductCreateFormState['variants']) => void
}) {
  const { variants, onChange } = props

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
        options: []
      }
    ])
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
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-gray-900 tracking-wide">Variants</h3>
        <button
          type="button"
          onClick={addVariant}
          className="flex items-center gap-2 text-xs font-bold text-mint-600 hover:text-mint-700 transition-colors"
        >
          <IoAddOutline size={18} />
          Add Variant
        </button>
      </div>

      <div className="space-y-4">
        {variants.map((v, variantIdx) => {
          const price = Number(v.priceText || 0)
          const finalPrice = Number(v.finalPriceText || 0)
          const badFinal =
            v.priceText.trim().length && v.finalPriceText.trim().length && finalPrice > price

          return (
            <div
              key={variantIdx}
              className="border border-neutral-100 rounded-[24px] p-5 bg-neutral-50/20"
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-neutral-500">
                    Variant #{variantIdx + 1}
                  </span>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700">
                    <input
                      type="radio"
                      name="defaultVariant"
                      checked={v.isDefault}
                      onChange={() => setDefaultVariant(variantIdx)}
                    />
                    Default
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => removeVariant(variantIdx)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  disabled={variants.length === 1}
                  title={variants.length === 1 ? 'Must have at least 1 variant' : 'Remove variant'}
                >
                  <IoTrashOutline size={18} />
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

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-extrabold text-neutral-500 ml-1">Images</label>
                  <ImageUpload
                    images={v.imgs}
                    onChange={(imgs) =>
                      onChange(variants.map((vv, i) => (i === variantIdx ? { ...vv, imgs } : vv)))
                    }
                  />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-gray-900">Options</h4>
                  <button
                    type="button"
                    onClick={() => addOption(variantIdx)}
                    className="flex items-center gap-2 text-[11px] font-bold text-mint-600 hover:text-mint-700 transition-colors"
                  >
                    <IoAddOutline size={16} />
                    Add Option
                  </button>
                </div>

                {v.options.length ? (
                  <div className="space-y-3">
                    {v.options.map((o, optionIdx) => (
                      <div key={optionIdx} className="grid grid-cols-1 md:grid-cols-6 gap-3">
                        <input
                          value={o.attributeId}
                          onChange={(e) =>
                            onChange(
                              variants.map((vv, i) =>
                                i !== variantIdx
                                  ? vv
                                  : {
                                      ...vv,
                                      options: vv.options.map((oo, oi) =>
                                        oi === optionIdx
                                          ? { ...oo, attributeId: e.target.value }
                                          : oo
                                      )
                                    }
                              )
                            )
                          }
                          placeholder="attributeId"
                          className={inputClassName}
                        />
                        <input
                          value={o.attributeName}
                          onChange={(e) =>
                            onChange(
                              variants.map((vv, i) =>
                                i !== variantIdx
                                  ? vv
                                  : {
                                      ...vv,
                                      options: vv.options.map((oo, oi) =>
                                        oi === optionIdx
                                          ? { ...oo, attributeName: e.target.value }
                                          : oo
                                      )
                                    }
                              )
                            )
                          }
                          placeholder="attributeName"
                          className={inputClassName}
                        />
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
                          placeholder="label"
                          className={inputClassName}
                        />
                        <DynamicSelectField
                          label="Show Type"
                          value={o.showType}
                          options={[
                            { id: 'text', name: 'text' },
                            { id: 'color', name: 'color' }
                          ]}
                          onChange={(val: string) =>
                            onChange(
                              variants.map((vv, i) =>
                                i !== variantIdx
                                  ? vv
                                  : {
                                      ...vv,
                                      options: vv.options.map((oo, oi) =>
                                        oi === optionIdx
                                          ? { ...oo, showType: val as 'color' | 'text' }
                                          : oo
                                      )
                                    }
                              )
                            )
                          }
                          allowCustom={false}
                          className="md:col-span-1"
                        />
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
                                        oi === optionIdx ? { ...oo, value: e.target.value } : oo
                                      )
                                    }
                              )
                            )
                          }
                          placeholder={o.showType === 'color' ? '#000000' : 'value'}
                          className={inputClassName}
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(variantIdx, optionIdx)}
                          className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <IoTrashOutline size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400">No options</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

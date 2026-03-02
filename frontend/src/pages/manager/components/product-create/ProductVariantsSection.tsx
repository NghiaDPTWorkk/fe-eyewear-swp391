import React from 'react'
import { IoAddOutline, IoTrashOutline } from 'react-icons/io5'
import {
  PRODUCT_CREATE_INPUT_CLASSNAME,
  toNumberOrUndefined
} from '@/shared/utils/product-create.utils'

export function ProductVariantsSection({
  variants,
  onAddVariant,
  onRemoveVariant,
  onSetDefaultVariant,
  onChangeVariant,
  onAddOption,
  onRemoveOption,
  onChangeOption
}: {
  variants: Array<{
    sku: string
    name: string
    slug: string
    priceText: string
    finalPriceText: string
    stockText: string
    imgsText: string
    isDefault: boolean
    options: Array<{
      attributeId: string
      attributeName: string
      label: string
      showType: 'color' | 'text'
      value: string
    }>
  }>
  onAddVariant: () => void
  onRemoveVariant: (variantIdx: number) => void
  onSetDefaultVariant: (variantIdx: number) => void
  onChangeVariant: (variantIdx: number, field: string, value: string) => void
  onAddOption: (variantIdx: number) => void
  onRemoveOption: (variantIdx: number, optionIdx: number) => void
  onChangeOption: (variantIdx: number, optionIdx: number, field: string, value: string) => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-gray-900 tracking-wide">Variants</h3>
        <button
          type="button"
          onClick={onAddVariant}
          className="flex items-center gap-2 text-xs font-bold text-mint-600 hover:text-mint-700 transition-colors"
        >
          <IoAddOutline size={18} />
          Add Variant
        </button>
      </div>

      <div className="space-y-4">
        {variants.map((v, variantIdx) => {
          const fp = toNumberOrUndefined(v.finalPriceText)
          const p = toNumberOrUndefined(v.priceText)
          const badFinal = typeof fp === 'number' && typeof p === 'number' && fp > p

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
                      onChange={() => onSetDefaultVariant(variantIdx)}
                    />
                    Default
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveVariant(variantIdx)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  disabled={variants.length === 1}
                  title={variants.length === 1 ? 'Must have at least 1 variant' : 'Remove variant'}
                >
                  <IoTrashOutline size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={v.sku}
                  onChange={(e) => onChangeVariant(variantIdx, 'sku', e.target.value)}
                  placeholder="sku (optional)"
                  className={PRODUCT_CREATE_INPUT_CLASSNAME}
                />
                <input
                  value={v.name}
                  onChange={(e) => onChangeVariant(variantIdx, 'name', e.target.value)}
                  placeholder="name (optional)"
                  className={PRODUCT_CREATE_INPUT_CLASSNAME}
                />
                <input
                  value={v.slug}
                  onChange={(e) => onChangeVariant(variantIdx, 'slug', e.target.value)}
                  placeholder="slug (optional)"
                  className={PRODUCT_CREATE_INPUT_CLASSNAME}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                  <input
                    value={v.priceText}
                    onChange={(e) => onChangeVariant(variantIdx, 'priceText', e.target.value)}
                    type="number"
                    placeholder="price"
                    className={PRODUCT_CREATE_INPUT_CLASSNAME}
                  />
                  <div>
                    <input
                      value={v.finalPriceText}
                      onChange={(e) =>
                        onChangeVariant(variantIdx, 'finalPriceText', e.target.value)
                      }
                      type="number"
                      placeholder="finalPrice"
                      className={`${PRODUCT_CREATE_INPUT_CLASSNAME} ${
                        badFinal ? 'border-red-300 focus:border-red-400' : ''
                      }`}
                    />
                    {badFinal ? (
                      <p className="text-[11px] font-bold text-red-500 ml-1">
                        finalPrice must be {'<='} price
                      </p>
                    ) : null}
                  </div>
                  <input
                    value={v.stockText}
                    onChange={(e) => onChangeVariant(variantIdx, 'stockText', e.target.value)}
                    type="number"
                    placeholder="stock"
                    className={PRODUCT_CREATE_INPUT_CLASSNAME}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-extrabold text-neutral-500 ml-1">
                    imgs (comma separated urls)
                  </label>
                  <input
                    value={v.imgsText}
                    onChange={(e) => onChangeVariant(variantIdx, 'imgsText', e.target.value)}
                    placeholder="https://...jpg, https://...jpg"
                    className={PRODUCT_CREATE_INPUT_CLASSNAME}
                  />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-gray-900">Options</h4>
                  <button
                    type="button"
                    onClick={() => onAddOption(variantIdx)}
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
                            onChangeOption(variantIdx, optionIdx, 'attributeId', e.target.value)
                          }
                          placeholder="attributeId"
                          className={PRODUCT_CREATE_INPUT_CLASSNAME}
                        />
                        <input
                          value={o.attributeName}
                          onChange={(e) =>
                            onChangeOption(variantIdx, optionIdx, 'attributeName', e.target.value)
                          }
                          placeholder="attributeName"
                          className={PRODUCT_CREATE_INPUT_CLASSNAME}
                        />
                        <input
                          value={o.label}
                          onChange={(e) =>
                            onChangeOption(variantIdx, optionIdx, 'label', e.target.value)
                          }
                          placeholder="label"
                          className={PRODUCT_CREATE_INPUT_CLASSNAME}
                        />
                        <select
                          value={o.showType}
                          onChange={(e) =>
                            onChangeOption(variantIdx, optionIdx, 'showType', e.target.value)
                          }
                          className={PRODUCT_CREATE_INPUT_CLASSNAME}
                        >
                          <option value="text">text</option>
                          <option value="color">color</option>
                        </select>
                        <input
                          value={o.value}
                          onChange={(e) =>
                            onChangeOption(variantIdx, optionIdx, 'value', e.target.value)
                          }
                          placeholder={o.showType === 'color' ? '#000000' : 'value'}
                          className={PRODUCT_CREATE_INPUT_CLASSNAME}
                        />
                        <button
                          type="button"
                          onClick={() => onRemoveOption(variantIdx, optionIdx)}
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

import React from 'react'
import type { ProductCreateFormType, ProductCreateFormState } from '../types/product-create.types'

const inputClassName =
  'w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-[14px] focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all'

export function ProductBaseFields(props: {
  state: ProductCreateFormState
  onChange: (patch: Partial<ProductCreateFormState>) => void
}) {
  const { state, onChange } = props

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">Type</label>
        <select
          value={state.type}
          onChange={(e) => onChange({ type: e.target.value as ProductCreateFormType })}
          className={inputClassName}
        >
          <option value="sunglass">sunglass</option>
          <option value="lens">lens</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">Brand (nullable)</label>
        <input
          value={state.brand}
          onChange={(e) => onChange({ brand: e.target.value })}
          type="text"
          placeholder="Rayban (để trống = null)"
          className={inputClassName}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-bold text-gray-700 ml-1">nameBase</label>
        <input
          value={state.nameBase}
          onChange={(e) => onChange({ nameBase: e.target.value })}
          type="text"
          placeholder="Kính râm ABC Classic"
          className={inputClassName}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">slugBase (optional)</label>
        <input
          value={state.slugBase}
          onChange={(e) => onChange({ slugBase: e.target.value })}
          type="text"
          placeholder="kinh-ram-abc-classic"
          className={inputClassName}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">skuBase (optional)</label>
        <input
          value={state.skuBase}
          onChange={(e) => onChange({ skuBase: e.target.value })}
          type="text"
          placeholder="SUN-ABC-BASE"
          className={inputClassName}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-bold text-gray-700 ml-1">categories (comma separated ids)</label>
        <input
          value={state.categoriesText}
          onChange={(e) => onChange({ categoriesText: e.target.value })}
          type="text"
          placeholder="65f1..., 65f2..."
          className={inputClassName}
        />
      </div>
    </div>
  )
}


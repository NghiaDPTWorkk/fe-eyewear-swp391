import React from 'react'
import { PRODUCT_CREATE_INPUT_CLASSNAME } from '@/shared/utils/product-create.utils'

interface BaseInfoProps {
  nameBase: string
  slugBase: string
  skuBase: string
  categoriesText: string
  onChange: (field: string, value: string) => void
}

export function ProductBaseInfoSection({
  nameBase,
  slugBase,
  skuBase,
  categoriesText,
  onChange
}: BaseInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-bold text-gray-700 ml-1">nameBase</label>
        <input
          value={nameBase}
          onChange={(e) => onChange('nameBase', e.target.value)}
          type="text"
          placeholder="Kính râm ABC Classic"
          className={PRODUCT_CREATE_INPUT_CLASSNAME}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">slugBase (optional)</label>
        <input
          value={slugBase}
          onChange={(e) => onChange('slugBase', e.target.value)}
          type="text"
          placeholder="kinh-ram-abc-classic"
          className={PRODUCT_CREATE_INPUT_CLASSNAME}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">skuBase (optional)</label>
        <input
          value={skuBase}
          onChange={(e) => onChange('skuBase', e.target.value)}
          type="text"
          placeholder="SUN-ABC-BASE"
          className={PRODUCT_CREATE_INPUT_CLASSNAME}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-bold text-gray-700 ml-1">
          categories (comma separated ids)
        </label>
        <input
          value={categoriesText}
          onChange={(e) => onChange('categoriesText', e.target.value)}
          type="text"
          placeholder="65f1..., 65f2..."
          className={PRODUCT_CREATE_INPUT_CLASSNAME}
        />
      </div>
    </div>
  )
}

import React from 'react'
import type { ProductCreateFormType } from '@/shared/types/product-create.types'
import { PRODUCT_CREATE_INPUT_CLASSNAME } from '@/shared/utils/product-create.utils'

export function ProductTypeSection({
  type,
  onChangeType,
  brand,
  onChangeBrand
}: {
  type: ProductCreateFormType
  onChangeType: (type: ProductCreateFormType) => void
  brand: string
  onChangeBrand: (brand: string) => void
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">Type</label>
        <select
          value={type}
          onChange={(e) => onChangeType(e.target.value as ProductCreateFormType)}
          className={PRODUCT_CREATE_INPUT_CLASSNAME}
        >
          <option value="sunglass">sunglass</option>
          <option value="lens">lens</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">Brand (nullable)</label>
        <input
          value={brand}
          onChange={(e) => onChangeBrand(e.target.value)}
          type="text"
          placeholder="Rayban (để trống = null)"
          className={PRODUCT_CREATE_INPUT_CLASSNAME}
        />
      </div>
    </div>
  )
}


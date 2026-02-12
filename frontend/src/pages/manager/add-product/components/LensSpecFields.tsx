import React from 'react'
import type { ProductCreateFormState } from '../types/product-create.types'

const inputClassName =
  'w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-[14px] focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all'

export function LensSpecFields(props: {
  specLens: ProductCreateFormState['specLens']
  onChange: (specLens: ProductCreateFormState['specLens']) => void
}) {
  const { specLens, onChange } = props

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-extrabold text-gray-900 tracking-wide">LenSpec (nullable)</h3>
      <p className="text-xs text-neutral-500">
        Nếu để trống cả feature + origin thì spec sẽ = null.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-gray-700 ml-1">feature (comma separated)</label>
          <input
            value={specLens.featureText}
            onChange={(e) => onChange({ ...specLens, featureText: e.target.value })}
            type="text"
            placeholder="blue-cut, uv400"
            className={inputClassName}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-gray-700 ml-1">origin (nullable)</label>
          <input
            value={specLens.origin}
            onChange={(e) => onChange({ ...specLens, origin: e.target.value })}
            type="text"
            placeholder="France (trống = null)"
            className={inputClassName}
          />
        </div>
      </div>
    </div>
  )
}

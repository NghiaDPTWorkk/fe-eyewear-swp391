import React from 'react'
import type { ProductCreateFormState } from '../types/product-create.types'

const inputClassName =
  'w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-[14px] focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all'

export function SunglassSpecFields(props: {
  specFrame: ProductCreateFormState['specFrame']
  onChange: (specFrame: ProductCreateFormState['specFrame']) => void
}) {
  const { specFrame, onChange } = props

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-gray-900 tracking-wide">FrameSpec</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-gray-700 ml-1">material (comma separated)</label>
          <input
            value={specFrame.materialText}
            onChange={(e) => onChange({ ...specFrame, materialText: e.target.value })}
            type="text"
            placeholder="acetate, metal"
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">shape</label>
          <input
            value={specFrame.shape}
            onChange={(e) => onChange({ ...specFrame, shape: e.target.value })}
            type="text"
            placeholder="aviator"
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">style (nullable)</label>
          <input
            value={specFrame.style}
            onChange={(e) => onChange({ ...specFrame, style: e.target.value })}
            type="text"
            placeholder="(trống = null)"
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">gender</label>
          <select
            value={specFrame.gender}
            onChange={(e) => onChange({ ...specFrame, gender: e.target.value as 'F' | 'M' | 'N' })}
            className={inputClassName}
          >
            <option value="F">F</option>
            <option value="M">M</option>
            <option value="N">N</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">weight (nullable, &gt;0 if set)</label>
          <input
            value={specFrame.weightText}
            onChange={(e) => onChange({ ...specFrame, weightText: e.target.value })}
            type="number"
            placeholder="28.5"
            className={inputClassName}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-gray-700 ml-1">dimensions</label>
          <div className="flex items-center gap-3">
            <input
              checked={specFrame.dimensionsEnabled}
              onChange={(e) => onChange({ ...specFrame, dimensionsEnabled: e.target.checked })}
              type="checkbox"
              className="w-4 h-4"
            />
            <span className="text-xs font-semibold text-neutral-500">Enable (unchecked = null)</span>
          </div>
        </div>

        {specFrame.dimensionsEnabled ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">width</label>
              <input
                value={specFrame.dimensions.widthText}
                onChange={(e) =>
                  onChange({
                    ...specFrame,
                    dimensions: { ...specFrame.dimensions, widthText: e.target.value }
                  })
                }
                type="number"
                placeholder="140"
                className={inputClassName}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">height</label>
              <input
                value={specFrame.dimensions.heightText}
                onChange={(e) =>
                  onChange({
                    ...specFrame,
                    dimensions: { ...specFrame.dimensions, heightText: e.target.value }
                  })
                }
                type="number"
                placeholder="45"
                className={inputClassName}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">depth</label>
              <input
                value={specFrame.dimensions.depthText}
                onChange={(e) =>
                  onChange({
                    ...specFrame,
                    dimensions: { ...specFrame.dimensions, depthText: e.target.value }
                  })
                }
                type="number"
                placeholder="145"
                className={inputClassName}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}


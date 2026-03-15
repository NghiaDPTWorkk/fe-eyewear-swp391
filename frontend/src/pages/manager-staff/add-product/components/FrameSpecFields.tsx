import { DynamicSelectField } from './DynamicSelectField'
import { MultiSelectField } from './MultiSelectField'
import type { ProductCreateFormState } from '../types/product-create.types'

const inputClassName =
  'w-full px-4 py-3 bg-neutral-50/50 border border-neutral-100 rounded-2xl text-[14px] focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all'

export function FrameSpecFields(props: {
  specFrame: ProductCreateFormState['specFrame']
  onChange: (specFrame: ProductCreateFormState['specFrame']) => void
}) {
  const { specFrame, onChange } = props

  const materialOptions = [
    { id: 'acetate', name: 'Acetate' },
    { id: 'metal', name: 'Metal' },
    { id: 'plastic', name: 'Plastic' },
    { id: 'titanium', name: 'Titanium' },
    { id: 'wood', name: 'Wood' }
  ]

  const shapeOptions = [
    { id: 'aviator', name: 'Aviator' },
    { id: 'rectangle', name: 'Rectangle' },
    { id: 'round', name: 'Round' },
    { id: 'square', name: 'Square' },
    { id: 'wayfarer', name: 'Wayfarer' },
    { id: 'cat-eye', name: 'Cat Eye' },
    { id: 'irregular', name: 'Irregular' }
  ]

  const styleOptions = [
    { id: 'classic', name: 'Classic' },
    { id: 'modern', name: 'Modern' },
    { id: 'vintage', name: 'Vintage' },
    { id: 'sporty', name: 'Sporty' },
    { id: 'minimalist', name: 'Minimalist' }
  ]

  const selectedMaterials = specFrame.materialText
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <div className="space-y-8 pt-6 border-t border-neutral-100">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Frame Specifications</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <MultiSelectField
          className="md:col-span-2"
          label="Materials"
          values={selectedMaterials}
          options={materialOptions}
          onChange={(vals: string[]) => onChange({ ...specFrame, materialText: vals.join(', ') })}
          placeholder="Select or enter materials..."
        />

        <DynamicSelectField
          label="Shape"
          value={specFrame.shape}
          options={shapeOptions}
          onChange={(val) => onChange({ ...specFrame, shape: val })}
        />

        <DynamicSelectField
          label="Style"
          value={specFrame.style}
          options={styleOptions}
          onChange={(val) => onChange({ ...specFrame, style: val })}
          helperText="Nullable"
        />

        <DynamicSelectField
          label="Gender"
          value={specFrame.gender}
          options={[
            { id: 'F', name: 'Female (Nữ)' },
            { id: 'M', name: 'Male (Nam)' },
            { id: 'N', name: 'Unisex (Cả hai)' }
          ]}
          onChange={(val) => onChange({ ...specFrame, gender: val as 'F' | 'M' | 'N' })}
          allowCustom={false}
        />

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Weight (g)</label>
          <input
            value={specFrame.weightText}
            onChange={(e) => onChange({ ...specFrame, weightText: e.target.value })}
            type="number"
            placeholder="e.g. 28.5"
            className={inputClassName}
          />
        </div>

        <div className="space-y-4 md:col-span-2 p-6 bg-neutral-50/50 rounded-3xl border border-neutral-100">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700">Dimensions (mm)</label>
            <div className="flex items-center gap-3">
              <input
                id="dim-toggle"
                checked={specFrame.dimensionsEnabled}
                onChange={(e) => onChange({ ...specFrame, dimensionsEnabled: e.target.checked })}
                type="checkbox"
                className="w-4 h-4 rounded text-mint-600 focus:ring-mint-500 cursor-pointer"
              />
              <label
                htmlFor="dim-toggle"
                className="text-xs font-semibold text-neutral-500 cursor-pointer"
              >
                Enable dimensions
              </label>
            </div>
          </div>

          {specFrame.dimensionsEnabled && (
            <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase ml-1">
                  Width
                </label>
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
                <label className="text-[10px] font-bold text-neutral-400 uppercase ml-1">
                  Height
                </label>
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
                <label className="text-[10px] font-bold text-neutral-400 uppercase ml-1">
                  Depth
                </label>
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

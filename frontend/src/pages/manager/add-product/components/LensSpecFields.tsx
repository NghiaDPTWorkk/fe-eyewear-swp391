import { DynamicSelectField } from './DynamicSelectField'
import { MultiSelectField } from './MultiSelectField'
import type { ProductCreateFormState } from '../types/product-create.types'

export function LensSpecFields(props: {
  specLens: ProductCreateFormState['specLens']
  onChange: (specLens: ProductCreateFormState['specLens']) => void
}) {
  const { specLens, onChange } = props

  const featureOptions = [
    { id: 'blue-cut', name: 'Blue Cut' },
    { id: 'uv400', name: 'UV400 Protection' },
    { id: 'photochromic', name: 'Photochromic (Đổi màu)' },
    { id: 'polarized', name: 'Polarized (Phân cực)' },
    { id: 'anti-reflective', name: 'Anti-Reflective' },
    { id: 'scratch-resistant', name: 'Scratch Resistant' }
  ]

  const originOptions = [
    { id: 'France', name: 'France' },
    { id: 'Japan', name: 'Japan' },
    { id: 'Germany', name: 'Germany' },
    { id: 'Korea', name: 'Korea' },
    { id: 'Vietnam', name: 'Vietnam' },
    { id: 'USA', name: 'USA' }
  ]

  const selectedFeatures = specLens.featureText
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <div className="space-y-8 pt-6 border-t border-neutral-100">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Lens Specifications</h3>
        <p className="text-xs text-neutral-400 font-medium">
          Note: If both feature and origin are empty, specifications will be saved as null.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MultiSelectField
          className="md:col-span-2"
          label="Features"
          values={selectedFeatures}
          options={featureOptions}
          onChange={(vals) => onChange({ ...specLens, featureText: vals.join(', ') })}
          placeholder="Select or enter lens features..."
        />

        <DynamicSelectField
          className="md:col-span-2"
          label="Origin"
          value={specLens.origin}
          options={originOptions}
          onChange={(val) => onChange({ ...specLens, origin: val })}
          placeholder="Select or enter country of origin..."
          helperText="Nullable"
        />
      </div>
    </div>
  )
}

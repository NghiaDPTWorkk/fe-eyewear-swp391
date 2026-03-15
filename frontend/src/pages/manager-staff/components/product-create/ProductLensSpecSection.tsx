import { PRODUCT_CREATE_INPUT_CLASSNAME } from '@/shared/utils/product-create.utils'

export function ProductLensSpecSection({
  featureText,
  origin,
  onChange
}: {
  featureText: string
  origin: string
  onChange: (field: string, value: string) => void
}) {
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
            value={featureText}
            onChange={(e) => onChange('featureText', e.target.value)}
            type="text"
            placeholder="blue-cut, uv400"
            className={PRODUCT_CREATE_INPUT_CLASSNAME}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-gray-700 ml-1">origin (nullable)</label>
          <input
            value={origin}
            onChange={(e) => onChange('origin', e.target.value)}
            type="text"
            placeholder="France (trống = null)"
            className={PRODUCT_CREATE_INPUT_CLASSNAME}
          />
        </div>
      </div>
    </div>
  )
}

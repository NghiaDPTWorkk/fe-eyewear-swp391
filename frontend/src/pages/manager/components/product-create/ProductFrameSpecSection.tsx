import { PRODUCT_CREATE_INPUT_CLASSNAME } from '@/shared/utils/product-create.utils'

export function ProductFrameSpecSection({
  materialText,
  shape,
  style,
  gender,
  weightText,
  dimensionsEnabled,
  dimensions,
  onChange,
  onChangeDimensionsEnabled
}: {
  materialText: string
  shape: string
  style: string
  gender: 'F' | 'M' | 'N'
  weightText: string
  dimensionsEnabled: boolean
  dimensions: { widthText: string; heightText: string; depthText: string }
  onChange: (field: string, value: string) => void
  onChangeDimensionsEnabled: (enabled: boolean) => void
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-extrabold text-gray-900 tracking-wide">FrameSpec</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-gray-700 ml-1">material (comma separated)</label>
          <input
            value={materialText}
            onChange={(e) => onChange('materialText', e.target.value)}
            type="text"
            placeholder="acetate, metal"
            className={PRODUCT_CREATE_INPUT_CLASSNAME}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">shape</label>
          <input
            value={shape}
            onChange={(e) => onChange('shape', e.target.value)}
            type="text"
            placeholder="aviator"
            className={PRODUCT_CREATE_INPUT_CLASSNAME}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">style (nullable)</label>
          <input
            value={style}
            onChange={(e) => onChange('style', e.target.value)}
            type="text"
            placeholder="(trống = null)"
            className={PRODUCT_CREATE_INPUT_CLASSNAME}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">gender</label>
          <select
            value={gender}
            onChange={(e) => onChange('gender', e.target.value)}
            className={PRODUCT_CREATE_INPUT_CLASSNAME}
          >
            <option value="F">F</option>
            <option value="M">M</option>
            <option value="N">N</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">
            weight (nullable, {'>'}0 if set)
          </label>
          <input
            value={weightText}
            onChange={(e) => onChange('weightText', e.target.value)}
            type="number"
            placeholder="28.5"
            className={PRODUCT_CREATE_INPUT_CLASSNAME}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-gray-700 ml-1">dimensions</label>
          <div className="flex items-center gap-3">
            <input
              checked={dimensionsEnabled}
              onChange={(e) => onChangeDimensionsEnabled(e.target.checked)}
              type="checkbox"
              className="w-4 h-4"
            />
            <span className="text-xs font-semibold text-neutral-500">
              Enable (unchecked = null)
            </span>
          </div>
        </div>

        {dimensionsEnabled ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">width</label>
              <input
                value={dimensions.widthText}
                onChange={(e) => onChange('widthText', e.target.value)}
                type="number"
                placeholder="140"
                className={PRODUCT_CREATE_INPUT_CLASSNAME}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">height</label>
              <input
                value={dimensions.heightText}
                onChange={(e) => onChange('heightText', e.target.value)}
                type="number"
                placeholder="45"
                className={PRODUCT_CREATE_INPUT_CLASSNAME}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">depth</label>
              <input
                value={dimensions.depthText}
                onChange={(e) => onChange('depthText', e.target.value)}
                type="number"
                placeholder="145"
                className={PRODUCT_CREATE_INPUT_CLASSNAME}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

import { IoAddOutline, IoTrashOutline } from 'react-icons/io5'
import { Button } from '@/shared/components/ui/button'
import type { ProductCreateFormState } from '../types/product-create.types'
import { DynamicSelectField } from './DynamicSelectField'
import { useAttributes } from '../../../../features/staff/hooks/useAttributes'
import { cn } from '@/lib/utils'

const inputClassName =
  'w-full px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-[13px] font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all placeholder:text-neutral-300'

export function OptionsConfigEditor(props: {
  optionsConfig: ProductCreateFormState['optionsConfig']
  onChange: (config: ProductCreateFormState['optionsConfig']) => void
}) {
  const { optionsConfig, onChange } = props
  const { data: attributeList = [] } = useAttributes()

  const attributeOptions = attributeList.map((attr: any) => ({
    id: attr.id,
    name: attr.name,
    showType: attr.showType
  }))

  const addAttribute = () => {
    onChange([
      ...optionsConfig,
      {
        attributeId: '',
        attributeName: '',
        showType: 'text',
        values: []
      }
    ])
  }

  const removeAttribute = (idx: number) => {
    onChange(optionsConfig.filter((_, i) => i !== idx))
  }

  const addValue = (attrIdx: number) => {
    onChange(
      optionsConfig.map((config, i) =>
        i !== attrIdx
          ? config
          : {
              ...config,
              values: [...config.values, { label: '', value: '' }]
            }
      )
    )
  }

  const removeValue = (attrIdx: number, valIdx: number) => {
    onChange(
      optionsConfig.map((config, i) =>
        i !== attrIdx
          ? config
          : {
              ...config,
              values: config.values.filter((_, vi) => vi !== valIdx)
            }
      )
    )
  }

  return (
    <div className="space-y-6 pt-10 border-t border-neutral-100">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-mint-600 rounded-full shadow-lg shadow-mint-500/20" />
          <div>
            <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
              Product Options Configuration
            </h3>
            <p className="text-[11px] font-medium text-neutral-400 mt-0.5">
              Step 1: Define attributes and values
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={addAttribute}
          leftIcon={<IoAddOutline size={20} />}
          className="bg-mint-600 hover:bg-mint-700 shadow-lg shadow-mint-100/50"
        >
          Add Attribute
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {optionsConfig.map((config, attrIdx) => (
          <div
            key={attrIdx}
            className="group relative border border-neutral-100 rounded-[32px] p-6 lg:p-8 bg-neutral-50/30 hover:bg-white hover:shadow-2xl hover:shadow-neutral-200/50 hover:border-mint-100 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white text-neutral-400 font-extrabold text-sm border border-neutral-100 group-hover:bg-mint-600 group-hover:text-white group-hover:border-mint-600 transition-all duration-300 shadow-sm">
                  {attrIdx + 1}
                </div>
                <div className="w-[300px]">
                  <DynamicSelectField
                    label="Select Attribute Type"
                    value={config.attributeName}
                    options={attributeOptions}
                    onChange={(val: string) => {
                      const selectedAttr = attributeList.find(
                        (a: any) => a.id === val || a.name === val
                      )
                      onChange(
                        optionsConfig.map((c, i) =>
                          i === attrIdx
                            ? {
                                ...c,
                                attributeId: selectedAttr?.id || val,
                                attributeName: selectedAttr?.name || val,
                                showType: selectedAttr?.showType || 'text'
                              }
                            : c
                        )
                      )
                    }}
                    placeholder="e.g. Color, Size..."
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeAttribute(attrIdx)}
                className="p-3 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
              >
                <IoTrashOutline size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-extrabold text-neutral-500">
                  Values ({config.values.length})
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addValue(attrIdx)}
                  leftIcon={<IoAddOutline size={16} />}
                  className="rounded-full border-mint-200 text-mint-600 hover:bg-mint-600 hover:text-white"
                >
                  Add Value
                </Button>
              </div>

              {config.values.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {config.values.map((v, valIdx) => (
                    <div
                      key={valIdx}
                      className="relative p-5 bg-white border border-neutral-100 rounded-[28px] shadow-sm hover:border-mint-200 transition-all flex items-start gap-3 group/val"
                    >
                      <div className="flex-1 space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                            Label
                          </label>
                          <input
                            value={v.label}
                            onChange={(e) =>
                              onChange(
                                optionsConfig.map((c, i) =>
                                  i !== attrIdx
                                    ? c
                                    : {
                                        ...c,
                                        values: c.values.map((vv, vi) =>
                                          vi === valIdx ? { ...vv, label: e.target.value } : vv
                                        )
                                      }
                                )
                              )
                            }
                            placeholder="e.g. Red, XL, 52mm"
                            className={inputClassName}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                            {config.showType === 'color' ? 'HEX CODE' : 'VALUE'}
                          </label>
                          <div className="relative">
                            <input
                              value={v.value}
                              onChange={(e) =>
                                onChange(
                                  optionsConfig.map((c, i) =>
                                    i !== attrIdx
                                      ? c
                                      : {
                                          ...c,
                                          values: c.values.map((vv, vi) =>
                                            vi === valIdx ? { ...vv, value: e.target.value } : vv
                                          )
                                        }
                                  )
                                )
                              }
                              placeholder={config.showType === 'color' ? '#000000' : 'Value'}
                              className={cn(inputClassName, config.showType === 'color' && 'pl-11')}
                            />
                            {config.showType === 'color' && (
                              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center">
                                <div
                                  className="w-6 h-6 rounded-full border border-neutral-200 shadow-sm"
                                  style={{ backgroundColor: v.value || '#000000' }}
                                />
                                <input
                                  type="color"
                                  value={v.value?.startsWith('#') ? v.value : '#000000'}
                                  onChange={(e) =>
                                    onChange(
                                      optionsConfig.map((c, i) =>
                                        i !== attrIdx
                                          ? c
                                          : {
                                              ...c,
                                              values: c.values.map((vv, vi) =>
                                                vi === valIdx
                                                  ? { ...vv, value: e.target.value }
                                                  : vv
                                              )
                                            }
                                      )
                                    )
                                  }
                                  className="absolute inset-0 opacity-0 cursor-pointer w-6 h-6"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="pt-7">
                        <button
                          type="button"
                          onClick={() => removeValue(attrIdx, valIdx)}
                          className="p-2.5 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover/val:opacity-100 shadow-sm hover:shadow"
                        >
                          <IoTrashOutline size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 border-2 border-dashed border-neutral-100 rounded-[28px] flex flex-col items-center justify-center gap-3 bg-white/50">
                  <p className="text-xs font-bold text-neutral-400">
                    No values defined for this attribute
                  </p>
                  <button
                    type="button"
                    onClick={() => addValue(attrIdx)}
                    className="text-[11px] font-bold text-mint-600 hover:underline px-4 py-2 hover:bg-mint-50 rounded-full transition-colors"
                  >
                    Click to add your first value
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {optionsConfig.length === 0 && (
          <div className="py-20 border-2 border-dashed border-neutral-100 rounded-[40px] flex flex-col items-center justify-center gap-4 bg-neutral-50/20">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-neutral-100">
              <IoAddOutline size={32} className="text-neutral-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-extrabold text-neutral-900">Define Product Options</p>
              <p className="text-xs text-neutral-400 mt-1">
                Add attributes like Color, Size or Material to generate variants automatically.
              </p>
            </div>
            <Button
              type="button"
              onClick={addAttribute}
              leftIcon={<IoAddOutline size={20} />}
              className="mt-2 bg-white text-mint-600 border border-mint-100 hover:bg-mint-50"
            >
              Add Your First Attribute
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

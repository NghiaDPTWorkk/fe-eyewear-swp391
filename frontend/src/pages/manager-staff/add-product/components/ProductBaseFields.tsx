import { useMemo } from 'react'
import type { ProductCreateFormType, ProductCreateFormState } from '../types/product-create.types'
import { DynamicSelectField } from './DynamicSelectField'
import { MultiSelectField } from './MultiSelectField'
import {
  useCategoriesTree,
  type CategoryNode
} from '../../../../features/staff/hooks/useCategories'

const inputClassName =
  'w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-[14px] focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all'

export function ProductBaseFields(props: {
  state: ProductCreateFormState
  onChange: (patch: Partial<ProductCreateFormState>) => void
}) {
  const { state, onChange } = props
  const { data: categoryTree = [], isLoading } = useCategoriesTree()

  const flattenedCategories = useMemo(() => {
    const list: { id: string; name: string }[] = []
    const traverse = (nodes: CategoryNode[], prefix = '') => {
      nodes.forEach((node) => {
        list.push({ id: node.id, name: prefix + node.name })
        if (node.children?.length > 0) {
          traverse(node.children, prefix + node.name + ' > ')
        }
      })
    }
    traverse(categoryTree)
    return list
  }, [categoryTree])

  const selectedCategoryIds = useMemo(() => {
    return state.categoriesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }, [state.categoriesText])

  const handleCategoryChange = (ids: string[]) => {
    onChange({ categoriesText: ids.join(', ') })
  }

  const brandOptions = [
    { id: 'Rayban', name: 'Rayban' },
    { id: 'Oakley', name: 'Oakley' },
    { id: 'Gucci', name: 'Gucci' },
    { id: 'Prada', name: 'Prada' },
    { id: 'Tom Ford', name: 'Tom Ford' },
    { id: 'Gentle Monster', name: 'Gentle Monster' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <DynamicSelectField
        label="Product Type"
        value={state.type}
        options={[
          { id: 'frame', name: 'Frame (Gọng kính)' },
          { id: 'lens', name: 'Lens (Tròng kính)' }
        ]}
        onChange={(val) => onChange({ type: val as ProductCreateFormType })}
        allowCustom={false}
      />

      <DynamicSelectField
        label="Brand"
        value={state.brand}
        options={brandOptions}
        onChange={(val) => onChange({ brand: val })}
        placeholder="Select or enter brand..."
        helperText="Nullable"
      />

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-bold text-gray-700 ml-1">Product Name</label>
        <input
          value={state.nameBase}
          onChange={(e) => onChange({ nameBase: e.target.value })}
          type="text"
          placeholder="e.g. Aviator Classic RB3025"
          className={inputClassName}
        />
      </div>

      <MultiSelectField
        className="md:col-span-2"
        label="Categories"
        values={selectedCategoryIds}
        options={flattenedCategories}
        onChange={handleCategoryChange}
        placeholder={isLoading ? 'Loading categories...' : 'Select product categories...'}
      />
    </div>
  )
}

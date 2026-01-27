import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FilterTag {
  id: string
  label: string
  type: 'color' | 'price' | 'category' | 'other'
}

export interface FilterTagsProps {
  tags: FilterTag[]
  onRemoveTag: (tagId: string) => void
  onClearAll: () => void
  className?: string
}

export function FilterTags({ tags, onRemoveTag, onClearAll, className }: FilterTagsProps) {
  if (tags.length === 0) {
    return null
  }

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onRemoveTag(tag.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 text-white rounded-full text-sm font-medium hover:bg-primary-600 transition-colors group"
        >
          <span>{tag.label}</span>
          <X className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
        </button>
      ))}

      <button
        onClick={onClearAll}
        className="text-primary-500 text-sm font-medium hover:text-primary-600 transition-colors underline"
      >
        Clear all
      </button>
    </div>
  )
}

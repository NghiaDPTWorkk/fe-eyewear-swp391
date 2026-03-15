import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../button'

export interface FilterTag {
  id: string
  label: string
  type: 'price' | 'category' | 'brand' | 'material' | 'shape' | 'style' | 'gender' | 'other'
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
        <Button
          key={tag.id}
          onClick={() => onRemoveTag(tag.id)}
          variant="ghost"
          size="sm"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-mint-300 text-mint-1200 rounded-lg text-sm font-medium hover:bg-mint-400 transition-colors group"
        >
          <span>{tag.label}</span>
          <X className="w-3.5 h-3.5 text-primary-500 group-hover:scale-110 transition-transform" />
        </Button>
      ))}
      <Button variant="outline" size="sm" onClick={onClearAll}>
        Clear all
      </Button>
    </div>
  )
}

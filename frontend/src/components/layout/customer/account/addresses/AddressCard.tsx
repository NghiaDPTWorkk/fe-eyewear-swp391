import { Card } from '@/shared/components/ui/card'
import { MapPin, Edit2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AddressCardProps {
  street: string
  ward: string
  city: string
  isDefault?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function AddressCard({ street, ward, city, isDefault, onEdit, onDelete }: AddressCardProps) {
  return (
    <Card
      className={cn(
        'p-6 flex flex-col justify-between transition-all border-2 group min-h-[200px]',
        isDefault
          ? 'border-primary-500 bg-primary-50/10 shadow-sm'
          : 'border-mint-100/50 hover:border-primary-200'
      )}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
              isDefault
                ? 'bg-primary-500 text-white'
                : 'bg-mint-50 text-mint-400 group-hover:bg-primary-50 group-hover:text-primary-500'
            )}
          >
            <MapPin size={20} />
          </div>
          {isDefault && (
            <span className="bg-primary-500 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
              Default
            </span>
          )}
        </div>

        <p className="text-sm font-bold text-mint-1200 mb-1 leading-snug">{street}</p>
        <p className="text-xs font-semibold text-gray-400">
          {ward}, {city}
        </p>
      </div>

      <div className="flex items-center justify-between mt-6 pt-6 border-t border-dashed border-mint-100">
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {!isDefault && (
          <button className="text-[11px] font-bold text-gray-400 hover:text-primary-600 uppercase tracking-widest transition-colors">
            Set as default
          </button>
        )}
      </div>
    </Card>
  )
}

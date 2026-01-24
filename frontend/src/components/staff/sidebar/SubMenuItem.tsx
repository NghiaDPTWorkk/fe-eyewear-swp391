import { cn } from '@/lib/utils'

interface SubMenuItemProps {
  label: string
  active?: boolean
  badge?: string | number
  badgeColor?: 'red' | 'gray'
  onClick?: () => void
}

export function SubMenuItem({
  label,
  active,
  badge,
  badgeColor = 'red',
  onClick
}: SubMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200',
        active
          ? 'bg-mint-500 text-white font-semibold shadow-sm shadow-mint-100'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      )}
    >
      <span className="truncate">{label}</span>
      {badge !== undefined && (
        <span
          className={cn(
            'px-2 py-0.5 rounded-full text-[11px] font-bold min-w-[22px] text-center',
            active
              ? 'bg-white/20 text-white'
              : badgeColor === 'red'
                ? 'bg-red-50 text-red-500'
                : 'bg-gray-100 text-gray-500'
          )}
        >
          {badge}
        </span>
      )}
    </button>
  )
}

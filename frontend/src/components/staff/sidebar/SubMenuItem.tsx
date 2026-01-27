import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const subMenuItemVariants = cva(
  [
    'w-full text-left px-4 py-2',
    'text-sm rounded-lg',
    'transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1'
  ],
  {
    variants: {
      active: {
        true: 'bg-primary-200 text-primary-800 font-medium',
        false: 'text-gray-600 hover:bg-primary-100 hover:text-gray-900'
      }
    },
    defaultVariants: {
      active: false
    }
  }
)

export interface SubMenuItemProps {
  label: string
  active?: boolean
  onClick?: () => void
  className?: string
}

export function SubMenuItem({ label, active = false, onClick, className }: SubMenuItemProps) {
  return (
    <button onClick={onClick} className={cn(subMenuItemVariants({ active }), className)}>
      {label}
    </button>
  )
}

export { subMenuItemVariants }

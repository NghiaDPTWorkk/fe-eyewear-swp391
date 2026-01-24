import { cn } from '@/lib/utils'
import { subMenuItemVariants } from './variants'

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

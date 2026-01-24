import { cn } from '@/lib/utils'
import { badgeVariants } from './variants'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'danger'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>
}

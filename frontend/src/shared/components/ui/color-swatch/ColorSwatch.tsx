import { cn } from '@/lib/utils'
import { Button } from '@/components'

export interface ColorSwatchProps {
  color: string
  colorName?: string
  isSelected?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ColorSwatch({
  color,
  colorName,
  isSelected = false,
  onClick,
  size = 'md',
  className
}: ColorSwatchProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  return (
    <Button
      type="Button"
      onClick={onClick}
      className={cn(
        'rounded-full border-2 transition-all duration-200',
        'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        isSelected ? 'border-primary-700 ring-2 ring-primary-500' : 'border-neutral-300',
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: color }}
      aria-label={colorName || `Color ${color}`}
      title={colorName || color}
    />
  )
}

import { cn } from '@/lib/utils'
import { VNDPrice } from '@/shared/components/ui/vnd-price/VNDPrice'

export interface PriceTagProps {
  price: number
  discountPrice?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PriceTag({ price, discountPrice, size = 'md', className }: PriceTagProps) {
  const hasDiscount = discountPrice !== undefined && discountPrice < price

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const discountSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {hasDiscount ? (
        <>
          <span className={cn('font-bold text-primary-700', sizeClasses[size])}>
            <VNDPrice amount={discountPrice} />
          </span>
          <span className={cn('text-neutral-400 line-through', discountSizeClasses[size])}>
            <VNDPrice amount={price} />
          </span>
        </>
      ) : (
        <span className={cn('font-bold text-mint-1200', sizeClasses[size])}>
          <VNDPrice amount={price} />
        </span>
      )}
    </div>
  )
}

import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-100 bg-white text-gray-900 shadow-sm transition-all hover:shadow-md',
        className
      )}
      {...props}
    />
  )
}

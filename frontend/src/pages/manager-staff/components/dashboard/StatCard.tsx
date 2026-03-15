import React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface StatCardProps {
  label: string
  value: string
  trend?: {
    value: string
    isPositive: boolean
  }
  icon?: React.ReactNode
  variant?: 'white' | 'mint' | 'blue'
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  icon,
  variant = 'white',
  className
}) => {
  const bgClasses = {
    white: 'bg-white',
    mint: 'bg-mint-600 text-white shadow-[0_8px_30px_rgb(59,193,157,0.15)]',
    blue: 'bg-mint-700 text-white shadow-[0_8px_30px_rgb(74,215,176,0.15)]'
  }

  const labelClasses = {
    white: 'text-gray-400',
    mint: 'text-white/80',
    blue: 'text-white/80'
  }

  const valueClasses = {
    white: 'text-gray-900 font-semibold',
    mint: 'text-white font-semibold',
    blue: 'text-white font-semibold'
  }

  return (
    <div
      className={cn(
        'p-6 rounded-3xl border border-neutral-100/50 flex flex-col justify-between h-40 transition-all hover:shadow-md relative overflow-hidden',
        bgClasses[variant],
        className
      )}
    >
      <div className="flex justify-between items-start">
        <span
          className={cn(
            'text-[12px] font-semibold uppercase tracking-wider',
            labelClasses[variant]
          )}
        >
          {label}
        </span>
        {icon && (
          <div
            className={cn(
              'text-xl opactiy-80',
              variant === 'white' ? 'text-gray-400' : 'text-white'
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-1">
        <div
          className={cn(
            'text-2xl font-semibold tracking-tight font-heading',
            valueClasses[variant]
          )}
        >
          {value}
        </div>
        {trend && (
          <div className="flex items-center gap-1.5 mt-3">
            <span
              className={cn(
                'text-[12px] font-medium px-2 py-0.5 rounded-lg flex items-center gap-0.5',
                trend.isPositive
                  ? variant === 'white'
                    ? 'bg-mint-50 text-mint-600'
                    : 'bg-white/20 text-white'
                  : variant === 'white'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-white/20 text-white'
              )}
            >
              <span className="text-[10px]">{trend.isPositive ? '▲' : '▼'}</span> {trend.value}
            </span>
            <span
              className={cn(
                'text-[10px] uppercase font-semibold tracking-wider opacity-60',
                labelClasses[variant]
              )}
            >
              vs last week
            </span>
          </div>
        )}
      </div>

      {variant !== 'white' && (
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      )}
    </div>
  )
}

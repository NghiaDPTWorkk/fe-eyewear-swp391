import React from 'react'
import { Card } from '@/components'

interface StatsCardProps {
  label: string
  value: string
  trend?: {
    value: string
    isUp: boolean
    colorClass?: string
  }
  icon?: React.ReactNode
  iconBg?: string
  iconColor?: string
  subtext?: string
  description?: string
  className?: string
}

export default function StatsCard({
  label,
  value,
  trend,
  icon,
  iconBg,
  iconColor,
  subtext,
  description,
  className = ''
}: StatsCardProps) {
  return (
    <Card
      className={`p-6 border-none shadow-sm shadow-neutral-200/50 hover:shadow-md transition-all ${className}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg || 'bg-neutral-50'} ${iconColor || 'text-neutral-400'}`}
            >
              {icon}
            </div>
          )}
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            {label}
          </span>
        </div>

        {trend && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${trend.colorClass || (trend.isUp ? 'bg-mint-50 text-mint-600' : 'bg-red-50 text-red-600')}`}
          >
            {trend.value}
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-3xl font-bold text-gray-900 font-primary leading-tight mb-2">
          {value}
        </h3>
        {subtext && (
          <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-tight">
            {subtext}
          </p>
        )}
        {description && <p className="text-xs text-neutral-400 font-medium">{description}</p>}
      </div>
    </Card>
  )
}

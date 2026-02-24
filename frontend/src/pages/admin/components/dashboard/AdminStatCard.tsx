import React from 'react'
import { IoTrendingUpOutline, IoTrendingDownOutline } from 'react-icons/io5'

interface AdminStatCardProps {
  label: string
  value: string
  variant?: 'indigo' | 'default'
  trend: { value: string; isPositive: boolean }
  icon: React.ReactNode
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  label,
  value,
  variant = 'default',
  trend,
  icon
}) => {
  const accentClass = variant === 'indigo' ? 'text-indigo-500' : 'text-gray-900'

  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              variant === 'indigo'
                ? 'bg-indigo-50 text-indigo-500'
                : 'bg-neutral-50 text-neutral-400'
            } border border-neutral-100 group-hover:scale-110 transition-transform`}
          >
            {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
          </div>
          <span className="text-xs font-semibold text-neutral-400 line-clamp-1">{label}</span>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
            trend.isPositive ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-600'
          }`}
        >
          {trend.isPositive ? <IoTrendingUpOutline /> : <IoTrendingDownOutline />}
          {trend.value}
        </div>
      </div>
      <div className="mt-4">
        <h3 className={`text-3xl font-bold font-primary leading-tight mb-4 ${accentClass}`}>
          {value}
        </h3>
        <p className="text-[10px] font-medium text-neutral-400 capitalize">Updated just now</p>
      </div>
    </div>
  )
}

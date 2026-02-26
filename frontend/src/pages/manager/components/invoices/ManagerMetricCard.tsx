import React from 'react'

export interface ManagerMetricCardProps {
  label: string
  value: number
  icon: React.ReactNode
  colorScheme: string
  trend: { label: string; value: number; isPositive: boolean }
  isActive: boolean
  onClick: () => void
}

export const ManagerMetricCard: React.FC<ManagerMetricCardProps> = ({
  label,
  value,
  icon,
  colorScheme,
  trend,
  isActive,
  onClick
}) => {
  const getIconBg = () => {
    switch (colorScheme) {
      case 'mint':
        return 'bg-mint-50 text-mint-700'
      case 'secondary':
        return 'bg-purple-50 text-purple-600'
      case 'danger':
        return 'bg-red-50 text-red-600'
      case 'info':
        return 'bg-sky-50 text-sky-600'
      default:
        return 'bg-gray-50 text-gray-600'
    }
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-3xl border-none shadow-sm ring-1 ring-neutral-100/50 transition-all cursor-pointer active:scale-95 ${
        isActive
          ? 'ring-2 ring-mint-500 ring-offset-4 shadow-2xl shadow-mint-100/50 scale-[1.02]'
          : 'hover:shadow-md'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[12px] font-bold text-slate-400 tracking-wider whitespace-nowrap uppercase">
            {label}
          </p>
          <h3 className="text-2xl font-bold mt-1.5 text-slate-900 tracking-tight">{value}</h3>
        </div>
        {icon && (
          <div
            className={`p-3.5 rounded-2xl shadow-sm transition-transform hover:scale-105 ${getIconBg()}`}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm">
        <span
          className={`font-bold flex items-center ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}
        >
          {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
        </span>
        <span className="text-gray-500">{trend.label}</span>
      </div>
    </div>
  )
}

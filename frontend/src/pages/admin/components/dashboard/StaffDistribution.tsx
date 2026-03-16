import React from 'react'
import { IoBarChartOutline } from 'react-icons/io5'

interface RoleData {
  label: string
  count: number
  percent: string
  color: string
}

const mockRoles: RoleData[] = [
  { label: 'Sale Staff', count: 12, percent: '40%', color: 'bg-mint-500' },
  { label: 'Operation Staff', count: 8, percent: '27%', color: 'bg-emerald-500' },
  { label: 'Manager', count: 5, percent: '17%', color: 'bg-amber-500' },
  { label: 'Admin', count: 2, percent: '7%', color: 'bg-red-500' },
  { label: 'Inactive', count: 3, percent: '10%', color: 'bg-neutral-300' }
]

export const StaffDistribution: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest leading-none">
          Staff Distribution
        </h3>
        <div className="w-8 h-8 rounded-xl bg-neutral-50 flex items-center justify-center border border-neutral-100">
          <IoBarChartOutline className="text-neutral-400" />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="text-3xl font-bold text-gray-900 font-primary leading-tight">30</h4>
          <span className="text-[10px] font-semibold text-mint-600 bg-mint-50 px-1.5 py-0.5 rounded-full">
            Total Staff
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {mockRoles.map((role, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-gray-700 font-primary">
              <span>{role.label}</span>
              <span className="font-bold">{role.count}</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${role.color} rounded-full transition-all duration-1000`}
                style={{ width: role.percent }}
              />
            </div>
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-tight">
              {role.percent}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

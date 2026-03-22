import React, { useMemo } from 'react'
import { IoBarChartOutline } from 'react-icons/io5'
import { useQuery } from '@tanstack/react-query'
import { adminAccountService } from '@/shared/services/admin/adminAccountService'

interface RoleData {
  label: string
  count: number
  percent: string
  color: string
}

const ROLE_CONFIG = [
  { label: 'Sale Staff', match: 'SALE_STAFF', color: 'bg-mint-500' },
  { label: 'Operation Staff', match: 'OPERATION_STAFF', color: 'bg-emerald-500' },
  { label: 'Manager', match: 'MANAGER', color: 'bg-amber-500' },
  { label: 'Admin', match: 'SYSTEM_ADMIN', color: 'bg-red-500' }
]

export const StaffDistribution: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-accounts-stats'],
    queryFn: () => adminAccountService.getAdminAccounts({ limit: 200 })
  })

  const stats = useMemo(() => {
    if (!data?.data?.adminAccounts) return { roles: [], total: 0 }

    const accounts = data.data.adminAccounts
    const total = data.data.pagination.total
    const activeAccounts = accounts.filter((a) => !a.deletedAt)
    const inactiveCount = total - activeAccounts.length

    const roles: RoleData[] = ROLE_CONFIG.map((config) => {
      const count = activeAccounts.filter((a) => a.role === config.match).length
      return {
        label: config.label,
        count,
        percent: total > 0 ? `${Math.round((count / total) * 100)}%` : '0%',
        color: config.color
      }
    })

    // Add Inactive
    roles.push({
      label: 'Inactive',
      count: inactiveCount,
      percent: total > 0 ? `${Math.round((inactiveCount / total) * 100)}%` : '0%',
      color: 'bg-neutral-300'
    })

    return { roles, total }
  }, [data])

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm animate-pulse">
        <div className="h-4 w-32 bg-neutral-100 rounded mb-10" />
        <div className="h-8 w-20 bg-neutral-100 rounded mb-8" />
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between h-3 bg-neutral-100 rounded" />
              <div className="h-1.5 bg-neutral-100 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm animate-in fade-in duration-500">
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
          <h4 className="text-3xl font-bold text-gray-900 font-primary leading-tight">
            {stats.total}
          </h4>
          <span className="text-[10px] font-semibold text-mint-600 bg-mint-50 px-1.5 py-0.5 rounded-full">
            Total Staff
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {stats.roles.map((role, idx) => (
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

import React from 'react'
import { IoFilterOutline, IoSearchOutline } from 'react-icons/io5'
import { Button } from '@/shared/components/ui-core'

interface StatusTab {
  label: string
  value: string
}

interface StatusFilterBarProps {
  statusTabs: StatusTab[]
  statusFilter: string
  onStatusChange: (status: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onToggleFilter: () => void
}

export const StatusFilterBar: React.FC<StatusFilterBarProps> = ({
  statusTabs,
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
  onToggleFilter
}) => {
  return (
    <div className="px-4 mb-6">
      <div className="flex flex-col xl:flex-row justify-between gap-5">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl w-fit border border-neutral-200/60 shadow-sm overflow-x-auto">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => onStatusChange(tab.value)}
                className={`px-5 py-2.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-mint-500 to-emerald-500 text-white shadow-md shadow-mint-500/20'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />}
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-[320px] group">
            <IoSearchOutline
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-mint-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, code or phone..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200/60 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-400 transition-all shadow-sm placeholder:text-slate-300"
            />
          </div>
          <Button
            variant="outline"
            className="px-5 py-3 rounded-2xl border-neutral-200/60 text-slate-500 hover:border-mint-400 hover:text-mint-600 hover:bg-mint-50/50 transition-all font-semibold flex items-center gap-2 w-full sm:w-auto shadow-sm text-xs uppercase tracking-wider"
            onClick={onToggleFilter}
          >
            <IoFilterOutline size={16} />
            Filters
          </Button>
        </div>
      </div>
    </div>
  )
}

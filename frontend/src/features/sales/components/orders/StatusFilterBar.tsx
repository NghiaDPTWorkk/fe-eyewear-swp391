import React from 'react'
import { IoFilterOutline, IoSearchOutline, IoRepeatOutline } from 'react-icons/io5'
import { cn } from '@/lib/utils'

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
  onReset: () => void
  orderTypeFilter: string
}

export const StatusFilterBar: React.FC<StatusFilterBarProps> = ({
  statusTabs,
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
  onToggleFilter,
  onReset,
  orderTypeFilter
}) => {
  return (
    <div className="flex flex-col gap-4">
      {}
      <div className="overflow-x-auto">
        <div className="flex items-center gap-2 p-1.5 bg-neutral-100/50 rounded-2xl w-fit border border-neutral-100">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => onStatusChange(tab.value)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap',
                  isActive
                    ? 'bg-white text-mint-600 shadow-sm border border-neutral-100'
                    : 'text-neutral-500 hover:text-neutral-700'
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {}
      <div className="bg-white border border-neutral-100 rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
        {}
        <div className="flex-1 max-w-md relative">
          <IoSearchOutline
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            size={18}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, code or phone..."
            className="w-full pl-11 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all font-primary"
          />
        </div>

        {}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleFilter}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-100 bg-neutral-50 text-neutral-600 rounded-xl text-sm font-semibold hover:bg-neutral-100 transition-all min-w-[160px] justify-between h-[42px]"
          >
            <div className="flex items-center gap-2">
              <IoFilterOutline className="text-neutral-400" size={16} />
              <span className="capitalize">{orderTypeFilter.toLowerCase().replace('-', ' ')}</span>
            </div>
            <span className="text-neutral-400">{'>'}</span>
          </button>

          <button
            onClick={onReset}
            className="p-2.5 bg-white text-neutral-400 rounded-xl hover:text-mint-600 hover:border-mint-200 border border-neutral-200 transition-all shadow-sm h-[42px] w-[42px] flex items-center justify-center"
            title="Reset Filters"
          >
            <IoRepeatOutline size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

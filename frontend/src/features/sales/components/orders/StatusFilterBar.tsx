import React from 'react'
import {
  IoFilterOutline,
  IoSearchOutline,
  IoRepeatOutline,
  IoChevronDownOutline
} from 'react-icons/io5'
import { cn } from '@/lib/utils'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { toTitleCase } from '@/shared/utils'

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
  isFilterOpen: boolean
  setIsFilterOpen: (open: boolean) => void
  onOrderTypeChange: (type: string) => void
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
  isFilterOpen,
  setIsFilterOpen,
  onOrderTypeChange,
  onReset,
  orderTypeFilter
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Status Tabs */}
      <div className="overflow-x-auto">
        <div className="flex items-center gap-2 p-1.5 bg-neutral-100/50 rounded-2xl w-fit border border-neutral-100">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => onStatusChange(tab.value)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all whitespace-nowrap outline-none',
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

      {/* Search and Filters */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
        {/* Search */}
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

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={onToggleFilter}
              className={cn(
                'flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-semibold transition-all min-w-[160px] justify-between h-[42px]',
                isFilterOpen || orderTypeFilter !== 'All'
                  ? 'border-mint-500 bg-mint-50 text-mint-600 ring-4 ring-mint-500/10'
                  : 'border-neutral-100 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
              )}
            >
              <div className="flex items-center gap-2">
                <IoFilterOutline
                  className={isFilterOpen ? 'text-mint-600' : 'text-neutral-400'}
                  size={16}
                />
                <span className="capitalize">{toTitleCase(orderTypeFilter)}</span>
              </div>
              <IoChevronDownOutline
                className={cn('transition-transform duration-200', isFilterOpen && 'rotate-180')}
                size={14}
              />
            </button>

            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                <div className="absolute top-full mt-2 right-0 w-56 z-20 p-2 bg-white rounded-2xl shadow-xl shadow-mint-900/5 border border-neutral-100 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1">
                    {['All', OrderType.NORMAL, OrderType.MANUFACTURING, OrderType.PRE_ORDER].map(
                      (val) => (
                        <button
                          key={val}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all text-left',
                            orderTypeFilter === val
                              ? 'bg-mint-50 text-mint-600 font-bold'
                              : 'text-neutral-600 hover:bg-neutral-50 hover:pl-4'
                          )}
                          onClick={() => onOrderTypeChange(val)}
                        >
                          {val === 'All' ? 'All Types' : toTitleCase(val)}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={onReset}
            className="p-2.5 bg-white text-neutral-400 rounded-xl hover:text-mint-600 hover:border-mint-200 border border-neutral-200 transition-all shadow-sm h-[42px] w-[42px] flex items-center justify-center outline-none"
            title="Reset Filters"
          >
            <IoRepeatOutline size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

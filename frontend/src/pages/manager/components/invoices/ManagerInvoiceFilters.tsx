import React from 'react'
import {
  IoSearchOutline,
  IoFilterOutline,
  IoChevronBackOutline,
  IoRefreshOutline
} from 'react-icons/io5'
import { Button } from '@/shared/components/ui-core'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { toTitleCase } from '@/shared/utils'

interface ManagerInvoiceFiltersProps {
  statusFilter: string
  onStatusChange: (status: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  orderTypeFilter: string
  onOrderTypeChange: (type: string) => void
  isFilterOpen: boolean
  setIsFilterOpen: (open: boolean) => void
  onRefetch: () => void
  isLoading: boolean
}

export const ManagerInvoiceFilters: React.FC<ManagerInvoiceFiltersProps> = ({
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
  orderTypeFilter,
  onOrderTypeChange,
  isFilterOpen,
  setIsFilterOpen,
  onRefetch,
  isLoading
}) => {
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <div className="flex items-center gap-2 p-1.5 bg-neutral-100/50 rounded-2xl w-fit border border-neutral-100">
          {[
            'All',
            InvoiceStatus.PENDING,
            InvoiceStatus.DEPOSITED,
            InvoiceStatus.APPROVED,
            InvoiceStatus.ONBOARD,
            InvoiceStatus.DELIVERING,
            InvoiceStatus.COMPLETED
          ].map((val) => (
            <button
              key={val}
              onClick={() => onStatusChange(val)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                statusFilter === val
                  ? 'bg-white text-mint-600 shadow-sm border border-neutral-100'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {val === 'All' ? 'All Invoices' : val}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-50/50 shadow-sm relative">
        <div className="p-6 border-b border-neutral-50/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1 max-w-md relative">
            <IoSearchOutline
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, code or phone..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-semibold transition-all min-w-[160px] justify-between h-[42px] ${
                  isFilterOpen || orderTypeFilter !== 'All'
                    ? 'border-mint-500 bg-mint-50 text-mint-600 ring-4 ring-mint-500/10'
                    : 'border-neutral-100 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <IoFilterOutline
                    className={isFilterOpen ? 'text-mint-600' : 'text-neutral-400'}
                  />
                  <span>
                    {orderTypeFilter === 'All' ? 'All Types' : toTitleCase(orderTypeFilter)}
                  </span>
                </div>
                <IoChevronBackOutline
                  className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-90' : '-rotate-90'}`}
                  size={12}
                />
              </button>
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                  <div className="absolute top-full mt-2 right-0 w-56 z-20 p-2 bg-white rounded-2xl shadow-xl shadow-mint-900/5 border border-neutral-100 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="space-y-1">
                      {[
                        'All',
                        OrderType.NORMAL,
                        OrderType.MANUFACTURING,
                        OrderType.PRE_ORDER,
                        OrderType.RETURN
                      ].map((val) => (
                        <button
                          key={val}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                            orderTypeFilter === val
                              ? 'bg-mint-50 text-mint-600 font-bold'
                              : 'text-neutral-600 hover:bg-neutral-50 hover:pl-4'
                          }`}
                          onClick={() => onOrderTypeChange(val)}
                        >
                          {val === 'All' ? 'All Types' : toTitleCase(val)}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-neutral-200 h-[42px] w-[42px] bg-white"
              onClick={onRefetch}
              disabled={isLoading}
            >
              <IoRefreshOutline className={isLoading ? 'animate-spin' : ''} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

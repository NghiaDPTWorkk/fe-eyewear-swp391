import React, { useState } from 'react'
import { IoSearchOutline, IoFilter, IoCloudDownloadOutline, IoAdd } from 'react-icons/io5'
import { Button, Card } from '@/components'
import { cn } from '@/lib/utils'

interface SalesStaffControlsProps {
  onSearch: (value: string) => void
  onFilterChange: (value: string) => void
  onExport: () => void
  onCreateOrder: () => void
  currentFilter: string
}

export const SalesStaffControls: React.FC<SalesStaffControlsProps> = ({
  onSearch,
  onFilterChange,
  onExport,
  onCreateOrder,
  currentFilter
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filterOptions = [
    { label: 'All Orders', value: 'All' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Processed', value: 'Processed' }
  ]

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
      <div className="relative flex-1 max-w-xl w-full">
        <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        <input
          type="text"
          placeholder="Search orders, customers, or frames..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50/30 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-neutral-400"
        />
      </div>

      <div className="flex gap-3 w-full md:w-auto relative">
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-all min-w-[170px] justify-between h-[42px]',
              isFilterOpen
                ? 'border-primary-500 bg-primary-50 text-primary-600'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            )}
          >
            <div className="flex items-center gap-2">
              <IoFilter /> Filter:{' '}
              {filterOptions.find((o) => o.value === currentFilter)?.label || currentFilter}
            </div>
          </button>

          {isFilterOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
              <Card className="absolute top-full mt-2 right-0 w-56 z-20 p-2 shadow-xl border border-neutral-100 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="space-y-1">
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.value}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all text-left',
                        currentFilter === opt.value
                          ? 'bg-primary-50 text-primary-600 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      )}
                      onClick={() => {
                        onFilterChange(opt.value)
                        setIsFilterOpen(false)
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
        <Button
          variant="outline"
          colorScheme="neutral"
          onClick={onExport}
          leftIcon={<IoCloudDownloadOutline className="text-lg" />}
        >
          Export
        </Button>
        <Button
          onClick={onCreateOrder}
          colorScheme="primary"
          leftIcon={<IoAdd className="text-lg" />}
        >
          New Order
        </Button>
      </div>
    </div>
  )
}

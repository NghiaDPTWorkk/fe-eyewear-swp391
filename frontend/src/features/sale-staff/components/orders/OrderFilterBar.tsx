import { IoSearchOutline, IoFilter, IoAdd, IoCloudDownloadOutline } from 'react-icons/io5'
import { Button, Card } from '@/components'
import { cn } from '@/lib/utils'

interface OrderFilterBarProps {
  search: string
  setSearch: (s: string) => void
  filter: string
  setFilter: (f: string) => void
  filterOptions: { label: string; value: string }[]
  isFilterOpen: boolean
  setIsFilterOpen: (o: boolean) => void
  onAdd?: () => void
  onExport?: () => void
  placeholder?: string
}

export const OrderFilterBar: React.FC<OrderFilterBarProps> = ({
  search,
  setSearch,
  filter,
  setFilter,
  filterOptions,
  isFilterOpen,
  setIsFilterOpen,
  onAdd,
  onExport,
  placeholder
}) => (
  <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
    <div className="relative flex-1 max-w-xl w-full">
      <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all placeholder:text-neutral-400"
      />
    </div>
    <div className="flex gap-3 w-full md:w-auto relative">
      <div className="relative">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-all min-w-[170px] justify-between h-[42px]',
            isFilterOpen
              ? 'border-mint-500 bg-mint-50 text-mint-600'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          )}
        >
          <div className="flex items-center gap-2">
            <IoFilter /> Filter: {filterOptions.find((o) => o.value === filter)?.label || filter}
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
                      filter === opt.value
                        ? 'bg-mint-50 text-mint-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    )}
                    onClick={() => {
                      setFilter(opt.value)
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
      {onExport && (
        <Button variant="outline" leftIcon={<IoCloudDownloadOutline />} onClick={onExport}>
          Export
        </Button>
      )}
      <Button colorScheme="primary" leftIcon={<IoAdd />} onClick={onAdd}>
        New Order
      </Button>
    </div>
  </div>
)

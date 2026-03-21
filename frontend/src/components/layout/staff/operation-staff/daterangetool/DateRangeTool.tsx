import React from 'react'
import { IoSearch } from 'react-icons/io5'
import { Button } from '@/shared/components/ui/button/Button'
import { Input } from '@/shared/components/ui/input/Input'

interface DateRangeToolProps {
  startDate: string
  endDate: string
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onSearch: () => void
  onClear: () => void
  isFiltered: boolean
}

const DateRangeTool: React.FC<DateRangeToolProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  onClear,
  isFiltered
}) => {
  const today = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD

  return (
    <div className="mt-6 mb-6 flex flex-wrap items-end gap-4 bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 transition-all hover:shadow-md">
      <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">
          From Date
        </label>
        <Input
          type="date"
          value={startDate}
          max={endDate || today}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">
          To Date
        </label>
        <Input
          type="date"
          value={endDate}
          min={startDate}
          max={today}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onSearch}
          className="min-w-[44px] px-3"
          title="Filter by Date"
          leftIcon={<IoSearch size={20} />}
        />
        {(startDate || endDate || isFiltered) && (
          <Button
            onClick={onClear}
            variant="ghost"
            colorScheme="danger"
            className="px-4 bg-neutral-100 hover:bg-red-50"
          >
            Clear
          </Button>
        )}
      </div>

      {isFiltered && (
        <div className="ml-2 px-3 py-1 bg-mint-50 text-mint-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-mint-100 animate-pulse">
          Filtered by Date
        </div>
      )}
    </div>
  )
}

export default DateRangeTool

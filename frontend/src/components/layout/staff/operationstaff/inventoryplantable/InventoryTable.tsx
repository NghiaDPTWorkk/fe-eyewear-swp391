import { InventoryTableHeader } from './InventoryTableHeader'
import { InventoryTData } from './InventoryTData'

interface InventoryTableProps {
  results: any[]
  staffMap: Record<string, string>
  onViewDetail: (id: string) => void
  onNext: (id: string) => void
}

export const InventoryTable = ({ results, staffMap, onViewDetail, onNext }: InventoryTableProps) => {
  return (
    <table className="w-full text-left border-collapse">
      <InventoryTableHeader />
      <InventoryTData
        results={results}
        staffMap={staffMap}
        onViewDetail={onViewDetail}
        onNext={onNext}
      />
    </table>
  )
}

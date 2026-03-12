import { InventoryTableHeader } from './InventoryTableHeader'
import { InventoryTData } from './InventoryTData'

interface InventoryTableProps {
  results: any[]
  onViewDetail: (id: string) => void
  onNext: (id: string) => void
}

export const InventoryTable = ({ results, onViewDetail, onNext }: InventoryTableProps) => {
  return (
    <table className="w-full text-left border-collapse">
      <InventoryTableHeader />
      <InventoryTData results={results} onViewDetail={onViewDetail} onNext={onNext} />
    </table>
  )
}

import { InventoryTr } from './InventoryTr'

interface InventoryTDataProps {
  results: any[]
  staffMap: Record<string, string>
  onViewDetail: (id: string) => void
  onNext: (id: string) => void
}

export const InventoryTData = ({ results, staffMap, onViewDetail, onNext }: InventoryTDataProps) => {
  return (
    <tbody className="divide-y divide-slate-50">
      {results.map((batch) => (
        <InventoryTr
          key={batch._id}
          batch={batch}
          managerName={staffMap[batch.managerResponsibility] || 'Unassigned'}
          onViewDetail={onViewDetail}
          onNext={onNext}
        />
      ))}
    </tbody>
  )
}

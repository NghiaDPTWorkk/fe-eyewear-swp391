import { InventoryTr } from './InventoryTr'

interface InventoryTDataProps {
  results: any[]
  onViewDetail: (id: string) => void
  onNext: (id: string) => void
}

export const InventoryTData = ({ results, onViewDetail, onNext }: InventoryTDataProps) => {
  return (
    <tbody className="divide-y divide-slate-50">
      {results.map((batch) => (
        <InventoryTr
          key={batch._id}
          batch={batch}
          managerName={batch.managerResponsibility || 'Unassigned'}
          onViewDetail={onViewDetail}
          onNext={onNext}
        />
      ))}
    </tbody>
  )
}

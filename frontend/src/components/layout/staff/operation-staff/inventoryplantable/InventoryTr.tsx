import { IoEyeOutline, IoTimeOutline, IoChevronForward } from 'react-icons/io5'
import { Button } from '@/components'
import { cn } from '@/lib/utils'
import { formatDate, formatTime } from '@/shared/utils'
import STATUS_INVENTORY_PLANNING_CONFIG from '@/shared/utils/enums/inventoryplan.enum'

interface InventoryTrProps {
  batch: any // Ideally use a proper type from your features/operations/types
  managerName: string
  onViewDetail: (id: string) => void
  onNext: (id: string) => void
}

export const InventoryTr = ({ batch, managerName, onViewDetail, onNext }: InventoryTrProps) => {
  const config =
    STATUS_INVENTORY_PLANNING_CONFIG[batch.status as keyof typeof STATUS_INVENTORY_PLANNING_CONFIG]

  return (
    <tr className="group hover:bg-neutral-50/50 transition-colors">
      <td className="px-6 py-5">
        <div className="text-sm font-semibold text-gray-900">{batch.sku}</div>
        <div className="w-12 mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="bg-emerald-400 h-full w-3/4 rounded-full"></div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="text-gray-400 text-sm">{managerName}</div>
      </td>
      <td className="px-6 py-5 text-center">
        <div className="text-gray-900 font-medium">{batch.targetQuantity}</div>
      </td>
      <td className="px-6 py-5 text-center">
        <span
          className={cn(
            'px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider',
            config?.bg || '',
            config?.color || ''
          )}
        >
          {config?.label || batch.status}
        </span>
      </td>
      <td className="px-6 py-5 text-gray-500">
        <div className="flex items-center justify-center gap-1.5">
          <IoTimeOutline />
          <div className="flex flex-col text-[13px]">
            <span>{formatTime(batch.createdAt)}</span>
            <span>{formatDate(batch.createdAt)}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            colorScheme="secondary"
            className="p-2"
            onClick={() => onViewDetail(batch._id)}
          >
            <IoEyeOutline size={20} />
          </Button>
          <Button
            variant="solid"
            colorScheme="primary"
            size="sm"
            className="text-xs rounded-xl h-8 px-4 font-bold"
            rightIcon={<IoChevronForward />}
            onClick={() => onNext(batch._id)}
          >
            Next
          </Button>
        </div>
      </td>
    </tr>
  )
}

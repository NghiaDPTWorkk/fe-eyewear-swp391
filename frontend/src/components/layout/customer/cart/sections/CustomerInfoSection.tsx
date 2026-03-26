import { User } from 'lucide-react'
import { Input } from '@/shared/components/ui'

interface CustomerInfoSectionProps {
  customerInfo: {
    fullName: string
    phone: string
  }
  onUpdate: (info: { fullName: string; phone: string }) => void
  errors: Record<string, string>
}

export const CustomerInfoSection = ({
  customerInfo,
  onUpdate,
  errors
}: CustomerInfoSectionProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-mint-1200 mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-primary-500" />
        Customer Information
      </h2>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-eyewear uppercase mb-1 block">
            Full Name
          </label>
          <Input
            value={customerInfo.fullName}
            onChange={(e) => onUpdate({ ...customerInfo, fullName: e.target.value })}
            placeholder="Example"
            className="rounded-xl border-mint-200"
            isInvalid={!!errors.fullName}
          />
          {errors.fullName && (
            <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.fullName}</p>
          )}
        </div>
        <div>
          <label className="text-xs font-bold text-gray-eyewear uppercase mb-1 block">
            Phone Number
          </label>
          <Input
            value={customerInfo.phone}
            onChange={(e) => onUpdate({ ...customerInfo, phone: e.target.value })}
            placeholder="0982716283"
            className="rounded-xl border-mint-200"
            isInvalid={!!errors.phone}
          />
          {errors.phone && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.phone}</p>}
        </div>
      </div>
    </div>
  )
}

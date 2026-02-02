import { Card } from '@/shared/components/ui/card'
import { User, Phone, MapPin } from 'lucide-react'
import type { Address } from '@/shared/types'

interface OrderCustomerDetailsProps {
  fullName: string
  phone: string
  address: Address
}

export function OrderCustomerDetails({ fullName, phone, address }: OrderCustomerDetailsProps) {
  return (
    <Card className="p-6 border-mint-100/50 space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-mint-50 flex items-center justify-center text-mint-400">
          <User size={16} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
            Customer
          </p>
          <p className="text-sm font-bold text-mint-1200">{fullName}</p>
          <p className="text-xs font-semibold text-gray-500 mt-0.5 flex items-center gap-1">
            <Phone size={12} /> {phone}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-mint-50 flex items-center justify-center text-mint-400">
          <MapPin size={16} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
            Shipping to
          </p>
          <p className="text-sm font-bold text-mint-1200 leading-tight">{address.street}</p>
          <p className="text-xs font-semibold text-gray-500 mt-1">
            {address.ward}, {address.city}
          </p>
        </div>
      </div>
    </Card>
  )
}

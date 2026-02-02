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
    <Card className="p-6 border-mint-100/50 space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-mint-50/50 flex items-center justify-center text-mint-400 border border-mint-100/20">
          <User size={16} />
        </div>
        <div>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1.5 leading-none">
            Customer
          </p>
          <p className="text-[15px] font-bold text-mint-1200 leading-none">{fullName}</p>
          <p className="text-xs font-semibold text-gray-500 mt-2 flex items-center gap-1.5">
            <Phone size={11} className="text-mint-300" /> {phone}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-mint-50/50 flex items-center justify-center text-mint-400 border border-mint-100/20">
          <MapPin size={16} />
        </div>
        <div>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1.5 leading-none">
            Shipping to
          </p>
          <p className="text-[15px] font-bold text-mint-1200 leading-snug">{address.street}</p>
          <p className="text-xs font-semibold text-gray-500 mt-2 uppercase tracking-wide">
            {address.ward}, {address.city}
          </p>
        </div>
      </div>
    </Card>
  )
}

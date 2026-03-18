/**
 * CustomerCard Component
 * Displays individual customer information in a card format
 */
import { Card } from '@/components'
import { IoEllipsisVertical, IoCallOutline, IoMailOutline, IoLinkOutline } from 'react-icons/io5'

interface Customer {
  name: string
  activity: string
  badge: string
  badgeColor: string
  phone: string
  email: string
  website: string
  avatar: string
}

interface CustomerCustomerCardProps {
  customer: Customer
  isSelected: boolean
  onClick: () => void
}

export default function CustomerCustomerCard({
  customer,
  isSelected,
  onClick
}: CustomerCustomerCardProps) {
  return (
    <Card
      className={`p-8 border-none shadow-sm hover:shadow-xl transition-all duration-300 group relative bg-white rounded-[32px] cursor-pointer ring-2 ${
        isSelected
          ? 'ring-primary-500 shadow-md transform scale-[1.02]'
          : 'ring-transparent hover:ring-primary-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex gap-4">
          <img
            src={customer.avatar}
            className="w-14 h-14 rounded-full object-cover ring-4 ring-neutral-50/50"
            alt={customer.name}
          />
          <div className="pt-1">
            <h3 className="text-lg font-semibold text-neutral-800 leading-tight mb-1 group-hover:text-primary-600 transition-colors">
              {customer.name}
            </h3>
            <p className="text-xs text-neutral-400 font-medium tracking-wide">
              {customer.activity}
            </p>
          </div>
        </div>
        <button
          className="p-2 text-neutral-300 hover:text-neutral-500 transition-colors rounded-full hover:bg-neutral-50"
          onClick={(e) => e.stopPropagation()}
        >
          <IoEllipsisVertical size={20} />
        </button>
      </div>

      <div className="mb-8">
        <div
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center transition-colors ${customer.badgeColor}`}
        >
          {customer.badge}
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-4 text-neutral-500 group-hover:text-neutral-700 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
            <IoCallOutline className="text-lg" />
          </div>
          <span className="text-sm font-semibold">{customer.phone}</span>
        </div>
        <div className="flex items-center gap-4 text-neutral-500 group-hover:text-neutral-700 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
            <IoMailOutline className="text-lg" />
          </div>
          <span className="text-sm font-semibold truncate">{customer.email}</span>
        </div>
        <div className="flex items-center gap-4 text-neutral-500 group-hover:text-neutral-700 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
            <IoLinkOutline className="text-lg" />
          </div>
          <span className="text-sm font-semibold">{customer.website}</span>
        </div>
      </div>
    </Card>
  )
}

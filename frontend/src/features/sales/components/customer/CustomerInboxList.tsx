import React from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import { cn } from '@/lib/utils'

interface Customer {
  id: string
  name: string
  activity: string
  badge: string
  badgeColor: string
  phone: string
  email: string
  website: string
  avatar: string
  status: 'online' | 'offline'
  lastMessage?: string
}

interface CustomerInboxListProps {
  customers: Customer[]
  selectedCustomerId: string | null
  setSelectedCustomerId: (id: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export const CustomerInboxList: React.FC<CustomerInboxListProps> = ({
  customers,
  selectedCustomerId,
  setSelectedCustomerId,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <aside className="w-[300px] lg:w-[380px] border-r border-neutral-50 bg-white flex flex-col shrink-0">
      <div className="p-6 space-y-6 text-sm font-medium">
        <div className="relative">
          <IoSearchOutline
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-11 pr-4 py-3 bg-neutral-100 border-none rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all outline-none font-normal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 p-1.5 bg-neutral-50/80 rounded-2xl">
          <button className="flex-1 py-2.5 px-4 bg-white text-gray-900 text-xs font-semibold rounded-xl shadow-sm border border-neutral-100/50 transition-all active:scale-95">
            Focused
          </button>
          <button className="flex-1 py-2.5 px-4 bg-mint-400/80 text-white text-xs font-semibold rounded-xl hover:bg-mint-500 transition-all active:scale-95">
            Other
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
        {customers.map((customer) => (
          <div
            key={customer.id}
            onClick={() => setSelectedCustomerId(customer.id)}
            className={cn(
              'px-6 py-5 flex gap-4 cursor-pointer transition-all relative group',
              selectedCustomerId === customer.id
                ? 'bg-mint-50/30'
                : 'bg-white hover:bg-neutral-50/50'
            )}
          >
            {selectedCustomerId === customer.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-mint-500" />
            )}
            <div className="relative shrink-0">
              <img
                src={customer.avatar}
                className="w-14 h-14 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
                alt={customer.name}
              />
              {customer.status === 'online' && (
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-[3px] border-white bg-emerald-500 shadow-sm" />
              )}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-[15px] font-semibold text-gray-900 truncate tracking-tight">
                  {customer.name}
                </h3>
                <span className="text-[11px] font-medium text-neutral-400 whitespace-nowrap ml-2 uppercase tracking-wider">
                  6:32 PM
                </span>
              </div>
              <p className="text-[13px] text-neutral-500 truncate font-normal leading-snug">
                {customer.lastMessage || 'No message yet'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

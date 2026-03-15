import React from 'react'
import {
  IoStar,
  IoBagCheckOutline,
  IoMailOutline,
  IoCallOutline,
  IoGlobeOutline
} from 'react-icons/io5'
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

interface CustomerProfileInsightsProps {
  customer: Customer
  showProfile: boolean
}

export const CustomerProfileInsights: React.FC<CustomerProfileInsightsProps> = ({
  customer,
  showProfile
}) => {
  return (
    <aside
      className={cn(
        'bg-neutral-50/30 border-l border-neutral-100 transition-all duration-300 overflow-hidden shrink-0 h-full',
        showProfile ? 'w-[320px] lg:w-[360px]' : 'w-0'
      )}
    >
      <div className="w-[320px] lg:w-[360px] h-full flex flex-col p-6 overflow-y-auto no-scrollbar bg-white">
        <div className="flex flex-col items-center mb-8 text-center pt-4">
          <div className="relative mb-5">
            <img
              src={customer.avatar}
              className="w-24 h-24 rounded-[2.5rem] object-cover ring-4 ring-neutral-50 shadow-lg"
              alt={customer.name}
            />
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-white p-2 rounded-xl shadow-md border-2 border-white">
              <IoStar size={16} />
            </div>
          </div>
          <h2 className="text-xl font-medium text-neutral-900 mb-1">{customer.name}</h2>
          <p className="text-[11px] font-normal text-neutral-400 capitalize">{customer.activity}</p>
          <span
            className={cn(
              'mt-4 px-4 py-1.5 rounded-full text-[10px] font-medium tracking-wider border',
              customer.badgeColor.replace('bg-', 'bg-white border-')
            )}
          >
            {customer.badge}
          </span>
        </div>

        <div className="space-y-6">
          <div className="p-5 bg-neutral-900 rounded-3xl text-white">
            <div className="flex justify-between items-center mb-4">
              <p className="text-[10px] font-medium opacity-50 tracking-wider">Customer Value</p>
              <IoBagCheckOutline size={18} className="opacity-50" />
            </div>
            <p className="text-2xl font-medium">$4,250</p>
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[9px] font-normal opacity-40">Orders</p>
                <p className="text-sm font-medium">12 Total</p>
              </div>
              <div>
                <p className="text-[9px] font-normal opacity-40">Tier</p>
                <p className="text-sm font-medium text-emerald-400">Elite</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-medium text-neutral-400 tracking-widest pl-1 uppercase">
              Contact Details
            </h4>
            <div className="space-y-4">
              {[
                { icon: <IoMailOutline />, label: 'Email', value: customer.email },
                { icon: <IoCallOutline />, label: 'Phone', value: customer.phone },
                { icon: <IoGlobeOutline />, label: 'Store', value: 'Downtown' }
              ].map((info) => (
                <div key={info.label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 shrink-0 border border-neutral-100">
                    {info.icon}
                  </div>
                  <div className="min-w-0 font-medium">
                    <p className="text-[10px] font-normal text-neutral-400 tracking-tight leading-none mb-1">
                      {info.label}
                    </p>
                    <p className="text-sm font-medium text-neutral-800 truncate">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

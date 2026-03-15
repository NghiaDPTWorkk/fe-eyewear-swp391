import { Card } from '@/shared/components/ui'
import { IoMailOutline, IoCallOutline, IoLocationOutline, IoCheckmarkCircle } from 'react-icons/io5'

interface OrderDetailSidebarProps {
  customer: { name: string; email: string; phone: string; avatar: string; since: string }
  shippingAddress: string
  children?: React.ReactNode
}

export function OrderDetailSidebar({
  customer,
  shippingAddress,
  children
}: OrderDetailSidebarProps) {
  return (
    <div className="contents">
      <Card className="xl:col-span-4 h-full flex flex-col p-6 border border-slate-100/50 shadow-xl bg-white rounded-[32px] overflow-hidden relative group">
        <h2 className="text-lg font-semibold text-slate-800 tracking-tight mb-6 relative z-10">
          Customer Profile
        </h2>
        <div className="relative flex flex-col items-center text-center pb-8 border-b border-slate-100">
          <div className="w-20 h-20 rounded-[28px] flex items-center justify-center font-semibold text-2xl border-4 border-white shadow-xl mb-4 bg-mint-100 text-mint-600">
            {customer.avatar}
          </div>
          <h3 className="text-lg font-semibold text-slate-900 tracking-tight">{customer.name}</h3>
          <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest rounded-full mt-2 bg-mint-50 text-mint-600">
            {customer.since}
          </p>
        </div>
        <div className="space-y-5 pt-8">
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <IoMailOutline /> Email
            </p>
            <p className="text-sm font-semibold text-slate-700 truncate">{customer.email}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <IoCallOutline /> Contact
            </p>
            <p className="text-sm font-semibold text-slate-700">{customer.phone}</p>
          </div>
          <button className="w-full mt-4 py-3 text-xs font-semibold border rounded-xl active:scale-95 text-mint-600 bg-mint-50/50 hover:bg-mint-50 border-mint-100/50 uppercase tracking-widest">
            View History
          </button>
        </div>
      </Card>
      <Card className="xl:col-span-4 h-full flex flex-col p-6 border border-slate-100/50 shadow-xl bg-white rounded-[32px]">
        <h2 className="text-lg font-semibold text-slate-800 tracking-tight mb-6">Order Detail</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-mint-500 border border-slate-100">
              <IoLocationOutline size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Shipping Address
              </p>
              <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                {shippingAddress}
              </p>
            </div>
          </div>
          <div className="flex gap-4 pt-6 border-t border-slate-50">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-mint-500 border border-slate-100">
              <IoCheckmarkCircle size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Billing Method
              </p>
              <p className="text-sm font-semibold text-slate-700">Same as Shipping</p>
            </div>
          </div>
        </div>
      </Card>
      {children && <div className="xl:col-span-12 w-full">{children}</div>}
      <Card className="xl:col-span-4 h-full flex flex-col p-6 border border-slate-100/50 shadow-xl bg-amber-50/40 rounded-[32px] relative overflow-hidden">
        <h2 className="text-base font-semibold tracking-tight mb-4 flex items-center gap-2 text-amber-600">
          Staff Memo
        </h2>
        <textarea
          className="w-full flex-1 min-h-[100px] p-4 rounded-3xl border border-amber-100 bg-white/60 focus:outline-none text-xs font-medium text-slate-700 resize-none shadow-inner"
          placeholder="Add private instructions..."
        />
        <div className="flex justify-end mt-4">
          <button className="text-[10px] font-semibold uppercase tracking-widest text-amber-700">
            Save Changes
          </button>
        </div>
      </Card>
    </div>
  )
}

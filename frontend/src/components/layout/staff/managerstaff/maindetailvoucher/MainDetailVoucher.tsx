import { IoCashOutline, IoGlobeOutline, IoCalendarOutline } from 'react-icons/io5'
import type { Voucher } from '@/shared/types'
import {
  fmtVND,
  fmtDate
} from '@/components/layout/staff/managerstaff/vouchertable/VoucherTdata.utils'

interface MainDetailVoucherProps {
  voucher: Voucher
  statusConfig: { pill: string; dot: string; label: string }
}

export default function MainDetailVoucher({
  voucher: v,
  statusConfig: st
}: MainDetailVoucherProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-5 duration-500">
      <div className="p-8 space-y-8">
        {/* Identification & Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Identification
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${st.pill}`}
            >
              <span className={`w-1 h-1 rounded-full ${st.dot}`} />
              {st.label}
            </span>
          </div>
        </div>

        {/* Voucher Title & Overview */}
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Promotion Title
            </p>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">{v.name}</h2>
          </div>
          {v.description && (
            <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 italic text-slate-600 text-sm leading-relaxed">
              {v.description}
            </div>
          )}
        </div>

        {/* Specific Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DetailGroup
            icon={<IoCashOutline className="text-mint-500" />}
            title="Order Requirements"
            items={[
              { label: 'Minimum Spend', value: `${fmtVND(v.minOrderValue)}đ` },
              {
                label: 'Maximum Discount',
                value: v.maxDiscountValue > 0 ? `${fmtVND(v.maxDiscountValue)}đ` : 'No limit'
              }
            ]}
          />
          <DetailGroup
            icon={<IoGlobeOutline className="text-mint-500" />}
            title="Accessibility"
            items={[
              {
                label: 'Apply Scope',
                value: v.applyScope === 'ALL' ? 'Open to everyone' : 'Targeted users only'
              },
              { label: 'Visibility', value: 'Publicly listed' }
            ]}
          />
        </div>

        {/* Validity Section */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <IoCalendarOutline className="text-mint-500" size={18} />
            <h3 className="text-sm font-bold text-slate-800">Validity Period</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100">
              <div className="w-1.5 h-1.5 rounded-full bg-mint-500" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Active From
                </p>
                <p className="text-sm font-bold text-slate-700">{fmtDate(v.startedDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Expires On
                </p>
                <p className="text-sm font-bold text-slate-700">{fmtDate(v.endedDate)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailGroup({
  icon,
  title,
  items
}: {
  icon: React.ReactNode
  title: string
  items: { label: string; value: string }[]
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</h4>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              {item.label}
            </span>
            <span className="text-sm font-bold text-slate-700">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

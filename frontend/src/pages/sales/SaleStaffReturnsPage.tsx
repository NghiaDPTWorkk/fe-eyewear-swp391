import { useState } from 'react'
import { Button, Card } from '@/components'
import ReturnDetails from '@/features/sales/components/returns/ReturnDetails'
import {
  IoSearchOutline,
  IoRefreshOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoChevronForward
} from 'react-icons/io5'

import { PageHeader } from '@/features/sales/components/common'

export default function SaleStaffReturnsPage() {
  const [selectedReturnId, setSelectedReturnId] = useState<string | null>(null)

  if (selectedReturnId) {
    return <ReturnDetails returnId={selectedReturnId} onBack={() => setSelectedReturnId(null)} />
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Returns Management"
        subtitle="Process customer returns and refunds."
        breadcrumbs={[
          { label: 'Dashboard', path: '/salestaff/dashboard' },
          { label: 'Orders', path: '/salestaff/orders' },
          { label: 'Returns' }
        ]}
      />

      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 max-w-md w-full">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search Return ID, Order #..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-mint-500/20 focus:border-mint-500 transition-all placeholder:text-gray-400"
            />
          </div>
          <Button
            variant="solid"
            colorScheme="primary"
            leftIcon={<IoRefreshOutline />}
            className="rounded-xl font-semibold"
          >
            Process New Return
          </Button>
        </div>

        <Card className="p-0 overflow-hidden border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50 bg-white rounded-[32px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-neutral-100">
                  <th className="pl-10 px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest align-middle">
                    Return ID
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest align-middle">
                    Original Order
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest align-middle">
                    Customer
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest align-middle">
                    Reason
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center align-middle">
                    Status
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest align-middle">
                    Date
                  </th>
                  <th className="pr-10 px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right align-middle">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 bg-white">
                <tr
                  className="hover:bg-mint-50/20 cursor-pointer group transition-all"
                  onClick={() => setSelectedReturnId('RET-8821')}
                >
                  <td className="pl-10 px-6 py-6 text-sm font-semibold text-slate-900 group-hover:text-mint-600 transition-colors align-middle">
                    #RET-8821
                  </td>
                  <td className="px-6 py-6 text-sm font-medium text-blue-600/80 align-middle">
                    #ORD-2023-098
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="text-sm font-bold text-slate-700">Michael Scott</div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      michael.s@example.com
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm font-medium text-slate-500 align-middle">
                    Defective Frame
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="flex justify-center">
                      <span className="px-4 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest bg-orange-50 text-orange-600 border border-orange-100 shadow-sm">
                        Pending
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="text-sm font-medium text-slate-600">Oct 23, 2023</div>
                  </td>
                  <td className="pr-10 px-6 py-6 text-right align-middle">
                    <button
                      className="text-slate-300 hover:text-mint-500 hover:bg-mint-50 transition-all p-2 rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedReturnId('RET-8821')
                      }}
                    >
                      <IoChevronForward size={18} />
                    </button>
                  </td>
                </tr>
                <tr
                  className="hover:bg-mint-50/20 cursor-pointer group transition-all"
                  onClick={() => setSelectedReturnId('RET-8819')}
                >
                  <td className="pl-10 px-6 py-6 text-sm font-semibold text-slate-900 group-hover:text-mint-600 transition-colors align-middle">
                    #RET-8819
                  </td>
                  <td className="px-6 py-6 text-sm font-medium text-blue-600/80 align-middle">
                    #ORD-2023-012
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="text-sm font-bold text-slate-700">Pam Beesly</div>
                    <div className="text-[11px] text-slate-400 font-medium">pam.b@example.com</div>
                  </td>
                  <td className="px-6 py-6 text-sm font-medium text-slate-500 align-middle">
                    Wrong Size
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="flex justify-center">
                      <span className="px-4 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                        Approved
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="text-sm font-medium text-slate-600">Oct 23, 2023</div>
                  </td>
                  <td className="pr-10 px-6 py-6 text-right align-middle">
                    <button
                      className="text-slate-300 hover:text-mint-500 hover:bg-mint-50 transition-all p-2 rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedReturnId('RET-8819')
                      }}
                    >
                      <IoChevronForward size={18} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-6 border-t border-slate-50 flex justify-between items-center text-sm text-slate-400 font-medium">
            <span>Showing 1 to 2 of 15 returns</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                colorScheme="neutral"
                size="sm"
                className="px-2 border-slate-200 rounded-xl"
              >
                <IoChevronBackOutline />
              </Button>
              <Button
                variant="solid"
                colorScheme="primary"
                size="sm"
                className="min-w-[32px] px-2 font-bold rounded-xl bg-mint-500 text-white"
              >
                1
              </Button>
              <Button
                variant="outline"
                colorScheme="neutral"
                size="sm"
                className="px-2 border-slate-200 rounded-xl"
              >
                <IoChevronForwardOutline />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

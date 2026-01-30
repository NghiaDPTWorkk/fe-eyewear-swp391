import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Button, Card } from '@/components'
import SaleStaffReturnDetails from '@/features/sales/components/SaleStaffReturnDetails/SaleStaffReturnDetails'
import {
  IoSearchOutline,
  IoRefreshOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoChevronForward
} from 'react-icons/io5'

export default function SaleStaffReturnsPage() {
  const [selectedReturnId, setSelectedReturnId] = useState<string | null>(null)

  if (selectedReturnId) {
    return (
      <Container>
        <SaleStaffReturnDetails
          returnId={selectedReturnId}
          onBack={() => setSelectedReturnId(null)}
        />
      </Container>
    )
  }

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-2 font-medium">
          <Link
            to="/salestaff/dashboard"
            className="text-neutral-400 hover:text-primary-500 transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-neutral-300">/</span>
          <Link
            to="/salestaff/orders"
            className="text-neutral-400 hover:text-primary-500 transition-colors"
          >
            Orders
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-primary-500 font-semibold">Returns Management</span>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Returns Management</h1>
        <p className="text-gray-500 mt-1">Process customer returns and refunds.</p>
      </div>

      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 max-w-md w-full">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search Return ID, Order #..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-400"
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

        <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-neutral-100">
                  <th className="pl-10 px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest align-middle">
                    Return ID
                  </th>
                  <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest align-middle">
                    Original Order
                  </th>
                  <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest align-middle">
                    Customer
                  </th>
                  <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest align-middle">
                    Reason
                  </th>
                  <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest text-center align-middle">
                    Status
                  </th>
                  <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest align-middle">
                    Date
                  </th>
                  <th className="pr-10 px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest text-right align-middle">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 bg-white">
                <tr
                  className="hover:bg-emerald-50/30 cursor-pointer group transition-all"
                  onClick={() => setSelectedReturnId('RET-8821')}
                >
                  <td className="pl-10 px-6 py-6 text-sm font-medium text-slate-900 group-hover:text-emerald-600 transition-colors align-middle">
                    #RET-8821
                  </td>
                  <td className="px-6 py-6 text-sm font-medium text-blue-600/80 align-middle">
                    #ORD-2023-098
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="text-sm font-semibold text-[#3d4465]">Michael Scott</div>
                    <div className="text-[11px] text-[#a4a9c1] font-medium">
                      michael.s@example.com
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm font-medium text-gray-500 align-middle">
                    Defective Frame
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="flex justify-center">
                      <span className="px-4 py-1.5 rounded-full text-[9px] font-semibold uppercase tracking-widest bg-white text-orange-600 border border-orange-100 shadow-sm">
                        Pending
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="text-sm font-medium text-[#3d4465]">Oct 23, 2023</div>
                  </td>
                  <td className="pr-10 px-6 py-6 text-right align-middle">
                    <button
                      className="text-neutral-300 hover:text-emerald-500 hover:bg-emerald-50 transition-all p-2 rounded-xl"
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
                  className="hover:bg-emerald-50/30 cursor-pointer group transition-all"
                  onClick={() => setSelectedReturnId('RET-8819')}
                >
                  <td className="pl-10 px-6 py-6 text-sm font-medium text-slate-900 group-hover:text-emerald-600 transition-colors align-middle">
                    #RET-8819
                  </td>
                  <td className="px-6 py-6 text-sm font-medium text-blue-600/80 align-middle">
                    #ORD-2023-012
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="text-sm font-semibold text-[#3d4465]">Pam Beesly</div>
                    <div className="text-[11px] text-[#a4a9c1] font-medium">pam.b@example.com</div>
                  </td>
                  <td className="px-6 py-6 text-sm font-medium text-gray-500 align-middle">
                    Wrong Size
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="flex justify-center">
                      <span className="px-4 py-1.5 rounded-full text-[9px] font-semibold uppercase tracking-widest bg-white text-emerald-600 border border-emerald-100 shadow-sm">
                        Approved
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="text-sm font-medium text-[#3d4465]">Oct 23, 2023</div>
                  </td>
                  <td className="pr-10 px-6 py-6 text-right align-middle">
                    <button
                      className="text-neutral-300 hover:text-emerald-500 hover:bg-emerald-50 transition-all p-2 rounded-xl"
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
          <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
            <span>Showing 1 to 2 of 15 returns</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                colorScheme="neutral"
                size="sm"
                className="px-2 border-neutral-200"
              >
                <IoChevronBackOutline />
              </Button>
              <Button
                variant="solid"
                colorScheme="primary"
                size="sm"
                className="min-w-[32px] px-2 font-semibold"
              >
                1
              </Button>
              <Button
                variant="outline"
                colorScheme="neutral"
                size="sm"
                className="px-2 border-neutral-200"
              >
                <IoChevronForwardOutline />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Container>
  )
}

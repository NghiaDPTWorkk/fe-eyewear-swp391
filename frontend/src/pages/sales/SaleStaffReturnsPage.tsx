import { Link } from 'react-router-dom'
import { Container, Button, Card } from '@/components'
import {
  IoSearchOutline,
  IoRefreshOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoEyeOutline,
  IoReaderOutline // for review
} from 'react-icons/io5'

export default function SaleStaffReturnsPage() {
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
          <span className="text-primary-500 font-bold">Returns Management</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Returns Management</h1>
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
            className="rounded-xl font-bold"
          >
            Process New Return
          </Button>
        </div>

        <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider align-middle">
                    Return ID
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider align-middle">
                    Original Order
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider align-middle">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider align-middle">
                    Reason
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center align-middle">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider align-middle">
                    Date
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center align-middle">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                <tr className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#RET-8821</td>
                  <td className="px-6 py-4 text-sm text-blue-600">#ORD-2023-098</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Michael Scott</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Defective Frame</td>
                  <td className="px-6 py-4 align-middle">
                    <div className="flex justify-center">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-600 whitespace-nowrap">
                        Pending
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">Oct 23, 2023</td>
                  <td className="px-6 py-4 text-center align-middle">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        colorScheme="primary"
                        className="p-2 h-8 w-8 text-primary-500"
                        title="Review"
                      >
                        <IoReaderOutline size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        colorScheme="neutral"
                        className="p-2 h-8 w-8 text-neutral-400 hover:text-primary-500"
                        title="Details"
                      >
                        <IoEyeOutline size={18} />
                      </Button>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#RET-8819</td>
                  <td className="px-6 py-4 text-sm text-blue-600">#ORD-2023-012</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Pam Beesly</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Wrong Size</td>
                  <td className="px-6 py-4 align-middle">
                    <div className="flex justify-center">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-600 whitespace-nowrap">
                        Approved
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 align-middle">Oct 23, 2023</td>
                  <td className="px-6 py-4 text-center align-middle">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        colorScheme="neutral"
                        className="p-2 h-8 w-8 text-neutral-400 hover:text-primary-500"
                        title="Details"
                      >
                        <IoEyeOutline size={18} />
                      </Button>
                    </div>
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
                className="min-w-[32px] px-2 font-bold"
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

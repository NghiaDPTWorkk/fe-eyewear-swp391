import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Button, Card } from '@/components'
import {
  IoCloudDownloadOutline,
  IoAdd,
  IoHourglassOutline,
  IoWarningOutline,
  IoCalendarOutline,
  IoWalletOutline,
  IoFilter,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoChevronForward,
  IoGlassesOutline
} from 'react-icons/io5'
import { cn } from '@/lib/utils'
import OrderDetailsDrawer from '@/features/staff/components/OrderDetailsDrawer/OrderDetailsDrawer'
import OrderDetail from '@/features/staff/components/OrderDetail/OrderDetail'

export default function SaleStaffPreOrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showFullDetails, setShowFullDetails] = useState(false)

  const handleOpenDrawer = (orderId: string) => {
    setSelectedOrderId(orderId)
    setIsDrawerOpen(true)
  }

  const handleViewFullDetails = () => {
    setIsDrawerOpen(false)
    setShowFullDetails(true)
  }

  const handleBackToTable = () => {
    setShowFullDetails(false)
    setSelectedOrderId(null)
  }

  if (showFullDetails && selectedOrderId) {
    return (
      <Container>
        <OrderDetail orderId={selectedOrderId} onBack={handleBackToTable} isPreOrder={true} />
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
          <span className="text-primary-500 font-semibold">Pre-order Management</span>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Pre-order Tracking</h1>
        <p className="text-gray-500 mt-1">Manage outstanding orders and supplier ETA updates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-5 border border-neutral-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Pending Orders
              </p>
              <h3 className="text-3xl font-semibold text-neutral-900 mt-2">142</h3>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
              <IoHourglassOutline className="text-xl" />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-emerald-500">+12% this week</div>
        </Card>

        <Card className="p-5 border border-neutral-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Overdue ETA
              </p>
              <h3 className="text-3xl font-semibold text-neutral-900 mt-2">8</h3>
            </div>
            <div className="p-2 bg-red-50 rounded-lg text-red-500">
              <IoWarningOutline className="text-xl" />
            </div>
          </div>
          <div className="mt-4 text-xs font-semibold text-red-500">Action required</div>
        </Card>

        <Card className="p-5 border border-neutral-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Arriving Soon
              </p>
              <h3 className="text-3xl font-semibold text-neutral-900 mt-2">24</h3>
            </div>
            <div className="p-2 bg-mint-50 rounded-lg text-mint-500">
              <IoCalendarOutline className="text-xl" />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-neutral-500">Within 3 days</div>
        </Card>

        <Card className="p-5 border border-neutral-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Total Deposits
              </p>
              <h3 className="text-3xl font-semibold text-neutral-900 mt-2">$12,450</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
              <IoWalletOutline className="text-xl" />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-neutral-500">Held securely</div>
        </Card>
      </div>

      <div className="mb-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex-1 max-w-xl w-full"></div>
        <div className="flex gap-3 justify-end w-full md:w-auto">
          <Button variant="outline" colorScheme="neutral" leftIcon={<IoCloudDownloadOutline />}>
            Export
          </Button>
          <Button variant="solid" colorScheme="primary" leftIcon={<IoAdd />}>
            New Pre-order
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex gap-3">
            <Button size="sm" variant="outline" colorScheme="neutral" leftIcon={<IoFilter />}>
              Filter
            </Button>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button className="px-3 py-1 text-xs font-medium bg-white shadow-sm rounded-md text-gray-800">
                Status: All
              </button>
              <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-800">
                Brand: Ray-Ban
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-500">Showing 1-10 of 142 orders</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-neutral-100">
                <th className="pl-10 px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest align-middle">
                  SKU / Product
                </th>
                <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest text-center align-middle">
                  Order ID
                </th>
                <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest align-middle">
                  Customer
                </th>
                <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest text-center align-middle">
                  Deposit
                </th>
                <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest align-middle">
                  ETA Date
                </th>
                <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest text-center align-middle">
                  Supplier Status
                </th>
                <th className="pr-10 px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest text-right align-middle">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 bg-white">
              {[
                {
                  id: 'PO-2849',
                  sku: 'RB-3025-L0205',
                  name: 'Ray-Ban Aviator Gold',
                  customer: 'John Doe',
                  deposit: '$50.00',
                  eta: 'Oct 12, 2023',
                  status: 'DELAYED',
                  statusColor: 'bg-amber-50 text-amber-600 border-amber-100'
                },
                {
                  id: 'PO-2850',
                  sku: 'TF-5532-B',
                  name: 'Tom Ford Square Black',
                  customer: 'Emily Chen',
                  deposit: '$120.00',
                  eta: 'Oct 24, 2023',
                  status: 'ON ORDER',
                  statusColor: 'bg-blue-50 text-blue-600 border-blue-100'
                },
                {
                  id: 'PO-2852',
                  sku: 'PR-17WS',
                  name: 'Prada Symbole',
                  customer: 'Sarah Connor',
                  deposit: '$150.00',
                  eta: 'Oct 20, 2023',
                  status: 'ARRIVED',
                  statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-100'
                }
              ].map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-emerald-50/30 transition-all cursor-pointer group"
                  onClick={() => handleOpenDrawer(item.id)}
                >
                  <td className="pl-10 px-6 py-6 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl border border-emerald-100/50 flex items-center justify-center text-emerald-600 shrink-0">
                        <IoGlassesOutline size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#3d4465]">{item.sku}</div>
                        <div className="text-[11px] text-[#a4a9c1] font-medium">{item.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm text-emerald-500 font-medium text-center align-middle">
                    #{item.id}
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="text-sm font-semibold text-[#3d4465]">{item.customer}</div>
                    <div className="text-[11px] text-[#a4a9c1] font-medium">+1 (555) 012-3456</div>
                  </td>
                  <td className="px-6 py-6 text-sm font-semibold text-[#3d4465] text-center align-middle">
                    {item.deposit}
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="text-sm font-semibold text-[#3d4465]">{item.eta}</div>
                    <div className="text-[10px] text-red-400 font-medium uppercase tracking-wider">
                      {item.id === 'PO-2849' ? '3 days overdue' : ''}
                    </div>
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="flex justify-center">
                      <span
                        className={cn(
                          'px-4 py-1.5 rounded-full text-[9px] font-semibold uppercase tracking-widest border shadow-sm bg-white',
                          item.statusColor
                            .replace('bg-', 'bg-white border-')
                            .replace('text-', 'text-')
                        )}
                      >
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="pr-10 px-6 py-6 text-right align-middle">
                    <button
                      className="text-neutral-300 hover:text-emerald-500 hover:bg-emerald-50 transition-all p-2 rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenDrawer(item.id)
                      }}
                    >
                      <IoChevronForward size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination similar to OrderList */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <span>Displaying 3 of 142 items</span>
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

      {/* Slide-out Drawer */}
      <OrderDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        orderId={selectedOrderId}
        onViewFullDetails={handleViewFullDetails}
      />
    </Container>
  )
}

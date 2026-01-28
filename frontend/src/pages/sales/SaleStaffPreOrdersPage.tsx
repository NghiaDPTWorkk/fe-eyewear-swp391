import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Button, Card } from '@/components'
import {
  IoCloudDownloadOutline,
  IoAdd,
  IoWarningOutline,
  IoHourglassOutline,
  IoWalletOutline,
  IoCalendarOutline,
  IoFilter,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoChevronForward
} from 'react-icons/io5'
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
          <span className="text-primary-500 font-bold">Pre-order Management</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pre-order Tracking</h1>
        <p className="text-gray-500 mt-1">Manage outstanding orders and supplier ETA updates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-5 border border-neutral-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Pending Orders
              </p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-2">142</h3>
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
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Overdue ETA
              </p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-2">8</h3>
            </div>
            <div className="p-2 bg-red-50 rounded-lg text-red-500">
              <IoWarningOutline className="text-xl" />
            </div>
          </div>
          <div className="mt-4 text-xs font-bold text-red-500">Action required</div>
        </Card>

        <Card className="p-5 border border-neutral-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Arriving Soon
              </p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-2">24</h3>
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
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Total Deposits
              </p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-2">$12,450</h3>
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
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider align-middle">
                  SKU / Product
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider align-middle">
                  Order ID
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider align-middle">
                  Customer
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider align-middle">
                  Deposit
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider align-middle">
                  ETA Date
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center align-middle">
                  Supplier Status
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center align-middle">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr
                className="hover:bg-gray-50/50 cursor-pointer"
                onClick={() => handleOpenDrawer('PO-2849')}
              >
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">RB-3025-L0205</div>
                      <div className="text-xs text-gray-500">Ray-Ban Aviator Gold</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-primary-500 font-medium align-middle">
                  #PO-2849
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm text-gray-900">John Doe</div>
                  <div className="text-xs text-gray-500">+1 (555) 012-3456</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium align-middle">$50.00</td>
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm font-bold text-red-500">Oct 12, 2023</div>
                  <div className="text-[10px] text-red-400">3 days overdue</div>
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-600 whitespace-nowrap">
                      DELAYED
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <div className="flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      colorScheme="neutral"
                      className="p-2 h-8 w-8 text-neutral-400 hover:text-primary-500"
                      title="Details"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenDrawer('PO-2849')
                      }}
                    >
                      <IoChevronForward size={18} />
                    </Button>
                  </div>
                </td>
              </tr>

              <tr
                className="hover:bg-gray-50/50 cursor-pointer"
                onClick={() => handleOpenDrawer('PO-2850')}
              >
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">TF-5532-B</div>
                      <div className="text-xs text-gray-500">Tom Ford Square Black</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-primary-500 font-medium align-middle">
                  #PO-2850
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm text-gray-900">Emily Chen</div>
                  <div className="text-xs text-gray-500">emily.c@example.com</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium align-middle">$120.00</td>
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm text-gray-900">Oct 24, 2023</div>
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-600 whitespace-nowrap">
                      ON ORDER
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <div className="flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      colorScheme="neutral"
                      className="p-2 h-8 w-8 text-neutral-400 hover:text-primary-500"
                      title="Details"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenDrawer('PO-2850')
                      }}
                    >
                      <IoChevronForward size={18} />
                    </Button>
                  </div>
                </td>
              </tr>

              <tr
                className="hover:bg-gray-50/50 cursor-pointer"
                onClick={() => handleOpenDrawer('PO-2852')}
              >
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">PR-17WS</div>
                      <div className="text-xs text-gray-500">Prada Symbole</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-primary-500 font-medium align-middle">
                  #PO-2852
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm text-gray-900">Sarah Connor</div>
                  <div className="text-xs text-gray-500">+1 (555) 999-8888</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium align-middle">$150.00</td>
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm text-gray-900">Oct 20, 2023</div>
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-600 whitespace-nowrap">
                      ARRIVED
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <div className="flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      colorScheme="neutral"
                      className="p-2 h-8 w-8 text-neutral-400 hover:text-primary-500"
                      title="Details"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenDrawer('PO-2852')
                      }}
                    >
                      <IoChevronForward size={18} />
                    </Button>
                  </div>
                </td>
              </tr>
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

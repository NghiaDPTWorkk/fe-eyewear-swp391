import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Button, Card } from '@/components'
import PrescriptionVerification from '@/features/staff/components/PrescriptionVerification/PrescriptionVerification'
import {
  IoFilter,
  IoAdd,
  IoFlaskOutline,
  IoSync,
  IoCheckmarkDoneCircleOutline,
  IoCheckboxOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoChevronForward,
  IoGlassesOutline
} from 'react-icons/io5'

export default function SaleStaffPrescriptionPage() {
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null)

  if (selectedPrescriptionId) {
    return (
      <Container>
        <PrescriptionVerification
          orderId={selectedPrescriptionId}
          onBack={() => setSelectedPrescriptionId(null)}
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
          <span className="text-primary-500 font-bold">Prescription Management</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Prescription Orders</h1>
        <p className="text-gray-500 mt-1">Manage technical lens details and fabrication status.</p>
      </div>

      {/* Metric Cards - Custom for Rx - Moved Up */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-5 border border-neutral-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Pending Lab
              </p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-2">12</h3>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
              <IoFlaskOutline className="text-xl" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border border-neutral-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                In Grinding
              </p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-2">8</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
              <IoSync className="text-xl" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border border-neutral-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Ready for QA
              </p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-2">5</h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-500">
              <IoCheckboxOutline className="text-xl" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border border-neutral-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Completed Today
              </p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-2">24</h3>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500">
              <IoCheckmarkDoneCircleOutline className="text-xl" />
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex-1 max-w-xl w-full">{/* Add search here if needed */}</div>
        <div className="flex gap-3 justify-end w-full md:w-auto">
          <Button
            variant="outline"
            colorScheme="neutral"
            leftIcon={<IoFilter />}
            className="rounded-xl font-bold border-neutral-200"
          >
            Filter
          </Button>
          <Button
            variant="solid"
            colorScheme="primary"
            leftIcon={<IoAdd />}
            className="rounded-xl font-bold"
          >
            New Order
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
                Lens: Progressive
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-500">Showing 1-10 of 48 orders</div>
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
                  Lens Details
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider align-middle">
                  Date
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center align-middle">
                  Lab Status
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center align-middle">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              <tr
                className="hover:bg-gray-50/50 cursor-pointer group"
                onClick={() => setSelectedPrescriptionId('ORD-2023-001')}
              >
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 shrink-0 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors">
                      <IoGlassesOutline
                        size={20}
                        className="group-hover:text-emerald-500 transition-colors"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">RB-3025-L0205</div>
                      <div className="text-[11px] text-gray-400 font-medium">
                        Ray-Ban Aviator Gold
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-emerald-500 font-semibold align-middle tracking-tight">
                  #ORD-2023-001
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm font-semibold text-gray-900">John Doe</div>
                  <div className="text-[11px] text-gray-400 font-medium">+1 (555) 012-3456</div>
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm font-semibold text-gray-900">Progressive</div>
                  <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                    High Index 1.67
                  </div>
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm font-semibold text-gray-600">Oct 24, 2023</div>
                </td>
                <td className="px-6 py-4 align-middle text-center">
                  <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-orange-50 text-orange-600 border border-orange-100 whitespace-nowrap">
                      GRINDING
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <div className="flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 h-9 w-9 text-neutral-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPrescriptionId('ORD-2023-001')
                      }}
                      title="Details"
                    >
                      <IoChevronForward size={18} />
                    </Button>
                  </div>
                </td>
              </tr>

              <tr
                className="hover:bg-gray-50/50 cursor-pointer group"
                onClick={() => setSelectedPrescriptionId('ORD-2023-004')}
              >
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 shrink-0 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors">
                      <IoGlassesOutline
                        size={20}
                        className="group-hover:text-emerald-500 transition-colors"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">TF-5532-B</div>
                      <div className="text-[11px] text-gray-400 font-medium">
                        Tom Ford Square Black
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-emerald-500 font-semibold align-middle tracking-tight">
                  #ORD-2023-004
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm font-semibold text-gray-900">Alice Smith</div>
                  <div className="text-[11px] text-gray-400 font-medium">alice.s@example.com</div>
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm font-semibold text-gray-900">Single Vision</div>
                  <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                    Polycarbonate
                  </div>
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm font-semibold text-gray-600">Oct 23, 2023</div>
                </td>
                <td className="px-6 py-4 align-middle text-center">
                  <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100 whitespace-nowrap">
                      COATING
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <div className="flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 h-9 w-9 text-neutral-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPrescriptionId('ORD-2023-004')
                      }}
                      title="Details"
                    >
                      <IoChevronForward size={18} />
                    </Button>
                  </div>
                </td>
              </tr>

              <tr
                className="hover:bg-gray-50/50 cursor-pointer group"
                onClick={() => setSelectedPrescriptionId('ORD-2023-006')}
              >
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 shrink-0 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors">
                      <IoGlassesOutline
                        size={20}
                        className="group-hover:text-emerald-500 transition-colors"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">PR-17WS</div>
                      <div className="text-[11px] text-gray-400 font-medium">Prada Symbole</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-emerald-500 font-semibold align-middle tracking-tight">
                  #ORD-2023-006
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm font-semibold text-gray-900">Michael Brown</div>
                  <div className="text-[11px] text-gray-400 font-medium">+1 (555) 987-6543</div>
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm font-semibold text-gray-900">Bifocal</div>
                  <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                    Trivex
                  </div>
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm font-semibold text-gray-600">Oct 20, 2023</div>
                </td>
                <td className="px-6 py-4 align-middle text-center">
                  <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-purple-50 text-purple-600 border border-purple-100 whitespace-nowrap">
                      QA CHECK
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <div className="flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 h-9 w-9 text-neutral-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPrescriptionId('ORD-2023-006')
                      }}
                      title="Details"
                    >
                      <IoChevronForward size={18} />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <span>Displaying 3 of 48 items</span>
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
    </Container>
  )
}

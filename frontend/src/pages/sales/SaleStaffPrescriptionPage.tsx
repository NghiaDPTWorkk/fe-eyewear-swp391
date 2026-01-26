import { Link } from 'react-router-dom'
import { Container, Button, Card } from '@/components'
import {
  IoFilter,
  IoAdd,
  IoFlaskOutline,
  IoSync,
  IoCheckmarkDoneCircleOutline,
  IoCheckboxOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline
} from 'react-icons/io5'

export default function SaleStaffPrescriptionPage() {
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
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-64 align-middle">
                  Order Info
                </th>
                <th className="px-2 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center align-middle">
                  Date
                </th>
                <th
                  className="px-2 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center align-middle"
                  colSpan={3}
                >
                  Right Eye (OD)
                  <br />
                  <span className="text-[9px] font-normal lowercase tracking-normal">
                    SPH | CYL | AXIS
                  </span>
                </th>
                <th
                  className="px-2 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center align-middle"
                  colSpan={3}
                >
                  Left Eye (OS)
                  <br />
                  <span className="text-[9px] font-normal lowercase tracking-normal">
                    SPH | CYL | AXIS
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider align-middle">
                  Lens Type
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center align-middle">
                  Lab Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              <tr className="hover:bg-gray-50/50">
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      JD
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 leading-tight">John Doe</div>
                      <div className="text-[11px] text-gray-400 font-medium">#ORD-2023-001</div>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-4 text-sm text-center font-medium text-gray-500 align-middle">
                  Oct 24, 2023
                </td>
                <td className="px-2 py-4 text-sm text-center font-bold text-neutral-900 align-middle">
                  -2.25
                </td>
                <td className="px-2 py-4 text-sm text-center font-medium text-neutral-500 align-middle">
                  -0.50
                </td>
                <td className="px-2 py-4 text-sm text-center font-medium text-neutral-500 align-middle">
                  180
                </td>

                <td className="px-2 py-4 text-sm text-center font-bold text-neutral-900 align-middle">
                  -2.50
                </td>
                <td className="px-2 py-4 text-sm text-center font-medium text-neutral-500 align-middle">
                  -0.75
                </td>
                <td className="px-2 py-4 text-sm text-center font-medium text-neutral-500 align-middle">
                  175
                </td>

                <td className="px-6 py-4 align-middle">
                  <div className="text-sm font-bold text-gray-900">Progressive</div>
                  <div className="text-[11px] text-gray-400 font-medium">High Index 1.67</div>
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-600 whitespace-nowrap">
                    Grinding
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-gray-50/50">
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">
                      AS
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 leading-tight">
                        Alice Smith
                      </div>
                      <div className="text-[11px] text-gray-400 font-medium">#ORD-2023-004</div>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-4 text-sm text-center font-medium text-gray-500 align-middle">
                  Oct 23, 2023
                </td>
                <td className="px-2 py-4 text-sm text-center font-bold text-neutral-900 align-middle">
                  +1.00
                </td>
                <td className="px-2 py-4 text-sm text-center font-medium text-neutral-500 align-middle">
                  0.00
                </td>
                <td className="px-2 py-4 text-sm text-center font-medium text-neutral-500 align-middle">
                  0
                </td>

                <td className="px-2 py-4 text-sm text-center font-bold text-neutral-900 align-middle">
                  +1.25
                </td>
                <td className="px-2 py-4 text-sm text-center font-medium text-neutral-500 align-middle">
                  -0.25
                </td>
                <td className="px-2 py-4 text-sm text-center font-medium text-neutral-500 align-middle">
                  90
                </td>

                <td className="px-6 py-4 align-middle">
                  <div className="text-sm font-bold text-gray-900">Single Vision</div>
                  <div className="text-[11px] text-gray-400 font-medium">Polycarbonate</div>
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-600 whitespace-nowrap">
                    Coating
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <span>Showing 1 to 5 of 48 results</span>
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

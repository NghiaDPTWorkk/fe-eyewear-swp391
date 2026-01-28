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
  IoEyeOutline,
  IoGlassesOutline,
  IoWarningOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoConstructOutline
} from 'react-icons/io5'

export default function SaleStaffRxVerificationPage() {
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
            className="text-neutral-400 hover:text-emerald-500 transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-neutral-300">/</span>
          <Link
            to="/salestaff/orders"
            className="text-neutral-400 hover:text-emerald-500 transition-colors"
          >
            Orders
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-emerald-500 font-semibold">Prescription Management</span>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
          Prescription Verification
        </h1>
        <p className="text-gray-500 mt-1 font-normal">
          Manage technical lens details, laboratory status, and verify prescription parameters.
        </p>
      </div>

      {/* Metric Cards - Mint Themed */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-5 border border-emerald-100 bg-emerald-50/30 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                Pending Lab
              </p>
              <h3 className="text-3xl font-semibold text-emerald-900 mt-2">12</h3>
            </div>
            <div className="p-2 bg-white rounded-xl text-emerald-500 shadow-sm border border-emerald-100">
              <IoFlaskOutline className="text-xl" />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-emerald-600">+12% this week</div>
        </Card>

        <Card className="p-5 border border-neutral-100 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                In Grinding
              </p>
              <h3 className="text-3xl font-semibold text-gray-900 mt-2">8</h3>
            </div>
            <div className="p-2 bg-gray-50 rounded-xl text-gray-500">
              <IoSync className="text-xl" />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-red-500">2 Overdue</div>
        </Card>

        <Card className="p-5 border border-neutral-100 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Ready for QA
              </p>
              <h3 className="text-3xl font-semibold text-gray-900 mt-2">5</h3>
            </div>
            <div className="p-2 bg-gray-50 rounded-xl text-gray-500">
              <IoCheckboxOutline className="text-xl" />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-amber-600">Action required</div>
        </Card>

        <Card className="p-5 border border-neutral-100 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Completed
              </p>
              <h3 className="text-3xl font-semibold text-gray-900 mt-2">24</h3>
            </div>
            <div className="p-2 bg-gray-50 rounded-xl text-gray-500">
              <IoCheckmarkDoneCircleOutline className="text-xl" />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-gray-400">Within 3 days</div>
        </Card>
      </div>

      {/* Urgent Attention Needed Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <IoWarningOutline className="text-red-500" /> Urgent Attention Needed
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-4 border-l-4 border-l-red-500 bg-red-50/10 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-700 uppercase tracking-wide">
                Job Rejected
              </span>
              <span className="text-xs text-gray-400 font-medium">2h ago</span>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Order #ORD-2023-009</h3>
            <p className="text-xs text-gray-500 line-clamp-2">
              Lab rejected due to base curve incompatibility. Please review lens selection.
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-red-600">
                Review Issue <IoChevronForward />
              </div>
              <span className="text-[10px] font-medium text-red-400">Escalated</span>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-amber-500 bg-amber-50/10 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700 uppercase tracking-wide">
                Missing Data
              </span>
              <span className="text-xs text-gray-400 font-medium">5h ago</span>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Order #ORD-2023-012</h3>
            <p className="text-xs text-gray-500 line-clamp-2">
              Pupillary Distance (PD) missing for Right Eye. Customer contact required.
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-600">
                Update Data <IoChevronForward />
              </div>
              <span className="text-[10px] font-medium text-amber-500">Notified</span>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-blue-500 bg-blue-50/10 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700 uppercase tracking-wide">
                High Complexity
              </span>
              <span className="text-xs text-gray-400 font-medium">10m ago</span>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Order #ORD-2023-015</h3>
            <p className="text-xs text-gray-500 line-clamp-2">
              High index progressive lens with prism correction. Requires senior verification.
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                Verify Now <IoChevronForward />
              </div>
              <span className="text-[10px] font-medium text-blue-400">Senior Req.</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Laboratory Operations Requests - "Confirm from Operation" Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <IoConstructOutline className="text-emerald-600" /> Laboratory Operations Requests
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
              3 Action Items
            </span>
          </h2>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-gray-100">
            {/* Request Item 1 */}
            <div className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center hover:bg-gray-50 transition-colors">
              <div className="p-3 rounded-full bg-amber-50 text-amber-600 shrink-0">
                <IoWarningOutline className="text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900">
                    Lens Blank Unavailable
                  </span>
                  <span className="text-xs font-mono text-gray-400">#REQ-2023-089</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700 uppercase">
                    Action Required
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">Order #ORD-2023-012:</span> Lab
                  reports stock shortage for{' '}
                  <span className="font-medium text-gray-800">Hoya BlueControl 1.67</span>.
                  Alternative suggested:{' '}
                  <span className="font-medium text-emerald-600">Essilor Crizal 1.67</span>. Please
                  confirm switch.
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <IoTimeOutline /> 30 mins ago
                  </span>
                  <span className="flex items-center gap-1">
                    <IoConstructOutline /> Operator: Mike D.
                  </span>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                <Button size="sm" variant="outline" className="text-gray-500 border-gray-200">
                  Decline
                </Button>
                <Button
                  size="sm"
                  variant="solid"
                  className="bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  Confirm Switch
                </Button>
              </div>
            </div>

            {/* Request Item 2 */}
            <div className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center hover:bg-gray-50 transition-colors">
              <div className="p-3 rounded-full bg-blue-50 text-blue-600 shrink-0">
                <IoGlassesOutline className="text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900">Frame Damage Report</span>
                  <span className="text-xs font-mono text-gray-400">#REQ-2023-092</span>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">Order #ORD-2023-045:</span> Frame
                  arrived at lab with hairline crack on left temple. Please advise on replacement or
                  proceed at risk (customer waiver required).
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <IoTimeOutline /> 2 hours ago
                  </span>
                  <span className="flex items-center gap-1">
                    <IoConstructOutline /> Operator: Sarah L.
                  </span>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                <Button size="sm" variant="outline" className="text-gray-500 border-gray-200">
                  Contact Customer
                </Button>
                <Button
                  size="sm"
                  variant="solid"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Send Replacement
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-center">
            <button className="text-xs font-semibold text-gray-500 hover:text-emerald-600 transition-colors">
              View All Operations Requests (5 Hidden)
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main Content Column */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                Verification Queue{' '}
                <span className="text-sm font-normal text-gray-500 ml-2">(48 orders)</span>
              </h2>
            </div>
            <div className="flex gap-3 justify-end w-full md:w-auto">
              <Button
                variant="outline"
                className="border-neutral-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-200"
                leftIcon={<IoFilter />}
              >
                Filter
              </Button>
              <Button
                variant="solid"
                className="bg-emerald-500 hover:bg-emerald-600 text-white border-transparent"
                leftIcon={<IoAdd />}
              >
                New Rx Order
              </Button>
            </div>
          </div>

          <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider w-64 align-middle">
                      Patient & Order
                    </th>
                    <th className="px-4 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider w-40 align-middle">
                      Frame Ref
                    </th>
                    <th
                      className="px-2 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center align-middle bg-emerald-50/30 border-l border-emerald-100/50"
                      colSpan={5}
                    >
                      <div className="flex items-center justify-center gap-1.5 text-emerald-700 mb-1">
                        <IoEyeOutline /> Right Eye (OD)
                      </div>
                      <span className="text-[9px] font-medium text-emerald-600/70 tracking-widest">
                        SPH | CYL | AXIS | ADD | PD
                      </span>
                    </th>
                    <th
                      className="px-2 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center align-middle border-l border-gray-100"
                      colSpan={5}
                    >
                      <div className="flex items-center justify-center gap-1.5 text-gray-600 mb-1">
                        <IoEyeOutline className="text-gray-400" /> Left Eye (OS)
                      </div>
                      <span className="text-[9px] font-medium text-gray-400 tracking-widest">
                        SPH | CYL | AXIS | ADD | PD
                      </span>
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider align-middle border-l border-gray-100 w-56">
                      Lens Details
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center align-middle">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right align-middle">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  <tr className="hover:bg-emerald-50/10 transition-colors group">
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-semibold border border-emerald-200 shadow-sm">
                          JD
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-emerald-700 transition-colors">
                              John Doe
                            </div>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-red-50 text-red-600 border border-red-100">
                              URGENT
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-400 font-medium mt-0.5 flex gap-2">
                            <span className="text-emerald-500 font-semibold">#ORD-2023-001</span>
                            <span>•</span>
                            <span>Oct 24, 2023</span>
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Dr. Sarah
                            Connor
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Frame Ref */}
                    <td className="px-4 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center text-xs shrink-0">
                          <IoGlassesOutline className="text-gray-400 text-lg" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-700">Ray-Ban 3025</div>
                          <div className="text-[10px] text-gray-400">Gold / Green</div>
                        </div>
                      </div>
                    </td>

                    {/* OD */}
                    <td className="px-1 py-4 text-sm text-center font-medium text-emerald-900 bg-emerald-50/10 border-l border-emerald-50">
                      -2.25
                    </td>
                    <td className="px-1 py-4 text-sm text-center font-normal text-gray-500 bg-emerald-50/10">
                      -0.50
                    </td>
                    <td className="px-1 py-4 text-sm text-center font-normal text-gray-500 bg-emerald-50/10">
                      180
                    </td>
                    <td className="px-1 py-4 text-sm text-center font-normal text-gray-400 bg-emerald-50/10">
                      +2.00
                    </td>
                    <td className="px-1 py-4 text-sm text-center font-normal text-gray-400 bg-emerald-50/10">
                      32.0
                    </td>

                    {/* OS */}
                    <td className="px-1 py-4 text-sm text-center font-medium text-gray-900 border-l border-gray-50">
                      -2.50
                    </td>
                    <td className="px-1 py-4 text-sm text-center font-normal text-gray-500">
                      -0.75
                    </td>
                    <td className="px-1 py-4 text-sm text-center font-normal text-gray-500">175</td>
                    <td className="px-1 py-4 text-sm text-center font-normal text-gray-400">
                      +2.00
                    </td>
                    <td className="px-1 py-4 text-sm text-center font-normal text-gray-400">
                      32.0
                    </td>

                    <td className="px-6 py-4 align-middle border-l border-gray-50">
                      <div className="space-y-2">
                        <div>
                          <div className="text-xs font-semibold text-gray-900">
                            Progressive Data
                          </div>
                          <div className="text-[10px] text-gray-500">
                            High Index 1.67 • Digital Surfacing
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-blue-50 text-blue-600 border border-blue-100">
                            Blue Cut
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-purple-50 text-purple-600 border border-purple-100">
                            AR Coat
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center align-middle">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-amber-50 text-amber-600 border border-amber-100">
                        In Production
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right align-middle">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 h-8 w-8 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-full"
                        onClick={() => setSelectedPrescriptionId('ORD-2023-001')}
                      >
                        <IoChevronForward size={18} />
                      </Button>
                    </td>
                  </tr>

                  <tr className="hover:bg-emerald-50/10 transition-colors group">
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-semibold border border-indigo-200 shadow-sm">
                          AS
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-emerald-700 transition-colors">
                              Alice Smith
                            </div>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                              STANDARD
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-400 font-medium mt-0.5 flex gap-2">
                            <span className="text-emerald-500 font-semibold">#ORD-2023-004</span>
                            <span>•</span>
                            <span>Oct 23, 2023</span>
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Dr. James
                            Bond
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Frame Ref */}
                    <td className="px-4 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center text-xs shrink-0">
                          <IoGlassesOutline className="text-gray-400 text-lg" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-700">Oakley 8050</div>
                          <div className="text-[10px] text-gray-400">Matte Black</div>
                        </div>
                      </div>
                    </td>

                    {/* OD */}
                    <td className="px-1 py-4 text-sm text-center font-medium text-emerald-900 bg-emerald-50/10 border-l border-emerald-50">
                      +1.00
                    </td>
                    <td className="px-1 py-4 text-sm text-center font-normal text-gray-500 bg-emerald-50/10">
                      0.00
                    </td>
                    <td className="px-1 py-4 text-sm text-center font-normal text-gray-500 bg-emerald-50/10">
                      0
                    </td>
                    <td className="px-1 py-4 text-sm text-center font-normal text-gray-300 bg-emerald-50/10">
                      -
                    </td>
                    <td className="px-1 py-4 text-sm text-center font-normal text-gray-400 bg-emerald-50/10">
                      30.5
                    </td>

                    {/* OS */}
                    <td className="px-1 py-4 text-sm text-center font-medium text-gray-900 border-l border-gray-50">
                      +1.25
                    </td>
                    <td className="px-1 py-4 text-sm text-center font-normal text-gray-500">
                      -0.25
                    </td>
                    <td className="px-1 py-4 text-sm text-center font-normal text-gray-500">90</td>
                    <td className="px-1 py-4 text-sm text-center font-normal text-gray-300">-</td>
                    <td className="px-1 py-4 text-sm text-center font-normal text-gray-400">
                      30.5
                    </td>

                    <td className="px-6 py-4 align-middle border-l border-gray-50">
                      <div className="space-y-2">
                        <div>
                          <div className="text-xs font-semibold text-gray-900">Single Vision</div>
                          <div className="text-[10px] text-gray-500">
                            Polycarbonate • Impact Resistant
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                            Hard Coat
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center align-middle">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-sky-50 text-sky-600 border border-sky-100">
                        Waiting Lens
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right align-middle">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 h-8 w-8 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-full"
                        onClick={() => setSelectedPrescriptionId('ORD-2023-004')}
                      >
                        <IoChevronForward size={18} />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
              <span>Showing 2 of 48 orders</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="px-2 border-neutral-200 text-gray-400"
                >
                  <IoChevronBackOutline />
                </Button>
                <Button
                  variant="solid"
                  size="sm"
                  className="min-w-[32px] px-2 font-medium bg-emerald-500 hover:bg-emerald-600 text-white border-transparent"
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-2 border-neutral-200 text-gray-400"
                >
                  <IoChevronForwardOutline />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Information Column (New) */}
        <div className="w-full xl:w-80 flex flex-col gap-6">
          {/* Operations Confirmation */}
          <Card className="p-5 border border-neutral-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                <IoConstructOutline className="text-emerald-500" /> Operations
              </h3>
              <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                3 New
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-800">Lab Confirmed Receipt</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Order #88229 accepted by Essilor Lab for surfacing.
                  </p>
                  <div className="mt-1.5">
                    <button className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                      Acknowledge
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 items-start border-t border-dashed border-gray-100 pt-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-800">Quality Check Passed</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Lens verification complete for #99201. Ready for mounting.
                  </p>
                </div>
              </div>
            </div>
            <Button variant="ghost" isFullWidth className="mt-4 text-xs h-8 text-gray-500">
              View All Confirmations
            </Button>
          </Card>

          {/* Recent Status Updates */}
          <Card className="p-5 border border-neutral-200 shadow-sm grow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                <IoTimeOutline className="text-emerald-500" /> Activity Feed
              </h3>
            </div>
            <div className="relative border-l border-gray-200 ml-2 space-y-6 pb-2">
              <div className="pl-4 relative">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></div>
                <p className="text-xs font-semibold text-gray-800">
                  Status Updated to 'In Production'
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">Order #2023-001 by You</p>
                <p className="text-[10px] text-gray-500 mt-1">10 mins ago</p>
              </div>
              <div className="pl-4 relative">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 border-2 border-white"></div>
                <p className="text-xs font-semibold text-gray-800">Order Created</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Order #2023-018 from Website</p>
                <p className="text-[10px] text-gray-500 mt-1">45 mins ago</p>
              </div>
              <div className="pl-4 relative">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-white shadow-sm"></div>
                <p className="text-xs font-semibold text-gray-800">Flagged for Review</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Order #2023-012 (Missing PD)</p>
                <p className="text-[10px] text-gray-500 mt-1">1h ago</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="mt-auto">
            <Button
              variant="solid"
              isFullWidth
              className="bg-gray-900 text-white hover:bg-gray-800 shadow-lg"
              leftIcon={<IoCheckmarkCircleOutline />}
            >
              Update Batch Status
            </Button>
          </div>
        </div>
      </div>
    </Container>
  )
}

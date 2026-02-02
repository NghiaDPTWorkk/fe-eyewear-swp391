/* eslint-disable max-lines */
import { useNavigate } from 'react-router-dom'
import {
  IoPrintOutline,
  IoPencilOutline,
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
  IoCheckmarkCircle,
  IoEyeOutline,
  IoCalendarOutline,
  IoDocumentTextOutline,
  IoCubeOutline,
  IoWalletOutline,
  IoPersonOutline,
  IoArrowBackOutline,
  IoAirplaneOutline,
  IoBusinessOutline,
  IoStorefrontOutline
} from 'react-icons/io5'
import { Card, Button } from '@/components'

interface OrderDetailProps {
  orderId: string
  onBack: () => void
  isPreOrder?: boolean
}

export default function SaleStaffOrderDetail({ orderId, onBack, isPreOrder }: OrderDetailProps) {
  const navigate = useNavigate()
  // Expanded Mock Data
  const order = {
    id: orderId,
    date: '24 Oct, 2023',
    status: 'In Production',
    subtotal: '$178.00',
    shipping: '$0.00',
    tax: '$14.24',
    total: '$192.24',
    paymentMethod: 'Credit Card ending in 4242',
    customer: {
      name: 'Leslie Alexander',
      ordersCount: 4,
      email: 'leslie.alex@example.com',
      phone: '+1 (555) 123-4567',
      avatar: 'LA',
      since: 'Member since 2021'
    },
    shippingAddress: {
      type: 'Home',
      address: '2972 Westheimer Rd. Santa Ana, Illinois 85486, United States'
    },
    billingAddress: 'Same as shipping address',
    items: [
      {
        id: 1,
        name: 'Ray-Ban Aviator Classic',
        sku: 'RB3025-001',
        brand: 'Ray-Ban',
        color: 'Gold / Green',
        price: '$163.00',
        image:
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2080&auto=format&fit=crop',
        specs: {
          eye: 58,
          bridge: 14,
          temple: 135,
          material: 'Metal'
        },
        prescription: {
          type: 'Single Vision (Polycarbonate)',
          coatings: ['Anti-Reflective', 'Blue Light Filter', 'Scratch Resistant'],
          od: { sph: '-2.25', cyl: '-0.50', axis: '180', add: '+2.00' },
          os: { sph: '-2.50', cyl: '-0.75', axis: '175', add: '+2.00' },
          pd: '63'
        }
      },
      {
        id: 2,
        name: 'Premium Cleaning Kit',
        sku: 'ACC-CLN-002',
        description: 'Includes: Spray, Cloth, Screwdriver',
        price: '$15.00',
        image:
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2080&auto=format&fit=crop'
      }
    ],
    timeline: [
      {
        title: 'Quality Check Passed',
        time: 'Today, 10:30 AM',
        desc: 'Passed final inspection by Lab Team A',
        icon: IoCheckmarkCircle,
        active: true
      },
      {
        title: 'In Production',
        time: 'Oct 25, 09:15 AM',
        desc: 'Lens cutting and mounting started',
        icon: IoCubeOutline,
        active: true
      },
      {
        title: 'Prescription Verified',
        time: 'Oct 24, 02:20 PM',
        desc: 'Optometrist validated Rx values',
        icon: IoEyeOutline,
        active: true
      },
      {
        title: 'Order Placed',
        time: 'Oct 24, 09:15 AM',
        desc: 'Order received via Online Store',
        icon: IoDocumentTextOutline,
        active: true
      }
    ],
    transactions: [
      {
        id: 'TRX-9981',
        date: 'Oct 24, 2023',
        method: 'Visa •••• 4242',
        amount: '$192.24',
        status: 'Success'
      }
    ]
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-right-4 duration-300 font-sans">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 group cursor-pointer shadow-sm hover:shadow"
          >
            <IoArrowBackOutline
              size={22}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
          </button>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">
                Order #{order.id}
              </h1>
              <span className="px-5 py-2 bg-[#dcfce7] text-[#15803d] text-[10px] font-semibold uppercase tracking-widest rounded-full border border-[#bbf7d0] cursor-pointer">
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-5 mt-1.5">
              <div className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
                <IoCalendarOutline className="text-slate-400" size={18} />
                {order.date}
              </div>
              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
              <div className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
                <IoCubeOutline className="text-slate-400" size={18} />
                {order.items.length} Items
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900 font-semibold rounded-2xl px-6 h-12 transition-all border-2"
            leftIcon={<IoPrintOutline size={20} />}
          >
            Invoice
          </Button>
          <Button
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl px-6 h-12 transition-all active:scale-95 border-none"
            leftIcon={<IoPencilOutline size={20} />}
          >
            Update Status
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Content Column */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Order Items Card */}
          <Card className="overflow-hidden border border-neutral-100 shadow-sm rounded-2xl">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Order Items</h2>
              <span className="text-sm text-emerald-600 font-medium cursor-pointer hover:underline">
                Download Specs
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 transition-colors hover:bg-gray-50/30">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 bg-white rounded-xl overflow-hidden shrink-0 border border-neutral-100 p-2 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-xs font-semibold text-emerald-600 mb-1">
                            {item.brand}
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <div className="flex gap-4 mt-1">
                            <span className="text-sm text-gray-500">
                              Color: <span className="text-gray-900">{item.color}</span>
                            </span>
                            <span className="text-sm text-gray-500">
                              SKU: <span className="text-gray-900">{item.sku}</span>
                            </span>
                          </div>
                        </div>
                        <span className="text-lg font-medium text-gray-900">{item.price}</span>
                      </div>

                      {/* Technical Specs & Rx */}
                      {item.specs && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                              Frame Measurements
                            </h4>
                            <div className="flex justify-between text-sm">
                              <div className="text-center">
                                <span className="block font-medium text-gray-700">
                                  {item.specs.eye}
                                </span>
                                <span className="text-[10px] text-gray-400">Eye</span>
                              </div>
                              <div className="w-px bg-gray-200 mx-2" />
                              <div className="text-center">
                                <span className="block font-medium text-gray-700">
                                  {item.specs.bridge}
                                </span>
                                <span className="text-[10px] text-gray-400">Bridge</span>
                              </div>
                              <div className="w-px bg-gray-200 mx-2" />
                              <div className="text-center">
                                <span className="block font-medium text-gray-700">
                                  {item.specs.temple}
                                </span>
                                <span className="text-[10px] text-gray-400">Temple</span>
                              </div>
                            </div>
                          </div>

                          {item.prescription && (
                            <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-lg p-3">
                              <h4 className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <IoEyeOutline /> Prescription Lens
                              </h4>
                              <p
                                className="text-sm text-gray-700 line-clamp-1"
                                title={item.prescription.type}
                              >
                                {item.prescription.type}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {item.prescription.coatings.map((c) => (
                                  <span
                                    key={c}
                                    className="text-[10px] px-1.5 py-0.5 bg-white text-emerald-700 border border-emerald-100 rounded shadow-sm"
                                  >
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Summary */}
            <div className="bg-gray-50/50 p-6 border-t border-gray-100 flex flex-col md:flex-row gap-8 justify-end">
              <div className="flex-1 max-w-sm ml-auto space-y-2">
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900 font-medium">{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-900 font-medium">{order.shipping}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-900 font-medium">{order.tax}</span>
                </div>
                <div className="border-t border-gray-200 my-2 pt-3 flex justify-between items-center">
                  <span className="text-gray-900 font-medium text-base">Total Due</span>
                  <span className="text-emerald-600 font-bold text-xl">{order.total}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Supply Chain & Logistics Section (Only for Pre-orders) */}
          {isPreOrder ? (
            <Card className="p-8 border border-neutral-100 shadow-sm rounded-2xl overflow-hidden relative">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                    <IoAirplaneOutline className="text-emerald-500" />
                    Shipment Journey
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Tracking ID: <span className="font-mono text-gray-900">#TRK-8892-IT</span> (DHL
                    Express)
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<IoLocationOutline />}
                  onClick={() => navigate('/salestaff/live-map/TRK-8892-IT')}
                >
                  Live Map
                </Button>
              </div>

              {/* Visual Stepper */}
              <div className="relative flex justify-between mb-12 px-4">
                {/* Progress Bar Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 -translate-y-1/2 rounded-full"></div>
                {/* Active Progress */}
                <div className="absolute top-1/2 left-0 w-[60%] h-1 bg-emerald-400 -z-10 -translate-y-1/2 rounded-full"></div>

                {/* Steps */}
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center border-4 border-white shadow-sm">
                    <IoBusinessOutline />
                  </div>
                  <span className="text-xs font-semibold text-emerald-600">Supplier (Italy)</span>
                </div>
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center border-4 border-white shadow-sm">
                    <IoAirplaneOutline />
                  </div>
                  <span className="text-xs font-semibold text-emerald-600">In Transit</span>
                </div>
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center border-4 border-white shadow-sm">
                    <IoCheckmarkCircle />
                  </div>
                  <span className="text-xs font-semibold text-emerald-600">Customs</span>
                </div>
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-emerald-500 text-emerald-500 flex items-center justify-center border-4 border-white shadow-sm">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-800">Dist. Center</span>
                </div>
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center border-4 border-white">
                    <IoStorefrontOutline />
                  </div>
                  <span className="text-xs font-medium text-gray-400">Store</span>
                </div>
              </div>

              {/* Detailed Logs */}
              <div className="bg-gray-50/50 rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                    <tr>
                      <th className="px-6 py-3 text-left">Date & Time</th>
                      <th className="px-6 py-3 text-left">Location</th>
                      <th className="px-6 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-6 py-4 text-gray-900 font-medium">Oct 25, 08:30 AM</td>
                      <td className="px-6 py-4 text-gray-600">Ho Chi Minh City, VN</td>
                      <td className="px-6 py-4">
                        <span className="text-emerald-600 flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Arrived at
                          Distribution Center
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-gray-500">Oct 24, 10:15 PM</td>
                      <td className="px-6 py-4 text-gray-500">Tan Son Nhat Int. Airport</td>
                      <td className="px-6 py-4 text-gray-500">Customs Clearance Completed</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-gray-500">Oct 23, 04:20 PM</td>
                      <td className="px-6 py-4 text-gray-500">Milan Malpensa, IT</td>
                      <td className="px-6 py-4 text-gray-500">Departed from Origin</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-gray-500">Oct 22, 09:00 AM</td>
                      <td className="px-6 py-4 text-gray-500">Luxottica Factory, IT</td>
                      <td className="px-6 py-4 text-gray-500">Order Picked Up by Carrier</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            /* Regular Activity Timeline */
            <Card className="p-8 border border-neutral-100 shadow-sm rounded-2xl">
              <h2 className="text-lg font-medium text-gray-800 mb-6">Order Activity</h2>
              <div className="relative border-l border-emerald-100 ml-3.5 space-y-8">
                {order.timeline.map((act, i) => (
                  <div key={i} className="relative pl-8">
                    <div className="absolute -left-[9px] top-0 w-[18px] h-[18px] bg-white rounded-full border-2 border-emerald-400 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    </div>
                    <div className="group">
                      <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-1 block">
                        {act.time}
                      </span>
                      <h4 className="text-base font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">
                        {act.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{act.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Transaction History Section (New) */}
          <Card className="overflow-hidden border border-neutral-100 shadow-sm rounded-2xl">
            <div className="p-6 border-b border-gray-50">
              <h2 className="text-lg font-medium text-gray-800">Transactions</h2>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Transaction ID</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Method</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {order.transactions.map((trx) => (
                  <tr key={trx.id}>
                    <td className="px-6 py-4 font-medium text-gray-900">{trx.id}</td>
                    <td className="px-6 py-4 text-gray-500">{trx.date}</td>
                    <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                      <IoWalletOutline /> {trx.method}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{trx.amount}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Sidebar Info Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Customer Card */}
          <Card className="p-6 border border-neutral-100 shadow-sm rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <IoPersonOutline size={100} />
            </div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6 relative z-10">
              Customer
            </h2>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-semibold text-xl shadow-inner border-2 border-white">
                  {order.customer.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{order.customer.name}</h3>
                  <p className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                    {order.customer.since}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3.5 text-sm group cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center shrink-0 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                    <IoMailOutline size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 font-medium">Email Address</p>
                    <p className="text-gray-700 font-medium truncate">{order.customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 text-sm group cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center shrink-0 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                    <IoCallOutline size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 font-medium">Phone Number</p>
                    <p className="text-gray-700 font-medium">{order.customer.phone}</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 py-2.5 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
                View Full Profile
              </button>
            </div>
          </Card>

          {/* Delivery & Billing */}
          <Card className="p-6 border border-neutral-100 shadow-sm rounded-2xl">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
              Delivery Details
            </h2>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <IoLocationOutline className="text-emerald-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {order.shippingAddress.type} Address
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed pl-6">
                  {order.shippingAddress.address}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Billing Address
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  <IoCheckmarkCircle className="text-emerald-500 text-lg" />
                  <span className="text-gray-600 font-medium">{order.billingAddress}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-6 border border-neutral-100 shadow-sm rounded-2xl bg-amber-50/30 border-amber-100/50">
            <h2 className="text-sm font-semibold text-amber-700/70 uppercase tracking-wider mb-3">
              Order Notes
            </h2>
            <textarea
              className="w-full min-h-[100px] p-3 rounded-xl border border-amber-200/50 bg-white/50 focus:outline-none focus:ring-2 focus:ring-amber-200/50 text-sm resize-none text-gray-600 placeholder:text-gray-400"
              placeholder="Add a note about this order..."
            ></textarea>
            <div className="flex justify-end mt-2">
              <button className="text-xs font-semibold text-amber-600 hover:text-amber-700">
                Save Note
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

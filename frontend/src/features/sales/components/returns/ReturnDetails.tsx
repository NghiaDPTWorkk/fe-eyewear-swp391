 
import {
  IoPersonOutline,
  IoLocationOutline,
  IoCubeOutline,
  IoDocumentTextOutline,
  IoCheckmarkCircle,
  IoAlertCircleOutline,
  IoCloseCircleOutline
} from 'react-icons/io5'
import { FaTruck } from 'react-icons/fa'
import { Card, Button } from '@/components'
import { ArrowLeft } from 'lucide-react'

interface ReturnDetailsProps {
  returnId: string
  onBack: () => void
}

export default function ReturnDetails({ returnId, onBack }: ReturnDetailsProps) {
  const data = {
    id: returnId || 'RT-2024-5001',
    date: '2026-01-14 14:30 PM',
    status: 'Processing',
    customer: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567'
    },
    originalOrder: {
      id: 'ORD-2024-1234',
      date: '2026-01-10',
      total: '$450.00'
    },
    address: '123 Main Street, Apt 4B, New York, NY 10001',
    item: {
      name: 'Blue Light Blocking Glasses',
      sku: 'BLG-001',
      price: '$450.00',
      quantity: 1,
      image:
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2080&auto=format&fit=crop'
    },
    reason: {
      category: 'Defective Product',
      description:
        'The left lens has a visible scratch and the frame is slightly bent. Product arrived damaged.',
      photos: [
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2080&auto=format&fit=crop'
      ]
    },
    shipping: {
      carrier: 'UPS',
      tracking: '1Z999AA10987654321',
      status: 'Delivered to Warehouse',
      returnDate: '2026-01-14'
    },
    goodsReceived: {
      status: 'Goods have been received at warehouse',
      date: '2026-01-14 10:00 AM',
      by: 'Operations Staff'
    },
    inspection: {
      inspector: 'Lab Technician - Alex Johnson',
      date: '2026-01-14 11:30 AM',
      type: 'Manufacturing Defect',
      finding:
        'Confirmed: Product has manufacturing defect. Left lens has internal scratch (not customer damage). Frame shows factory assembly issue. Recommend full refund approval.',
      photos: [
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2080&auto=format&fit=crop'
      ]
    },
    refund: {
      productPrice: '$450.00',
      shippingRefund: '$15.00',
      restockingFee: '-$0.00',
      total: '$465.00',
      method: 'Original Payment Method'
    },
    timeline: [
      { id: 1, title: 'Lab Inspection Completed', date: 'Jan 14, 2026 11:30 AM', active: true },
      { id: 2, title: 'Goods Received', date: 'Jan 14, 2026 10:00 AM', active: true },
      { id: 3, title: 'Return Shipped', date: 'Jan 14, 2026 8:00 AM', active: true },
      { id: 4, title: 'Return Requested', date: 'Jan 14, 2026 2:30 PM', active: false }
    ]
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center bg-white hover:bg-mint-50 rounded-xl shadow-sm transition-all duration-300 border border-neutral-100 hover:border-mint-200 hover:shadow-md hover:-translate-x-0.5 active:scale-90 group"
          >
            <ArrowLeft
              size={20}
              className="text-neutral-500 group-hover:text-mint-600 transition-colors stroke-[2.5px]"
            />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Return Detail</h1>
            <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
              <span>{data.id}</span>
              <span>•</span>
              <span>{data.date}</span>
            </div>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-mint-50 text-mint-600 font-semibold rounded-full text-xs uppercase tracking-wider border border-mint-100 shadow-sm shadow-mint-50">
          {data.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <IoPersonOutline className="text-lg text-neutral-400" />
              <h2 className="font-semibold text-lg text-neutral-900">
                Customer & Order Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Customer Name
                  </label>
                  <div className="font-medium text-neutral-900 mt-1">{data.customer.name}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Email
                  </label>
                  <div className="font-medium text-neutral-900 mt-1">{data.customer.email}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Phone
                  </label>
                  <div className="font-medium text-neutral-900 mt-1">{data.customer.phone}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Original Order ID
                  </label>
                  <div className="font-medium text-mint-600 mt-1 cursor-pointer hover:underline">
                    {data.originalOrder.id}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Order Date
                  </label>
                  <div className="font-medium text-neutral-900 mt-1">{data.originalOrder.date}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Total Paid
                  </label>
                  <div className="font-medium text-neutral-900 mt-1">
                    {data.originalOrder.total}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <IoLocationOutline className="text-lg text-neutral-400" />
              <h2 className="font-semibold text-lg text-neutral-900">Original Shipping Address</h2>
            </div>
            <p className="text-neutral-600 font-medium">{data.address}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <IoCubeOutline className="text-lg text-neutral-400" />
              <h2 className="font-semibold text-lg text-neutral-900">Return Item</h2>
            </div>

            <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
              <img
                src={data.item.image}
                alt={data.item.name}
                className="w-20 h-20 object-cover rounded-lg border border-neutral-200 bg-white"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 text-lg">{data.item.name}</h3>
                <div className="text-neutral-500 text-sm mt-1">SKU: {data.item.sku}</div>
                <div className="text-neutral-500 text-sm">Quantity: {data.item.quantity}</div>
              </div>
              <div className="font-semibold text-neutral-900 text-lg">{data.item.price}</div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-lg text-neutral-900 mb-6">Return Reason</h2>

            <div className="space-y-6">
              <div>
                <span className="text-sm font-medium text-neutral-500 mr-2">Reason Category</span>
                <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-semibold">
                  {data.reason.category}
                </span>
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700 block mb-2">
                  Customer Description
                </label>
                <div className="bg-neutral-50 p-4 rounded-xl text-neutral-700 text-sm leading-relaxed">
                  {data.reason.description}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700 block mb-2">
                  Customer Photos
                </label>
                <div className="flex gap-4">
                  {data.reason.photos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt="Customer evidence"
                      className="w-24 h-24 object-cover rounded-xl border border-neutral-200 hover:border-mint-400 transition-colors cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaTruck className="text-lg text-neutral-400" />
              <h2 className="font-semibold text-lg text-neutral-900">
                Return Shipping Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Carrier
                  </label>
                  <div className="font-medium text-neutral-900 mt-1">{data.shipping.carrier}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Status
                  </label>
                  <div className="mt-1">
                    <span className="px-3 py-1 bg-mint-50 text-mint-700 rounded-full text-xs font-semibold font-medium">
                      {data.shipping.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Tracking Number
                  </label>
                  <div className="font-medium text-neutral-900 mt-1 font-mono">
                    {data.shipping.tracking}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Return Date
                  </label>
                  <div className="font-medium text-neutral-900 mt-1">
                    {data.shipping.returnDate}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-mint-200 bg-mint-50/20">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-mint-500 rounded-full text-white shrink-0">
                <IoCheckmarkCircle className="text-xl" />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-mint-900">Goods Received Confirmation</h2>
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-medium text-mint-800">
                    <span className="font-semibold">Status:</span> {data.goodsReceived.status}
                  </p>
                  <p className="text-sm font-medium text-mint-800">
                    <span className="font-semibold">Received Date:</span> {data.goodsReceived.date}
                  </p>
                  <p className="text-sm font-medium text-mint-800">
                    <span className="font-semibold">Received By:</span> {data.goodsReceived.by}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 border-mint-500 shadow-[0_0_0_4px_rgba(74,215,176,0.1)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <IoDocumentTextOutline className="text-xl text-mint-600" />
                <h2 className="font-semibold text-lg text-neutral-900">Lab Inspection Report</h2>
              </div>
              <span className="px-3 py-1 bg-mint-100 text-mint-700 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                Read-Only
              </span>
            </div>

            <div className="bg-neutral-50/50 rounded-xl p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Inspector
                  </label>
                  <div className="font-medium text-neutral-900 mt-1">
                    {data.inspection.inspector}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Inspection Date
                  </label>
                  <div className="font-medium text-neutral-900 mt-1">{data.inspection.date}</div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide block mb-2">
                  Defect Type
                </label>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-semibold">
                  {data.inspection.type}
                </span>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide block mb-2">
                  Lab Finding
                </label>
                <div className="border border-neutral-200 bg-white p-4 rounded-xl text-sm text-neutral-700 leading-relaxed shadow-sm">
                  {data.inspection.finding}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide block mb-2">
                  Lab Inspection Photos
                </label>
                <div className="flex gap-4">
                  {data.inspection.photos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt="Lab evidence"
                      className="w-24 h-24 object-cover rounded-xl border border-neutral-200 hover:border-mint-400 transition-colors cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-semibold text-lg text-neutral-900 mb-6">Refund Calculation</h2>

            <div className="space-y-3 pb-6 border-b border-neutral-100">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 font-medium">Product Price</span>
                <span className="text-neutral-900 font-semibold">{data.refund.productPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 font-medium">Shipping Refund</span>
                <span className="text-neutral-900 font-semibold">{data.refund.shippingRefund}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 font-medium">Restocking Fee</span>
                <span className="text-neutral-900 font-semibold">{data.refund.restockingFee}</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-4">
              <span className="font-semibold text-neutral-900">Total Refund</span>
              <span className="font-semibold text-2xl text-mint-600">{data.refund.total}</span>
            </div>

            <div className="pt-4 border-t border-neutral-100">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide block mb-1">
                Refund Method
              </label>
              <div className="font-medium text-neutral-900">{data.refund.method}</div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-lg text-neutral-900 mb-6">Refund Decision</h2>
            <div className="space-y-3">
              <Button
                isFullWidth
                className="bg-mint-600 hover:bg-mint-700 text-white font-semibold h-12 rounded-xl shadow-lg shadow-mint-100 transition-all hover:-translate-y-0.5"
                leftIcon={<IoCheckmarkCircle size={20} />}
              >
                Approve Refund
              </Button>
              <Button
                isFullWidth
                className="bg-red-600 hover:bg-red-700 text-white font-semibold h-12 rounded-xl shadow-lg shadow-red-100 transition-all hover:-translate-y-0.5"
                leftIcon={<IoCloseCircleOutline size={20} />}
              >
                Reject Refund
              </Button>
            </div>
          </Card>

          <Card className="p-5 bg-amber-50 border-amber-100">
            <div className="flex items-center gap-2 mb-3 text-amber-800">
              <IoAlertCircleOutline className="text-xl" />
              <h3 className="font-semibold uppercase tracking-wider text-xs">
                Decision Guidelines
              </h3>
            </div>
            <ul className="text-xs space-y-2 text-amber-800/80 list-disc pl-4 font-medium">
              <li>Review lab inspection report carefully</li>
              <li>Manufacturing defects = Full refund</li>
              <li>Customer damage = Reject or partial refund</li>
              <li>Document decision reason for records</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-lg text-neutral-900 mb-6">Activity Timeline</h2>
            <div className="relative border-l-2 border-neutral-100 ml-3 space-y-8 py-2">
              {data.timeline.map((item) => (
                <div key={item.id} className="relative pl-6 group">
                  <div
                    className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-white transition-all group-hover:scale-125"
                    style={{
                      backgroundColor:
                        item.title.includes('Lab') || item.title.includes('Goods')
                          ? '#4ad7b0'
                          : item.title.includes('Shipped')
                            ? '#3b82f6'
                            : '#f59e0b',
                      borderColor: 'white'
                    }}
                  />
                  <div className="text-sm font-semibold text-neutral-900">{item.title}</div>
                  <div className="text-xs text-neutral-400 mt-0.5 font-medium">{item.date}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

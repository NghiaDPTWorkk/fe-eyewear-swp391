import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useSalesStaffOrderDetail } from '@/features/sales/hooks'
import OrderDetail from '@/features/staff/components/order-detail/OrderDetail'
import {
  MapBackground,
  ShipmentStatusCard,
  CourierInfoCard
} from '@/features/sales/components/live-map/LiveMapIndex'

export default function SaleStaffPreOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { data: order } = useSalesStaffOrderDetail(orderId as string)

  // Tracking progress state
  const [progress, setProgress] = useState(62)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 65 : prev + 0.5))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleBack = () => {
    const fromPath = searchParams.get('from')
    const invoiceId = searchParams.get('invoiceId') || order?.invoiceId

    if (fromPath && invoiceId) {
      navigate(`${fromPath}?invoiceId=${invoiceId}`)
    } else if (fromPath) {
      navigate(fromPath)
    } else if (invoiceId) {
      navigate(`/sale-staff/dashboard?invoiceId=${invoiceId}`)
    } else {
      navigate(-1)
    }
  }

  if (!orderId) return null

  return (
    <div className="space-y-10 pb-12">
      {/* Breadcrumb — consistent with other pages */}
      <nav className="flex items-center gap-1 text-sm font-medium mb-4 ml-1">
        <Link
          to="/sale-staff/dashboard"
          className="text-neutral-400 hover:text-neutral-600 transition-colors font-normal"
        >
          Dashboard
        </Link>
        <span className="text-neutral-300 mx-1">/</span>
        <Link
          to="/sale-staff/orders"
          className="text-neutral-400 hover:text-neutral-600 transition-colors font-normal"
        >
          Orders
        </Link>
        <span className="text-neutral-300 mx-1">/</span>
        <span className="text-mint-700 font-bold tracking-tight">Pre-order Details</span>
      </nav>

      {/* Main content - Order details */}
      <div className="relative z-20">
        <OrderDetail orderId={orderId} onBack={handleBack} isPreOrder={true}>
          {/* Live Map Tracking Section */}
          <div
            onClick={() =>
              window.open(
                'https://www.google.com/maps/dir/Milan,+Italy/Ho+Chi+Minh+City,+Vietnam',
                '_blank'
              )
            }
            className="relative w-full rounded-[32px] overflow-hidden bg-mint-50/50 min-h-[350px] flex flex-col shadow-xl shadow-mint-500/5 border border-mint-100 flex-shrink-0 cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:shadow-mint-500/10 hover:border-mint-300"
          >
            <MapBackground />

            {/* Title for Map Section */}
            <div className="relative z-10 px-8 py-6 pointer-events-none flex justify-between items-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-white">
                <div className="w-2 h-2 rounded-full bg-mint-500 animate-pulse"></div>
                <span className="text-sm font-bold text-gray-800 tracking-tight uppercase">
                  Live Pre-order Tracking
                </span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-mint-50 backdrop-blur-md rounded-2xl shadow-sm border border-mint-100 text-mint-600 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                Click to view real route
              </div>
            </div>

            {/* Cards container at the bottom */}
            <div className="relative z-10 p-6 mt-auto pointer-events-none">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 pointer-events-auto">
                <div className="lg:col-span-2 h-full flex flex-col">
                  <ShipmentStatusCard progress={progress} />
                </div>
                <div className="lg:col-span-1 h-full flex flex-col justify-end">
                  <CourierInfoCard />
                </div>
              </div>
            </div>
          </div>
        </OrderDetail>
      </div>
    </div>
  )
}

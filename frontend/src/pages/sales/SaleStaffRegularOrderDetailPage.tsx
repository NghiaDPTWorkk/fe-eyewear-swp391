import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'

import { useSalesStaffOrderDetail } from '@/features/sales/hooks'
import OrderDetail from '@/features/staff/components/OrderDetail/OrderDetail'

export default function SaleStaffRegularOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { data: order } = useSalesStaffOrderDetail(orderId as string)

  const handleBack = () => {
    const fromPath = searchParams.get('from')
    const invoiceId = searchParams.get('invoiceId') || order?.invoiceId

    if (fromPath && invoiceId) {
      navigate(`${fromPath}?invoiceId=${invoiceId}`)
    } else if (fromPath) {
      navigate(fromPath)
    } else if (invoiceId) {
      navigate(`/salestaff/dashboard?invoiceId=${invoiceId}`)
    } else {
      navigate(-1)
    }
  }

  if (!orderId) return null

  return (
    <div className="space-y-12 pb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm font-medium mb-6 ml-1">
        <Link
          to="/salestaff/dashboard"
          className="text-neutral-400 hover:text-neutral-600 transition-colors font-normal"
        >
          Dashboard
        </Link>
        <span className="text-neutral-300 mx-1">/</span>
        <Link
          to="/salestaff/orders"
          className="text-neutral-400 hover:text-neutral-600 transition-colors font-normal"
        >
          Orders
        </Link>
        <span className="text-neutral-300 mx-1">/</span>
        <span className="text-mint-500 font-semibold tracking-wider">Order Details</span>
      </nav>

      {/* Main content */}
      <OrderDetail orderId={orderId} onBack={handleBack} />
    </div>
  )
}

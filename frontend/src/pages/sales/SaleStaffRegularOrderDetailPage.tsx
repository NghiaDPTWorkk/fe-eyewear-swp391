import { useParams, useNavigate, useSearchParams } from 'react-router-dom'

import { PageHeader } from '@/features/sales/components/common'
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
    <div className="space-y-6">
      <PageHeader
        title="Order Details"
        breadcrumbs={[
          { label: 'Dashboard', path: '/salestaff/dashboard' },
          { label: 'Orders', path: '/salestaff/orders' },
          { label: 'Order Details' }
        ]}
      />
      <OrderDetail orderId={orderId} onBack={handleBack} />
    </div>
  )
}

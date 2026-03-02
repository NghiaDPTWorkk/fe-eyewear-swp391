import OrderDetail from '@/features/staff/components/OrderDetail/OrderDetail'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/features/sales/components/common'

export default function SaleStaffPreOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  if (!orderId) return null

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pre-order Details"
        breadcrumbs={[
          { label: 'Dashboard', path: '/salestaff/dashboard' },
          { label: 'Orders', path: '/salestaff/orders' },
          { label: 'Pre-order Details' }
        ]}
      />
      <OrderDetail orderId={orderId} onBack={() => navigate(-1)} isPreOrder={true} />
    </div>
  )
}

import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@/components'
import OrderDetail from '@/features/staff/components/OrderDetail/OrderDetail'
import { PageHeader } from '@/features/sales/components/common'

export default function SaleStaffRegularOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  if (!orderId) return null

  return (
    <Container className="pt-2 pb-8 px-2 max-w-none">
      <PageHeader
        title="Order Details"
        breadcrumbs={[
          { label: 'Dashboard', path: '/salestaff/dashboard' },
          { label: 'Orders', path: '/salestaff/orders' },
          { label: 'Order Details' }
        ]}
      />
      <OrderDetail orderId={orderId} onBack={() => navigate(-1)} />
    </Container>
  )
}

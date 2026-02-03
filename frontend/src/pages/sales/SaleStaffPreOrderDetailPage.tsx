import { Container } from '@/components'
import OrderDetail from '@/features/staff/components/OrderDetail/OrderDetail'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/features/sales/components/common'

export default function SaleStaffPreOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  if (!orderId) return null

  return (
    <Container className="pt-2 pb-8 px-2 max-w-none">
      <PageHeader
        title="Pre-order Details"
        breadcrumbs={[
          { label: 'Dashboard', path: '/salestaff/dashboard' },
          { label: 'Orders', path: '/salestaff/orders' },
          { label: 'Pre-order Details' }
        ]}
      />
      <OrderDetail orderId={orderId} onBack={() => navigate(-1)} isPreOrder={true} />
    </Container>
  )
}

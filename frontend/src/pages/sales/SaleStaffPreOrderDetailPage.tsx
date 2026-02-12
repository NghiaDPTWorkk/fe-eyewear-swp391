import { Container } from '@/components'
import OrderDetail from '@/features/staff/components/OrderDetail/OrderDetail'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/features/sales/components/common'

export default function SaleStaffPreOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  if (!orderId) return null

  return (
    <Container maxWidth="none" className="pt-6 pb-8 px-6 md:px-8">
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

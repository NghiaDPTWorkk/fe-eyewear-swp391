import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@/components'
import { OrdersDetail } from '@/features/sales/components/orders'

export default function SaleStaffRegularOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  if (!orderId) return null

  return (
    <Container>
      <OrdersDetail orderId={orderId} onBack={() => navigate(-1)} />
    </Container>
  )
}

import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@/components'
import { OrderDetail } from '@/features/sales/components/orders'

export default function RegularOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  if (!orderId) return null

  return (
    <Container>
      <OrderDetail orderId={orderId} onBack={() => navigate(-1)} />
    </Container>
  )
}

import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@/components'
import OrderDetail from '@/features/staff/components/OrderDetail/OrderDetail'

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

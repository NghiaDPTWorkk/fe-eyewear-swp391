import { Container } from '@/components'
import OrderDetail from '@/features/staff/components/OrderDetail/OrderDetail'
import { useNavigate, useParams } from 'react-router-dom'

export default function PreOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  if (!orderId) return null

  return (
    <Container>
      <OrderDetail orderId={orderId} onBack={() => navigate(-1)} isPreOrder={true} />
    </Container>
  )
}

import { Container } from '@/components'
import { OrdersDetail } from '@/features/sales/components/orders'
import { useNavigate, useParams } from 'react-router-dom'

export default function SaleStaffPreOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  if (!orderId) return null

  return (
    <Container>
      <OrdersDetail orderId={orderId} onBack={() => navigate(-1)} isPreOrder={true} />
    </Container>
  )
}

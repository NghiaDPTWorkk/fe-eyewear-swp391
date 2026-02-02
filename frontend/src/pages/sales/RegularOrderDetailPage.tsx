import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@/components'
import SaleStaffOrderDetail from '@/features/sales/components/SaleStaffOrderDetail/SaleStaffOrderDetail'

export default function RegularOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  if (!orderId) return null

  return (
    <Container>
      <SaleStaffOrderDetail orderId={orderId} onBack={() => navigate(-1)} />
    </Container>
  )
}

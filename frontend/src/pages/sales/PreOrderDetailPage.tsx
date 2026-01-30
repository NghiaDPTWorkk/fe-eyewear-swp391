import { Container } from '@/components'
import SaleStaffOrderDetail from '@/features/sales/components/SaleStaffOrderDetail/SaleStaffOrderDetail'
import { useNavigate, useParams } from 'react-router-dom'

export default function PreOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  if (!orderId) return null

  return (
    <Container>
      <SaleStaffOrderDetail orderId={orderId} onBack={() => navigate(-1)} isPreOrder={true} />
    </Container>
  )
}

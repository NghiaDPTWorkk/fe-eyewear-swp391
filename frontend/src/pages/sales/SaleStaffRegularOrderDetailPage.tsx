import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@/components'
import PrescriptionVerification from '@/features/sales/components/prescriptions/PrescriptionVerification'

export default function SaleStaffRegularOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  if (!orderId) return null

  return (
    <Container>
      <PrescriptionVerification orderId={orderId} onBack={() => navigate(-1)} />
    </Container>
  )
}

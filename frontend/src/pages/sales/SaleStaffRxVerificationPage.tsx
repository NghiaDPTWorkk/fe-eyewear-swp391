import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@/shared/components/ui/container'
import PrescriptionVerification from '@/features/staff/components/PrescriptionVerification/PrescriptionVerification'

export default function SaleStaffRxVerificationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <Container className="py-8">
      <PrescriptionVerification orderId={orderId || ''} onBack={handleBack} />
    </Container>
  )
}

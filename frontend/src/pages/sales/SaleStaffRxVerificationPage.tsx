import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@/shared/components/ui/container'
import SaleStaffPrescriptionVerification from '@/features/sales/components/SaleStaffPrescriptionVerification/SaleStaffPrescriptionVerification'

export default function SaleStaffRxVerificationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <Container className="py-8">
      <SaleStaffPrescriptionVerification orderId={orderId || ''} onBack={handleBack} />
    </Container>
  )
}

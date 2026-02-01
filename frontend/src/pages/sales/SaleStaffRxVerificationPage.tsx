import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Container } from '@/shared/components/ui/container'
import SaleStaffPrescriptionVerification from '@/features/sales/components/SaleStaffPrescriptionVerification/SaleStaffPrescriptionVerification'

export default function SaleStaffRxVerificationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  // Get isApproved from location state (passed from OrderPage/Drawer)
  const isApproved = location.state?.isApproved || false

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <Container className="py-8">
      <SaleStaffPrescriptionVerification
        orderId={orderId || ''}
        onBack={handleBack}
        isApproved={isApproved}
      />
    </Container>
  )
}

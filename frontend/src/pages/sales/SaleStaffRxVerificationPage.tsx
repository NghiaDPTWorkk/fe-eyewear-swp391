import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Card } from '@/components'
import SaleStaffPrescriptionVerification from '@/features/sales/components/SaleStaffPrescriptionVerification/SaleStaffPrescriptionVerification'
import { IoChevronBackOutline } from 'react-icons/io5'

export default function SaleStaffRxVerificationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  return (
    <Container className="py-8">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-all"
        >
          <IoChevronBackOutline size={24} className="text-gray-600" />
        </button>
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
            <Link to="/salestaff/orders" className="hover:text-primary-500">
              Orders
            </Link>
            <span>/</span>
            <span className="text-gray-900">Verification</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Prescription Verification</h1>
        </div>
      </div>
      <Card className="p-0 border-none shadow-xl overflow-hidden rounded-3xl">
        <SaleStaffPrescriptionVerification orderId={orderId || ''} onBack={() => navigate(-1)} />
      </Card>
    </Container>
  )
}

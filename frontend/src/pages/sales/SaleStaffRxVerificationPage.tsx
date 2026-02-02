import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container } from '@/components'
import PrescriptionVerification from '@/features/sales/components/prescriptions/PrescriptionVerification'
import { IoChevronBackOutline } from 'react-icons/io5'

export default function SaleStaffRxVerificationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  const handleActionSuccess = () => {
    // Trigger refresh for parent components
    window.dispatchEvent(new CustomEvent('orderUpdated'))
  }

  return (
    <Container className="py-6">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 hover:bg-mint-50 rounded-xl transition-all text-gray-500 hover:text-mint-600 border border-gray-200 hover:border-mint-200"
        >
          <IoChevronBackOutline size={20} />
        </button>
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">
            <Link to="/salestaff/orders" className="hover:text-mint-600 transition-colors">
              Orders
            </Link>
            <span>/</span>
            <span className="text-gray-600">Verification</span>
          </div>
          <h1 className="text-2xl font-medium text-gray-900">Prescription Verification</h1>
        </div>
      </div>
      <div className="bg-white border border-gray-100 shadow-lg rounded-2xl overflow-hidden">
        <PrescriptionVerification
          orderId={orderId || ''}
          onBack={() => navigate(-1)}
          onActionSuccess={handleActionSuccess}
        />
      </div>
    </Container>
  )
}

import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@/components'
import PrescriptionVerification from '@/features/sales/components/prescriptions/PrescriptionVerification'
import { IoChevronBackOutline } from 'react-icons/io5'

import { PageHeader } from '@/features/sales/components/common'

export default function SaleStaffRxVerificationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  const handleActionSuccess = () => {
    // Trigger refresh for parent components
    window.dispatchEvent(new CustomEvent('orderUpdated'))
  }

  return (
    <Container className="pt-2 pb-8 px-2 max-w-none">
      <div className="flex items-center gap-4 mb-5">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 bg-white hover:bg-mint-50 rounded-xl transition-all text-gray-500 hover:text-mint-600 border border-gray-200 hover:border-mint-200 shadow-sm"
        >
          <IoChevronBackOutline size={20} />
        </button>
        <PageHeader
          title="Prescription Verification"
          breadcrumbs={[
            { label: 'Dashboard', path: '/salestaff/dashboard' },
            { label: 'Orders', path: '/salestaff/orders' },
            { label: 'Verification' }
          ]}
          noMargin
        />
      </div>
      <PrescriptionVerification
        orderId={orderId || ''}
        onBack={() => navigate(-1)}
        onActionSuccess={handleActionSuccess}
      />
    </Container>
  )
}

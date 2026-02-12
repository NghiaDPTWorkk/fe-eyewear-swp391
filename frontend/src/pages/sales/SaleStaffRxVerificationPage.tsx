import { IoChevronBackOutline } from 'react-icons/io5'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { PageHeader } from '@/features/sales/components/common'
import PrescriptionVerification from '@/features/sales/components/prescriptions/PrescriptionVerification'
import { useSalesStaffOrderDetail } from '@/features/sales/hooks/useSalesStaffOrders'
import { Button, Container } from '@/shared/components/ui-core'

export default function SaleStaffRxVerificationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const { data: order } = useSalesStaffOrderDetail(orderId || null)

  const [searchParams] = useSearchParams()

  const handleBack = () => {
    const fromPath = searchParams.get('from')
    const invoiceId = searchParams.get('invoiceId') || order?.invoiceId

    if (fromPath && invoiceId) {
      navigate(`${fromPath}?invoiceId=${invoiceId}`)
    } else if (fromPath) {
      navigate(fromPath)
    } else if (invoiceId) {
      navigate(`/salestaff/dashboard?invoiceId=${invoiceId}`)
    } else {
      navigate(-1)
    }
  }

  const handleActionSuccess = () => {
    // Trigger refresh for parent components
    window.dispatchEvent(new CustomEvent('orderUpdated'))
  }

  return (
    <Container className="pt-2 pb-8 px-2 max-w-none">
      <div className="flex items-center gap-4 mb-5">
        <Button
          onClick={handleBack}
          className="p-2.5 bg-white hover:bg-mint-50 rounded-xl transition-all text-gray-500 hover:text-mint-600 border border-gray-200 hover:border-mint-200 shadow-sm"
        >
          <IoChevronBackOutline size={20} />
        </Button>
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
        onBack={handleBack}
        onActionSuccess={handleActionSuccess}
      />
    </Container>
  )
}

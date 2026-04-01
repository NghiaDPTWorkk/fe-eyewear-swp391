import { useEffect, useState } from 'react'
import { IoChevronBackOutline, IoLockClosedOutline, IoWarningOutline } from 'react-icons/io5'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/features/sales/components/common'
import PrescriptionVerification from '@/features/sales/components/prescriptions/PrescriptionVerification'
import { useSalesStaffOrderDetail, useOrderVerificationLock } from '@/features/sales/hooks'
import { Button } from '@/shared/components/ui-core'

export default function SaleStaffRxVerificationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const { data: order } = useSalesStaffOrderDetail(orderId || '')
  const [searchParams] = useSearchParams()
  const [lockDenied, setLockDenied] = useState(false)
  const { lockStatus, acquireLock, releaseLock } = useOrderVerificationLock(orderId || '')

  useEffect(() => {
    if (!orderId || !order) return
    const orderStatus = (order?.status || '').toUpperCase()
    const invoiceStatus = ((order as any)?.invoice?.status || '').toUpperCase()
    const isCanceledOrRejected =
      ['CANCELED', 'CANCEL', 'CANCELLED', 'REJECTED', 'REJECT', 'EXPIRED'].includes(orderStatus) ||
      ['CANCELED', 'CANCEL', 'CANCELLED', 'REJECTED', 'REJECT'].includes(invoiceStatus)

    if (isCanceledOrRejected) return
    const acquired = acquireLock()
    if (!acquired) {
      setLockDenied(true)
    }
    return () => {
      releaseLock()
    }
  }, [orderId, order?.status])

  useEffect(() => {
    if (lockStatus.locked) {
      setLockDenied(true)
    }
  }, [lockStatus])

  const handleBack = () => {
    releaseLock()
    const fromPath = searchParams.get('from')
    const invoiceId = searchParams.get('invoiceId') || order?.invoiceId
    if (fromPath && invoiceId) {
      navigate(`${fromPath}?invoiceId=${invoiceId}`)
    } else if (fromPath) {
      navigate(fromPath)
    } else if (invoiceId) {
      navigate(`/sale-staff/dashboard?invoiceId=${invoiceId}`)
    } else {
      navigate(-1)
    }
  }

  const handleActionSuccess = () => {
    window.dispatchEvent(new CustomEvent('orderUpdated'))
  }

  const isOrderCanceledOrRejected = (() => {
    const orderStatus = (order?.status || '').toUpperCase()
    const invoiceStatus = ((order as any)?.invoice?.status || '').toUpperCase()
    return (
      ['CANCELED', 'CANCEL', 'CANCELLED', 'REJECTED', 'REJECT', 'EXPIRED'].includes(orderStatus) ||
      ['CANCELED', 'CANCEL', 'CANCELLED', 'REJECTED', 'REJECT'].includes(invoiceStatus)
    )
  })()

  if (lockDenied) {
    const blockerName = lockStatus.locked ? lockStatus.staffName : 'Another staff'
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleBack}
            className="p-2.5 bg-white hover:bg-mint-50 rounded-xl transition-all text-gray-500 hover:text-mint-600 border border-gray-200 hover:border-mint-200 shadow-sm"
          >
            <IoChevronBackOutline size={20} />
          </Button>
          <PageHeader
            title="Prescription Verification"
            breadcrumbs={[
              { label: 'Dashboard', path: '/sale-staff/dashboard' },
              { label: 'Orders', path: '/sale-staff/orders' },
              { label: 'Verification' }
            ]}
            noMargin
          />
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-8 flex flex-col items-center gap-5 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center shadow-inner">
            <IoLockClosedOutline size={32} className="text-amber-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-amber-800 tracking-tight flex items-center justify-center gap-2">
              <IoWarningOutline size={18} />
              Order is being verified
            </h3>
            <p className="text-sm text-amber-700 max-w-sm">
              <span className="font-semibold">{blockerName}</span> is currently verifying this
              prescription. Please wait until they finish.
            </p>
          </div>
          <Button
            onClick={handleBack}
            className="mt-2 px-6 h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm border-none shadow-md shadow-amber-200/50 transition-all active:scale-95"
          >
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={handleBack}
          className="p-2.5 bg-white hover:bg-mint-50 rounded-xl transition-all text-gray-500 hover:text-mint-600 border border-gray-200 hover:border-mint-200 shadow-sm"
        >
          <IoChevronBackOutline size={20} />
        </Button>
        <PageHeader
          title="Prescription Verification"
          breadcrumbs={[
            { label: 'Dashboard', path: '/sale-staff/dashboard' },
            { label: 'Orders', path: '/sale-staff/orders' },
            { label: 'Verification' }
          ]}
          noMargin
        />
      </div>
      {!isOrderCanceledOrRejected && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-mint-50 border border-mint-100 w-fit text-mint-700">
          <IoLockClosedOutline size={14} />
          <span className="text-xs font-semibold">You are currently verifying this order</span>
        </div>
      )}
      <PrescriptionVerification
        orderId={orderId || ''}
        onBack={handleBack}
        onActionSuccess={handleActionSuccess}
      />
    </div>
  )
}

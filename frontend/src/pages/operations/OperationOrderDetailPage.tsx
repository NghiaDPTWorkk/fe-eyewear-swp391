import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@/components'
import { JobTechnicalDetails } from '@/components/layout/staff/staff-core/technicaldetail'
import { PATHS } from '@/routes/paths'
import { IoArrowBack } from 'react-icons/io5'

import { Button } from '@/shared/components/ui/button'
import { ProcessTracker } from '@/components/layout/staff/staff-core/processtracker'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'

export default function OperationOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  // TẤT CẢ MOCK DATA NẰM Ở ĐÂY
  const lensData = {
    prescription: [
      { eye: 'Right Eye (OD)', sph: '-6.50', cyl: '-1.50', axis: '0°', prism: '-', add: '-' },
      { eye: 'Left Eye (OS)', sph: '-6.50', cyl: '-1.50', axis: '0°', prism: '-', add: '-' }
    ],
    additional: [
      { label: 'Loại Tròng', value: 'Single Vision' },
      { label: 'Chất Liệu', value: 'CR-39 Plastic' }
    ]
  }

  const frameData = [
    { label: 'Frame Code', value: 'RB-AV-001' },
    { label: 'Brand', value: 'Ray-Ban' },
    { label: 'Material', value: 'Metal Titanium' },
    { label: 'Color', value: 'Gold' }
  ]
  return (
    <Container>
      {/* Breadcrumb Path */}
      <BreadcrumbPath paths={['Dashboard', 'Details']} />

      {/* Header */}
      <div className="flex items-center gap-5 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-white hover:bg-neutral-50 rounded-xl shadow-sm transition-all border border-neutral-100"
        >
          <IoArrowBack size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Order #{orderId || 'REG-001'}
          </h1>
          <p className="text-sm text-neutral-500 mt-1 font-medium tracking-wide italic opacity-80 uppercase tracking-widest text-[10px]">
            DETAILED ORDER INFORMATION
          </p>
        </div>
        <div className="ml-auto">
          <span className="px-6 py-2 bg-mint-100 text-mint-700 border border-mint-200 rounded-full text-xs font-bold uppercase tracking-widest">
            Pending
          </span>
        </div>
      </div>

      {/* Progress Tracker */}
      <ProcessTracker />

      {/* Technical Details - Lens & Frame Specifications */}
      <JobTechnicalDetails lensData={lensData} frameData={frameData} />

      {/* Action Button */}
      <div className="flex justify-end gap-3 mt-4">
        <Button
          className="px-6 py-3 bg-mint-900 hover:bg-mint-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          onClick={() => navigate(PATHS.OPERATIONSTAFF.PACKING_PROCESS(orderId || ''))}
        >
          Start Processing
        </Button>
      </div>
    </Container>
  )
}

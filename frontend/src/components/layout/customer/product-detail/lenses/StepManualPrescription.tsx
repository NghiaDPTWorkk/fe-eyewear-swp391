import type { PrescriptionData } from './types'
import { PrescriptionForm } from '@/shared/components/prescription/PrescriptionForm'

interface StepManualPrescriptionProps {
  onSubmit: (rx: PrescriptionData) => void
  isPreOrder?: boolean
}

export default function StepManualPrescription({
  onSubmit,
  isPreOrder
}: StepManualPrescriptionProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-bold text-mint-1200 mb-2">
          Enter your prescription
        </h2>
        <p className="text-gray-eyewear">
          We'll create a lens tailor-made to your vision needs. Don't have a valid prescription?
          <button className="text-primary-500 font-bold ml-1 hover:underline">
            Find Eye Doctors Near You
          </button>
        </p>
      </div>

      <PrescriptionForm
        onSubmit={onSubmit}
        showDefaultCheckbox={false}
        showConfirmCheckbox={true}
        submitLabel={isPreOrder ? 'Pre-order Now' : 'Add to Cart'}
        confirmText="By clicking this box, I confirm that the prescription values entered above are taken from a valid (not expired) prescription issued to me, signed by a licensed optometrist or ophthalmologist."
      />
    </div>
  )
}

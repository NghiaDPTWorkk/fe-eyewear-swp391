import type { PrescriptionData } from '@/shared/types/prescription.types'

export type { PrescriptionData }
export type VisionNeed = 'prescription' | 'non-prescription'

export interface LensSelectionState {
  visionNeed: VisionNeed | null
  lensId: string | null
  sku: string | null
  prescription: PrescriptionData | null
  useSavedPrescription: boolean
}

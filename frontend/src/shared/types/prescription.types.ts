export interface Prescription {
  _id?: string
  right: {
    SPH: number
    CYL: number
    AXIS: number
    ADD: number
  }
  left: {
    SPH: number
    CYL: number
    AXIS: number
    ADD: number
  }
  PD: number
  isDefault?: boolean
}

export type PrescriptionData = Prescription

export interface PrescriptionValidateRequest {
  prescription: PrescriptionData
}

export interface PrescriptionValidateResponse {
  isValid: boolean
  message?: string
  warnings?: string[]
}

export interface PrescriptionCalculateRequest {
  prescription: PrescriptionData
  lensType: string
}

export interface PrescriptionCalculateResponse {
  recommendedLens: {
    id: string
    name: string
    price: number
    description: string
  }[]
}

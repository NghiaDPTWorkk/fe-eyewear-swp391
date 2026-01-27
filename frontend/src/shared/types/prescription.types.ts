export interface PrescriptionData {
  right: {
    SPH: number
    CYL: number
    AXIS: number
  }
  left: {
    SPH: number
    CYL: number
    AXIS: number
  }
  PD: number
}

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

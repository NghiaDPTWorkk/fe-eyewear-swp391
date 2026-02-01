export interface PrescriptionData {
  right: {
    SPH: string | number
    CYL: string | number
    AXIS: string | number
    ADD?: string | number
  }
  left: {
    SPH: string | number
    CYL: string | number
    AXIS: string | number
    ADD?: string | number
  }
  PD: string | number
  PD2?: string | number // For separate PDs
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

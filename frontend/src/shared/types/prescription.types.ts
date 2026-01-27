export interface PrescriptionData {
  od_sph: number
  od_cyl: number
  od_axis: number
  od_add?: number
  os_sph: number
  os_cyl: number
  os_axis: number
  os_add?: number
  pd: number
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

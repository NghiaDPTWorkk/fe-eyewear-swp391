export interface LensParameters {
  left: {
    SPH: number
    CYL: number
    AXIS: number
    ADD?: number
  }
  right: {
    SPH: number
    CYL: number
    AXIS: number
    ADD?: number
  }
  PD: number
}

export interface OrderProductFrame {
  product_id: string
  sku: string
}

export interface OrderProductLens {
  lens_id: string
  sku: string
  parameters: LensParameters
}

export interface OrderProduct {
  product?: OrderProductFrame
  lens?: OrderProductLens
  quantity: number
}

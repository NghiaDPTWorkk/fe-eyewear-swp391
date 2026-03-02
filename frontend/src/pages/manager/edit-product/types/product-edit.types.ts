export type ProductEditFormType = 'frame' | 'lens' | 'sunglass'

export interface ProductEditVariant {
  sku: string
  name: string
  slug: string
  priceText: string
  finalPriceText: string
  stockText: string
  imgs: string[]
  isDefault: boolean
  mode: 'AVAILABLE' | 'PRE_ORDER'
  options: Array<{
    attributeId: string
    attributeName: string
    label: string
    showType: 'color' | 'text'
    value: string
  }>
}

export interface ProductEditFormState {
  type: ProductEditFormType
  nameBase: string
  brand: string
  categoriesText: string
  specFrame: {
    materialText: string
    shape: string
    style: string
    gender: 'F' | 'M' | 'N'
    weightText: string
    dimensionsEnabled: boolean
    dimensions: {
      widthText: string
      heightText: string
      depthText: string
    }
  }
  specLens: {
    featureText: string
    origin: string
  }
  variants: ProductEditVariant[]
}

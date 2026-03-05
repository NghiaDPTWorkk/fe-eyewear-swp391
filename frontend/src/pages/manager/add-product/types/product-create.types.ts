export type ProductCreateFormType = 'frame' | 'lens'

export interface ProductCreateFormState {
  type: ProductCreateFormType
  nameBase: string
  slugBase: string
  skuBase: string
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
  variants: Array<{
    sku: string
    name: string
    slug: string
    priceText: string
    finalPriceText: string
    stockText: string
    imgs: string[]
    isDefault: boolean
    options: Array<{
      attributeId: string
      attributeName: string
      label: string
      showType: 'color' | 'text'
      value: string
    }>
  }>
  optionsConfig: Array<{
    attributeId: string
    attributeName: string
    showType: 'color' | 'text'
    values: Array<{
      label: string
      value: string
    }>
  }>
  isPreOrder?: boolean
  preOrderConfig?: {
    description: string
    targetDate: string
    targetQuantity: string
    startedDate: string
    endedDate: string
  }
}

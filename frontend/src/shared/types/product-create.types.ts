import type { ProductCreateLensRequest, ProductCreateSunglassRequest } from './product.types'

export type ProductCreateFormType = 'sunglass' | 'lens'

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
    imgsText: string
    isDefault: boolean
    options: Array<{
      attributeId: string
      attributeName: string
      label: string
      showType: 'color' | 'text'
      value: string
    }>
  }>
}

export type ProductCreateRequest = ProductCreateSunglassRequest | ProductCreateLensRequest

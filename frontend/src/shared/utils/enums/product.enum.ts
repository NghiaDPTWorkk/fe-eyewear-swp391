export const ProductType = {
  FRAME: 'frame',
  LENS: 'lens',
  SUNGLASS: 'sunglass'
} as const
export type ProductType = (typeof ProductType)[keyof typeof ProductType]

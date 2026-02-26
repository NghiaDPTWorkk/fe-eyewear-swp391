export interface SpecCategory {
  _id: string
  name: string
}

export interface ProductSpecs {
  materials: string[]
  shapes: string[]
  genders: string[]
  styles: string[]
  features: string[]
  origins: string[]
  brands: string[]
  categories: SpecCategory[]
  types: string[]
}

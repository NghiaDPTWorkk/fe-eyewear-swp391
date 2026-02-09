import type {
  ProductCreateLensRequest,
  ProductCreateSunglassRequest
} from '@/shared/types/product.types'
import type { Variant, VariantOption } from '@/shared/types/variant.types'
import type { ProductCreateFormState } from '../types/product-create.types'

export const toOptionalString = (value: string): string | undefined => {
  const v = value.trim()
  return v.length ? v : undefined
}

export const toBrandNullable = (value: string): string | null => {
  const v = value.trim()
  return v.length ? v : null
}

export const toStringArrayFromText = (value: string): string[] => {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export const toNumberOrNull = (value: string): number | null => {
  const v = value.trim()
  if (!v.length) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

export const buildVariant = (v: ProductCreateFormState['variants'][number]): Variant => {
  const options: VariantOption[] = v.options
    .filter(
      (o) =>
        o.attributeId.trim().length &&
        o.attributeName.trim().length &&
        o.label.trim().length &&
        o.value.trim().length
    )
    .map((o) => ({
      attributeId: o.attributeId.trim(),
      attributeName: o.attributeName.trim(),
      label: o.label.trim(),
      showType: o.showType,
      value: o.value.trim()
    }))

  return {
    sku: toOptionalString(v.sku),
    name: toOptionalString(v.name),
    slug: toOptionalString(v.slug),
    options,
    price: Number(v.priceText || 0),
    finalPrice: Number(v.finalPriceText || 0),
    stock: Number(v.stockText || 0),
    imgs: v.imgs, 
    isDefault: v.isDefault
  }
}

export const buildRequest = (
  state: ProductCreateFormState
): ProductCreateSunglassRequest | ProductCreateLensRequest => {
  const categories = toStringArrayFromText(state.categoriesText)
  const variants = state.variants.map(buildVariant)

  if (state.type === 'sunglass') {
    const material = toStringArrayFromText(state.specFrame.materialText)
    const weight = toNumberOrNull(state.specFrame.weightText)

    const dimensions = state.specFrame.dimensionsEnabled
      ? {
          width: Number(state.specFrame.dimensions.widthText || 0),
          height: Number(state.specFrame.dimensions.heightText || 0),
          depth: Number(state.specFrame.dimensions.depthText || 0)
        }
      : null

    return {
      nameBase: state.nameBase.trim(),
      slugBase: toOptionalString(state.slugBase),
      skuBase: toOptionalString(state.skuBase),
      type: 'sunglass',
      brand: toBrandNullable(state.brand),
      categories,
      spec: {
        material,
        shape: state.specFrame.shape.trim(),
        style: state.specFrame.style.trim().length ? state.specFrame.style.trim() : null,
        gender: state.specFrame.gender,
        weight,
        dimensions
      },
      variants
    }
  }

  const feature = toStringArrayFromText(state.specLens.featureText)

  const spec =
    feature.length || state.specLens.origin.trim().length
      ? {
          feature,
          origin: state.specLens.origin.trim().length ? state.specLens.origin.trim() : null
        }
      : null

  return {
    nameBase: state.nameBase.trim(),
    slugBase: toOptionalString(state.slugBase),
    skuBase: toOptionalString(state.skuBase),
    type: 'lens',
    brand: toBrandNullable(state.brand),
    categories,
    spec,
    variants
  }
}

export const validateStrict = (
  req: ProductCreateSunglassRequest | ProductCreateLensRequest
): string[] => {
  const errors: string[] = []

  if (!req.nameBase || req.nameBase.trim().length < 1) errors.push('nameBase is required')
  if (!('brand' in req)) errors.push('brand key is required')
  if (!Array.isArray(req.categories) || req.categories.length < 1)
    errors.push('categories must have at least 1 item')
  if (!Array.isArray(req.variants) || req.variants.length < 1)
    errors.push('variants must have at least 1 item')

  req.variants.forEach((v, idx) => {
    if (v.finalPrice > v.price) errors.push(`variants[${idx}].finalPrice must be <= price`)
  })

  if (req.type === 'sunglass') {
    const s = req.spec
    if (!s) errors.push('spec is required for sunglass')
    if (!Array.isArray(s.material) || s.material.length < 1)
      errors.push('spec.material must have at least 1 item')
    if (!s.shape || s.shape.trim().length < 1) errors.push('spec.shape is required')
    if (!['F', 'M', 'N'].includes(s.gender)) errors.push('spec.gender invalid')
    if (s.weight !== null && !(s.weight > 0)) errors.push('spec.weight must be > 0 if not null')
    if (s.dimensions !== null) {
      if (!(s.dimensions.width > 0)) errors.push('spec.dimensions.width must be > 0')
      if (!(s.dimensions.height > 0)) errors.push('spec.dimensions.height must be > 0')
      if (!(s.dimensions.depth > 0)) errors.push('spec.dimensions.depth must be > 0')
    }
  }

  if (req.type === 'lens') {
    if (!('spec' in req)) errors.push('spec key is required for lens')
    if (req.spec !== null) {
      if (!Array.isArray(req.spec.feature) || req.spec.feature.length < 1)
        errors.push('spec.feature must have at least 1 item when spec is object')
      if (req.spec.origin !== null && req.spec.origin.trim().length < 1)
        errors.push('spec.origin must be min 1 if not null')
    }
  }

  return errors
}


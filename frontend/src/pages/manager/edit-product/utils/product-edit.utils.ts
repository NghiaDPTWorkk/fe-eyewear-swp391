import type { AdminProductDetail } from '@/shared/types'
import type { ProductEditFormState, ProductEditVariant } from '../types/product-edit.types'

export function mapProductToFormState(product: AdminProductDetail): ProductEditFormState {
  const spec = product.spec
  const isFrame = product.type === 'frame' || product.type === 'sunglass'
  const hasDimensions = !!spec?.dimensions

  return {
    type: product.type as ProductEditFormState['type'],
    nameBase: product.nameBase,
    brand: product.brand || '',
    categoriesText: (product.categories || []).join(', '),
    specFrame: {
      materialText: isFrame && spec?.material ? spec.material.join(', ') : '',
      shape: (isFrame && spec?.shape) || '',
      style: (isFrame && spec?.style) || '',
      gender: (isFrame && spec?.gender ? spec.gender : 'N') as 'F' | 'M' | 'N',
      weightText:
        isFrame && spec?.weight !== null && spec?.weight !== undefined ? String(spec.weight) : '',
      dimensionsEnabled: hasDimensions,
      dimensions: {
        widthText: hasDimensions && spec?.dimensions ? String(spec.dimensions.width) : '',
        heightText: hasDimensions && spec?.dimensions ? String(spec.dimensions.height) : '',
        depthText: hasDimensions && spec?.dimensions ? String(spec.dimensions.depth) : ''
      }
    },
    specLens: {
      featureText: !isFrame && spec?.feature ? spec.feature.join(', ') : '',
      origin: (!isFrame && spec?.origin) || ''
    },
    variants: product.variants.map(
      (v): ProductEditVariant => ({
        sku: v.sku || '',
        name: v.name || '',
        slug: v.slug || '',
        priceText: String(v.price),
        finalPriceText: String(v.finalPrice),
        stockText: String(v.stock),
        imgs: v.imgs || [],
        isDefault: v.isDefault,
        mode: (v.mode as 'AVAILABLE' | 'PRE_ORDER') || 'AVAILABLE',
        virTryOnUrl: v.virTryOnUrl || '',
        options: v.options.map((o) => ({
          attributeId: o.attributeId,
          attributeName: o.attributeName,
          label: o.label,
          showType: o.showType,
          value: o.value
        }))
      })
    ),
    optionsConfig: []
  }
}

export function buildUpdatePayload(state: ProductEditFormState): Record<string, unknown> {
  const categories = state.categoriesText
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const payload: Record<string, unknown> = {
    nameBase: state.nameBase,
    type: state.type,
    brand: state.brand || null,
    categories,
    variants: state.variants.map((v) => ({
      options: v.options
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
        })),
      price: Number(v.priceText || 0),
      finalPrice: Number(v.finalPriceText || 0),
      stock: Number(v.stockText || 0),
      imgs: v.imgs,
      isDefault: v.isDefault,
      mode: v.mode,
      virTryOnUrl: v.virTryOnUrl || undefined
    }))
  }

  if (state.type === 'frame' || state.type === 'sunglass') {
    payload.spec = {
      material: state.specFrame.materialText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      shape: state.specFrame.shape || undefined,
      style: state.specFrame.style || undefined,
      gender: state.specFrame.gender,
      weight: state.specFrame.weightText ? Number(state.specFrame.weightText) : undefined,
      dimensions: state.specFrame.dimensionsEnabled
        ? {
            width: Number(state.specFrame.dimensions.widthText),
            height: Number(state.specFrame.dimensions.heightText),
            depth: Number(state.specFrame.dimensions.depthText)
          }
        : undefined
    }
  } else {
    payload.spec = {
      feature: state.specLens.featureText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      origin: state.specLens.origin || undefined
    }
  }

  return payload
}

import { cartApi } from './cart.api'
import type {
  AddToCartPayload,
  BackendCart,
  CartItem,
  LensParameters
} from '@/shared/types/cart.types'
import type { LensSelectionState } from '@/components/layout/customer/product-detail/lenses/types'
import type { PrescriptionData } from '@/shared/types/prescription.types'
import { productService } from '@/shared/services/products/productService'

const transformPrescriptionToParameters = (prescription: PrescriptionData): LensParameters => {
  return {
    left: {
      SPH: Number(prescription.left.SPH),
      CYL: Number(prescription.left.CYL),
      AXIS: Number(prescription.left.AXIS),
      ADD: prescription.left.ADD ? Number(prescription.left.ADD) : undefined
    },
    right: {
      SPH: Number(prescription.right.SPH),
      CYL: Number(prescription.right.CYL),
      AXIS: Number(prescription.right.AXIS),
      ADD: prescription.right.ADD ? Number(prescription.right.ADD) : undefined
    },
    PD: Number(prescription.PD)
  }
}

const transformBackendCartToItems = (backendCart: BackendCart): CartItem[] => {
  const items = backendCart.products.map((item) => ({
    _id: item._id,
    product_id: item.product?.product_id || '',
    sku: item.product?.sku || '',
    name: item.product?.name || 'Unknown Product',
    price: item.product?.price || 0,
    image: item.product?.image || '/placeholder-product.png',
    quantity: item.quantity || 1,
    addAt: item.addedAt ? new Date(item.addedAt) : new Date(),
    selected: true,
    lens: item.lens
      ? {
          lensId: item.lens.lens_id,
          sku: item.lens.sku,
          visionNeed: item.lens.parameters ? 'prescription' : 'non-prescription',
          prescription: item.lens.parameters
            ? {
                left: {
                  SPH: item.lens.parameters.left?.SPH || 0,
                  CYL: item.lens.parameters.left?.CYL || 0,
                  AXIS: item.lens.parameters.left?.AXIS || 0,
                  ADD: item.lens.parameters.left?.ADD || 0
                },
                right: {
                  SPH: item.lens.parameters.right?.SPH || 0,
                  CYL: item.lens.parameters.right?.CYL || 0,
                  AXIS: item.lens.parameters.right?.AXIS || 0,
                  ADD: item.lens.parameters.right?.ADD || 0
                },
                PD: item.lens.parameters.PD || 0
              }
            : null
        }
      : undefined
  }))

  return items.reverse()
}

const enrichCartItemsWithProductDetails = async (items: CartItem[]): Promise<CartItem[]> => {
  const productIds = [...new Set(items.map((item) => item.product_id).filter(Boolean))]
  const lensIds = [...new Set(items.map((item) => item.lens?.lensId).filter(Boolean))]
  const allIds = [...new Set([...productIds, ...lensIds])]

  if (allIds.length === 0) {
    return items
  }

  try {
    const productDetailsPromises = allIds.map((id) =>
      productService
        .getProductDetail(id!)
        .then((response) => ({ id, data: response.data }))
        .catch(() => ({ id, data: null }))
    )

    const productDetailsResponses = await Promise.all(productDetailsPromises)

    const productDetailsMap = new Map()
    productDetailsResponses.forEach(({ id, data }) => {
      if (data?.product) {
        productDetailsMap.set(id, data.product)
      }
    })

    const enrichedItems = items.map((item) => {
      let enrichedItem = { ...item }

      const productDetail = productDetailsMap.get(item.product_id)
      if (productDetail) {
        const variant = productDetail.variants?.find((v: any) => v.sku === item.sku)
        if (variant) {
          const selectedOptions: Record<string, string> = {}
          variant.options?.forEach((option: any) => {
            selectedOptions[option.attributeName] = option.label
          })
          enrichedItem = {
            ...enrichedItem,
            name: variant.name || productDetail.nameBase || item.name,
            price: variant.finalPrice || variant.price || item.price,
            image: variant.imgs?.[0] || item.image,
            sku: variant.sku || item.sku,
            productType: productDetail.type,
            selectedOptions,
            mode: variant.mode
          }
        } else {
          enrichedItem = {
            ...enrichedItem,
            name: productDetail.nameBase || item.name,
            price:
              productDetail.variants?.[0]?.finalPrice ||
              productDetail.variants?.[0]?.price ||
              item.price,
            image: productDetail.variants?.[0]?.imgs?.[0] || item.image,
            productType: productDetail.type
          }
        }
      }

      if (item.lens?.lensId) {
        const lensDetail = productDetailsMap.get(item.lens.lensId)
        if (lensDetail) {
          const variant = lensDetail.variants?.find((v: any) => v.sku === item.lens?.sku)
          enrichedItem.lens = {
            ...item.lens,
            name: variant?.name || lensDetail.nameBase || 'Lense',
            price:
              variant?.finalPrice || variant?.price || lensDetail.defaultVariantFinalPrice || 0,
            image: variant?.imgs?.[0] || lensDetail.defaultVariantImage || lensDetail.imageUrl,
            nameVariant: variant?.nameVariant || lensDetail.nameVariant
          }
        }
      }

      return enrichedItem
    })

    return enrichedItems
  } catch (error) {
    console.error('Failed to enrich cart items:', error)
    return items
  }
}

const buildCartItemPayload = (item: CartItem): AddToCartPayload => {
  const payload: AddToCartPayload = {
    item: {
      product: {
        product_id: item.product_id,
        sku: item.sku || ''
      }
    },
    quantity: item.quantity
  }

  if (item.lens?.lensId) {
    payload.item.lens = {
      lens_id: item.lens.lensId,
      sku: item.lens.sku || '',
      parameters: item.lens.prescription
        ? transformPrescriptionToParameters(item.lens.prescription)
        : undefined
    }
  }

  return payload
}

export const cartService = {
  addToCart: async (
    productId: string,
    sku: string,
    quantity: number,
    lensSelection?: LensSelectionState
  ): Promise<CartItem[]> => {
    try {
      const payload: AddToCartPayload = {
        item: {
          product: {
            product_id: productId,
            sku: sku
          }
        },
        quantity
      }

      if (lensSelection && lensSelection.lensId) {
        payload.item.lens = {
          lens_id: lensSelection.lensId,
          sku: lensSelection.sku || '',
          parameters:
            lensSelection.prescription && lensSelection.visionNeed === 'prescription'
              ? transformPrescriptionToParameters(lensSelection.prescription)
              : undefined
        }
      }

      const response = await cartApi.addProductToCart(payload)

      if (!response.data || !response.data.cart) {
        return []
      }

      const transformedItems = transformBackendCartToItems(response.data.cart)

      const enrichedItems = await enrichCartItemsWithProductDetails(transformedItems)

      return enrichedItems
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status
        const message = error.response.data?.message || error.message

        switch (status) {
          case 401:
            throw new Error('UNAUTHORIZED')
          case 400:
          case 409:
            throw new Error(message || 'Product is out of stock or unavailable')
          case 404:
            throw new Error('Product not found')
          default:
            throw new Error(message || 'Failed to add product to cart')
        }
      }

      throw new Error('Network error. Please check your connection and try again.')
    }
  },

  getCart: async (): Promise<CartItem[]> => {
    try {
      const response = await cartApi.getCart()

      if (!response.data || !response.data.cart) {
        return []
      }

      const transformedItems = transformBackendCartToItems(response.data.cart)

      const enrichedItems = await enrichCartItemsWithProductDetails(transformedItems)

      return enrichedItems
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status
        const message = error.response.data?.message || error.message

        switch (status) {
          case 401:
            throw new Error('UNAUTHORIZED')
          case 404:
            return []
          default:
            throw new Error(message || 'Failed to get cart')
        }
      }

      throw new Error('Network error. Please check your connection and try again.')
    }
  },

  updateQuantity: async (item: CartItem, quantity: number): Promise<CartItem[]> => {
    try {
      const payload = buildCartItemPayload({ ...item, quantity })

      const response = await cartApi.updateQuantity(payload)

      if (!response.data?.cart) return []

      const transformedItems = transformBackendCartToItems(response.data.cart)
      const enrichedItems = await enrichCartItemsWithProductDetails(transformedItems)

      return enrichedItems
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('UNAUTHORIZED')
      }
      throw new Error(error.message || 'Failed to update quantity')
    }
  },

  removeItem: async (item: CartItem): Promise<CartItem[]> => {
    try {
      const payload = buildCartItemPayload(item)

      const response = await cartApi.removeItem(payload)

      if (!response.data?.cart) return []

      const transformedItems = transformBackendCartToItems(response.data.cart)
      const enrichedItems = await enrichCartItemsWithProductDetails(transformedItems)

      return enrichedItems
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('UNAUTHORIZED')
      }
      throw new Error(error.message || 'Failed to remove item')
    }
  },

  removeItems: async (items: CartItem[]): Promise<CartItem[]> => {
    for (const item of items) {
      const payload = buildCartItemPayload(item)
      try {
        await cartApi.removeItem(payload)
      } catch (error) {
        console.error('Failed to remove item in batch:', error)
      }
    }

    try {
      const response = await cartApi.getCart()
      if (response.data?.cart) {
        const transformedItems = transformBackendCartToItems(response.data.cart)
        return await enrichCartItemsWithProductDetails(transformedItems)
      }
    } catch (error) {
      console.error('Failed to fetch final cart state:', error)
    }

    return []
  },

  clearCart: async (): Promise<CartItem[]> => {
    try {
      await cartApi.clearCart()
      return []
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('UNAUTHORIZED')
      }
      throw new Error(error.message || 'Failed to clear cart')
    }
  }
}

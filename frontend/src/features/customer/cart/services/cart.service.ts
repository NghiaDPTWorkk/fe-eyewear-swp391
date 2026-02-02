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

/**
 * Transform prescription data to lens parameters
 */
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

/**
 * Transform backend cart to frontend cart items
 */
const transformBackendCartToItems = (backendCart: BackendCart): CartItem[] => {
  return backendCart.products.map((item) => ({
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
          lensId: item.lens.lens_id, // Save for API
          sku: item.lens.sku, // Save for API
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
}

/**
 * Enrich cart items with full product details from products API
 * @param items - Cart items with basic product info
 * @returns Cart items enriched with full product details
 */
const enrichCartItemsWithProductDetails = async (items: CartItem[]): Promise<CartItem[]> => {
  // Extract unique product IDs
  const productIds = [...new Set(items.map((item) => item.product_id).filter(Boolean))]

  if (productIds.length === 0) {
    return items
  }

  try {
    // Fetch all product details in parallel
    const productDetailsPromises = productIds.map((id) =>
      productService
        .getProductDetail(id)
        .then((response) => ({ id, data: response.data }))
        .catch(() => ({ id, data: null }))
    )

    const productDetailsResponses = await Promise.all(productDetailsPromises)

    // Create product details map
    const productDetailsMap = new Map()
    productDetailsResponses.forEach(({ id, data }) => {
      if (data?.product) {
        productDetailsMap.set(id, data.product)
      }
    })

    // Merge product details into cart items
    const enrichedItems = items.map((item) => {
      const productDetail = productDetailsMap.get(item.product_id)

      if (productDetail) {
        // Find the specific variant by SKU
        const variant = productDetail.variants?.find((v: any) => v.sku === item.sku)

        if (variant) {
          // Extract color and other attributes from variant options
          const selectedOptions: Record<string, string> = {}
          variant.options?.forEach((option: any) => {
            selectedOptions[option.attributeName] = option.label
          })

          return {
            ...item,
            name: variant.name || productDetail.nameBase || item.name,
            price: variant.finalPrice || variant.price || item.price,
            image: variant.imgs?.[0] || item.image,
            sku: variant.sku || item.sku,
            selectedOptions // Add variant attributes (color, size, etc.)
          }
        } else {
          // Fallback to product defaults if variant not found
          return {
            ...item,
            name: productDetail.nameBase || item.name,
            // Use default variant if available
            price:
              productDetail.variants?.[0]?.finalPrice ||
              productDetail.variants?.[0]?.price ||
              item.price,
            image: productDetail.variants?.[0]?.imgs?.[0] || item.image
          }
        }
      }

      return item
    })

    return enrichedItems
  } catch (error) {
    // Return original items if enrichment fails
    console.error('Failed to enrich cart items:', error)
    return items
  }
}

/**
 * Build cart item payload from CartItem for API requests
 */
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

  // Add lens if exists
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

/**
 * Cart Service - Business logic layer for cart operations
 */
export const cartService = {
  /**
   * Thêm sản phẩm vào giỏ hàng với xử lý lỗi đầy đủ
   *
   * @param productId - id
   * @param sku - SKU của variant đã chọn
   * @param quantity - Số lượng
   * @param lensSelection - Thông tin lens (nếu có)
   * @returns Cart items đã được transform
   * @throws Error với message phù hợp cho từng trường hợp lỗi
   */
  addToCart: async (
    productId: string,
    sku: string,
    quantity: number,
    lensSelection?: LensSelectionState
  ): Promise<CartItem[]> => {
    try {
      // Build payload
      const payload: AddToCartPayload = {
        item: {
          product: {
            product_id: productId,
            sku: sku
          }
        },
        quantity
      }

      // Add lens info if provided
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

      // Make API call
      const response = await cartApi.addProductToCart(payload)

      // Handle case where backend returns success but data is null
      if (!response.data || !response.data.cart) {
        // Return empty array since we don't have cart data to transform
        // The operation was successful, just no data returned
        return []
      }

      // Transform backend cart to frontend format
      const transformedItems = transformBackendCartToItems(response.data.cart)

      // Enrich with full product details from products API
      const enrichedItems = await enrichCartItemsWithProductDetails(transformedItems)

      return enrichedItems
    } catch (error: any) {
      // Handle specific error cases
      if (error.response) {
        const status = error.response.status
        const message = error.response.data?.message || error.message

        switch (status) {
          case 401:
            throw new Error('UNAUTHORIZED')
          case 400:
          case 409:
            // Out of stock or invalid request
            throw new Error(message || 'Product is out of stock or unavailable')
          case 404:
            throw new Error('Product not found')
          default:
            throw new Error(message || 'Failed to add product to cart')
        }
      }

      // Network or other errors
      throw new Error('Network error. Please check your connection and try again.')
    }
  },
  /**
   * Lấy giỏ hàng từ backend
   * @returns Cart items đã được transform và enriched với product details
   * @throws Error với message phù hợp cho từng trường hợp lỗi
   */
  getCart: async (): Promise<CartItem[]> => {
    try {
      const response = await cartApi.getCart()

      // Handle case where backend returns success but data is null
      if (!response.data || !response.data.cart) {
        // Return empty array since we don't have cart data
        return []
      }

      // Transform backend cart to frontend format
      const transformedItems = transformBackendCartToItems(response.data.cart)

      // Enrich with full product details from products API
      const enrichedItems = await enrichCartItemsWithProductDetails(transformedItems)

      return enrichedItems
    } catch (error: any) {
      // Handle specific error cases
      if (error.response) {
        const status = error.response.status
        const message = error.response.data?.message || error.message

        switch (status) {
          case 401:
            throw new Error('UNAUTHORIZED')
          case 404:
            // Cart not found, return empty array
            return []
          default:
            throw new Error(message || 'Failed to get cart')
        }
      }

      // Network or other errors
      throw new Error('Network error. Please check your connection and try again.')
    }
  },

  /**
   * Cập nhật số lượng cart item
   */
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

  /**
   * Xóa item khỏi giỏ hàng
   */
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

  /**
   * Xóa nhiều item khỏi giỏ hàng
   */
  removeItems: async (items: CartItem[]): Promise<CartItem[]> => {
    // Perform deletions sequentially
    for (const item of items) {
      const payload = buildCartItemPayload(item)
      try {
        await cartApi.removeItem(payload)
      } catch (error) {
        console.error('Failed to remove item in batch:', error)
      }
    }

    // After all deletions are attempted, fetch the definitive latest state from server
    try {
      const response = await cartApi.getCart()
      if (response.data?.cart) {
        const transformedItems = transformBackendCartToItems(response.data.cart)
        return await enrichCartItemsWithProductDetails(transformedItems)
      }
    } catch (error) {
      console.error('Failed to fetch final cart state:', error)
    }

    return [] // Fallback to empty if everything fails
  },

  /**
   * Xóa toàn bộ giỏ hàng
   */
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

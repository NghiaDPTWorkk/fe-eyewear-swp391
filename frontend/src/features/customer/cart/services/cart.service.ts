import { cartApi } from './cart.api'
import type {
  AddToCartPayload,
  BackendCart,
  CartItem,
  LensParameters
} from '@/shared/types/cart.types'
import type { LensSelectionState } from '@/components/layout/customer/product-detail/lenses/types'
import type { PrescriptionData } from '@/shared/types/prescription.types'

/**
 * Transform prescription data to lens parameters
 */
const transformPrescriptionToParameters = (prescription: PrescriptionData): LensParameters => {
  return {
    left: {
      SPH: Number(prescription.left.SPH),
      CYL: Number(prescription.left.CYL),
      AXIS: Number(prescription.left.AXIS)
    },
    right: {
      SPH: Number(prescription.right.SPH),
      CYL: Number(prescription.right.CYL),
      AXIS: Number(prescription.right.AXIS)
    },
    PD: Number(prescription.PD)
  }
}

/**
 * Transform backend cart to frontend cart items
 */
const transformBackendCartToItems = (backendCart: BackendCart): CartItem[] => {
  return backendCart.products.map((item) => ({
    product_id: item.product.product_id,
    sku: item.product.sku,
    name: item.product.name,
    price: item.product.price,
    image: item.product.image,
    quantity: item.quantity,
    addAt: new Date(item.addedAt),
    selected: true,
    lens: item.lens
      ? {
          visionNeed: item.lens.parameters ? 'prescription' : 'non-prescription',
          prescription: item.lens.parameters
            ? {
                left: {
                  SPH: item.lens.parameters.left.SPH,
                  CYL: item.lens.parameters.left.CYL,
                  AXIS: item.lens.parameters.left.AXIS
                },
                right: {
                  SPH: item.lens.parameters.right.SPH,
                  CYL: item.lens.parameters.right.CYL,
                  AXIS: item.lens.parameters.right.AXIS
                },
                PD: item.lens.parameters.PD
              }
            : null
        }
      : undefined
  }))
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
          sku: sku, // Use the same SKU or lens SKU if different
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

      // Transform and return cart items
      const transformedItems = transformBackendCartToItems(response.data.cart)

      return transformedItems
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
  }
}

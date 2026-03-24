import axios from 'axios'

const API_SHIP_URL = 'https://sample-delivery-system.vercel.app/ship-fee'

export const shippingService = {
  getShippingFee: async (province?: string): Promise<number> => {
    try {
      const response = await axios.get(API_SHIP_URL, {
        params: { province: province }
      })
      if (response.data?.success && response.data?.data) {
        return response.data.data.shipFee || 0
      }
      return 20000 // Default if API structure is not as expected
    } catch (error) {
      console.error('Failed to fetch shipping fee:', error)
      return 20000 // Fallback to default shipping fee if API fails
    }
  }
}

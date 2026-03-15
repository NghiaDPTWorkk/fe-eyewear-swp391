import { apiClient } from '@/lib/axios'
import { ENDPOINTS } from '@/api/endpoints'
import type { Prescription } from '@/shared/types/prescription.types'

export const prescriptionService = {
  getPrescriptions: async (): Promise<Prescription[]> => {
    const response = await apiClient.get(ENDPOINTS.PRESCRIPTION.LIST)
    return response.data.data.prescriptions
  },

  addPrescription: async (data: Prescription): Promise<void> => {
    await apiClient.post(ENDPOINTS.PRESCRIPTION.ADD, data)
  },

  updatePrescription: async (id: string, data: Prescription): Promise<void> => {
    await apiClient.patch(ENDPOINTS.PRESCRIPTION.UPDATE(id), data)
  },

  deletePrescription: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.PRESCRIPTION.DELETE(id))
  }
}

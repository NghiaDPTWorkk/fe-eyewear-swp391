import { apiClient } from '@/lib/axios'
import { ENDPOINTS } from '@/api/endpoints'
import type { Prescription } from '@/shared/types/prescription.types'

export const prescriptionService = {
  /**
   * Get all prescriptions for the current customer
   */
  getPrescriptions: async (): Promise<Prescription[]> => {
    const response = await apiClient.get(ENDPOINTS.PRESCRIPTION.LIST)
    return response.data.data.prescriptions
  },

  /**
   * Add a new prescription
   */
  addPrescription: async (data: Prescription): Promise<void> => {
    await apiClient.post(ENDPOINTS.PRESCRIPTION.ADD, data)
  },

  /**
   * Update an existing prescription
   */
  updatePrescription: async (id: string, data: Prescription): Promise<void> => {
    await apiClient.patch(ENDPOINTS.PRESCRIPTION.UPDATE(id), data)
  },

  /**
   * Delete a prescription
   */
  deletePrescription: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.PRESCRIPTION.DELETE(id))
  }
}

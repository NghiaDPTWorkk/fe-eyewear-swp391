import { apiClient } from '@/lib'
import type { AxiosRequestConfig } from 'axios'

export const httpClient = {
  /**
   * Performs a GET request
   * @param url - The endpoint URL
   * @param config - Optional Axios request configuration
   */
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return apiClient.get<T>(url, config).then((res) => res.data)
  },

  /**
   * Performs a POST request
   * @param url - The endpoint URL
   * @param data - The payload to send
   * @param config - Optional Axios request configuration
   */
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return apiClient.post<T>(url, data, config).then((res) => res.data)
  },

  /**
   * Performs a PUT request
   * @param url - The endpoint URL
   * @param data - The payload to update
   * @param config - Optional Axios request configuration
   */
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return apiClient.put<T>(url, data, config).then((res) => res.data)
  },

  /**
   * Performs a PATCH request
   * @param url - The endpoint URL
   * @param data - The payload to update partially
   * @param config - Optional Axios request configuration
   */
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return apiClient.patch<T>(url, data, config).then((res) => res.data)
  },

  /**
   * Performs a DELETE request
   * @param url - The endpoint URL
   * @param config - Optional Axios request configuration
   */
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return apiClient.delete<T>(url, config).then((res) => res.data)
  }
}

import { authEventEmitter } from '@/shared/utils/auth.events'
import { getOrCreateDeviceId } from '@/shared/utils/device.utils'
import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const deviceId = getOrCreateDeviceId()
    const token = localStorage.getItem('access_token')
    config.headers['x-device-id'] = deviceId

    const publicRoutes = ['/auth/login', '/admin/auth/login', '/products']
    const isPublicRoute = publicRoutes.some((route) => config.url?.includes(route))

    if (token && !isPublicRoute) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      authEventEmitter.emit('UNAUTHORIZED')

      localStorage.removeItem('access_token')
    }

    return Promise.reject(error)
  }
)

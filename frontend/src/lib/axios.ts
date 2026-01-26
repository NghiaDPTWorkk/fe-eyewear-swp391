import { authEventEmitter } from '@/api'
import { getOrCreateDeviceId } from '@/utils/device'
import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  // true nếu be dùng Cookie và setup CORS Credentials
  withCredentials: false
})

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const deviceId = getOrCreateDeviceId()
    const token = localStorage.getItem('access_token')
    config.headers['x-device-id'] = deviceId
    // nếu có token và header chưa được set thì mới gán
    const authRoutes = ['/auth/login', '/admin/auth/login']
    const isAuthRequest = authRoutes.some((route) => config.url?.includes(route))

    if (token && !isAuthRequest) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // apiClients xử lý .data
    return response
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      authEventEmitter.emit('UNAUTHORIZED')

      // xóa tránh loop
      localStorage.removeItem('access_token')
    }

    return Promise.reject(error)
  }
)

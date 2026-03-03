import { authEventEmitter } from '@/shared/utils/auth.events'
import { getOrCreateDeviceId } from '@/shared/utils/device.utils'
import { useAuthStore } from '@/store/auth.store'
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig
} from 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean
    _retry?: boolean
  }

  export interface InternalAxiosRequestConfig {
    skipAuth?: boolean
    _retry?: boolean
  }
}

type RefreshTokenResponse = {
  success: boolean
  message: string
  data?: {
    accessToken: string
  }
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payloadPart = token.split('.')[1]
    if (!payloadPart) return null
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

function isTokenExpiredOrNearExpiry(token: string, skewSeconds = 30): boolean {
  const payload = decodeJwtPayload(token)
  const exp = payload?.exp
  if (typeof exp !== 'number') return false
  const now = Math.floor(Date.now() / 1000)
  return exp <= now + skewSeconds
}

let refreshPromise: Promise<string> | null = null

function getRefreshEndpoint(): string {
  const role = useAuthStore.getState().role
  if (
    role &&
    ['SYSTEM_ADMIN', 'SALE_STAFF', 'MANAGER', 'OPERATION_STAFF'].includes(role.toUpperCase())
  ) {
    return '/admin/auth/refresh-token'
  }
  return '/auth/refresh-token'
}

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const deviceId = getOrCreateDeviceId()
    const refreshEndpoint = getRefreshEndpoint()

    // NOTE: Refresh token endpoint PHẢI có withCredentials: true để gửi refreshToken cookie
    const res = await apiClient.post<RefreshTokenResponse>(refreshEndpoint, undefined, {
      headers: {
        'x-device-id': deviceId
      },
      skipAuth: true,
      _retry: true,
      withCredentials: true
    } as AxiosRequestConfig)

    const newToken = res.data?.data?.accessToken
    if (!newToken) {
      throw new Error('Refresh token response missing accessToken')
    }

    // Update both localStorage and zustand store
    localStorage.setItem('access_token', newToken)
    localStorage.setItem('accessToken', newToken)
    useAuthStore.getState().setToken(newToken)
    return newToken
  })()

  try {
    return await refreshPromise
  } finally {
    refreshPromise = null
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.DEV ? '/api/v1' : `${import.meta.env.VITE_API_URL}/api/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const deviceId = getOrCreateDeviceId()
    config.headers['x-device-id'] = deviceId

    const url = config.url || ''

    // Security check: if logging in, clear all old auth data first
    // fix tam thoi nha <3
    if (url.toLowerCase().includes('login')) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('auth-storage')
      // Reset the zustand store state
      useAuthStore.getState().logout()
    }

    let token =
      localStorage.getItem('access_token') ??
      localStorage.getItem('accessToken') ??
      localStorage.getItem('token')

    const publicRoutes = ['/auth/login', '/admin/auth/login', '/products', '/auth/refresh-token']
    const isPublicRoute = publicRoutes.some((route) => url.startsWith(route))

    if (config.skipAuth || isPublicRoute) {
      return config
    }

    if (token) {
      if (isTokenExpiredOrNearExpiry(token)) {
        try {
          token = await refreshAccessToken()
        } catch {
          authEventEmitter.emit('UNAUTHORIZED')
          localStorage.removeItem('access_token')
          // refreshToken is stored in cookie, nothing to remove here
          throw new Error('Session expired')
        }
      }

      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config

    // If 401 and we haven't retried yet, attempt to refresh the token
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.skipAuth
    ) {
      originalRequest._retry = true

      try {
        const newToken = await refreshAccessToken()
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest) // Retry the original request
      } catch {
        // Refresh also failed → session truly expired, force logout
        localStorage.removeItem('access_token')
        localStorage.removeItem('accessToken')
        useAuthStore.getState().logout()
        authEventEmitter.emit('UNAUTHORIZED')
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

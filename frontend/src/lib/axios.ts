import { authEventEmitter } from '@/shared/utils/auth.events'
import { getOrCreateDeviceId } from '@/shared/utils/device.utils'
import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

function decodeJwtPayload(token: string): any | null {
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

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const deviceId = getOrCreateDeviceId()

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/auth/refresh-token`,
      undefined,
      {
        headers: {
          'x-device-id': deviceId
        },
        withCredentials: true
      }
    )

    const newToken = (res.data as any)?.data?.accessToken
    if (!newToken) {
      throw new Error('Refresh token response missing accessToken')
    }

    localStorage.setItem('access_token', newToken)
    return newToken
  })()

  try {
    return await refreshPromise
  } finally {
    refreshPromise = null
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const deviceId = getOrCreateDeviceId()
    let token = localStorage.getItem('access_token')
    config.headers['x-device-id'] = deviceId

    const publicRoutes = ['/auth/login', '/admin/auth/login', '/products', '/auth/refresh-token']
    const isPublicRoute = publicRoutes.some((route) => config.url?.includes(route))

    if (token && !isPublicRoute) {
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

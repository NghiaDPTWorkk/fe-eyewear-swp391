export interface JWTPayload {
  role?: string
  userId?: string
  email?: string
  exp?: number
  iat?: number
  [key: string]: unknown
}

export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.error('Invalid JWT format: token must have 3 parts')
      return null
    }

    const base64Url = parts[1]
    if (!base64Url) {
      console.error('Invalid JWT: missing payload')
      return null
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

export const getRoleFromToken = (token: string): string | null => {
  const payload = decodeJWT(token)
  return payload?.role || null
}

export const getUserIdFromToken = (token: string): string | null => {
  const payload = decodeJWT(token)
  return payload?.userId || null
}

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token)
  if (!payload || typeof payload.exp !== 'number') return false

  return payload.exp * 1000 < Date.now()
}

export const getTokenExpiration = (token: string): Date | null => {
  const payload = decodeJWT(token)
  if (!payload?.exp) return null

  return new Date(payload.exp * 1000)
}

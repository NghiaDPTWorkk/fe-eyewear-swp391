/**
 * JWT Utility Functions
 * Provides functions for decoding and extracting information from JWT tokens
 */

export interface JWTPayload {
  role?: string
  userId?: string
  email?: string
  exp?: number
  iat?: number
  [key: string]: unknown
}

/**
 * Decodes a JWT token and returns the payload
 * @param token - The JWT token string
 * @returns The decoded payload or null if decoding fails
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    // JWT format: header.payload.signature
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

    // Convert base64url to base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

    // Decode base64 to JSON string
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

/**
 * Extracts the role from a JWT token
 * @param token - The JWT token string
 * @returns The role string or null if not found
 */
export const getRoleFromToken = (token: string): string | null => {
  const payload = decodeJWT(token)
  return payload?.role || null
}

/**
 * Extracts the user ID from a JWT token
 * @param token - The JWT token string
 * @returns The user ID string or null if not found
 */
export const getUserIdFromToken = (token: string): string | null => {
  const payload = decodeJWT(token)
  return payload?.userId || null
}

/**
 * Checks if a JWT token is expired
 * @param token - The JWT token string
 * @returns True if the token is expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token)
  if (!payload || typeof payload.exp !== 'number') return false

  // exp is in seconds, Date.now() is in milliseconds
  return payload.exp * 1000 < Date.now()
}

/**
 * Gets the expiration time of a JWT token
 * @param token - The JWT token string
 * @returns The expiration date or null if not found
 */
export const getTokenExpiration = (token: string): Date | null => {
  const payload = decodeJWT(token)
  if (!payload?.exp) return null

  return new Date(payload.exp * 1000)
}

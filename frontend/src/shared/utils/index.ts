export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Export JWT utilities
export * from './jwt.utils'

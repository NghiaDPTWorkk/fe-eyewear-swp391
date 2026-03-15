export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export * from './jwt.utils'
export * from './string.utils'
export * from './style.utils'
export * from './format.utils'

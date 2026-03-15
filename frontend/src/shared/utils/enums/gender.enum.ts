export const Gender = {
  FEMALE: 'F',
  MALE: 'M',
  NON_BINARY: 'N'
} as const
export type Gender = (typeof Gender)[keyof typeof Gender]

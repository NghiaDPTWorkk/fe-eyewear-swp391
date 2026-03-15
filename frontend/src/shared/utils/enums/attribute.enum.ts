// Attribute Enums
export const AttributeShowType = {
  COLOR: 'color',
  TEXT: 'text'
} as const
export type AttributeShowType = (typeof AttributeShowType)[keyof typeof AttributeShowType]

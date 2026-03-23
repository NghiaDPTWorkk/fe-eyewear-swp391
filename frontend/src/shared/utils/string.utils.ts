/**
 * Get initials from a full name.
 * Takes the first character of the first word and the first character of the last word.
 * Example: "Nguyễn Văn E" -> "NE"
 */
export const getInitials = (name: string): string => {
  if (!name || typeof name !== 'string') return '...'
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return 'OP'
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

/**
 * Convert string to title case (e.g. "PRE_ORDER" -> "Pre-order")
 * Handles underscores and common cases like "PRE-ORDER"
 */
export const toTitleCase = (str: string): string => {
  if (!str) return ''
  const s = str.replace(/_/g, ' ')
  if (s.toUpperCase() === 'PRE ORDER' || s.toUpperCase() === 'PRE-ORDER') return 'Pre-order'
  return s
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

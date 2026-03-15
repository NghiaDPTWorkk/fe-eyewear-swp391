export const getInitials = (name: string): string => {
  if (!name || typeof name !== 'string') return '...'
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return 'OP'
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

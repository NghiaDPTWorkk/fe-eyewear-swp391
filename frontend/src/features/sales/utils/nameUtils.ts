/**
 * Removes Vietnamese accents/diacritics from a string.
 */
export const removeAccents = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

/**
 * Gets initials from a full name (e.g., "Đào Thị Út Trinh" -> "DT").
 * Removes accents and takes the first character of the first two words.
 */
export const getInitials = (name: string): string => {
  if (!name) return ''
  const cleanName = removeAccents(name)
  const parts = cleanName.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

/**
 * Formats a number as VND currency
 * Example: 100000 -> "100.000 ₫"
 */
export function formatPrice(price: number | undefined | null): string {
  if (price === undefined || price === null) return '0 ₫'
  return price.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })
}

/**
 * Formats a date string to a readable format
 */
export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

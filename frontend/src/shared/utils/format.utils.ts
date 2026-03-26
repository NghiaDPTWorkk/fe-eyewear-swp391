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
  
  if (typeof date === 'string' && date.includes('/')) {
    // Handle DD/MM/YYYY or HH:mm:ss DD/MM/YYYY
    const parts = date.split(' ')
    const datePart = parts.length > 1 ? parts[1] : parts[0]
    const [day, month, year] = datePart.split('/')
    if (day && month && year) {
      // Reconstruct as YYYY-MM-DD
      const isoDate = `${year}-${month}-${day}`
      const d = new Date(isoDate)
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      }
    }
  }

  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return String(date)
    
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export function formatTime(iso: string) {
  if (!iso) return 'N/A'
  return new Date(iso).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

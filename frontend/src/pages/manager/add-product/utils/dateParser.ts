import { format, addDays } from 'date-fns'

/**
 * Parses a Vietnamese date string into YYYY-MM-DD.
 * Examples:
 * - "ngày 20 tháng 3 năm 2024"
 * - "hôm nay"
 * - "ngày mai"
 * - "tháng 5 ngày 10 2026"
 */
export function parseVietnameseDate(input: string): string | null {
  // 1. Clean the input: remove punctuation and extra spaces
  const text = input
    .toLowerCase()
    .replace(/[.,!?;:-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  console.warn('[DateParser] Cleaned text:', text)

  const today = new Date()
  const currentYear = today.getFullYear()

  // 2. Shortcuts
  if (text.includes('hôm nay')) return format(today, 'yyyy-MM-dd')
  if (text.includes('ngày mai')) return format(addDays(today, 1), 'yyyy-MM-dd')

  // 3. Extract numbers
  const numbers = text.match(/\d+/g)
  console.warn('[DateParser] Numbers found:', numbers)

  if (!numbers || numbers.length < 2) {
    console.warn('[DateParser] Failed: Not enough numbers found')
    return null
  }

  let day = 0
  let month = 0
  let year = currentYear

  // Pattern: "ngày 20 tháng 4"
  // Using \s* to be flexible with spaces (STT outputs can vary)
  const dMatch = text.match(/ngày\s*(\d+)/)
  const mMatch = text.match(/tháng\s*(\d+)/)
  const yMatch = text.match(/năm\s*(\d{4})/)

  if (dMatch) {
    day = parseInt(dMatch[1])
  } else {
    day = parseInt(numbers[0])
  }

  if (mMatch) {
    const mStr = mMatch[1]
    month = parseInt(mStr)
    // Handle transcription artifacts like "tháng 4 5" or "tháng 45"
    if (month > 12 && mStr.length > 1) {
      month = parseInt(mStr[0])
    }
  } else {
    // Fallback: use second set of numbers as month
    month = parseInt(numbers[1])
  }

  if (yMatch) {
    year = parseInt(yMatch[1])
  } else {
    // Look for any 4-digit number starting with 20 that could be a year
    const potentialYear = numbers.find((n) => n.length === 4 && n.startsWith('20'))
    if (potentialYear) year = parseInt(potentialYear)
  }

  console.warn(`[DateParser] Candidate: Day=${day}, Month=${month}, Year=${year}`)

  // 4. Validation
  if (day > 0 && day <= 31 && month > 0 && month <= 12) {
    try {
      const date = new Date(year, month - 1, day)
      if (!isNaN(date.getTime())) {
        const result = format(date, 'yyyy-MM-dd')
        console.warn('[DateParser] Success:', result)
        return result
      }
    } catch (e) {
      console.error('[DateParser] Error creating date:', e)
      return null
    }
  }

  console.warn('[DateParser] Failed: Day or Month out of range')
  return null
}

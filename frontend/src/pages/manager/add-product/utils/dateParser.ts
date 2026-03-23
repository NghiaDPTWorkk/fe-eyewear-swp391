function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function parseVietnameseDate(input: string): string | null {
  const text = input
    .toLowerCase()
    .replace(/[.,!?;:-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  console.warn('[DateParser] Cleaned text:', text)

  const today = new Date()
  const currentYear = today.getFullYear()

  if (text.includes('hôm nay')) return formatDate(today)
  if (text.includes('ngày mai')) return formatDate(addDays(today, 1))

  const numbers = text.match(/\d+/g)
  console.warn('[DateParser] Numbers found:', numbers)

  if (!numbers || numbers.length < 2) {
    console.warn('[DateParser] Failed: Not enough numbers found')
    return null
  }

  let day = 0
  let month = 0
  let year = currentYear

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

    if (month > 12 && mStr.length > 1) {
      month = parseInt(mStr[0])
    }
  } else {
    month = parseInt(numbers[1])
  }

  if (yMatch) {
    year = parseInt(yMatch[1])
  } else {
    const potentialYear = numbers.find((n) => n.length === 4 && n.startsWith('20'))
    if (potentialYear) year = parseInt(potentialYear)
  }

  console.warn(`[DateParser] Candidate: Day=${day}, Month=${month}, Year=${year}`)

  if (day > 0 && day <= 31 && month > 0 && month <= 12) {
    try {
      const date = new Date(year, month - 1, day)
      if (!isNaN(date.getTime())) {
        const result = formatDate(date)
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

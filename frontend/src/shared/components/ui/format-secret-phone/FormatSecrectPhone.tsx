interface FormatSecretPhoneProps {
  phone?: string
}

export default function FormatSecretPhone({ phone }: FormatSecretPhoneProps) {
  const formatPhone = (phoneStr?: string): string => {
    if (!phoneStr) return '—'

    let cleaned = phoneStr.replace(/\D/g, '')
    if (!cleaned) return '—'

    if (cleaned.startsWith('0')) {
      cleaned = '84' + cleaned.substring(1)
    }

    const fullPhone = '+' + cleaned

    if (fullPhone.length < 8) return fullPhone

    const countryCode = fullPhone.substring(0, 3)
    const prefix = fullPhone.substring(3, 6)
    const lastTwo = fullPhone.slice(-2)
    const maskLen = fullPhone.length - 8
    const mask = 'x'.repeat(maskLen > 0 ? maskLen : 0)

    return `${countryCode} ${prefix} ${mask} ${lastTwo}`
  }

  return <span>{formatPhone(phone)}</span>
}

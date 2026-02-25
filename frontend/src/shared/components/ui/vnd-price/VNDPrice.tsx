interface VNDPriceProps {
  amount: number
  className?: string
}

/**
 * Renders a price in VND with a styled ₫ symbol.
 * The ₫ is rendered smaller (0.75em) with slight opacity for a premium look.
 *
 * Usage: <VNDPrice amount={1500000} />
 * Result: 1.500.000 ₫
 */
export function VNDPrice({ amount, className }: VNDPriceProps) {
  const formatted = amount.toLocaleString('vi-VN')
  return (
    <span className={className}>
      {formatted}
      <span style={{ fontSize: '0.75em', marginLeft: '2px', opacity: 0.7 }}>₫</span>
    </span>
  )
}

interface VNDPriceProps {
  amount: number
  className?: string
}

export function VNDPrice({ amount, className }: VNDPriceProps) {
  const formatted = amount.toLocaleString('vi-VN')
  return (
    <span className={className}>
      {formatted}
      <span style={{ fontSize: '0.75em', marginLeft: '2px', opacity: 0.7 }}>₫</span>
    </span>
  )
}

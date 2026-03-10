export default function InvoiceInformationItem({ label, value }: { label: string; value: any }) {
  return (
    <p className="text-sm text-gray-600">
      {label}: <span className="font-semibold text-gray-900">{value}</span>
    </p>
  )
}

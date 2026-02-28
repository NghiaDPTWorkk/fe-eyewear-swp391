interface ScanInvoiceCodeProps {
  value: string
  expectedInvoiceId: string
  onChange: (value: string) => void
  onConfirm: () => void
  isConfirmed: boolean
}

export default function ScanInvoiceCode({
  value,
  expectedInvoiceId,
  onChange,
  onConfirm,
  isConfirmed
}: ScanInvoiceCodeProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        Scan Invoice ID
      </h2>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Invoice ID</label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Scan or enter invoice ID..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Expected: {expectedInvoiceId}</p>
        </div>

        <button
          onClick={onConfirm}
          disabled={!value}
          className={`w-full px-6 py-3 rounded-lg font-medium transition-all ${
            isConfirmed
              ? 'bg-mint-100 text-mint-700 border-2 border-mint-200 cursor-default'
              : value
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isConfirmed ? '✓ Invoice Confirmed' : 'Confirm Invoice'}
        </button>
      </div>
    </div>
  )
}

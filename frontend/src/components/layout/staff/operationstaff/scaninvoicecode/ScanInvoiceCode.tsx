interface ScanInvoiceCodeProps {
  invoiceCode: string
}

export default function ScanInvoiceCode({ invoiceCode }: ScanInvoiceCodeProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        Invoice ID
      </h2>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Invoice</label>
          <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 font-mono font-medium">
            {invoiceCode}
          </div>
          <p className="text-xs text-mint-600 mt-2 font-medium"> Ready for shipping process</p>
        </div>
      </div>
    </div>
  )
}

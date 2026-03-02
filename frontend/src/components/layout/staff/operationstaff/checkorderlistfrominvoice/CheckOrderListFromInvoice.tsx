import InvoiceInformationItem from './InvoiceInformationItem'

interface CheckOrderListFromInvoiceProps {
  invoiceCode: string
  fullName: string
  orderCount: number
}

export default function CheckOrderListFromInvoice({
  invoiceCode,
  fullName,
  orderCount
}: CheckOrderListFromInvoiceProps) {
  return (
    <div className="mb-4 pb-4 border-b border-gray-200">
      <InvoiceInformationItem label="Invoice" value={invoiceCode} />
      <InvoiceInformationItem label="Customer" value={fullName} />
      <InvoiceInformationItem label="Orders" value={orderCount} />
    </div>
  )
}


import { Link } from 'react-router-dom'

export const OrderPaymentPolicyPage = () => {
  return (
    <div className="min-h-screen bg-mint-200">
      {/* Hero Banner */}
      <div className="bg-mint-1200 py-14 text-center">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">
          ORDER &amp; PAYMENT POLICY
        </h1>
        <nav className="text-mint-300 text-sm">
          <Link to="/" className="hover:text-primary-400 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">Order &amp; Payment Policy</span>
        </nav>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <ul className="text-gray-600 space-y-4 ml-1">
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-1">–</span>
              <span>Customers are allowed to purchase lenses separately.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-1">–</span>
              <span>
                Manufacturing orders must be paid in advance using the online payment methods
                available in the system.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-1">–</span>
              <span>Pre-order products may require longer processing times.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-1">–</span>
              <span>Vouchers that have been used will not be refunded.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-1">–</span>
              <span>Only vouchers that the customer is eligible to use will be displayed.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-1">–</span>
              <span>
                Technical specifications for custom-manufactured glasses must be accurate.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-1">–</span>
              <span>
                System staff will contact customers to confirm processing specifications for
                manufacturing orders.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-1">–</span>
              <span>
                Orders can only be cancelled before processing has begun (i.e., before the order is
                onboarded by staff).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-1">–</span>
              <span>Each item is limited to a maximum quantity per order.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-1">–</span>
              <span>
                If an order is pending payment and the customer does not complete the payment within
                the time limit set by the system, the order will be automatically cancelled.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-1">–</span>
              <span>
                You can chat with our AI assistant for additional information and product
                suggestions; however, the AI does not make decisions for you — all final decisions
                are yours to make.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

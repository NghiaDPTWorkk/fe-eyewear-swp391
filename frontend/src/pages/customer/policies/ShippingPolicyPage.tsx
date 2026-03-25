import { Link } from 'react-router-dom'

export const ShippingPolicyPage = () => {
  return (
    <div className="min-h-screen bg-mint-200">
      {/* Hero Banner */}
      <div className="bg-mint-1200 py-14 text-center">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">
          SHIPPING &amp; INSPECTION POLICY
        </h1>
        <nav className="text-mint-300 text-sm">
          <Link to="/" className="hover:text-primary-400 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">Shipping &amp; Inspection Policy</span>
        </nav>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 space-y-10">
          {/* Shipping */}
          <section>
            <h2 className="text-xl font-bold text-mint-1200 mb-4">
              Shipping Coverage &amp; Delivery Time
            </h2>
            <ul className="text-gray-600 space-y-3 ml-1">
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>
                  <strong>Within Ho Chi Minh City (inner &amp; outer districts):</strong> Customers
                  will receive their orders within 1–2 days.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>
                  <strong>Note:</strong> Shipping fees will be communicated to the customer by
                  OpticView Eyewear on a case-by-case basis prior to delivery.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>
                  <strong>Other provinces and cities nationwide:</strong>
                </span>
              </li>
              <li className="ml-6 flex items-start gap-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>
                  Major cities: Delivery typically takes 1–3 days after OpticView dispatches the
                  order.
                </span>
              </li>
              <li className="ml-6 flex items-start gap-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>
                  Remote provinces, districts, and communes: Delivery may take 5–7 days or longer
                  depending on the shipping carrier.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>
                  Delivery times may vary based on the shipping address and logistics conditions. We
                  will make every effort to deliver your products as quickly as possible and provide
                  estimated delivery times when you place your order.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>
                  The logistics provider is responsible for providing proof of delivery (photographs
                  and recipient signature) to both the buyer and the seller upon request.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>
                  <strong>Important:</strong> If you have not received your order within 7 days,
                  please contact OpticView hotline:{' '}
                  <a href="tel:0972607322" className="text-primary-500 hover:underline font-medium">
                    0972 607 322
                  </a>{' '}
                  for prompt assistance.
                </span>
              </li>
            </ul>
          </section>

          {/* System Inspection */}
          <section>
            <h2 className="text-xl font-bold text-mint-1200 mb-4">
              Product Inspection by OpticView
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All products undergo thorough inspection before being delivered to customers. We are
              committed to providing quality products that match the descriptions at the time of
              delivery.
            </p>
          </section>

          {/* Receiving Inspection */}
          <section>
            <h2 className="text-xl font-bold text-mint-1200 mb-4">Inspection Upon Receiving</h2>
            <ul className="text-gray-600 space-y-3 ml-1">
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>
                  Upon receiving the product, please inspect it thoroughly before signing for
                  delivery.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>
                  If there are any quality issues, please notify OpticView Eyewear immediately via
                  hotline:{' '}
                  <a href="tel:0972607322" className="text-primary-500 hover:underline font-medium">
                    0972 607 322
                  </a>{' '}
                  so we can assist you with an exchange or return as per our policy.
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

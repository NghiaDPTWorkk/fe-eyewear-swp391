import CustomerHeader from '@/components/layout/customer/header/CustomerHeader'
import { Footer } from '@/components/layout/customer/homepage/components'
import { Link } from 'react-router-dom'

export const ReturnWarrantyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-mint-200">
      <CustomerHeader />

      {/* Hero Banner */}
      <div className="bg-mint-1200 py-14 text-center">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">
          RETURN/EXCHANGE &amp; WARRANTY POLICY
        </h1>
        <nav className="text-mint-300 text-sm">
          <Link to="/" className="hover:text-primary-400 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">Return &amp; Warranty Policy</span>
        </nav>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 space-y-10">
          {/* Eligible Cases */}
          <section>
            <h2 className="text-xl font-bold text-mint-1200 mb-4">
              Eligible Return/Exchange Cases
            </h2>
            <p className="text-gray-600 mb-3 leading-relaxed">
              We accept returns and exchanges in the following cases:
            </p>
            <ul className="text-gray-600 space-y-3 ml-1">
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>The product does not match the description on our website.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>The product is damaged or has defects from the manufacturer.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>
                  Free vision adjustment support within 3 days if the new prescription causes
                  discomfort (dizziness, headaches, imbalance, etc.).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>
                  50% discount (up to 500,000 VND) on a new replacement frame if your glasses break
                  within 3 days.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>
                  100% free replacement if your glasses develop a cracked rim within 3 days.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>
                  Free cleaning, nose pad replacement, and screw replacement for the lifetime of use
                  at any OpticView store.
                </span>
              </li>
            </ul>
          </section>

          {/* Return Order Conditions */}
          <section>
            <h2 className="text-xl font-bold text-mint-1200 mb-4">Return Order Conditions</h2>
            <ul className="text-gray-600 space-y-3 ml-1">
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>
                  Orders may be returned after delivery if the product is damaged, does not match
                  the order placed, or does not maintain its original condition prior to shipping.
                  Supporting photo evidence is required, and the return must be initiated within{' '}
                  <strong>3 days</strong> of the system's allowed return period.
                </span>
              </li>
            </ul>
          </section>

          {/* Non-eligible Cases */}
          <section>
            <h2 className="text-xl font-bold text-mint-1200 mb-4">Non-Eligible Return Cases</h2>
            <ul className="text-gray-600 space-y-3 ml-1">
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>
                  Returns will <strong>not</strong> be processed for the following reasons: no
                  longer needed, no longer like the color, prefer a different pair, etc.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>
                  Due to the effects of lighting and display settings, actual product colors may not
                  be 100% identical to the images shown.
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}

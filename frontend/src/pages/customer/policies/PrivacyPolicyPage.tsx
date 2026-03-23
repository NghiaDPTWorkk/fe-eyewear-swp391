import CustomerHeader from '@/components/layout/customer/header/CustomerHeader'
import { Footer } from '@/components/layout/customer/homepage/components'
import { Link } from 'react-router-dom'

export const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-mint-200">
      <CustomerHeader />

      {/* Hero Banner */}
      <div className="bg-mint-1200 py-14 text-center">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">
          PRIVACY POLICY
        </h1>
        <nav className="text-mint-300 text-sm">
          <Link to="/" className="hover:text-primary-400 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">Privacy Policy</span>
        </nav>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 space-y-10">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-mint-1200 mb-4">
              1. Purpose of Collecting Personal Information
            </h2>
            <p className="text-gray-600 mb-3 leading-relaxed">
              The purpose of collecting customer information is related to the following matters:
            </p>
            <ul className="text-gray-600 space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>
                  <strong>Customer support:</strong> purchasing, payment, and delivery assistance.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>
                  Providing product information, services, and support as requested by the customer.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>Sending notifications about our latest promotions and new products.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>Resolving issues arising during the purchasing process.</span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-mint-1200 mb-4">
              2. Scope of Information Collection
            </h2>
            <p className="text-gray-600 mb-3 leading-relaxed">
              We collect personal information from customers when placing orders on our website:
            </p>
            <ul className="text-gray-600 space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>Full name</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>Email address</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>Phone number</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">–</span>
                <span>Delivery address</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-mint-1200 mb-4">
              3. Information Retention Period
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Members' personal data will be stored until a cancellation request is made, or until
              the member logs in and cancels their account. In all other cases, personal information
              will be securely stored on the servers of{' '}
              <a
                href="https://eyewear-optic.shop/"
                className="text-primary-500 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://eyewear-optic.shop/
              </a>
              .
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}

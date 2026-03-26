import { Link } from 'react-router-dom'
import { Phone, MapPin } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-mint-1200 text-mint-300">
      {/* Top Section: Hotline & Support */}
      <div className="border-b border-mint-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <div className="text-center md:text-left">
                <span className="text-mint-300 text-xs font-semibold uppercase tracking-wider block mb-1">
                  Hotline
                </span>
                <a
                  href="tel:0972607322"
                  className="text-white text-2xl font-bold hover:text-primary-400 transition-colors"
                >
                  0972 607 322
                </a>
                <span className="text-mint-300 text-xs ml-2">(9:00 – 22:00)</span>
              </div>
            </div>

            <div className="text-center md:text-right">
              <h3 className="text-white font-bold mb-1">Feedback & Support</h3>
              <p className="text-mint-300 text-xs max-w-xs md:max-w-md">
                We always cherish and look forward to receiving all comments from customers to
                continuously improve our service quality.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Columns */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-white text-base">About Our Store</h4>
            <p className="text-mint-300 text-sm leading-relaxed">
              We specialize in providing high-quality eyeglasses and frames with affordable prices
              and competitive advantages. OpticView Eyewear always strives to provide the best
              experience for all customers.
            </p>
            <p className="text-white text-xs font-black uppercase tracking-widest border-l-2 border-primary-500 pl-3">
              OPTICVIEW EYEWEAR
            </p>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-white text-base">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/policies/privacy"
                  className="text-mint-300 text-sm hover:text-primary-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-mint-900" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/policies/shipping"
                  className="text-mint-300 text-sm hover:text-primary-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-mint-900" />
                  Shipping &amp; Inspection
                </Link>
              </li>
              <li>
                <Link
                  to="/policies/order-payment"
                  className="text-mint-300 text-sm hover:text-primary-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-mint-900" />
                  Order &amp; Payment
                </Link>
              </li>
              <li>
                <Link
                  to="/policies/return-warranty"
                  className="text-mint-300 text-sm hover:text-primary-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-mint-900" />
                  Return &amp; Warranty
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-white text-base">Store Location</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <span className="text-mint-300 text-sm">Ho Chi Minh City, Vietnam</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <a
                  href="tel:0972607322"
                  className="text-mint-300 text-sm hover:text-primary-400 transition-colors"
                >
                  0972 607 322
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-mint-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left space-y-1">
              <p className="text-mint-300 text-sm">
                © {new Date().getFullYear()} OpticView Eyewear. All rights reserved.
              </p>
              <p className="text-mint-900 text-[10px] uppercase font-bold tracking-tighter">
                Premium Eye Care Experience
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-mint-900 text-[10px] font-bold uppercase mr-2 group-hover:text-mint-300 transition-colors">
                Secure Payment:
              </span>
              <div className="flex gap-2">
                {['VNPAY', 'PayOS', 'COD'].map((method) => (
                  <div
                    key={method}
                    className="px-3 py-1 bg-white/5 border border-mint-1100 rounded text-white text-[10px] font-bold"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

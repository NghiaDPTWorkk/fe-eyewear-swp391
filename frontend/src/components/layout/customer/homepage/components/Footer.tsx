import { Link } from 'react-router-dom'
import { Phone, MapPin } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-[#052e25] text-[#b5ccc7]">
      {/* Top Section: Hotline & Support */}
      <div className="border-b border-[#1a443b]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8ba39e] block">
                Hotline
              </span>
              <div className="flex items-baseline gap-3">
                <a
                  href="tel:0972607322"
                  className="text-white text-3xl font-bold tracking-tight hover:text-primary-400 transition-colors"
                >
                  0972 607 322
                </a>
                <span className="text-[#5e7a74] text-xs font-normal">(9:00 – 22:00)</span>
              </div>
            </div>

            <div className="text-left md:text-right max-w-xl">
              <h3 className="text-white font-bold text-lg mb-2 tracking-tight">
                Feedback & Support
              </h3>
              <p className="text-[#8ba39e] text-xs leading-relaxed font-normal">
                We always cherish and look forward to receiving all comments from customers to
                continuously improve our service quality.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Columns */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* About */}
          <div className="md:col-span-5 space-y-4">
            <h4 className="font-heading font-bold text-white text-lg uppercase tracking-wider">
              About Our Store
            </h4>
            <p className="text-[#8ba39e] text-sm leading-7 font-normal">
              We specialize in providing high-quality eyeglasses and frames with affordable prices
              and competitive advantages. OpticView Eyewear always strives to provide the best
              experience for all customers.
            </p>
            <div className="flex items-center gap-4 py-2">
              <div className="h-6 w-[2px] bg-primary-500" />
              <p className="text-white text-xs font-bold uppercase tracking-[0.3em]">
                OPTICVIEW EYEWEAR
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-heading font-bold text-white text-lg uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Privacy Policy', to: '/policies/privacy' },
                { label: 'Shipping & Inspection', to: '/policies/shipping' },
                { label: 'Order & Payment', to: '/policies/order-payment' },
                { label: 'Return & Warranty', to: '/policies/return-warranty' }
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[#8ba39e] text-sm hover:text-white transition-colors flex items-center gap-3 font-normal group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#1a443b] group-hover:bg-primary-500 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Location */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-heading font-bold text-white text-lg uppercase tracking-wider">
              Store Location
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-[#0a3d33] flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/10 transition-colors">
                  <MapPin className="w-5 h-5 text-primary-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-[#5e7a74] uppercase tracking-wider">
                    Address
                  </span>
                  <span className="text-[#8ba39e] text-sm font-normal">
                    Ho Chi Minh City, Vietnam
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-[#0a3d33] flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/10 transition-colors">
                  <Phone className="w-5 h-5 text-primary-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-[#5e7a74] uppercase tracking-wider">
                    Contact
                  </span>
                  <a
                    href="tel:0972607322"
                    className="text-[#8ba39e] text-sm font-normal hover:text-white transition-colors"
                  >
                    0972 607 322
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-[#1a443b]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left space-y-2">
              <p className="text-[#8ba39e] text-xs font-normal">
                © {new Date().getFullYear()} OpticView Eyewear. All rights reserved.
              </p>
              <p className="text-[#5e7a74] text-[9px] uppercase font-bold tracking-[0.2em]">
                Premium Eye Care Experience
              </p>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-[#5e7a74] text-[10px] font-bold uppercase tracking-widest">
                Secure Payment:
              </span>
              <div className="flex gap-3">
                {['VNPAY', 'PayOS', 'COD'].map((method) => (
                  <div
                    key={method}
                    className="px-4 py-1.5 bg-white rounded-lg text-[#052e25] text-[10px] font-bold tracking-widest shadow-sm hover:translate-y-[-2px] transition-transform cursor-default"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 
        PREVIOUS FOOTER CODE - COMMENTED OUT FOR REFERENCE
        
        <footer className="bg-mint-1200 text-mint-300">
          <div className="border-b border-mint-900">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                ...
              </div>
            </div>
          </div>
          ...
        </footer>
      */}
    </footer>
  )
}

import { Link } from 'react-router-dom'
import {
  Phone,
  MapPin,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  ArrowRight,
  ShieldCheck
} from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-[#042f26] text-[#b5ccc7] pt-20 pb-10 overflow-hidden relative">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Brand & About Column */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="inline-block group">
              <h2 className="text-3xl font-heading font-black text-white tracking-tighter group-hover:text-primary-400 transition-colors">
                EYEWEAR<span className="text-primary-500">.</span>
              </h2>
            </Link>
            <p className="text-[#8ba39e] text-base leading-relaxed max-w-sm">
              Elevating your vision with premium craftsmanship and modern lens technology. Discover
              a world of clarity and style tailored just for you.
            </p>
            <div className="flex items-center gap-4">
              {[
                { Icon: Instagram, href: '#' },
                { Icon: Facebook, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Youtube, href: '#' }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-full border border-[#1a443b] flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 hover:text-[#042f26] transition-all duration-300 transform hover:-translate-y-1"
                >
                  <social.Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-10">
            <div className="space-y-6">
              <h4 className="text-white font-bold text-lg uppercase tracking-widest">Shop</h4>
              <ul className="space-y-4">
                {[
                  { label: 'Eyeglasses', to: '/eyeglasses' },
                  { label: 'Sunglasses', to: '/sunglasses' },
                  { label: 'Lenses', to: '/lenses' },
                  { label: 'New Arrivals', to: '/products' }
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-[#8ba39e] hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-white font-bold text-lg uppercase tracking-widest">Assistance</h4>
              <ul className="space-y-4">
                {[
                  { label: 'Privacy Policy', to: '/policies/privacy' },
                  { label: 'Shipping & Delivery', to: '/policies/shipping' },
                  { label: 'Returns & Refunds', to: '/policies/return-warranty' },
                  { label: 'Payment Methods', to: '/policies/order-payment' }
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-[#8ba39e] hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact & Newsletter Column */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-[#0a3d33] p-8 rounded-3xl border border-[#1a443b] space-y-6">
              <h4 className="text-white font-bold text-lg">Contact Us</h4>
              <div className="space-y-4">
                <a
                  href="tel:0972607322"
                  className="flex items-center gap-4 group text-[#8ba39e] hover:text-primary-400 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#13493e] flex items-center justify-center group-hover:bg-primary-500/20">
                    <Phone className="w-5 h-5 text-primary-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[#5e7a74]">Call us</span>
                    <span className="font-bold">0972 607 322</span>
                  </div>
                </a>
                <div className="flex items-center gap-4 group text-[#8ba39e]">
                  <div className="w-10 h-10 rounded-xl bg-[#13493e] flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[#5e7a74]">Visit us</span>
                    <span className="text-sm">HCM City, Vietnam</span>
                  </div>
                </div>
                <a
                  href="mailto:support@opticview.com"
                  className="flex items-center gap-4 group text-[#8ba39e] hover:text-primary-400 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#13493e] flex items-center justify-center group-hover:bg-primary-500/20">
                    <Mail className="w-5 h-5 text-primary-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[#5e7a74]">Email us</span>
                    <span className="text-sm">support@eyewear.com</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Divider */}
        <div className="h-px w-full bg-[#1a443b] mb-10" />

        {/* Footer Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
            <p className="text-sm text-[#5e7a74]">
              © {new Date().getFullYear()} OpticView Eyewear. Crafting Better Vision.
            </p>
            <div className="flex items-center gap-2 text-[#5e7a74]">
              <ShieldCheck className="w-4 h-4 text-primary-500" />
              <span className="text-[10px] uppercase font-black tracking-widest">
                Certified Premium Eye Care
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex gap-3">
              {['VNPAY', 'PayOS', 'COD'].map((method) => (
                <div
                  key={method}
                  className="px-4 py-1.5 bg-[#0a3d33] border border-[#1a443b] rounded-lg text-white text-[10px] font-black tracking-widest opacity-60 hover:opacity-100 transition-opacity"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 
        OLD FOOTER CODE - COMMENTED OUT FOR REFERENCE AS REQUESTED
        
        <footer className="bg-mint-1200 text-mint-300">
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

          <div className="container mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
                  ...
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-heading font-bold text-white text-base">Store Location</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span className="text-mint-300 text-sm">Ho Chi Minh City, Vietnam</span>
                  </li>
                  ...
                </ul>
              </div>
            </div>
          </div>
          ...
        </footer>
      */}
    </footer>
  )
}

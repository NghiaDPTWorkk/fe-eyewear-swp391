import { useState } from 'react'
import {
  IoMailOutline,
  IoCallOutline,
  IoChatbubblesOutline,
  IoChevronDownOutline,
  IoChevronUpOutline
} from 'react-icons/io5'
import ContactSupportTeam from '@/shared/components/ui/contact-support-team'
import { Container } from '@/components'
import { BreadcrumbPath } from '@/components/layout/staff/operation-staff/breadcrumb-path'

export default function StaffSupportPage() {
  return (
    <Container>
      <div className="mb-8">
        <BreadcrumbPath paths={['Dashboard', 'Supports']} />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Staff Support Center</h1>
        <p className="text-gray-500 mt-1">
          Get help with technical issues or operational questions.
        </p>
      </div>

      <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-2 space-y-6">
          <ContactSupportTeam />

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <FAQItem
                question="How do I process a refund for a customer?"
                answer="Go to the Orders page, select the specific order, and click the 'Process Refund' button in the Actions menu. Approval may be required for amounts over $500."
              />
              <FAQItem
                question="Why is the label printer not connecting?"
                answer="Ensure the printer is on the same Wi-Fi network as your terminal. Check settings under 'Devices' or restart the printer."
              />
              <FAQItem
                question="Can I edit an order after it has been shipped?"
                answer="No, once an order status is 'Shipped', it cannot be modified. You will need to create a return request if corrections are needed."
              />
            </div>
          </div>
        </div>

        {/* Right Column: Contact Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-emerald-600/20 shadow-[0_4px_20px_-10px_rgba(16,185,129,0.1)]">
            <h3 className="font-bold text-lg text-emerald-700 mb-6 tracking-tight">
              Quick Contacts
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center text-gray-600 transition-transform group-hover:scale-105 group-hover:shadow-md group-hover:border-emerald-100 group-hover:text-emerald-600">
                  <IoCallOutline className="text-xl" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-0.5">
                    IT Hotline
                  </div>
                  <div className="text-emerald-800 font-semibold text-lg hover:text-emerald-600 transition-colors cursor-pointer">
                    1-800-OPTIC-IT
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center text-gray-600 transition-transform group-hover:scale-105 group-hover:shadow-md group-hover:border-emerald-100 group-hover:text-emerald-600">
                  <IoMailOutline className="text-xl" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-0.5">
                    Email Support
                  </div>
                  <div className="text-emerald-800 font-medium hover:text-emerald-600 transition-colors cursor-pointer">
                    support@opticview.com
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center text-gray-600 transition-transform group-hover:scale-105 group-hover:shadow-md group-hover:border-emerald-100 group-hover:text-emerald-600">
                  <IoChatbubblesOutline className="text-xl" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-0.5">
                    Live Chat
                  </div>
                  <div className="text-emerald-800 font-medium">Available 8am - 6pm</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">System Status</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-sm font-medium text-emerald-700">All Systems Operational</span>
            </div>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Version</span>
                <span>v2.5.4</span>
              </div>
              <div className="flex justify-between">
                <span>Last Update</span>
                <span>Oct 24, 2023</span>
              </div>
              <div className="flex justify-between">
                <span>Server</span>
                <span>US-East-1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium text-gray-800">{question}</span>
        {isOpen ? (
          <IoChevronUpOutline className="text-gray-500" />
        ) : (
          <IoChevronDownOutline className="text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-white text-sm text-gray-600 border-t border-gray-100">{answer}</div>
      )}
    </div>
  )
}

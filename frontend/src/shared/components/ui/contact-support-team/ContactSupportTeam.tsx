import { Input } from '../input'
import { Button } from '../button'
import { IoChevronDownOutline } from 'react-icons/io5'

export default function ContactSupportTeam() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Contact Support Team</h2>
        <p className="text-sm text-gray-500">For urgent issues, please call the hotline.</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Department</label>
            <div className="relative">
              <select className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 appearance-none">
                <option>Technical Support</option>
                <option>Order Logistics</option>
                <option>Account Issues</option>
              </select>
              <IoChevronDownOutline className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Priority</label>
            <div className="relative">
              <select className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 appearance-none">
                <option>Normal</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
              <IoChevronDownOutline className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">Subject</label>
          <Input
            placeholder="Brief description of the issue"
            className="bg-white border-gray-200 focus:border-primary-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">Message</label>
          <textarea
            rows={5}
            className="w-full p-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
            placeholder="Describe your issue in detail..."
          ></textarea>
        </div>

        <div className="pt-2 flex justify-end">
          <Button colorScheme="primary" className="px-6">
            Send Request
          </Button>
        </div>
      </div>
    </div>
  )
}

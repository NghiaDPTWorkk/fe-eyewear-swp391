/**
 * CourierInfoCard Component
 * Displays courier information and contact options
 */
import { Card, Button } from '@/components'
import { IoCall, IoChatbubble, IoInformationCircle, IoAirplaneOutline } from 'react-icons/io5'

export default function LiveMapCourierInfoCard() {
  return (
    <Card className="p-6 rounded-2xl shadow-xl border-0 bg-white/95 backdrop-blur-sm flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
          Courier Information
        </h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-mint-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md text-mint-500">
            <IoAirplaneOutline size={28} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900">OpticView Global</h4>
            <div className="flex gap-1 text-xs text-mint-600 font-bold bg-mint-50 px-2 py-0.5 rounded-full w-fit">
              <IoInformationCircle size={14} /> Priority Line
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Service</span>
            <span className="font-medium text-gray-900">Express Worldwide</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Weight</span>
            <span className="font-medium text-gray-900">0.5 kg</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Pieces</span>
            <span className="font-medium text-gray-900">1</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button variant="outline" className="flex-1 border-mint-200 text-mint-600 hover:bg-mint-50">
          <IoChatbubble className="mr-2" /> Message
        </Button>
        <Button className="flex-1 bg-mint-500 hover:bg-mint-600 text-white border-0">
          <IoCall className="mr-2" /> Call
        </Button>
      </div>
    </Card>
  )
}

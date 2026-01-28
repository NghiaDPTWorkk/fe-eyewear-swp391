import { useState } from 'react'
import {
  IoArrowBack,
  IoInformationCircleOutline,
  IoCheckmark,
  IoClose,
  IoAlertCircleOutline,
  IoAdd,
  IoRemove,
  IoRefresh,
  IoEyeOutline,
  IoCalendarOutline,
  IoPersonOutline,
  IoMailOutline,
  IoGlassesOutline,
  IoConstructOutline,
  IoCallOutline,
  IoChatbubblesOutline,
  IoSend,
  IoMicOutline,
  IoVideocamOutline,
  IoEllipsisHorizontal
} from 'react-icons/io5'
import { Card, Button, Input } from '@/components'

interface PrescriptionVerificationProps {
  orderId: string
  onBack: () => void
}

export default function PrescriptionVerification({
  orderId,
  onBack
}: PrescriptionVerificationProps) {
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(100)

  // Mock data to match screenshot
  const orderData = {
    id: orderId || 'RX-1234',
    customer: 'John Smith',
    email: 'john.smith@email.com',
    submitted: '2026-01-15 10:30 AM',
    product: 'Blue Light Blocking Glasses'
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="group p-2.5 bg-white border border-gray-200/60 hover:border-emerald-200 hover:bg-emerald-50/30 rounded-xl shadow-sm hover:shadow hover:scale-105 transition-all duration-200 mr-2 flex items-center justify-center"
          >
            <IoArrowBack
              size={22}
              className="text-gray-400 group-hover:text-emerald-600 transition-colors duration-200"
            />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Rx Verification</h1>
            <p className="text-gray-500 text-sm font-normal">
              Verify prescription details before sending to lab
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 font-semibold rounded-full text-xs border border-emerald-100 uppercase tracking-wide">
            In Verification
          </span>
          <div className="h-6 w-px bg-gray-200"></div>
          <div className="px-4 py-1.5 bg-orange-50 text-orange-600 font-semibold rounded-full text-sm border border-orange-100">
            24 Pending
          </div>
        </div>
      </div>

      {/* Pending Queue */}
      <Card className="p-6 border border-neutral-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
          Pending Queue
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
          {/* Active Item */}
          <div className="min-w-[200px] p-3 rounded-xl border border-emerald-500 bg-emerald-50/20 cursor-pointer shadow-sm relative group">
            <div className="absolute top-3 right-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <IoCheckmark />
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 ring-2 ring-emerald-100" />
              <div>
                <div className="font-semibold text-emerald-900 text-sm">{orderData.id}</div>
                <div className="text-xs text-emerald-600 font-medium mt-0.5">
                  {orderData.customer}
                </div>
                <div className="text-[10px] text-emerald-600/70 mt-1 font-mono">
                  Submitted: 10:30 AM
                </div>
              </div>
            </div>
          </div>

          {/* Other Items */}
          <div className="min-w-[200px] p-3 rounded-xl border border-neutral-200 hover:border-emerald-200 cursor-pointer transition-colors bg-white hover:bg-gray-50 group">
            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-400 mt-1.5 ring-2 ring-orange-100" />
              <div>
                <div className="font-semibold text-gray-700 text-sm group-hover:text-emerald-700">
                  RX-1235
                </div>
                <div className="text-xs text-gray-400 font-medium mt-0.5">Jane Doe</div>
                <div className="text-[10px] text-gray-400 mt-1 font-mono">Submitted: 11:15 AM</div>
              </div>
            </div>
          </div>

          <div className="min-w-[200px] p-3 rounded-xl border border-neutral-200 hover:border-emerald-200 cursor-pointer transition-colors bg-white hover:bg-gray-50 group">
            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 mt-1.5 ring-2 ring-blue-100" />
              <div>
                <div className="font-semibold text-gray-700 text-sm group-hover:text-emerald-700">
                  RX-1236
                </div>
                <div className="text-xs text-gray-400 font-medium mt-0.5">Mike Johnson</div>
                <div className="text-[10px] text-gray-400 mt-1 font-mono">Submitted: 11:45 AM</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (Main Content): Image & Data Entry */}
        <div className="xl:col-span-2 space-y-6">
          {/* Image Viewer */}
          <Card className="p-0 overflow-hidden h-[600px] flex flex-col border border-neutral-200 shadow-sm">
            <div className="flex justify-between items-center p-4 border-b border-neutral-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <IoEyeOutline /> Prescription Scan
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setZoom((prev) => Math.min(prev + 10, 200))}
                  className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 transition-all border border-transparent hover:border-gray-200"
                  title="Zoom In"
                >
                  <IoAdd size={18} />
                </button>
                <span className="text-xs font-mono font-medium text-gray-500 self-center w-12 text-center bg-white px-2 py-0.5 rounded border border-gray-100">
                  {zoom}%
                </span>
                <button
                  onClick={() => setZoom((prev) => Math.max(prev - 10, 50))}
                  className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 transition-all border border-transparent hover:border-gray-200"
                  title="Zoom Out"
                >
                  <IoRemove size={18} />
                </button>
                <div className="w-px h-5 bg-gray-300 mx-1 self-center" />
                <button
                  onClick={() => setRotation((prev) => prev + 90)}
                  className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 transition-all border border-transparent hover:border-gray-200"
                  title="Rotate"
                >
                  <IoRefresh size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-neutral-100/50 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <img
                  src="https://placehold.co/600x800/png?text=Prescription+Scan"
                  alt="Prescription"
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-sm transition-transform duration-200 ease-out"
                  style={{ transform: `rotate(${rotation}deg) scale(${zoom / 100})` }}
                />
              </div>
            </div>
          </Card>

          {/* Data Entry Form */}
          <Card className="p-0 border border-neutral-200 overflow-hidden shadow-sm">
            <div className="p-5 bg-white border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/50 shadow-sm">
                  <IoInformationCircleOutline size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                    Transcription Data
                  </h3>
                  <p className="text-xs font-medium text-gray-400 mt-0.5">
                    Accurately transcribe prescription details
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 sm:flex-none text-[11px] h-10 font-semibold border-emerald-100 text-emerald-700 bg-white hover:bg-emerald-50 rounded-xl transition-all"
                >
                  Copy Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 sm:flex-none text-[11px] h-10 font-semibold border-gray-100 text-gray-400 bg-white hover:bg-gray-50 rounded-xl transition-all"
                >
                  Clear Form
                </Button>
              </div>
            </div>

            <div className="p-6 bg-white space-y-6">
              {/* Right Eye (OD) */}
              <div className="bg-emerald-50/20 p-6 rounded-2xl border border-emerald-100/50">
                <h4 className="font-semibold text-sm text-emerald-800 mb-5 flex items-center gap-2">
                  <IoEyeOutline size={18} /> Right Eye (OD)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-emerald-700 uppercase tracking-widest pl-1">
                      SPH
                    </label>
                    <Input
                      defaultValue="-2.00"
                      className="bg-white border-emerald-200 focus:border-emerald-500 font-semibold text-emerald-900 text-center h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-emerald-700 uppercase tracking-widest pl-1">
                      CYL
                    </label>
                    <Input
                      defaultValue="-0.50"
                      className="bg-white border-emerald-200 focus:border-emerald-500 font-semibold text-emerald-900 text-center h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-emerald-700 uppercase tracking-widest pl-1">
                      AXIS
                    </label>
                    <Input
                      defaultValue="180"
                      className="bg-white border-emerald-200 focus:border-emerald-500 font-semibold text-emerald-900 text-center h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-emerald-700 uppercase tracking-widest pl-1">
                      ADD
                    </label>
                    <Input
                      defaultValue="+1.50"
                      className="bg-white border-emerald-200 focus:border-emerald-500 font-semibold text-emerald-900 text-center h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Left Eye (OS) */}
              <div className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-100">
                <h4 className="font-semibold text-sm text-neutral-700 mb-5 flex items-center gap-2">
                  <IoEyeOutline size={18} /> Left Eye (OS)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
                      SPH
                    </label>
                    <Input
                      defaultValue="-2.25"
                      className="bg-white border-neutral-200 font-semibold text-neutral-900 text-center h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
                      CYL
                    </label>
                    <Input
                      defaultValue="-0.75"
                      className="bg-white border-neutral-200 font-semibold text-neutral-900 text-center h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
                      AXIS
                    </label>
                    <Input
                      defaultValue="170"
                      className="bg-white border-neutral-200 font-semibold text-neutral-900 text-center h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
                      ADD
                    </label>
                    <Input
                      defaultValue="+1.50"
                      className="bg-white border-neutral-200 font-semibold text-neutral-900 text-center h-11"
                    />
                  </div>
                </div>
              </div>

              {/* PD & Notes Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-2">
                {/* PD Section */}
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-widest pl-1 block">
                    Pupillary Distance (PD)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Input
                        defaultValue="31.5"
                        className="font-semibold text-center border-neutral-200 h-12 pr-8 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/10"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                        R
                      </span>
                    </div>
                    <div className="relative">
                      <Input
                        defaultValue="31.5"
                        className="font-semibold text-center border-neutral-200 h-12 pr-8 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/10"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                        L
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-widest pl-1 block">
                    Notes
                  </label>
                  <textarea
                    className="w-full h-12 p-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-sm font-medium resize-none bg-neutral-50/20 transition-all placeholder:text-neutral-300"
                    placeholder="Enter special instructions for lab technician..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50/80 p-6 flex gap-4 border-t border-neutral-100">
              <Button
                isFullWidth
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold h-12 rounded-xl shadow-md shadow-emerald-100 transition-all active:scale-95 border-none"
                leftIcon={<IoCheckmark size={20} />}
              >
                Verify & Submit to Lab
              </Button>
              <Button
                isFullWidth
                variant="outline"
                className="bg-white border-neutral-200 text-neutral-600 hover:text-red-600 hover:bg-neutral-50 font-semibold h-12 rounded-xl transition-all active:scale-95 translate-y-0"
                leftIcon={<IoClose size={20} />}
              >
                Reject Order
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Information & Operations (Sidebar) */}
        <div className="space-y-6">
          {/* Order Details Card */}
          <Card className="p-5 border border-neutral-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 text-sm">Order Details</h3>
              <button className="text-emerald-600 text-xs font-semibold hover:underline">
                Edit
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <IoPersonOutline className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="text-sm font-semibold text-gray-900">{orderData.customer}</p>
                  <p className="text-[10px] text-gray-400">{orderData.email}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <IoGlassesOutline className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Product</p>
                  <p className="text-sm font-semibold text-gray-900">{orderData.product}</p>
                  <p className="text-[10px] text-gray-400">SKU: BLB-2023-001</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <IoCalendarOutline className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Timeline</p>
                  <p className="text-sm font-semibold text-gray-900">{orderData.submitted}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Customer Communication Hub */}
          <Card className="p-0 border border-neutral-200 shadow-sm overflow-hidden bg-white">
            <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                <IoChatbubblesOutline className="text-emerald-500" /> Communication
              </h3>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                  <IoEllipsisHorizontal />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              <button className="flex-1 py-2.5 text-xs font-semibold text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50/30">
                Chat (2)
              </button>
              <button className="flex-1 py-2.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                Call
              </button>
              <button className="flex-1 py-2.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                History
              </button>
            </div>

            {/* Chat View */}
            <div className="h-[240px] flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
                {/* Incoming Message */}
                <div className="flex gap-2 items-start max-w-[90%]">
                  <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                    <img
                      src="https://i.pravatar.cc/100?img=12"
                      alt="Customer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="bg-white p-2.5 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm text-xs text-gray-600">
                      Hi, I think I might have entered my PD wrong. Can you check?
                    </div>
                    <span className="text-[9px] text-gray-400 ml-1">10:45 AM</span>
                  </div>
                </div>

                {/* Outgoing Message */}
                <div className="flex gap-2 items-start max-w-[90%] ml-auto flex-row-reverse">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 shrink-0 flex items-center justify-center text-[10px] font-semibold text-emerald-600">
                    You
                  </div>
                  <div className="text-right">
                    <div className="bg-emerald-500 p-2.5 rounded-2xl rounded-tr-none text-xs text-white shadow-sm">
                      Checking now. Please upload a selfie holding a card for reference if possible.
                    </div>
                    <span className="text-[9px] text-gray-400 mr-1">10:48 AM</span>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-gray-100 bg-white">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="w-full pl-3 pr-8 py-2 rounded-full border border-gray-200 text-xs focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all"
                    />
                    <button className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600">
                      <IoMicOutline size={14} />
                    </button>
                  </div>
                  <button className="p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 shadow-sm transition-transform active:scale-95">
                    <IoSend size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Call Overlay (Hidden by default, shown here for structure if tabs were interactive) - 
                    In a real app, this would toggle. For this visual, I'll just leave the chat view active 
                    or maybe add a small 'Quick Call' header at bottom. 
                */}
            <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-medium text-gray-600">Customer Online</span>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-200 shadow-sm"
                  title="Voice Call"
                >
                  <IoCallOutline />
                </button>
                <button
                  className="p-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 shadow-sm"
                  title="Video Call"
                >
                  <IoVideocamOutline />
                </button>
              </div>
            </div>
          </Card>

          {/* Laboratory Operations Channel */}
          <Card className="p-0 border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 flex justify-between items-center">
              <h3 className="font-semibold text-emerald-900 text-sm flex items-center gap-2">
                <IoConstructOutline /> Lab Operations
              </h3>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            </div>

            <div className="p-4 space-y-4">
              {/* Alert Item */}
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                <div className="flex gap-2 items-start">
                  <IoAlertCircleOutline className="text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-amber-800">Lens Stock Warning</p>
                    <p className="text-[11px] text-amber-700 leading-snug mt-1">
                      High index 1.74 stock low. Estimated delay: 2 days. Confirm proceed?
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button className="text-[10px] font-semibold bg-white border border-amber-200 text-amber-700 px-2 py-1 rounded hover:bg-amber-50">
                        Cancel
                      </button>
                      <button className="text-[10px] font-semibold bg-amber-600 text-white px-2 py-1 rounded hover:bg-amber-700">
                        Confirm Proceed
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="relative border-l border-gray-200 ml-1.5 space-y-5 py-2">
                <div className="pl-4 relative">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-gray-200 border-2 border-white"></div>
                  <p className="text-xs text-gray-500">Technician Review</p>
                  <p className="text-[10px] text-gray-400">Pending assignment</p>
                </div>
                <div className="pl-4 relative">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm ring-2 ring-emerald-50"></div>
                  <p className="text-xs font-semibold text-gray-800">Data Transcription</p>
                  <p className="text-[10px] text-gray-500">Started 5m ago by You</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
              <button className="text-xs font-semibold text-emerald-600 flex items-center justify-center gap-1 hover:underline">
                <IoMailOutline /> Contact Lab Manager
              </button>
            </div>
          </Card>

          {/* Status Override Panel */}
          <Card className="p-5 border border-neutral-200 shadow-sm bg-gray-50">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Status Override</h3>
            <p className="text-[11px] text-gray-500 mb-3">
              Manually update status if automation fails or for special cases.
            </p>
            <div className="space-y-2">
              <Button
                isFullWidth
                size="sm"
                variant="outline"
                className="bg-white justify-start text-xs border-gray-300"
              >
                Mark as On Hold
              </Button>
              <Button
                isFullWidth
                size="sm"
                variant="outline"
                className="bg-white justify-start text-xs border-gray-300"
              >
                Escalate to Manager
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

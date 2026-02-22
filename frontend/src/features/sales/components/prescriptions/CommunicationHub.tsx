import React from 'react'
import {
  IoChatbubblesOutline,
  IoEllipsisHorizontal,
  IoSend,
  IoCallOutline,
  IoVideocamOutline
} from 'react-icons/io5'
import { Button, Card } from '@/shared/components/ui-core'

interface CommunicationHubProps {
  customerName?: string
}

export const CommunicationHub: React.FC<CommunicationHubProps> = ({ customerName }) => {
  return (
    <Card className="p-0 border border-gray-200 shadow-sm overflow-hidden bg-white rounded-xl">
      <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
          <IoChatbubblesOutline className="text-slate-400" /> Communication
        </h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            colorScheme="neutral"
            className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <IoEllipsisHorizontal />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-100">
        <Button className="flex-1 py-3 text-[10px] font-medium uppercase tracking-widest text-mint-600 border-b-2 border-mint-500 bg-white">
          Chat (2)
        </Button>
        <Button
          variant="ghost"
          colorScheme="neutral"
          className="flex-1 py-3 text-[10px] font-medium uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors bg-white hover:bg-slate-50"
        >
          Call
        </Button>
        <Button
          variant="ghost"
          colorScheme="neutral"
          className="flex-1 py-3 text-[10px] font-medium uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors bg-white hover:bg-slate-50"
        >
          History
        </Button>
      </div>

      {/* Chat View */}
      <div className="h-[240px] flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
          {/* Incoming Message */}
          <div className="flex gap-2 items-start max-w-[90%]">
            <div className="w-6 h-6 rounded-full bg-slate-100 shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-200 uppercase">
              {(customerName || 'C').charAt(0)}
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
            <div className="w-6 h-6 rounded-full bg-mint-100 shrink-0 flex items-center justify-center text-[10px] font-semibold text-mint-600">
              You
            </div>
            <div className="text-right">
              <div className="bg-mint-500 p-2.5 rounded-2xl rounded-tr-none text-xs text-white shadow-sm font-medium">
                Checking now. Please upload a selfie holding a card for reference if possible.
              </div>
              <span className="text-[9px] text-gray-400 mr-1">10:48 AM</span>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-slate-100 bg-white">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full pl-4 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-mint-300 focus:ring-4 focus:ring-mint-500/5 transition-all"
              />
            </div>
            <Button
              variant="solid"
              className="p-2.5 bg-mint-600 text-white rounded-xl hover:bg-mint-700 shadow-md shadow-mint-100 transition-all active:scale-95 border-none"
            >
              <IoSend size={14} className="text-white" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-3 bg-white border-t border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-mint-500 animate-pulse"></div>
          <span className="text-xs font-medium text-slate-400">Customer Online</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            colorScheme="neutral"
            className="p-1.5 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-mint-600 hover:border-mint-200 shadow-sm"
            title="Voice Call"
          >
            <IoCallOutline />
          </Button>
          <Button
            variant="ghost"
            colorScheme="neutral"
            className="p-1.5 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-mint-600 hover:border-mint-200 shadow-sm"
            title="Video Call"
          >
            <IoVideocamOutline />
          </Button>
        </div>
      </div>
    </Card>
  )
}

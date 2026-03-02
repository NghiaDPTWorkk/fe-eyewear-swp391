import React, { useState, useEffect } from 'react'
import {
  IoChatbubblesOutline,
  IoEllipsisHorizontal,
  IoSend,
  IoCallOutline,
  IoVideocamOutline,
  IoCheckmarkDoneOutline
} from 'react-icons/io5'
import { Button, Card } from '@/shared/components/ui-core'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import { cn } from '@/lib/utils'

interface CommunicationHubProps {
  customerName?: string
}

interface Message {
  id: string
  role: 'CUSTOMER' | 'AI' | 'STAFF'
  conversationId: string
  content: string
  createdAt: string
}

export const CommunicationHub: React.FC<CommunicationHubProps> = ({ customerName }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchConversation = async () => {
      if (!customerName) return
      setIsLoading(true)
      try {
        const response = await httpClient.get<{
          success: boolean
          data: { conversationList: any[] }
        }>(ENDPOINTS.ADMIN_AI_CONVERSATIONS.LIST(customerName))

        if (response.success && response.data.conversationList.length > 0) {
          // Find closest match or first one
          const conv = response.data.conversationList[0]

          const msgResponse = await httpClient.get<{
            success: boolean
            data: { messageList: Message[] }
          }>(ENDPOINTS.ADMIN_AI_CONVERSATIONS.MESSAGES(conv.id))

          if (msgResponse.success) {
            setMessages(msgResponse.data.messageList)
          }
        }
      } catch (error) {
        console.error('Failed to fetch messages for hub:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversation()
  }, [customerName])

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
        <Button className="flex-1 py-3 text-[10px] font-medium uppercase tracking-widest text-mint-600 border-b-2 border-mint-500 bg-white rounded-none border-t-0 border-x-0">
          Chat ({messages.length})
        </Button>
        <Button
          variant="ghost"
          colorScheme="neutral"
          className="flex-1 py-3 text-[10px] font-medium uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors bg-white hover:bg-slate-50 rounded-none border-none"
        >
          Call
        </Button>
        <Button
          variant="ghost"
          colorScheme="neutral"
          className="flex-1 py-3 text-[10px] font-medium uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors bg-white hover:bg-slate-50 rounded-none border-none"
        >
          History
        </Button>
      </div>

      {/* Chat View */}
      <div className="h-[240px] flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white scrollbar-hide">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-mint-500" />
            </div>
          ) : messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-2 items-start max-w-[90%]',
                  msg.role !== 'CUSTOMER' ? 'ml-auto flex-row-reverse' : ''
                )}
              >
                <div
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border uppercase',
                    msg.role === 'CUSTOMER'
                      ? 'bg-slate-100 text-slate-400 border-slate-200'
                      : 'bg-mint-100 text-mint-600 border-mint-100'
                  )}
                >
                  {msg.role === 'CUSTOMER' ? (customerName || 'C').charAt(0) : 'ME'}
                </div>
                <div className={msg.role !== 'CUSTOMER' ? 'text-right' : ''}>
                  <div
                    className={cn(
                      'p-2.5 rounded-2xl text-[11px] shadow-sm',
                      msg.role === 'CUSTOMER'
                        ? 'bg-white rounded-tl-none border border-gray-200 text-gray-600'
                        : 'bg-mint-500 rounded-tr-none text-white font-medium'
                    )}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 block">
                    {msg.createdAt.split(' ')[1] || msg.createdAt}
                    {msg.role !== 'CUSTOMER' && (
                      <IoCheckmarkDoneOutline className="inline ml-1 text-mint-500" />
                    )}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                <IoChatbubblesOutline className="text-slate-300" size={24} />
              </div>
              <p className="text-[11px] font-medium text-slate-400 leading-relaxed px-6">
                No conversation records found with this customer. Start a new chat to assist them.
              </p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-slate-100 bg-white">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full pl-4 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-mint-300 focus:ring-4 focus:ring-mint-500/5 transition-all bg-slate-50/50"
              />
            </div>
            <Button
              variant="solid"
              className="p-2.5 bg-mint-600 text-white rounded-xl hover:bg-mint-700 shadow-md shadow-mint-100 transition-all active:scale-95 border-none h-[38px] w-[38px]"
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
            className="p-1.5 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-mint-600 hover:border-mint-200 shadow-sm transition-all"
            title="Voice Call"
          >
            <IoCallOutline />
          </Button>
          <Button
            variant="ghost"
            colorScheme="neutral"
            className="p-1.5 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-mint-600 hover:border-mint-200 shadow-sm transition-all"
            title="Video Call"
          >
            <IoVideocamOutline />
          </Button>
        </div>
      </div>
    </Card>
  )
}

import { useState, useEffect, useRef, useCallback } from 'react'
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react'
import { IconButton } from '@/shared/components/ui/icon-button'
import { Input } from '@/shared/components/ui/input'
import { useChatMessages } from '@/shared/hooks/chat/useChatMessages'
import { useAuthStore, useChatStore } from '@/store'
import { Link } from 'react-router-dom'
import { ProductChatTag } from './ProductChatTag'
// import { ChatProductCard } from './ChatProductCard'
import { useShallow } from 'zustand/react/shallow'
import LogoEyewearIcon from '../logoeyewear/LogoEyewearIcon'

interface MessageContentProps {
  text: string
  isUser: boolean
}

const MessageContent = ({ text: originalText, isUser }: MessageContentProps) => {
  const text = originalText.replace(/link chi tiết/gi, 'Sản phẩm')
  const PRODUCT_URL_REGEX = /\/products\/([a-f\d]{24})/i

  const parseLine = (line: string) => {
    // Regex matches: **bold**, [label](url), or raw URL
    const regex = /(\*\*.*?\*\*|\[.*?\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s\n]+)/g
    const parts = line.split(regex)

    return parts.map((part, i) => {
      // Bold: **text**
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className={isUser ? 'font-bold' : 'font-bold text-primary-700'}>
            {part.slice(2, -2)}
          </strong>
        )
      }

      // Markdown link: [label](url)
      const mdLinkMatch = part.match(/^\[(.*?)\]\((https?:\/\/.*?)\)$/)
      if (mdLinkMatch) {
        const [, label, url] = mdLinkMatch

        // Check if it's a product link
        const productMatch = url.match(PRODUCT_URL_REGEX)
        if (productMatch) {
          return <ProductChatTag key={i} productId={productMatch[1]} />
        }

        return (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={
              isUser
                ? 'underline font-medium text-white/90 hover:text-white transition-colors'
                : 'underline font-medium text-primary-600 hover:text-primary-700 transition-colors'
            }
            onClick={(e) => e.stopPropagation()}
          >
            {label}
          </a>
        )
      }

      // Raw URL
      if (part.startsWith('http')) {
        // Check if it's a product link
        const productMatch = part.match(PRODUCT_URL_REGEX)
        if (productMatch) {
          return <ProductChatTag key={i} productId={productMatch[1]} />
        }

        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={
              isUser
                ? 'underline font-medium text-white/90 hover:text-white transition-colors break-all'
                : 'underline font-medium text-primary-600 hover:text-primary-700 transition-colors break-all'
            }
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        )
      }
      return part
    })
  }

  const lines = text.split('\n')

  return (
    <div className="space-y-1.5 flex flex-col min-w-0">
      {lines.map((line, i) => {
        const trimmedLine = line.trim()

        // Handle Bullet Points
        if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
          return (
            <div key={i} className="flex gap-2 pl-1 mb-0.5 items-start min-w-0 w-full">
              <span
                className={
                  isUser ? 'text-white/70 mt-1.5 shrink-0' : 'text-primary-500 mt-1.5 shrink-0'
                }
                style={{ fontSize: '8px' }}
              >
                ●
              </span>
              <div className="flex-1 leading-relaxed break-words min-w-0">
                {parseLine(trimmedLine.substring(2))}
              </div>
            </div>
          )
        }

        // Empty lines as spacing
        if (line === '') {
          return <div key={i} className="" />
        }

        // Normal paragraph
        return (
          <div key={i} className="leading-relaxed break-words min-w-0">
            {parseLine(line)}
          </div>
        )
      })}
    </div>
  )
}

export const ChatBot = () => {
  const { isAuthenticated } = useAuthStore()
  const { isOpen, openChat, closeChat, pendingMessage, clearPendingMessage } = useChatStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      openChat: state.openChat,
      closeChat: state.closeChat,
      pendingMessage: state.pendingMessage,
      clearPendingMessage: state.clearPendingMessage
    }))
  )
  const setIsOpen = useCallback(
    (open: boolean) => (open ? openChat() : closeChat()),
    [openChat, closeChat]
  )

  const [unread, setUnread] = useState(0)
  const prevScrollHeightRef = useRef<number>(0)

  const {
    messages,
    isLoading,
    isTyping,
    hasMore,
    input,
    setInput,
    handleSend,
    handleKeyDown,
    handleLoadMore,
    fetchInitialMessages,
    messagesEndRef,
    scrollContainerRef,
    inputRef
  } = useChatMessages()

  // auto send
  useEffect(() => {
    if (pendingMessage && isAuthenticated && !isLoading) {
      const msg = pendingMessage
      clearPendingMessage()
      handleSend(msg)
    }
  }, [pendingMessage, isAuthenticated, isLoading, handleSend, clearPendingMessage])

  // Preserve scroll position when loading more messages
  useEffect(() => {
    if (!isLoading && prevScrollHeightRef.current > 0 && scrollContainerRef.current) {
      const currentScrollHeight = scrollContainerRef.current.scrollHeight
      const heightDifference = currentScrollHeight - prevScrollHeightRef.current
      if (heightDifference > 0) {
        scrollContainerRef.current.scrollTop = heightDifference
      }
      prevScrollHeightRef.current = 0
    }
  }, [isLoading, scrollContainerRef])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    if (target.scrollTop < 20 && hasMore && !isLoading) {
      prevScrollHeightRef.current = target.scrollHeight
      handleLoadMore()
    }
  }

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      fetchInitialMessages()
    }
  }, [isOpen, inputRef, fetchInitialMessages])

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl shadow-2xl border border-mint-300 bg-white overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen
            ? 'scale-100 opacity-100 pointer-events-auto'
            : 'scale-90 opacity-0 pointer-events-none'
        }`}
        style={{ height: '520px' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-primary-500 to-primary-700 text-white shrink-0">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <LogoEyewearIcon className="w-10 h-10" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-base leading-tight">Eyewear Support</h3>
            <span className="text-xs text-primary-100 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
              Online
            </span>
          </div>
          <IconButton
            icon={<X className="w-5 h-5" />}
            aria-label="Close chat"
            variant="ghost"
            size="sm"
            isRound
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20"
          />
        </div>

        {/* Messages */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-4 bg-mint-50"
        >
          {/* Auth required state */}
          {!isAuthenticated && (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center h-full">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="font-heading font-semibold text-mint-1200 mb-2">Sign in to chat</h4>
              <p className="text-sm text-gray-eyewear mb-6">
                Please log in to your account to start a conversation with our support.
              </p>
              <Link
                to="/login"
                className="w-full py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Go to Login
              </Link>
            </div>
          )}

          {isAuthenticated && (
            <>
              {/* History Loading Spinner */}
              {isLoading && messages.length > 0 && (
                <div className="flex justify-center py-2">
                  <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                </div>
              )}

              {/* Loading initial */}
              {isLoading && messages.length === 0 && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                </div>
              )}

              {/* Empty state */}
              {!isLoading && messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-gray-eyewear text-sm">
                  <Bot className="w-10 h-10 text-primary-300 mb-3" />
                  <p>Start a conversation!</p>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-primary-600" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`w-full px-4 py-2.5 rounded-2xl text-sm break-words ${
                        msg.sender === 'user'
                          ? 'bg-primary-500 text-white rounded-br-md'
                          : 'bg-white text-mint-1200 rounded-bl-md shadow-sm border border-mint-300'
                      }`}
                    >
                      <MessageContent text={msg.text} isUser={msg.sender === 'user'} />
                      {/* {msg.sender === 'bot' && msg.products && msg.products.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {msg.products.map((p: any) => (
                            <ChatProductCard key={p._id} product={p} />
                          ))}
                        </div>
                      )} */}
                    </div>
                    <span className="text-[10px] text-gray-eyewear mt-1 px-1">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-2 items-end animate-fade-in-up">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-mint-300">
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (isAuthenticated) handleSend()
          }}
          className="flex items-center gap-2 px-4 py-3 bg-white border-t border-mint-300 shrink-0"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isAuthenticated ? 'Type a message...' : 'Login to chat'}
            size="md"
            className="flex-1"
            disabled={!isAuthenticated}
          />
          <IconButton
            icon={<Send className="w-4 h-4" />}
            aria-label="Send message"
            variant="solid"
            colorScheme="primary"
            size="md"
            isRound
            isDisabled={!isAuthenticated || !input.trim()}
            onClick={() => handleSend()}
          />
        </form>
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={() => {
          const next = !isOpen
          setIsOpen(next)
          if (next) setUnread(0)
        }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer ${
          isOpen ? 'bg-mint-1200 rotate-0' : 'bg-gradient-to-br from-primary-500 to-primary-700'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}

        {!isOpen && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
            {unread}
          </span>
        )}
      </button>
    </>
  )
}

export default ChatBot

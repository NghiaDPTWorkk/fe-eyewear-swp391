import { useState, useEffect } from 'react'
import { MessageCircle, X, Send, Glasses, Bot, Loader2 } from 'lucide-react'
import { IconButton } from '@/shared/components/ui/icon-button'
import { Input } from '@/shared/components/ui/input'
import { useChatMessages } from '@/shared/hooks/chat/useChatMessages'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Link } from 'react-router-dom'

export const ChatBot = () => {
  const { isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const [prevScrollHeight, setPrevScrollHeight] = useState<number>(0)

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
    scrollToBottom,
    inputRef
  } = useChatMessages()


  // Preserve scroll position when loading more messages
  useEffect(() => {
    if (!isLoading && prevScrollHeight > 0 && scrollContainerRef.current) {
      const currentScrollHeight = scrollContainerRef.current.scrollHeight
      const heightDifference = currentScrollHeight - prevScrollHeight
      if (heightDifference > 0) {
        scrollContainerRef.current.scrollTop = heightDifference
      }
      setPrevScrollHeight(0)
    }
  }, [isLoading, prevScrollHeight, scrollContainerRef])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    if (target.scrollTop < 20 && hasMore && !isLoading) {
      setPrevScrollHeight(target.scrollHeight)
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
            <Glasses className="w-5 h-5" />
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
                      className={`w-full px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line break-words ${
                        msg.sender === 'user'
                          ? 'bg-primary-500 text-white rounded-br-md'
                          : 'bg-white text-mint-1200 rounded-bl-md shadow-sm border border-mint-300'
                      }`}
                    >
                      {msg.text}
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
          setIsOpen((o) => {
            const next = !o
            if (next) setUnread(0)
            return next
          })
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

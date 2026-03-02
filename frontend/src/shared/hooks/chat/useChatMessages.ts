import { useState, useRef, useCallback, useEffect, type KeyboardEvent } from 'react'
import { chatService } from '@/shared/services/chat/chatService'
import type { AiMessage } from '@/shared/types/chat.types'
import { useAuthStore } from '@/store/auth.store'

export interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface UseChatMessagesReturn {
  messages: ChatMessage[]
  isLoading: boolean
  isTyping: boolean
  hasMore: boolean
  input: string
  setInput: (value: string) => void
  handleSend: (text?: string) => void
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
  handleLoadMore: () => void
  fetchInitialMessages: () => void
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
  scrollToBottom: (behavior?: ScrollBehavior) => void
  inputRef: React.RefObject<HTMLInputElement | null>
}

function mapApiMessages(apiMessages: AiMessage[]): ChatMessage[] {
  return apiMessages.map((m) => ({
    id: m._id,
    text: m.content,
    sender: m.role === 'AI' ? 'bot' : 'user',
    timestamp: new Date(m.createdAt)
  }))
}

export const useChatMessages = (): UseChatMessagesReturn => {
  const { user, isAuthenticated } = useAuthStore()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [lastItem, setLastItem] = useState<number | undefined>(undefined)

  const hasFetchedInitial = useRef(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset state when user changes
  useEffect(() => {
    setMessages([])
    setHasMore(false)
    setLastItem(undefined)
    hasFetchedInitial.current = false
  }, [user?._id])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior })
    } else if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [])

  const fetchMessages = useCallback(
    async (cursor?: number) => {
      if (!isAuthenticated) return

      setIsLoading(true)
      try {
        const res = await chatService.getMessages(cursor)
        if (res.success) {
          const mapped = mapApiMessages(res.data.messageList)
          if (cursor) {
            setMessages((prev) => [...mapped, ...prev])
          } else {
            setMessages(mapped)
            // Scroll to bottom on initial load
            setTimeout(() => scrollToBottom('auto'), 100)
          }
          setHasMore(res.data.pagination.hasNext)
          setLastItem(res.data.pagination.lastItem)
        }
      } catch {
        // silently fail
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, scrollToBottom]
  )

  const fetchInitialMessages = useCallback(async () => {
    if (!isAuthenticated) return
    if (!hasFetchedInitial.current) {
      hasFetchedInitial.current = true
      setIsLoading(true)
      try {
        // 1st: get/create conversation to avoid 404 on getMessages
        await chatService.getConversation()
        await fetchMessages()
      } catch (error) {
        console.error('Failed to initialize conversation:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [fetchMessages, isAuthenticated])

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading && lastItem) {
      fetchMessages(lastItem)
    }
  }, [hasMore, isLoading, lastItem, fetchMessages])

  const handleSend = useCallback(
    async (text?: string) => {
      if (!isAuthenticated) return

      const msg = (text ?? input).trim()
      if (!msg) return

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        text: msg,
        sender: 'user',
        timestamp: new Date()
      }

      setMessages((prev) => [...prev, userMsg])
      setInput('')
      setIsTyping(true)
      // Scroll to bottom when user sends a message
      setTimeout(() => scrollToBottom('smooth'), 100)

      try {
        const res = await chatService.sendMessage(msg)
        if (res.success) {
          const botMsg: ChatMessage = {
            id: `bot-${Date.now()}`,
            text: res.data.message,
            sender: 'bot',
            timestamp: new Date()
          }
          setMessages((prev) => [...prev, botMsg])
          // Scroll to bottom on bot response
          setTimeout(() => scrollToBottom('smooth'), 100)
        }
      } catch (error) {
        console.error('Failed to send message:', error)
      } finally {
        setIsTyping(false)
      }
    },
    [input, isAuthenticated, scrollToBottom]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  return {
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
  }
}

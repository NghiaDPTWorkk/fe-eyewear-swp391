import { useState, useRef, useCallback, useEffect, type KeyboardEvent } from 'react'
import { chatService } from '@/shared/services/chat/chatService'
import type { AiMessage } from '@/shared/types/chat.types'
import { useAuth } from '@/features/auth/hooks/useAuth'

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
  const { user, isAuthenticated } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [lastItem, setLastItem] = useState<number | undefined>(undefined)

  const hasFetchedInitial = useRef(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset state when user changes
  useEffect(() => {
    setMessages([])
    setHasMore(false)
    setLastItem(undefined)
    hasFetchedInitial.current = false
  }, [user?._id])

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

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
    [isAuthenticated]
  )

  const fetchInitialMessages = useCallback(() => {
    if (!isAuthenticated) return
    if (!hasFetchedInitial.current) {
      hasFetchedInitial.current = true
      fetchMessages()
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
        }
      } catch (error) {
        console.error('Failed to send message:', error)
      } finally {
        setIsTyping(false)
      }
    },
    [input, isAuthenticated]
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
    inputRef
  }
}

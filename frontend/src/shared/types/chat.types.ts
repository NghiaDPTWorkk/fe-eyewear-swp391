export interface AiMessage {
  _id: string
  role: 'AI' | 'CUSTOMER'
  conversationId: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface AiMessagePagination {
  hasNext: boolean
  lastItem: number
}

export interface AiMessageListData {
  messageList: AiMessage[]
  pagination: AiMessagePagination
}

export interface ChatReplyData {
  message: string
}

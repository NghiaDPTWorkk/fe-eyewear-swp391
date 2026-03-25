export interface AiMessage {
  _id: string
  role: 'AI' | 'CUSTOMER'
  conversationId: string
  content: string
  createdAt: string
  updatedAt: string
  products?: any[]
}

export interface AiMessagePagination {
  hasNext: boolean
  lastItem: number
}

export interface AiMessageListData {
  messageList: AiMessage[]
  pagination: AiMessagePagination
}

export interface AiConversation {
  _id: string
  customerId: string
  stage: 'DISCOVERY' | string
  lastInteractionAt: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface AiConversationData {
  conversation: AiConversation
}

export interface ChatReplyData {
  message: string
  products?: any[]
}

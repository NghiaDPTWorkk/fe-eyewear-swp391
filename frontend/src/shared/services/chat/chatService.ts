import { ENDPOINTS, httpClient } from '@/api'
import type { ApiResponse } from '@/shared/types/response.types'
import type { AiMessageListData, ChatReplyData } from '@/shared/types/chat.types'

export const chatService = {
  /** Get message list, optionally pass lastMessageAt cursor for lazy loading older messages */
  getMessages(lastMessageAt?: number) {
    return httpClient.get<ApiResponse<AiMessageListData>>(
      ENDPOINTS.AI_CHAT.GET_MESSAGES(lastMessageAt)
    )
  },

  sendMessage(message: string) {
    return httpClient.post<ApiResponse<ChatReplyData>>(ENDPOINTS.AI_CHAT.SEND_MESSAGE, { message })
  }
}

import { ENDPOINTS, httpClient } from '@/api'
import type { ApiResponse } from '@/shared/types/response.types'
import type {
  AiMessageListData,
  ChatReplyData,
  AiConversationData
} from '@/shared/types/chat.types'

export const chatService = {
  getConversation() {
    return httpClient.get<ApiResponse<AiConversationData>>(ENDPOINTS.AI_CHAT.GET_CONVERSATION)
  },

  getMessages(lastMessageAt?: number) {
    return httpClient.get<ApiResponse<AiMessageListData>>(
      ENDPOINTS.AI_CHAT.GET_MESSAGES(lastMessageAt)
    )
  },

  sendMessage(message: string) {
    return httpClient.post<ApiResponse<ChatReplyData>>(ENDPOINTS.AI_CHAT.SEND_MESSAGE, { message })
  }
}

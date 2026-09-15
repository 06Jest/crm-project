import { apiClient } from "./apiClient";
import type {
  AIChatResponse,
  AIConversation,
  AIConversationWithMessages,
  ConfirmAIActionResponse,
  SendAIChatRequest,
  SendPublicAIChatRequest,
} from "../types/ai";


export const sendAIChatAPI = async (
  request: SendAIChatRequest
): Promise<AIChatResponse> => {
  const result = await apiClient("/api/ai/chat", {
    method: "POST",
    body: JSON.stringify(request),
  });

  return result as AIChatResponse;
};

export const sendPublicAIChatAPI = async (
  request: SendPublicAIChatRequest
): Promise<AIChatResponse> => {
  const result = await apiClient("/api/ai/public/chat", {
    method: "POST",
    body: JSON.stringify(request),
  });

  return result as AIChatResponse;
};

export const confirmAIActionAPI = async (
  confirmationId: string
): Promise<ConfirmAIActionResponse> => {
  const result = await apiClient(
    `/api/ai/confirmations/${confirmationId}/confirm`,
    {
      method: "POST",
    }
  );

  return result as ConfirmAIActionResponse;
};

// export const getAIConversationsAPI = async (): Promise<
//   AIConversation[]
// > => {
//   const result = await apiClient("/api/ai/conversations", {
//     method: "GET",
//   });

//   return result.conversations;
// };



export const getAIConversationAPI = async (
  conversationId: string
): Promise<AIConversationWithMessages> => {
  const result = await apiClient(
    `/api/ai/conversations/${conversationId}`,
    {
      method: "GET",
    }
  );

  return result;
};

export const getAIConversationsAPI = async (): Promise<
  AIConversation[]
> => {
  const result = await apiClient("/api/ai/conversations", {
    method: "GET",
  });

  console.log(
    "Conversation titles:",
    result.conversations.map((conversation: AIConversation) => ({
      id: conversation.id,
      title: conversation.title,
    }))
  );

  return result.conversations;
};

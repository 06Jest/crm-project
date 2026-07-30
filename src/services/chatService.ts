import { apiClient } from "./apiClient";

import type {
  ConversationListItem,
  ConversationWithLastMessage,
  MessageListItem,
  AddMessage,
} from "../types/chat";

export const fetchConversationsAPI = async (): Promise<ConversationListItem[]> => {
  const result = await apiClient("/api/chat/conversations", {
    method: "GET",
  });

  return result.data as ConversationListItem[];
};

export const fetchDirectConversationAPI = async (
  userId: string
): Promise<ConversationWithLastMessage | null> => {
  const result = await apiClient(`/api/chat/direct-conversation/${userId}`, {
    method: "GET",
  });

  return result.data as ConversationWithLastMessage | null;
};

export const createDirectConversationAPI = async (
  profileId: string
): Promise<ConversationWithLastMessage> => {
  const result = await apiClient("/api/chat/direct-conversation", {
    method: "POST",
    body: JSON.stringify({
      profile_id: profileId,
    }),
  });

  return result.data as ConversationWithLastMessage;
};

export const fetchMessagesAPI = async (
  conversationId: string
): Promise<MessageListItem[]> => {
  const result = await apiClient(`/api/chat/messages/${conversationId}`, {
    method: "GET",
  });

  return result.data as MessageListItem[];
};

export const sendMessageAPI = async (
  conversationId: string,
  message: AddMessage
): Promise<MessageListItem> => {
  const result = await apiClient(`/api/chat/messages/${conversationId}`, {
    method: "POST",
    body: JSON.stringify(message),
  });

  return result.data as MessageListItem;
};

export const editMessageAPI = async (
  id: string,
  content: string
): Promise<MessageListItem> => {
  const result = await apiClient(`/api/chat/message/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ content }),
  });

  return result.data as MessageListItem;
};

export const deleteMessageAPI = async (
  id: string
): Promise<string> => {
  const result = await apiClient(`/api/chat/message/${id}`, {
    method: "DELETE",
  });

  return result.data as string;
};

export const markConversationAsReadAPI = async (
  conversationId: string
): Promise<void> => {
  await apiClient(`/api/chat/conversation/${conversationId}/read`, {
    method: "PATCH",
  });
};
import { apiClient } from "./apiClient";
import type {
  AIChatResponse,
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
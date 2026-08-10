import { apiClient } from "./apiClient";

export interface CreateFeedbackData {
  name?: string;
  email?: string;
  rating?: number | null;
  message: string;
}

export interface Feedback {
  id: string;
  name: string | null;
  email: string | null;
  rating: number | null;
  message: string;
  created_at: string;
}

export const createFeedbackAPI = async (
  data: CreateFeedbackData
): Promise<Feedback> => {
  const result = await apiClient(
    "/api/feedback/",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  return result.data as Feedback;
};
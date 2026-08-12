import { apiClient } from "./apiClient";

export type FeedbackUserType =
  | "everyday_user"
  | "manager"
  | "technical"
  | "prefer_not_to_say";

export interface CreateFeedbackData {
  name?: string;
  email?: string;
  userType?: FeedbackUserType;
  rating?: number | null;
  message: string;
}

export interface Feedback {
  id: string;
  name: string | null;
  email: string | null;
  userType: FeedbackUserType;
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
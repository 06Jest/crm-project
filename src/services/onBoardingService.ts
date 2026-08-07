import { apiClient } from "./apiClient";

import type { CompleteProfileDTO } from "../types/profile";
import type { CreateWorkspaceDTO } from "../types/organization";
import type { CreateSubscriptionDTO } from "../types/subscription";

export const completeProfileSetupAPI = async (
  dto: CompleteProfileDTO
) => {
  return apiClient("/api/onboarding/profile", {
    method: "POST",
    body: JSON.stringify(dto),
  });
};

export const createWorkspaceAPI = async (
  dto: CreateWorkspaceDTO
) => {
  return apiClient("/api/onboarding/workspace", {
    method: "POST",
    body: JSON.stringify(dto),
  });
};

export const createSubscriptionAPI = async (
  dto: CreateSubscriptionDTO
) => {
  return apiClient("/api/onboarding/subscription", {
    method: "POST",
    body: JSON.stringify(dto),
  });
};
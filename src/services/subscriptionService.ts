import type {
  Subscription,
  CreateSubscriptionDTO,
} from "../types/subscription";

import { apiClient } from "./apiClient";

export const createFreeSubscriptionAPI = async (
  subscription: CreateSubscriptionDTO
): Promise<Subscription> => {

  const result = await apiClient(
    "/api/subscriptions/",
    {
      method: "POST",
      body: JSON.stringify(subscription),
    }
  );

  return result.data as Subscription;

};

export const fetchSubscriptionAPI = async (): Promise<Subscription> => {

  const result = await apiClient(
    "/api/subscriptions/",
    {
      method: "GET",
    }
  );

  return result.data as Subscription;

};

export const updateSubscriptionPlanAPI = async (
  plan: Pick<Subscription, "plan">
): Promise<Subscription> => {

  const result = await apiClient(
    "/api/subscriptions/plan",
    {
      method: "PATCH",
      body: JSON.stringify(plan),
    }
  );

  return result.data as Subscription;

};

export const updateSubscriptionStatusAPI = async (
  status: Pick<Subscription, "status">
): Promise<Subscription> => {

  const result = await apiClient(
    "/api/subscriptions/status",
    {
      method: "PATCH",
      body: JSON.stringify(status),
    }
  );

  return result.data as Subscription;

};
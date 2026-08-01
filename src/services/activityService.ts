import type {
  ActivityListItem,
  ManualCreateActivity,
  UpdateActivity,
  ActivityAction,
  ActivityType,
} from "../types/activity";

import { apiClient } from "./apiClient";

export const fetchActivitiesAPI = async (): Promise<ActivityListItem[]> => {
  const result = await apiClient("/api/activities/show-activities", {
    method: "GET",
  });

  return result.data as ActivityListItem[];
};

export const fetchActivityByIDAPI = async (
  id: string
): Promise<ActivityListItem> => {
  const result = await apiClient(
    `/api/activities/show-activity/${id}`,
    {
      method: "GET",
    }
  );

  return result.data as ActivityListItem;
};

export const fetchLeadActivitiesAPI = async (
  leadId: string
): Promise<ActivityListItem[]> => {
  const result = await apiClient(
    `/api/activities/show-lead-activities/${leadId}`,
    {
      method: "GET",
    }
  );

  return result.data as ActivityListItem[];
};

export const fetchContactActivitiesAPI = async (
  contactId: string
): Promise<ActivityListItem[]> => {
  const result = await apiClient(
    `/api/activities/show-contact-activities/${contactId}`,
    {
      method: "GET",
    }
  );

  return result.data as ActivityListItem[];
};

export const fetchCustomerActivitiesAPI = async (
  customerId: string
): Promise<ActivityListItem[]> => {
  const result = await apiClient(
    `/api/activities/show-customer-activities/${customerId}`,
    {
      method: "GET",
    }
  );

  return result.data as ActivityListItem[];
};

export const fetchActivitiesByActionAPI = async (
  action: ActivityAction
): Promise<ActivityListItem[]> => {
  const result = await apiClient(
    `/api/activities/show-activities-action/${action}`,
    {
      method: "GET",
    }
  );

  return result.data as ActivityListItem[];
};

export const fetchActivitiesByTypeAPI = async (
  type: ActivityType
): Promise<ActivityListItem[]> => {
  const result = await apiClient(
    `/api/activities/show-activities-type/${type}`,
    {
      method: "GET",
    }
  );

  return result.data as ActivityListItem[];
};

export const addManualActivityAPI = async (
  activity: ManualCreateActivity
): Promise<ActivityListItem> => {
  const result = await apiClient(
    "/api/activities/add-manual-activity",
    {
      method: "POST",
      body: JSON.stringify(activity),
    }
  );

  return result.data as ActivityListItem;
};

export const updateActivityAPI = async (
  id: string,
  activity: UpdateActivity
): Promise<ActivityListItem> => {
  const result = await apiClient(
    `/api/activities/update-activity/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(activity),
    }
  );

  return result.data as ActivityListItem;
};
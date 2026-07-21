import { apiClient } from "./apiClient";
import type { AddLead,  LeadListItem, LeadStatus, UpdateLead } from "../types/lead";


export const fetchLeadsListsAPI = async (): Promise<LeadListItem[]> => {
  const result = await apiClient('/api/leads/show-leads-lists', {
    method: "GET",
  });

  return result.data as LeadListItem[];
};


export const addLeadAPI = async (
  lead: AddLead
): Promise<LeadListItem> => {
  const result = await apiClient("/api/leads/add-lead", {
    method: "POST",
    body: JSON.stringify(lead),
  });

  return result.data as LeadListItem;
};

export const updateLeadAPI = async (
  id: string,
  lead: UpdateLead
): Promise<LeadListItem> => {
  const result = await apiClient(`/api/leads/update-lead/${id}`, {
    method: "PATCH",
    body: JSON.stringify(lead),
  });

  return result.data as LeadListItem;
};

export const updateLeadStatusAPI = async (
  id: string,
  status: LeadStatus
): Promise<LeadListItem> => {
  
  const result = await apiClient(`/api/leads/update-lead-status/${id}`, {
    method: "PATCH",
    body: JSON.stringify({status}),
  });
  
  return result.data as LeadListItem;
};

export const deleteLeadAPI = async (
  id: string
): Promise<string> => {
  const result = await apiClient(`/api/leads/delete-lead/${id}`, {
    method: "DELETE",
  });

  return result.data as string;
};
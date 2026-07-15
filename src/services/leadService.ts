import { apiClient } from "./apiClient";
import type { AddLead, Lead, LeadStatus, UpdateLead } from "../types/lead";

export const fetchLeadsAPI = async (): Promise<Lead[]> => {
  const result = await apiClient("/api/leads/show-leads", {
    method: "GET",
  });

  return result.data as Lead[];
};

export const addLeadAPI = async (
  lead: AddLead
): Promise<Lead> => {
  const result = await apiClient("/api/leads/add-lead", {
    method: "POST",
    body: JSON.stringify(lead),
  });

  return result.data as Lead;
};

export const updateLeadAPI = async (
  id: string,
  lead: UpdateLead
): Promise<Lead> => {
  const result = await apiClient(`/api/leads/update-lead/${id}`, {
    method: "PATCH",
    body: JSON.stringify(lead),
  });

  return result.data as Lead;
};

export const updateLeadStatusAPI = async (
  id: string,
  status: LeadStatus
): Promise<Lead> => {
  
  const result = await apiClient(`/api/leads/update-lead-status/${id}`, {
    method: "PATCH",
    body: JSON.stringify({status}),
  });
  
  return result.data as Lead;
};

export const deleteLeadAPI = async (
  id: string
): Promise<string> => {
  const result = await apiClient(`/api/leads/delete-lead/${id}`, {
    method: "DELETE",
  });

  return result.data as string;
};
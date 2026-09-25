import { apiClient } from "./apiClient";
import type { AddLead, LeadCareer, LeadListItem, LeadPersonal, LeadSocials, LeadStatus} from "../types/lead";
import type { PreferredTime, Priority, Source } from "../types/global";


export const fetchLeadsListsAPI = async (): Promise<LeadListItem[]> => {
  const result = await apiClient('/api/leads/show-lists', {
    method: "GET",
  });
  return result.data as LeadListItem[];
};

export const fetchLeadListByIDAPI = async (
  id: string
): Promise<LeadListItem> => {
  const result = await apiClient(`/api/leads/view-list/${id}`, {
    method: "GET",
  });

  return result.data as LeadListItem;
};


export const addLeadAPI = async (
  lead: AddLead
): Promise<LeadListItem> => {
  const idempotencyKey = crypto.randomUUID();

  const result = await apiClient("/api/leads/add", {
    method: "POST",
    headers: {
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(lead),
  });

  return result.data as LeadListItem;
};



export const updateLeadPersonalAPI = async (
  id: string,
  personal: LeadPersonal
): Promise<LeadListItem> => {
  const result = await apiClient(`/api/leads/update/personal/${id}`, {
    method: "PATCH",
    body: JSON.stringify(personal),
  });

  return result.data as LeadListItem;
};

export const updateLeadCareerAPI = async (
  id: string,
  career: LeadCareer
): Promise<LeadListItem> => {
  const result = await apiClient(`/api/leads/update/career/${id}`, {
    method: "PATCH",
    body: JSON.stringify(career),
  });

  return result.data as LeadListItem;
};

export const updateLeadSocialsAPI = async (
  id: string,
  socials: LeadSocials
): Promise<LeadListItem> => {
  const result = await apiClient(`/api/leads/update/socials/${id}`, {
    method: "PATCH",
    body: JSON.stringify(socials),
  });

  return result.data as LeadListItem;
};

export const updateLeadAvatarAPI = async (
  id: string,
  avatarFileId: string | null,
  avatarUrl: string | null
): Promise<LeadListItem> => {
  const result = await apiClient(`/api/leads/update/avatar/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      avatar_file_id: avatarFileId,
      avatar_url: avatarUrl,
    }),
  });

  return result.data as LeadListItem;
};

export const updateLeadStatusAPI = async (
  id: string,
  status: LeadStatus
): Promise<LeadListItem> => {
  
  const result = await apiClient(`/api/leads/update/status/${id}`, {
    method: "PATCH",
    body: JSON.stringify({status}),
  });
  
  return result.data as LeadListItem;
};

export const updateLeadNotesAPI = async (
  id: string,
  notes: string
): Promise<LeadListItem> => {
  
  const result = await apiClient(`/api/leads/update/notes/${id}`, {
    method: "PATCH",
    body: JSON.stringify({notes}),
  });
  
  return result.data as LeadListItem;
};

export const updateLeadSourceAPI = async (
  id: string,
  source: Source
): Promise<LeadListItem> => {
  
  const result = await apiClient(`/api/leads/update/source/${id}`, {
    method: "PATCH",
    body: JSON.stringify({source}),
  });
  
  return result.data as LeadListItem;
};

export const updateLeadPriorityAPI = async (
  id: string,
  priority: Priority
): Promise<LeadListItem> => {
  
  const result = await apiClient(`/api/leads/update/priority/${id}`, {
    method: "PATCH",
    body: JSON.stringify({priority}),
  });
  
  return result.data as LeadListItem;
};

export const updateLeadPreferredTimeAPI = async (
  id: string,
  preferredTime: PreferredTime
): Promise<LeadListItem> => {
  
  const result = await apiClient(`/api/leads/update/preferred-time/${id}`, {
    method: "PATCH",
    body: JSON.stringify({preferredTime}),
  });
  
  return result.data as LeadListItem;
};

export const archiveLeadAPI = async (
  id: string
): Promise<string> => {
  const result = await apiClient(`/api/leads/archive/${id}`, {
    method: "PATCH",
  });

  return result.data as string;
};

export const archiveBulkLeadsAPI = async (
  ids: string[]
): Promise<string[]> => {
  const result = await apiClient("/api/leads/archive/bulk", {
    method: "PATCH",
    body: JSON.stringify({ ids }),
  });

  return result.data as string[];
};

export const deleteLeadAPI = async (
  id: string
): Promise<string> => {
  const result = await apiClient(`/api/leads/delete/${id}`, {
    method: "DELETE",
  });

  return result.data as string;
};

export const deleteBulkLeadsAPI = async (
  ids: string[]
): Promise<string[]> => {
  const result = await apiClient("/api/leads/delete/bulk", {
    method: "DELETE",
    body: JSON.stringify({ ids }),
  });

  return result.data as string[];
};
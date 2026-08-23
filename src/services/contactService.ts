import { apiClient } from "./apiClient";
import type {
  AddContact,
  Contact,
  ContactCareer,
  ContactListItem,
  ContactPersonal,
  ContactSocials,
} from "../types/contact";
import type { PreferredTime, Priority, Source } from "../types/global";

export const fetchContactsAPI = async (): Promise<Contact[]> => {
  const result = await apiClient("/api/contacts/show", {
    method: "GET",
  });

  return result.data as Contact[];
};

export const fetchContactsListsAPI = async (): Promise<ContactListItem[]> => {
  const result = await apiClient("/api/contacts/show-lists", {
    method: "GET",
  });

  return result.data as ContactListItem[];
};

export const addContactAPI = async (
  contact: AddContact
): Promise<ContactListItem> => {
  const result = await apiClient("/api/contacts/add", {
    method: "POST",
    body: JSON.stringify(contact),
  });

  return result.data as ContactListItem;
};

export const addContactFromLeadsAPI = async (
  contact: AddContact
): Promise<ContactListItem> => {
  const result = await apiClient("/api/contacts/move", {
    method: "POST",
    body: JSON.stringify(contact),
  });

  return result.data as ContactListItem;
};

export const updateContactPersonalAPI = async (
  id: string,
  personal: ContactPersonal
): Promise<ContactListItem> => {
  const result = await apiClient(`/api/contacts/update/personal/${id}`, {
    method: "PATCH",
    body: JSON.stringify(personal),
  });

  return result.data as ContactListItem;
};

export const updateContactSocialsAPI = async (
  id: string,
  socials: ContactSocials
): Promise<ContactListItem> => {
  const result = await apiClient(`/api/contacts/update/socials/${id}`, {
    method: "PATCH",
    body: JSON.stringify(socials),
  });

  return result.data as ContactListItem;
};

export const updateContactCareerAPI = async (
  id: string,
  career: ContactCareer
): Promise<ContactListItem> => {
  const result = await apiClient(`/api/contacts/update/career/${id}`, {
    method: "PATCH",
    body: JSON.stringify(career),
  });

  return result.data as ContactListItem;
};

export const updateContactNotesAPI = async (
  id: string,
  notes: string
): Promise<ContactListItem> => {
  
  const result = await apiClient(`/api/contacts/update/notes/${id}`, {
    method: "PATCH",
    body: JSON.stringify({notes}),
  });
  
  return result.data as ContactListItem;
};

export const updateContactSourceAPI = async (
  id: string,
  source: Source
): Promise<ContactListItem> => {
  
  const result = await apiClient(`/api/contacts/update/source/${id}`, {
    method: "PATCH",
    body: JSON.stringify({source}),
  });
  
  return result.data as ContactListItem;
};

export const updateContactPriorityAPI = async (
  id: string,
  priority: Priority
): Promise<ContactListItem> => {
  
  const result = await apiClient(`/api/contacts/update/priority/${id}`, {
    method: "PATCH",
    body: JSON.stringify({priority}),
  });
  
  return result.data as ContactListItem;
};

export const updateContactPreferredTimeAPI = async (
  id: string,
  preferredTime: PreferredTime
): Promise<ContactListItem> => {
  
  const result = await apiClient(`/api/contacts/update/preferred-time/${id}`, {
    method: "PATCH",
    body: JSON.stringify({preferredTime}),
  });
  
  return result.data as ContactListItem;
};



export const deleteContactAPI = async (
  id: string
): Promise<string> => {
  const result = await apiClient(`/api/contacts/delete/${id}`, {
    method: "DELETE",
  });

  return result.data as string;
};

export const deleteBulkContactsAPI = async (
  ids: string[]
): Promise<string> => {
  const result = await apiClient(`/api/contacts/delete/bulk`, {
    method: "DELETE",
    body: JSON.stringify({ids}),
  });

  return result.data as string;
};
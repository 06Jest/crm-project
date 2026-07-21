import { apiClient } from "./apiClient";
import type {
  AddContact,
  Contact,
  ContactCareer,
  ContactListItem,
  ContactSocials,
  UpdateContact,
} from "../types/contact";

export const fetchContactsAPI = async (): Promise<Contact[]> => {
  const result = await apiClient("/api/contacts/show-contacts", {
    method: "GET",
  });

  return result.data as Contact[];
};

export const fetchContactsListsAPI = async (): Promise<ContactListItem[]> => {
  const result = await apiClient("/api/contacts/show-contacts-lists", {
    method: "GET",
  });

  return result.data as ContactListItem[];
};

export const addContactAPI = async (
  contact: AddContact
): Promise<ContactListItem> => {
  const result = await apiClient("/api/contacts/add-contact", {
    method: "POST",
    body: JSON.stringify(contact),
  });

  return result.data as ContactListItem;
};

export const addContactFromLeadsAPI = async (
  contact: AddContact
): Promise<ContactListItem> => {
  const result = await apiClient("/api/contacts/move-contact", {
    method: "POST",
    body: JSON.stringify(contact),
  });

  return result.data as ContactListItem;
};

export const updateContactAPI = async (
  id: string,
  contact: UpdateContact
): Promise<ContactListItem> => {
  const result = await apiClient(`/api/contacts/update-contact/${id}`, {
    method: "PATCH",
    body: JSON.stringify(contact),
  });

  return result.data as ContactListItem;
};

export const updateSocialsAPI = async (
  id: string,
  socials: ContactSocials
): Promise<ContactListItem> => {
  const result = await apiClient(`/api/contacts/update-socials/${id}`, {
    method: "PATCH",
    body: JSON.stringify(socials),
  });

  return result.data as ContactListItem;
};

export const updateCareerAPI = async (
  id: string,
  career: ContactCareer
): Promise<ContactListItem> => {
  const result = await apiClient(`/api/contacts/update-career/${id}`, {
    method: "PATCH",
    body: JSON.stringify(career),
  });

  return result.data as ContactListItem;
};


export const deleteContactAPI = async (
  id: string
): Promise<string> => {
  const result = await apiClient(`/api/contacts/delete-contact/${id}`, {
    method: "DELETE",
  });

  return result.data as string;
};

export const deleteBulkContactsAPI = async (
  ids: string[]
): Promise<string> => {
  const result = await apiClient(`/api/contacts/delete-contacts`, {
    method: "DELETE",
    body: JSON.stringify({ids}),
  });

  return result.data as string;
};
import { apiClient } from "./apiClient";
import type {
  AddContact,
  Contact,
  UpdateContact,
} from "../types/contact";

export const fetchContactsAPI = async (): Promise<Contact[]> => {
  const result = await apiClient("/api/contacts/show-contacts", {
    method: "GET",
  });

  return result.data as Contact[];
};

export const addContactAPI = async (
  contact: AddContact
): Promise<Contact> => {
  const result = await apiClient("/api/contacts/add-contact", {
    method: "POST",
    body: JSON.stringify(contact),
  });

  return result.data as Contact;
};

export const addContactFromLeadsAPI = async (
  contact: AddContact
): Promise<Contact> => {
  const result = await apiClient("/api/contacts/add-leadscontact", {
    method: "POST",
    body: JSON.stringify(contact),
  });

  return result.data as Contact;
};

export const updateContactAPI = async (
  id: string,
  contact: UpdateContact
): Promise<Contact> => {
  const result = await apiClient(`/api/contacts/update-contact/${id}`, {
    method: "POST",
    body: JSON.stringify(contact),
  });

  return result.data as Contact;
};

export const deleteContactAPI = async (
  id: string
): Promise<string> => {
  const result = await apiClient(`/api/contacts/delete-contact/${id}`, {
    method: "DELETE",
  });

  return result.data as string;
};
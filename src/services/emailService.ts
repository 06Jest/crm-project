import type {
  ComposeEmail,
  UpdateDraftEmail,
  EmailListItem,
} from "../types/email";

import { apiClient } from "./apiClient";


export const fetchEmailsAPI = async (): Promise<EmailListItem[]> => {
  const result = await apiClient("/api/emails/show-emails", {
    method: "GET",
  });

  return result.data as EmailListItem[];
};


export const fetchEmailByIDAPI = async (
  id: string
): Promise<EmailListItem> => {
  const result = await apiClient(`/api/emails/show-email/${id}`, {
    method: "GET",
  });

  return result.data as EmailListItem;
};


export const addEmailDraftAPI = async (
  email: ComposeEmail
): Promise<EmailListItem> => {
  const result = await apiClient("/api/emails/add-email-draft", {
    method: "POST",
    body: JSON.stringify(email),
  });

  return result.data as EmailListItem;
};


export const updateEmailDraftAPI = async (
  id: string,
  email: UpdateDraftEmail
): Promise<EmailListItem> => {
  const result = await apiClient(`/api/emails/update-email/${id}`, {
    method: "PATCH",
    body: JSON.stringify(email),
  });

  return result.data as EmailListItem;
};


export const sendEmailAPI = async (
  id: string
): Promise<EmailListItem> => {
  const result = await apiClient(`/api/emails/send-email/${id}`, {
    method: "POST",
  });

  return result.data as EmailListItem;
};


export const fetchLeadEmailsAPI = async (
  leadId: string
): Promise<EmailListItem[]> => {
  const result = await apiClient(`/api/emails/lead/${leadId}/emails`, {
    method: "GET",
  });

  return result.data as EmailListItem[];
};


export const fetchContactEmailsAPI = async (
  contactId: string
): Promise<EmailListItem[]> => {
  const result = await apiClient(`/api/emails/contact/${contactId}/emails`, {
    method: "GET",
  });

  return result.data as EmailListItem[];
};


export const fetchCustomerEmailsAPI = async (
  customerId: string
): Promise<EmailListItem[]> => {
  const result = await apiClient(`/api/emails/customer/${customerId}/emails`, {
    method: "GET",
  });

  return result.data as EmailListItem[];
};


export const deleteEmailAPI = async (
  id: string
): Promise<string> => {
  const result = await apiClient(`/api/emails/delete-email/${id}`, {
    method: "DELETE",
  });

  return result.data as string;
};
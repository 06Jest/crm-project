import type {
  SmsListItem,
  CreateSms,
  UpdateSmsStatus,
} from "../types//sms";

import { apiClient } from "./apiClient";


export const fetchSmsAPI = async (): Promise<SmsListItem[]> => {

  const result = await apiClient("/api/sms/", {
    method: "GET",
  });

  return result.data as SmsListItem[];

};


export const fetchSmsByIDAPI = async (
  id: string
): Promise<SmsListItem> => {

  const result = await apiClient(
    `/api/sms/${id}`,
    {
      method: "GET",
    }
  );

  return result.data as SmsListItem;

};


export const fetchLeadSmsAPI = async (
  leadId: string
): Promise<SmsListItem[]> => {

  const result = await apiClient(
    `/api/sms/lead/${leadId}`,
    {
      method: "GET",
    }
  );

  return result.data as SmsListItem[];

};


export const fetchContactSmsAPI = async (
  contactId: string
): Promise<SmsListItem[]> => {

  const result = await apiClient(
    `/api/sms/contact/${contactId}`,
    {
      method: "GET",
    }
  );

  return result.data as SmsListItem[];

};


export const fetchSmsByStatusAPI = async (
  status: UpdateSmsStatus["status"]
): Promise<SmsListItem[]> => {

  const result = await apiClient(
    `/api/sms/status/${status}`,
    {
      method: "GET",
    }
  );

  return result.data as SmsListItem[];

};


export const addSmsAPI = async (
  sms: CreateSms
): Promise<SmsListItem> => {

  const result = await apiClient(
    "/api/sms/",
    {
      method: "POST",
      body: JSON.stringify(sms),
    }
  );

  return result.data as SmsListItem;

};


export const updateSmsStatusAPI = async (
  id: string,
  sms: UpdateSmsStatus
): Promise<SmsListItem> => {

  const result = await apiClient(
    `/api/sms/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(sms),
    }
  );

  return result.data as SmsListItem;

};
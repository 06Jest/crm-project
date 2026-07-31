import type {
  CallListItem,
  UpdateCall,
  EndCall,
  CreateCall,
} from "../types/call";

import { apiClient } from "./apiClient";


export const fetchCallsAPI = async (): Promise<CallListItem[]> => {

  const result = await apiClient("/api/calls/show-calls", {
    method: "GET",
  });

  return result.data as CallListItem[];

};


export const fetchCallByIDAPI = async (
  id: string
): Promise<CallListItem> => {

  const result = await apiClient(`/api/calls/show-call/${id}`, {
    method: "GET",
  });

  return result.data as CallListItem;

};


export const fetchLeadCallsAPI = async (
  leadId: string
): Promise<CallListItem[]> => {

  const result = await apiClient(
    `/api/calls/show-lead-calls/${leadId}`,
    {
      method: "GET",
    }
  );

  return result.data as CallListItem[];

};


export const fetchContactCallsAPI = async (
  contactId: string
): Promise<CallListItem[]> => {

  const result = await apiClient(
    `/api/calls/show-contact-calls/${contactId}`,
    {
      method: "GET",
    }
  );

  return result.data as CallListItem[];

};



export const addCallAPI = async (
  call: CreateCall
): Promise<CallListItem> => {

  const result = await apiClient("/api/calls/add-call", {
    method: "POST",
    body: JSON.stringify(call),
  });


  return result.data as CallListItem;

};



export const updateCallAPI = async (
  id: string,
  call: UpdateCall
): Promise<CallListItem> => {

  const result = await apiClient(
    `/api/calls/update-call/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(call),
    }
  );


  return result.data as CallListItem;

};



export const startCallAPI = async (
  id: string
): Promise<CallListItem> => {

  const result = await apiClient(
    `/api/calls/start-call/${id}`,
    {
      method: "PATCH",
    }
  );


  return result.data as CallListItem;

};



export const endCallAPI = async (
  id: string,
  call: EndCall
): Promise<CallListItem> => {

  const result = await apiClient(
    `/api/calls/end-call/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(call),
    }
  );


  return result.data as CallListItem;

};



export const cancelCallAPI = async (
  id: string
): Promise<CallListItem> => {

  const result = await apiClient(
    `/api/calls/cancel-call/${id}`,
    {
      method: "PATCH",
    }
  );


  return result.data as CallListItem;

};



export const deleteCallAPI = async (
  id: string
): Promise<string> => {

  const result = await apiClient(
    `/api/calls/delete-call/${id}`,
    {
      method: "DELETE",
    }
  );


  return result.data as string;

};
import { apiClient } from "./apiClient";
import type { Customer, CustomerListItem, CustomerStatus } from "../types/customer";

export const fetchCustomersAPI = async (): Promise<Customer[]> => {
  const result = await apiClient("/api/customers/show", {
    method: "GET",
  });

  return result.data as Customer[];
};

export const fetchCustomersListsAPI = async (): Promise<CustomerListItem[]> => {
  const result = await apiClient("/api/customers/show-lists", {
    method: "GET",
  });
  return result.data as CustomerListItem[];
};

export const fetchCustomerListByIDAPI = async (
  id: string
): Promise<CustomerListItem> => {
  const result = await apiClient(`/api/customers/view-list/${id}`, {
    method: "GET",
  });
  return result.data as CustomerListItem;
};


export const updateCustomerNotesAPI = async (
  id: string,
  notes: string
): Promise<CustomerListItem> => {
  const result = await apiClient(`/api/customers/update/notes/${id}`, {
    method: "PATCH",
    body: JSON.stringify({notes}),
  });
  return result.data as CustomerListItem;
};

export const updateCustomerStatusAPI = async (
  id: string,
  status: CustomerStatus
): Promise<CustomerListItem> => {
  const result = await apiClient(`/api/customers/update/status/${id}`, {
    method: "PATCH",
    body: JSON.stringify({status}),
  });

  return result.data as CustomerListItem;
};


export const deleteCustomerAPI = async (
  id: string
): Promise<string> => {
  const result = await apiClient(`/api/customers/delete/${id}`, {
    method: "DELETE",
  });

  return result.data as string;
};

export const deleteBulkCustomersAPI = async (
  ids: string[]
): Promise<string> => {
  const result = await apiClient(`/api/customers/delete`, {
    method: "DELETE",
    body: JSON.stringify({ids}),
  });

  return result.data as string;
};
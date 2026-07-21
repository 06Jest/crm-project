import { apiClient } from "./apiClient";
import type { Customer, CustomerListItem, CustomerStatus } from "../types/customer";

export const fetchCustomersAPI = async (): Promise<Customer[]> => {
  const result = await apiClient("/api/customers/show-customers", {
    method: "GET",
  });

  return result.data as Customer[];
};

export const fetchCustomersListsAPI = async (): Promise<CustomerListItem[]> => {
  const result = await apiClient("/api/customers/show-customers-lists", {
    method: "GET",
  });
  console.log("Customers API:", result.data);
  return result.data as CustomerListItem[];
};


export const updateCustomerNotesAPI = async (
  id: string,
  notes: string
): Promise<CustomerListItem> => {
  const result = await apiClient(`/api/customers/update-customer-notes/${id}`, {
    method: "PATCH",
    body: JSON.stringify({notes}),
  });

  return result.data as CustomerListItem;
};

export const updateCustomerStatusAPI = async (
  id: string,
  status: CustomerStatus
): Promise<CustomerListItem> => {
  const result = await apiClient(`/api/customers/update-customer-status/${id}`, {
    method: "PATCH",
    body: JSON.stringify({status}),
  });

  return result.data as CustomerListItem;
};


export const deleteCustomerAPI = async (
  id: string
): Promise<string> => {
  const result = await apiClient(`/api/customers/delete-customer/${id}`, {
    method: "DELETE",
  });

  return result.data as string;
};

export const deleteBulkCustomersAPI = async (
  ids: string[]
): Promise<string> => {
  const result = await apiClient(`/api/customers/delete-customers`, {
    method: "DELETE",
    body: JSON.stringify({ids}),
  });

  return result.data as string;
};
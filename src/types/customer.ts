

export interface CustomerState {
  items: CustomerListItem[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const CUSTOMER_STATUSES = [
   "Active",
   "Inactive",
   "At Risk",
   "Churned"
] as const;

export type CustomerStatus = typeof CUSTOMER_STATUSES[number];

export interface Customer {
  id: string;
  contact_id: string;
  notes?: string;
  status: CustomerStatus;
  owner_id: string;
  org_id?: string;          
  created_at: string;
  deleted_at: string | null;
  deleted_by: string | null;
  updated_by: string | null;
}

export interface CustomerListItem extends Customer{

  owner: {
      id: string;
      first_name: string;
      last_name: string;
  };
}


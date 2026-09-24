

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
  assigned_to?: string | null;
  display_id: string;
  contact_id: string;
  notes?: string;
  status: CustomerStatus;
  owner_id: string;
  org_id?: string;     
  churned_at: string | null;     
  created_at: string;
  deleted_at: string | null;
  deleted_by: string | null;
  updated_by: string | null;
}

export interface CustomerListItem extends Customer {
  owner: {
    id: string;
    profile: {
      first_name: string;
      last_name: string;
      avatar_url?: string | null;
    }
  };
  assigned?: {
    id: string;
    profile: {
      first_name: string;
      last_name: string;
      avatar_url?: string | null;
    }
  } | null;
  contact: {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
  } | null;
}

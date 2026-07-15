import type { Gender, Priority, Source, Suffix } from "./global";

export interface ContactsState {
  items: Contact[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const CONTACT_STATUSES = [
   "Contacted",
   "Qualified",
   "Opportunity",
   "Customer",
   "Inactive",
   "Lost",
   "Churned"
] as const;

export type ContactStatus = typeof CONTACT_STATUSES[number];



export interface Contact {
  id: string;
  lead_id?:string;
  first_name: string;
  last_name: string;
  suffix?: Suffix;
  gender: Gender;
  birth_date?: string | null;
  email: string;
  phone: string;
  source: Source;
  company_name?: string;
  position?: string;  
  department?: string;
  status: ContactStatus;
  priority: Priority;
  notes?: string;
  owner_id: string;
  org_id: string;            
  created_at: string;
  deleted_at: string | null;
  deleted_by: string | null;
  updated_by: string | null;
}

export interface AddContact {
  lead_id?:string;
  first_name: string;
  last_name: string;
  suffix?: Suffix;
  gender?: Gender;
  birth_date?: string | null;
  email: string;
  phone: string;
  source?: Source;
  company_name?: string;
  position?: string;  
  department?: string;
  status: ContactStatus;
  priority: Priority;
  notes?: string;
}

export interface UpdateContact {
  first_name?: string;
  last_name?: string;
  suffix?: Suffix;
  gender?: Gender;
  birth_date?: string | null;
  email?: string;
  phone?: string;
  source?: Source;
  company_name?: string;
  position?: string;  
  department?: string;
  status: ContactStatus;
  priority: Priority;
  notes?: string;
}

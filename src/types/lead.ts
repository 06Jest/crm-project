import type { Gender, Priority, Source, Suffix } from "./global";

export interface LeadsState {
  items: Lead[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Closed",
] as const;

export type LeadStatus = typeof LEAD_STATUSES[number];



export interface Lead {
  id: string;
  title: string;
  source: Source;
  first_name: string;
  last_name: string;
  suffix?: Suffix;
  gender: Gender;
  birth_date?: string | null;
  email: string | null;
  phone: string | null;
  company_name?: string;
  position?: string;
  department?: string;
  status: LeadStatus;
  priority: Priority;
  notes?: string;
  owner_id: string;
  org_id: string;            
  created_at: string;
  deleted_at: string | null;
  deleted_by: string | null;
  updated_by: string | null;
}

export interface AddLead {
  title: string;
  source: Source;
  first_name: string;
  last_name: string;
  suffix?: Suffix;
  gender: Gender;
  birth_date?: string | null;
  email: string | null;
  phone: string | null;
  company_name?: string;
  position?: string;
  department?: string;
  status: LeadStatus;
  priority: Priority;
  notes?: string;
}
export interface UpdateLead {
  title: string;
  source: Source;
  first_name: string;
  last_name: string;
  suffix?: Suffix;
  gender: Gender;
  birth_date?: string | null;
  email: string| null;
  phone: string| null;
  company_name?: string;
  position?: string;
  department?: string;
  status: LeadStatus;
  priority: Priority;
  notes?: string;
}
import type { Gender, PreferredTime, Priority, Source, Suffix } from "./global";

export interface LeadsState {
  items: LeadListItem[];
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
  email: string;
  phone: string;
  company_name?: string;
  industry?: string;
  position?: string;  
  department?: string;
  website?: string;
  priority: Priority;
  notes?: string;
  status: LeadStatus;
  preferred_contact_time: PreferredTime;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  x?: string;
  whatsapp?: string;
  telegram?: string;
  viber?: string;
  owner_id: string;
  org_id: string;            
  created_at: string;
  deleted_at: string | null;
  deleted_by: string | null;
  updated_by: string | null;
}

export interface LeadListItem extends Lead{

  owner: {
      id: string;
      first_name: string;
      last_name: string;
  };
}


export interface AddLead {
  title: string;
  source: Source;
  first_name: string;
  last_name: string;
  suffix?: Suffix;
  gender: Gender;
  birth_date?: string | null;
  email?: string | null;
  phone?: string | null;
  company_name?: string;
  industry?: string;
  position?: string;  
  department?: string;
  website?: string;
  priority: Priority;
  notes?: string;
  preferred_contact_time: PreferredTime;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  x?: string;
  whatsapp?: string;
  telegram?: string;
  viber?: string;
}
export interface UpdateLead {
  id: string;
  title: string;
  source: Source;
  first_name: string;
  last_name: string;
  suffix?: Suffix;
  gender: Gender;
  birth_date?: string | null;
  email?: string | null;
  phone?: string | null;
  company_name?: string;
  industry?: string;
  position?: string;  
  department?: string;
  website?: string;
  priority: Priority;
  notes?: string;
  preferred_contact_time: PreferredTime;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  x?: string;
  whatsapp?: string;
  telegram?: string;
  viber?: string;
}
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
  display_id: string;
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
  avatar_file_id?: string | null;
  avatar_url?: string | null;
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
      profile: {
        first_name: string,
        last_name: string,
        avatar_url: string | null,
      }
  };
}


export interface AddLead {
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
export interface LeadPersonal {
  first_name?: string;
  last_name?: string;
  suffix?: Suffix;
  gender?: Gender;
  birth_date?: string | null;
  email?: string;
  phone?: string;
  avatar_file_id?: string | null;
  avatar_url?: string | null;
}

export interface LeadCareer {
  company_name?: string;
  position?: string;  
  department?: string;
  industry?: string;
  website?: string;
}

export interface LeadSocials {
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  x?: string;
  whatsapp?: string;
  telegram?: string;
  viber?: string;
}

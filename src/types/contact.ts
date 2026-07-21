import type { Gender, PreferredTime, Priority, Source, Suffix } from "./global";

export interface ContactsState {
  items: ContactListItem[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const CONTACT_STATUSES = [
   "Contacted",
   "Opportunity",
   "Customer",
   "Lost",
   "Churned"
] as const;

export type ContactStatus = typeof CONTACT_STATUSES[number];



export interface Contact {
  id: string;
  lead_id?:string;
  owner_id: string;
  org_id: string;
  first_name: string;
  last_name: string;
  suffix?: Suffix;
  gender: Gender;
  birth_date?: string | null;
  email: string;
  phone: string;
  source: Source;
  company_name?: string;
  industry?: string;
  position?: string;  
  department?: string;
  website?: string;
  status: ContactStatus;
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
  created_at: string;
  deleted_at: string | null;
  deleted_by: string | null;
  updated_by: string | null;
}

export interface ContactListItem extends Contact {

  owner: {
      id: string;
      first_name: string;
      last_name: string;
  };

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

export interface UpdateContact {
  first_name?: string;
  last_name?: string;
  suffix?: Suffix;
  gender?: Gender;
  birth_date?: string | null;
  email?: string;
  phone?: string;
  source?: Source;
  status: ContactStatus;
  priority: Priority;
  notes?: string;
  preferred_contact_time: PreferredTime;
}

export interface ContactCareer {
  company_name?: string;
  position?: string;  
  department?: string;
  industry?: string;
  website?: string;
}

export interface ContactSocials {
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  x?: string;
  whatsapp?: string;
  telegram?: string;
  viber?: string;
}




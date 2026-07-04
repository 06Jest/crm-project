export type LeadsStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Closed";


export type LeadsSource = 
  | "Website"
  | "Referral"
  | "Facebook"
  | "Instagram"
  | "LinkedIn"
  | "Google Search"
  | "Google Ads"
  | "Email Campaign"
  | "Cold Call"
  | "Trade Show"
  | "Webinar"
  | "Partner"
  | "Walk-in"
  | "WhatsApp"
  | "Messenger"
  | "Personal Network"
  | "Direct Conversation"
  | "Networking Event"
  | "Conference"
  | "Friend"
  | "Family"
  | "Other";

export type Gender = "Male" | "Female" | "Prefer not to say";
export type Priority = "Highest" | "High" | "Low";

export interface Lead {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  suffix?: string;
  gender: Gender;
  birth_date?: string | null;
  email: string;
  phone: string;
  company_name?: string;
  position?: string;
  department?: string;
  source: LeadsSource;
  status: LeadsStatus;
  priority: Priority;
  notes?: string;
  owner_id: string;
  org_id: string;            
  created_at: string;
  deleted_at: string | null;
  deleted_by: string | null;
  updated_by: string | null;
  owner_name: string;
}

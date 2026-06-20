export type  ContactSource = 
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

export type ContactStatus =
  | "Contacted"
  | "Qualified"
  | "Opportunity"
  | "Customer"
  | "Inactive"
  | "Lost"
  | "Churned";


export type Gender = "Male" | "Female" | "Prefer not to say";
export type Priority = "Highest" | "High" | "Low";

export interface Contact {
  id: string;
  lead_id?: string;
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
  source: ContactSource;
  status: ContactStatus;
  priority: Priority;
  notes?: string;
  owner_id: string;
  org_id: string;            
  created_at: string;
  owner_name: string;
}

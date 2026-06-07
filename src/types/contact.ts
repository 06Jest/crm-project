export type ContactStatus =
  | "Lead"
  | "Contacted"
  | "Qualified"
  | "Opportunity"
  | "Customer"
  | "Inactive"
  | "Lost"
  | "Churned";


export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  company_name?: string;
  position?: string;
  status: ContactStatus;
  owner_id: string;
  org_id: string;            
  created_at: string;
  owner_name: string;
}

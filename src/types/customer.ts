export type CustomerStatus = 'Active' | 'Inactive' | 'Prospect';

export interface Customer {
  id: string;
  name: string;
  company: boolean;
  company_name: string;
  position: string;
  industry?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  status: string;
  user_id?: string;
  org_id?: string;          
  account_manager?: string;  
  created_at?: string;
}

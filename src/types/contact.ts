export type ContactStatus = 'Active' | 'Prospect' | 'Lead'; 

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: ContactStatus;
  notes?: string;
  user_id?: string;
  org_id?: string;          
  created_by?: string;      
  assigned_to?: string;     
  created_at?: string;
  assigned_agent?: {
    id: string;
    name: string;
    employee_id?: string;
  };
}